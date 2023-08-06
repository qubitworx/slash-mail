import { FlatInput } from "ui";
import ImportSubscriberModal from "./import-subscribers";

interface Props {
  children?: React.ReactNode;
}

const Header = (props: Props) => {
  return (
    <div className="w-full flex gap-2 mb-2">
      {props.children}
      <ImportSubscriberModal />
    </div>
  );
};

export default Header;
