import { Checkbox } from "ui";

interface Props {
  id: string;
  email: string;
  onSelected: (id: string, active: boolean) => void;
  isSelected: boolean;
}

const Subscriber = (props: Props) => {
  return (
    <div
      className="border-b px-2 py-2 hover:bg-white-stroke/20 cursor-pointer flex items-center gap-2"
      onClick={() => {
        props.onSelected(props.id, !props.isSelected);
      }}
    >
      <Checkbox
        checked={props.isSelected}
        onChange={(active) => props.onSelected(props.id, active)}
      />
      <span className="ml-2">{props.email}</span>
    </div>
  );
};

export default Subscriber;
