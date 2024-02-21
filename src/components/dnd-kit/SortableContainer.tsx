import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

const SortableContainer = ({
  id,
  items,
  label,
}: {
  id: string;
  items: string[];
  label: string;
}) => {
  const { setNodeRef } = useDroppable({
    id,
  });
  return (
    <div className="sortableContainer">
      <h3 className="sortableContainer-title">{label}</h3>
      <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
        <div ref={setNodeRef} className="sortableContainer-block">
          {items.map((id: string) => (
            <SortableItem key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default SortableContainer;
