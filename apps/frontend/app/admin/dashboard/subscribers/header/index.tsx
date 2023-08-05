import { FlatInput } from "ui";
import NewSubscriber from "./new-subscriber";

interface Props {
  children?: React.ReactNode;
}

const Header = (props: Props) => {
  return (
    <div className="w-full flex gap-2 mb-2">
      {props.children}
      <NewSubscriber />
    </div>
  );
};

export default Header;
