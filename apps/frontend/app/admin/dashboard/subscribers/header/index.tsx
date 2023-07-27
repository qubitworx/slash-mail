import { FlatInput } from "ui";
import NewSubscriber from "./new-subscriber";

interface Props {
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}

const Header = (props: Props) => {
  return (
    <div className="w-full flex gap-2">
      <FlatInput
        value={props.searchQuery}
        onChange={(e) => props.setSearchQuery(e.target.value)}
        placeholder="Search for a subscriber"
        className="w-full"
        containerClassName="w-10/12"
      />
      <NewSubscriber />
    </div>
  );
};

export default Header;
