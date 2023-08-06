import { FlatButton, Dialog, DialogTitle } from "ui";
import { Plus } from "ui/icons";
import ImportSubscriberBody from "./body";
import { useParams } from "next/navigation";

const ImportSubscriberModal = () => {
  const { id } = useParams();

  return (
    <Dialog>
      <FlatButton className="w-2/12 flex gap-2 items-center justify-center">
        <Plus />
        Import Subscribers
      </FlatButton>
      <div className="flex flex-col gap-2 w-full">
        <DialogTitle>Import Subscribers</DialogTitle>
        <p className="text-sm">
          Subscribers who are already in the list will not be shown.
        </p>
        <ImportSubscriberBody id={id as any as string} />
      </div>
    </Dialog>
  );
};

export default ImportSubscriberModal;
