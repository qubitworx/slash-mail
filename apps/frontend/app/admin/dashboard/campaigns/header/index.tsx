import { FlatInput } from "ui";
import NewCampaign from "./new-list-modal";

interface Props {
  children?: React.ReactNode;
}

const Header = (props: Props) => {
  return (
    <div className="w-full flex gap-2 mb-2">
      {props.children}
      <NewCampaign />
    </div>
  );
};

export default Header;
