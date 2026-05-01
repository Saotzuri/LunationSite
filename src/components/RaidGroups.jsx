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
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isOfficer } from '../utils/auth';
import MemberCard from './MemberCard';

const GROUP_COUNT = 8;

function SortableMember({ member, onEdit, onDelete, disabled = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: member.id,
    data: { member },
    disabled
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

function GroupColumn({ groupId, members, onEdit, onDelete, onAdd, isOver, canManage }) {
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
              disabled={!canManage}
            />
          ))}
        </div>
      </SortableContext>
      {officer && canManage && members.length < 5 && (
        <button className="add-to-group-btn" onClick={() => onAdd(groupId)}>
          + Slot
        </button>
      )}
    </div>
  );
}

export default function RaidGroups({ roster, setRoster, onEditMember, onDeleteMember, onAddMember }) {
  const [activeId, setActiveId] = useState(null);
  const canManage = isOfficer();

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
    if (!canManage) return;
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    if (!canManage) {
      setActiveId(null);
      return;
    }
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const memberId = active.id;
    const targetId = over.id;

    const currentGroup = findMemberGroup(memberId);
    const targetGroup = findDropGroup(targetId);

    // Reorder inside the same group
    if (currentGroup === targetGroup) {
      const groupMembers = [...groups[currentGroup]];
      const oldIndex = groupMembers.findIndex(m => m.id === memberId);
      const newIndex = groupMembers.findIndex(m => m.id === targetId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reorderedGroup = arrayMove(groupMembers, oldIndex, newIndex);
        const reorderedIds = reorderedGroup.map(member => member.id);
        const positionById = new Map(reorderedIds.map((id, index) => [id, index]));

        const inGroup = [];
        const outsideGroup = [];

        roster.forEach(member => {
          if (member.group === currentGroup && positionById.has(member.id)) {
            inGroup.push(member);
          } else {
            outsideGroup.push(member);
          }
        });

        inGroup.sort((a, b) => positionById.get(a.id) - positionById.get(b.id));
        setRoster([...outsideGroup, ...inGroup]);
      }
      return;
    }

    // If dropped in different group - move member
    const targetGroupMembers = groups[targetGroup] || [];
    if (targetGroupMembers.length >= 5) {
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
            canManage={canManage}
          />
        ))}
      </div>
      <DragOverlay>
        {activeMember ? <MemberCard member={activeMember} compact={true} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function GroupWithDroppable({ groupId, members, onEdit, onDelete, onAdd, canManage }) {
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
        canManage={canManage}
      />
    </div>
  );
}