import { FlatInput } from "ui";
import NewListModal from "./new-list-modal";

interface Props {
  children?: React.ReactNode;
}

const Header = (props: Props) => {
  return (
    <div className="w-full flex gap-2 mb-2">
      {props.children}
      <NewListModal />
    </div>
  );
};

export default Header;
