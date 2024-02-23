import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { ItemProps } from "./Item";

export type SortableContainerProps = {
  id: string;
  label: string;
  items: ItemProps[];
};

const SortableContainer = ({ id, items, label }: SortableContainerProps) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div className="sortableContainer">
      <h3 className="sortableContainer-title">{label}</h3>
      <SortableContext
        id={id}
        items={items.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        <div ref={setNodeRef} className="sortableContainer-block">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              content={item.content}
              className={item.className}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default SortableContainer;
