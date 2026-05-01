import { useState, useCallback } from 'react';
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

function GroupColumn({ groupId, members, onEdit, onDelete, onAdd, isOver }) {
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

  // Helper to find group of a member
  const findMemberGroup = (memberId) => {
    for (const [groupId, members] of Object.entries(groups)) {
      if (members.find(m => m.id === memberId)) {
        return parseInt(groupId);
      }
    }
    return 1;
  };

  // Find group of a drop target
  const findDropGroup = (targetId) => {
    if (targetId.toString().startsWith('group-')) {
      return parseInt(targetId.toString().replace('group-', ''));
    }
    return findMemberGroup(targetId);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const memberId = active.id;
    const targetId = over.id;

    const currentGroup = findMemberGroup(memberId);
    const targetGroup = findDropGroup(targetId);

    console.log('Drag end:', { memberId, currentGroup, targetGroup });

    // If dropped in same group - try to reorder within group
    if (currentGroup === targetGroup) {
      const groupMembers = [...groups[currentGroup]];
      const oldIndex = groupMembers.findIndex(m => m.id === memberId);
      const newIndex = groupMembers.findIndex(m => m.id === targetId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        // Reorder within group - for now just stay in same group, reorder not critical
        console.log('Reorder within group');
      }
      return;
    }

    // If dropped in different group - move member
    const targetGroupMembers = groups[targetGroup] || [];
    if (targetGroupMembers.length >= 5) {
      console.log('Target group full');
      return;
    }

    // Update the member's group
    const newRoster = roster.map(m => {
      if (m.id === memberId) {
        return { ...m, group: targetGroup };
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
      <GroupColumn
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