import { FlatButton, Dialog, DialogTitle } from "ui";
import { Plus } from "ui/icons";
import NewSubscriberBody from "./body";

const NewSubscriberModal = () => {
  return (
    <Dialog>
      <FlatButton className="w-2/12 flex gap-2 items-center justify-center">
        <Plus />
        New Subscriber
      </FlatButton>
      <div className="flex flex-col gap-2 w-full">
        <DialogTitle>Add A Subscriber</DialogTitle>
        <NewSubscriberBody />
      </div>
    </Dialog>
  );
};

export default NewSubscriberModal;
