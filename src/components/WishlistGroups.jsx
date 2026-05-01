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
import WishlistCard from './WishlistCard';

const GROUP_COUNT = 8;

function SortableWishlistEntry({ entry, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.id,
    data: { entry }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <WishlistCard entry={entry} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

function GroupColumn({ groupId, entries, onEdit, onDelete, onAdd, isOver }) {
  const officer = isOfficer();

  return (
    <div className={`raid-group wishlist-group ${isOver ? 'drag-over' : ''}`}>
      <div className="group-header">
        <span className="group-name">Wunsch Gruppe {groupId}</span>
        <span className="group-count">{entries.length}/5</span>
      </div>
      <SortableContext
        items={entries.map(entry => entry.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="group-slots">
          {entries.map(entry => (
            <SortableWishlistEntry
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
      {officer && entries.length < 5 && (
        <button className="add-to-group-btn" onClick={() => onAdd(groupId)}>
          + Wunsch-Spec
        </button>
      )}
    </div>
  );
}

export default function WishlistGroups({ wishlist, setWishlist, onEditEntry, onDeleteEntry, onAddEntry }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const getGroupsFromWishlist = useCallback(() => {
    const newGroups = {};
    for (let i = 1; i <= GROUP_COUNT; i++) {
      newGroups[i] = [];
    }

    wishlist.forEach(entry => {
      const groupNum = entry.group || 1;
      if (newGroups[groupNum] && newGroups[groupNum].length < 5) {
        newGroups[groupNum].push(entry);
      } else {
        for (let g = 1; g <= GROUP_COUNT; g++) {
          if (newGroups[g].length < 5) {
            newGroups[g].push(entry);
            break;
          }
        }
      }
    });

    return newGroups;
  }, [wishlist]);

  const groups = getGroupsFromWishlist();

  const findEntryGroup = (entryId) => {
    for (const [groupId, entries] of Object.entries(groups)) {
      if (entries.find(e => e.id === entryId)) {
        return parseInt(groupId);
      }
    }
    return 1;
  };

  const findDropGroup = (targetId) => {
    if (targetId.toString().startsWith('wish-group-')) {
      return parseInt(targetId.toString().replace('wish-group-', ''));
    }
    return findEntryGroup(targetId);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const entryId = active.id;
    const targetId = over.id;
    const currentGroup = findEntryGroup(entryId);
    const targetGroup = findDropGroup(targetId);

    if (currentGroup === targetGroup) {
      const groupEntries = [...groups[currentGroup]];
      const oldIndex = groupEntries.findIndex(e => e.id === entryId);
      const newIndex = groupEntries.findIndex(e => e.id === targetId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reorderedGroup = arrayMove(groupEntries, oldIndex, newIndex);
        const reorderedIds = reorderedGroup.map(entry => entry.id);
        const positionById = new Map(reorderedIds.map((id, index) => [id, index]));

        const inGroup = [];
        const outsideGroup = [];

        wishlist.forEach(entry => {
          if ((entry.group || 1) === currentGroup && positionById.has(entry.id)) {
            inGroup.push(entry);
          } else {
            outsideGroup.push(entry);
          }
        });

        inGroup.sort((a, b) => positionById.get(a.id) - positionById.get(b.id));
        setWishlist([...outsideGroup, ...inGroup]);
      }
      return;
    }

    const targetGroupEntries = groups[targetGroup] || [];
    if (targetGroupEntries.length >= 5) return;

    setWishlist(prev =>
      prev.map(entry => (entry.id === entryId ? { ...entry, group: targetGroup } : entry))
    );
  };

  const activeEntry = activeId ? wishlist.find(entry => entry.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="raid-groups">
        {Array.from({ length: GROUP_COUNT }, (_, i) => i + 1).map(groupId => (
          <WishlistGroupWithDroppable
            key={groupId}
            groupId={groupId}
            entries={groups[groupId] || []}
            onEdit={onEditEntry}
            onDelete={onDeleteEntry}
            onAdd={onAddEntry}
          />
        ))}
      </div>
      <DragOverlay>
        {activeEntry ? <WishlistCard entry={activeEntry} onEdit={() => {}} onDelete={() => {}} showActions={false} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function WishlistGroupWithDroppable({ groupId, entries, onEdit, onDelete, onAdd }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `wish-group-${groupId}`
  });

  return (
    <div ref={setNodeRef} className={`raid-group-wrapper ${isOver ? 'drag-over' : ''}`}>
      <GroupColumn
        groupId={groupId}
        entries={entries}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd}
        isOver={isOver}
      />
    </div>
  );
}
