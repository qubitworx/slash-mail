import { FlatButton, Dialog, DialogTitle } from "ui";
import { Plus } from "ui/icons";
import NewListBody from "./body";

const NewListModal = () => {
  return (
    <Dialog>
      <FlatButton className="w-2/12 flex gap-2 items-center justify-center">
        <Plus />
        Create List
      </FlatButton>
      <div className="flex flex-col gap-2 w-full">
        <DialogTitle>Create a new list</DialogTitle>
        <NewListBody />
      </div>
    </Dialog>
  );
};

export default NewListModal;
