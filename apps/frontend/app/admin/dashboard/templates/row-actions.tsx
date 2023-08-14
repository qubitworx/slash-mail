"use client";
import { rspc } from "@/rspc/utils";
import { useRouter } from "next/navigation";
import { AlertDialog, Button } from "ui";
import { Eye, FolderOpen, Trash } from "ui/icons";

interface Props {
  id: string;
  name: string;
  identifier: string;
  created_at: string;
  updated_at: string;
}

export const default_identifiers = [
  "email-verify",
  "default"
]

const RowActions = (props: Props) => {
  const deleteListMutation = rspc.useMutation(["templates.delete"]);
  const context = rspc.useContext();
  const router = useRouter();

  if (default_identifiers.includes(props.identifier)) {
    return (
      <div className="flex gap-1 items-center">
        <Button
          onClick={() => {
            router.push(`/admin/dashboard/templates/${props.id}`);
          }}
          variant={"secondary"}
          className="p-2"
        >
          <Eye />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-1 items-center">
      <Button
        onClick={() => {
          router.push(`/admin/dashboard/templates/${props.id}`);
        }}
        variant={"secondary"}
        className="p-2"
      >
        <Eye />
      </Button>

      <AlertDialog
        confirmButtonText="Delete, list"
        description="Are you sure you want to delete this list? This action cannot be undone."
        title="Delete list"
        confirmationText={`Delete ${props.name}`}
        onConfirm={() => {
          deleteListMutation.mutate(
            {
              ids: [props.id],
            },
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
