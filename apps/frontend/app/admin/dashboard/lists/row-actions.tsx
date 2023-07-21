import { AlertDialog, Button } from "ui";
import { Trash } from "ui/icons";

const RowActions = () => {
  return (
    <div className="flex gap-1 items-center">
      <AlertDialog
        confirmButtonText="Delete, list"
        description="Are you sure you want to delete this list? This action cannot be undone."
        title="Delete list"
      >
        <Button
          variant={"error"}
          className="p-2 text-error-stroke bg-error-fill/20"
        >
          <Trash />
        </Button>
      </AlertDialog>
    </div>
  );
};

export default RowActions;
