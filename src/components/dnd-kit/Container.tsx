import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import SortableContainer, { SortableContainerProps } from "./SortableContainer";
import Item from "./Item";

const Contaienr = () => {
  const [containers, setContainers] = useState<SortableContainerProps[]>([
    {
      id: "01",
      label: "ラベルA",
      items: [
        { id: "01-01", content: <>テキスト</>, className: "red" },
        { id: "01-02", content: <>テキスト</>, className: "blue" },
        { id: "01-03", content: <>テキスト</>, className: "orange bold" },
      ],
    },
    {
      id: "02",
      label: "ラベルB",
      items: [
        {
          id: "02-01",
          content: (
            <>
              テキスト
              <br />
              テキスト
            </>
          ),
          className: "string",
        },
        {
          id: "02-02",
          content: <div className="item">テキスト</div>,
          className: "string",
        },
        {
          id: "02-03",
          content: (
            <ul>
              <li>リスト</li>
              <li>リスト</li>
              <li>リスト</li>
            </ul>
          ),
          className: "string",
        },
      ],
    },
    {
      id: "03",
      label: "ラベルC",
      items: [
        { id: "03-01", content: <>テキスト</>, className: "string" },
        { id: "03-02", content: <>テキスト</>, className: "string" },
        { id: "03-03", content: <>テキスト</>, className: "string" },
      ],
    },
    {
      id: "04",
      label: "ラベルD",
      items: [],
    },
  ]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id: UniqueIdentifier) => {
    // コンテナIDで直接マッチする場合、そのコンテナを返す
    let container = containers.find((container) => container.id === id);
    if (container) {
      return container;
    }

    // アイテムIDに基づいて、そのアイテムが属するコンテナを探す
    return containers.find((container) =>
      container.items.some((item) => item.id === id)
    );
  };

  const getActiveItem = () => {
    for (let container of containers) {
      const activeItem = container.items.find((item) => item.id === activeId);
      if (activeItem) {
        return activeItem;
      }
    }
    return null; // アクティブなアイテムが見つからない場合
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (over) {
      const overContainer = findContainer(over.id);
      const activeContainer = findContainer(active.id);

      if (
        overContainer &&
        activeContainer &&
        overContainer.id !== activeContainer.id
      ) {
        setContainers((prevContainers) => {
          // アクティブなアイテムを移動元のコンテナから削除
          const activeItems = activeContainer.items.filter(
            (item) => item.id !== active.id
          );
          // アクティブなアイテムを移動先のコンテナに追加
          const movingItem = activeContainer.items.find(
            (item) => item.id === active.id
          );
          const overItems = movingItem
            ? [...overContainer.items, movingItem]
            : [...overContainer.items];

          return prevContainers.map((container) => {
            if (container.id === activeContainer.id) {
              return { ...container, items: activeItems };
            } else if (container.id === overContainer.id) {
              return { ...container, items: overItems };
            } else {
              return container;
            }
          });
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    if (activeContainer.id === overContainer.id) {
      // 同じコンテナ内でのアイテムの並び替え
      const newItems = arrayMove(
        activeContainer.items,
        activeContainer.items.findIndex((item) => item.id === activeId),
        overContainer.items.findIndex((item) => item.id === overId)
      );
      setContainers((prev) =>
        prev.map((container) => {
          if (container.id === overContainer.id) {
            return { ...container, items: newItems };
          }
          return container;
        })
      );
    } else {
      // 異なるコンテナ間でのアイテム移動
      const movingItem = activeContainer.items.find(
        (item) => item.id === activeId
      );
      if (!movingItem) {
        setActiveId(null);
        return;
      }

      setContainers((prev) =>
        prev.map((container) => {
          if (container.id === activeContainer.id) {
            return {
              ...container,
              items: container.items.filter((item) => item.id !== activeId),
            };
          } else if (container.id === overContainer.id) {
            return { ...container, items: [...container.items, movingItem] };
          }
          return container;
        })
      );
    }

    setActiveId(null);
  };

  const activeItem = getActiveItem();

  return (
    <div className="contaienr">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {containers.map((container) => (
          <SortableContainer
            key={container.id}
            id={container.id}
            items={container.items}
            label={container.label}
          />
        ))}

        <DragOverlay>
          {activeItem ? (
            <Item
              id={activeId ?? 0}
              content={activeItem.content}
              className={activeItem.className}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Contaienr;
