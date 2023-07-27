"use client";
import { rspc } from "@/rspc/utils";
import { AlertDialog, Button } from "ui";
import { Eye, FolderOpen, Trash } from "ui/icons";

interface Props {
  id: string;
  name: string;
  description: string;
  requires_confirmation: boolean;
  created_at: string;
  updated_at: string;
}

const RowActions = (props: Props) => {
  const deleteListMutation = rspc.useMutation(["list.delete"]);
  const context = rspc.useContext();

  return (
    <div className="flex gap-1 items-center">
      <Button variant={"secondary"} className="p-2">
        <Eye />
      </Button>

      <AlertDialog
        confirmButtonText="Delete, list"
        description="Are you sure you want to delete this list? This action cannot be undone."
        title="Delete list"
        confirmationText={`Delete ${props.name}`}
        onConfirm={() => {
          deleteListMutation.mutate(
            { id: props.id },
            {
              onSuccess: () => {
                context.queryClient.invalidateQueries();
              },
            }
          );
        }}
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
