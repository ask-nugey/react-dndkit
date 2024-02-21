import { UniqueIdentifier } from "@dnd-kit/core";

const Item = ({ id }: { id: UniqueIdentifier }) => {
  return <div className="item">{id}</div>;
};
export default Item;
