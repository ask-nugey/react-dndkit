import { UniqueIdentifier } from "@dnd-kit/core";
import { ReactNode } from "react";

export type ItemProps = {
  id: UniqueIdentifier;
  content?: ReactNode;
  className?: string;
};

const Item = ({ id, content, className }: ItemProps) => {
  return (
    <div key={id} className={`item ${className ?? ""}`}>
      {content}
    </div>
  );
};
export default Item;
