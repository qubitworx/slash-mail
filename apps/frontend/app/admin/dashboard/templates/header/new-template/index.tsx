import { FlatButton, Dialog, DialogTitle } from "ui";
import { Plus } from "ui/icons";
import NewTemplateBody from "./body";

const NewListModal = () => {
  return (
    <Dialog
      disableMaxWidth
    >
      <FlatButton className="w-2/12 flex gap-2 items-center justify-center">
        <Plus />
        Create Template
      </FlatButton>
      <div className="flex flex-col gap-2 w-full">
        <DialogTitle>Create a new Template</DialogTitle>
        <NewTemplateBody />
      </div>
    </Dialog>
  );
};

export default NewListModal;
