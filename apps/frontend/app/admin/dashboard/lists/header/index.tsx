import { FlatInput } from "ui";
import NewListModal from "./new-list-modal";

const Header = () => {
  return (
    <div className="w-full flex gap-2">
      <FlatInput
        placeholder="Search for a list"
        className="w-full"
        containerClassName="w-10/12"
      />
      <NewListModal />
    </div>
  );
};

export default Header;
