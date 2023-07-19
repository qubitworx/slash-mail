import { FlatButton, FlatInput } from "ui";
import { Plus } from "ui/icons";

const Header = () => {
  return (
    <div className="w-full flex gap-2">
      <FlatInput
        placeholder="Search for a list"
        className="w-full"
        containerClassName="w-10/12"
      />
      <FlatButton className="w-2/12 flex gap-2 items-center justify-center">
        <Plus />
        Create List
      </FlatButton>
    </div>
  );
};

export default Header;
