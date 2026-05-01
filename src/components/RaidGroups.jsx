import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isOfficer } from '../utils/auth';
import MemberCard from './MemberCard';

const GROUP_COUNT = 8;

function SortableMember({ member, onEdit, onDelete, groupId, index }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: `${groupId}-${member.id}`,
    data: { member, groupId }
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

function GroupColumn({ groupId, members, onEdit, onDelete, onAdd }) {
  const officer = isOfficer();

  return (
    <div className="raid-group">
      <div className="group-header">
        <span className="group-name">Gruppe {groupId}</span>
        <span className="group-count">{members.length}/5</span>
      </div>
      <SortableContext
        items={members.map(m => `${groupId}-${m.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="group-slots">
          {members.map((member, index) => (
            <SortableMember
              key={member.id}
              member={member}
              onEdit={onEdit}
              onDelete={onDelete}
              groupId={groupId}
              index={index}
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
  const [groups, setGroups] = useState({});

  // Initialize groups from roster
  useEffect(() => {
    const newGroups = {};
    for (let i = 1; i <= GROUP_COUNT; i++) {
      newGroups[i] = [];
    }

    // Distribute roster members into groups
    roster.forEach(member => {
      const groupNum = member.group || ((roster.indexOf(member) % GROUP_COUNT) + 1);
      if (newGroups[groupNum] && newGroups[groupNum].length < 5) {
        newGroups[groupNum].push(member);
      } else {
        // Find first available group
        for (let g = 1; g <= GROUP_COUNT; g++) {
          if (newGroups[g].length < 5) {
            newGroups[g].push(member);
            break;
          }
        }
      }
    });

    setGroups(newGroups);
  }, [roster]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const findGroup = (id) => {
    for (const [groupId, members] of Object.entries(groups)) {
      if (members.some(m => `${groupId}-${m.id}` === id)) {
        return parseInt(groupId);
      }
    }
    return null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeGroup = findGroup(active.id);
    const overGroup = findGroup(over.id) || parseInt(over.id);

    if (activeGroup === overGroup) return;

    // Find the member being dragged
    const member = groups[activeGroup]?.find(m => `${activeGroup}-${m.id}` === active.id);
    if (!member) return;

    // Remove from old group, add to new group
    const newGroups = { ...groups };
    newGroups[activeGroup] = newGroups[activeGroup].filter(m => m.id !== member.id);

    // Update group assignment
    const updatedMember = { ...member, group: overGroup };

    if (newGroups[overGroup]) {
      newGroups[overGroup].push(updatedMember);
    }

    setGroups(newGroups);

    // Update roster with new group assignments
    const newRoster = roster.map(m => {
      if (m.id === member.id) {
        return { ...m, group: overGroup };
      }
      return m;
    });
    setRoster(newRoster);
  };

  const activeMember = activeId ? (() => {
    for (const members of Object.values(groups)) {
      const found = members.find(m => `${Object.keys(groups).find(g => groups[g] === members)}-${m.id}` === activeId);
      if (found) return found;
    }
    return null;
  })() : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="raid-groups">
        {Object.entries(groups).map(([groupId, members]) => (
          <GroupColumn
            key={groupId}
            groupId={parseInt(groupId)}
            members={members}
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