import { FlatInput } from "ui";
import UploadModal from "./upload-modal";

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
        placeholder="Search for media"
        className="w-full"
        containerClassName="w-10/12"
      />
      <UploadModal />
    </div>
  );
};

export default Header;
