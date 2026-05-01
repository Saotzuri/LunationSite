import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isOfficer } from '../utils/auth';
import MemberCard from './MemberCard';

const GROUP_COUNT = 8;

function SortableMember({ member, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: member.id,
    data: { member }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MemberCard member={member} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

function GroupDropZone({ groupId, members, onEdit, onDelete, onAdd, isOver }) {
  const officer = isOfficer();

  return (
    <div className={`raid-group ${isOver ? 'drag-over' : ''}`}>
      <div className="group-header">
        <span className="group-name">Gruppe {groupId}</span>
        <span className="group-count">{members.length}/5</span>
      </div>
      <SortableContext
        items={members.map(m => m.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="group-slots">
          {members.map((member) => (
            <SortableMember
              key={member.id}
              member={member}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
      {officer && members.length < 5 && (
        <button className="add-to-group-btn" onClick={() => onAdd(groupId)}>
          + Slot
        </button>
      )}
    </div>
  );
}

export default function RaidGroups({ roster, setRoster, onEditMember, onDeleteMember, onAddMember }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const getGroupsFromRoster = useCallback(() => {
    const newGroups = {};
    for (let i = 1; i <= GROUP_COUNT; i++) {
      newGroups[i] = [];
    }

    roster.forEach(member => {
      const groupNum = member.group || 1;
      if (newGroups[groupNum] && newGroups[groupNum].length < 5) {
        newGroups[groupNum].push(member);
      } else {
        for (let g = 1; g <= GROUP_COUNT; g++) {
          if (newGroups[g].length < 5) {
            newGroups[g].push(member);
            break;
          }
        }
      }
    });

    return newGroups;
  }, [roster]);

  const groups = getGroupsFromRoster();

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const memberId = active.id;
    const targetGroup = over.id;

    // Check if target is a group (starts with "group-")
    let newGroup;
    if (targetGroup.toString().startsWith('group-')) {
      newGroup = parseInt(targetGroup.replace('group-', ''));
    } else {
      // It's a member ID, find their group
      const member = roster.find(m => m.id === targetGroup);
      if (member) {
        newGroup = member.group || 1;
      } else {
        return;
      }
    }

    // Find current group of the dragged member
    const currentMember = roster.find(m => m.id === memberId);
    if (!currentMember) return;
    const currentGroup = currentMember.group || 1;

    if (currentGroup === newGroup) return;

    // Check if target group has space
    const targetGroupMembers = groups[newGroup] || [];
    if (targetGroupMembers.length >= 5) return;

    // Update the member's group
    const newRoster = roster.map(m => {
      if (m.id === memberId) {
        return { ...m, group: newGroup };
      }
      return m;
    });

    setRoster(newRoster);
  };

  const activeMember = activeId ? roster.find(m => m.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="raid-groups">
        {Array.from({ length: GROUP_COUNT }, (_, i) => i + 1).map(groupId => (
          <GroupWithDroppable
            key={groupId}
            groupId={groupId}
            members={groups[groupId] || []}
            onEdit={onEditMember}
            onDelete={onDeleteMember}
            onAdd={onAddMember}
          />
        ))}
      </div>
      <DragOverlay>
        {activeMember ? <MemberCard member={activeMember} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function GroupWithDroppable({ groupId, members, onEdit, onDelete, onAdd }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `group-${groupId}`
  });

  return (
    <div ref={setNodeRef} className={`raid-group-wrapper ${isOver ? 'drag-over' : ''}`}>
      <GroupDropZone
        groupId={groupId}
        members={members}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd}
        isOver={isOver}
      />
    </div>
  );
}