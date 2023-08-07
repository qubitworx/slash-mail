import { AlertDialog, Checkbox, Button, FlatButton } from "ui";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUp, Pen, Trash } from "ui/icons";
import { rspc } from "@/rspc/utils";
import { toast } from "ui/toast";

export type Subscriber = {
  status: string;
  name: string;
  email: string;
  createdAt: string;
  id: string;
};

export const columns: ColumnDef<Subscriber>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <FlatButton
          variant="nooutline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUp className="ml-2 h-4 w-4" />
        </FlatButton>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <FlatButton
          variant="nooutline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUp className="ml-2 h-4 w-4" />
        </FlatButton>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <FlatButton
          variant="nooutline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUp className="ml-2 h-4 w-4" />
        </FlatButton>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <FlatButton
          variant="nooutline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subscriber Since
          <ArrowUp className="ml-2 h-4 w-4" />
        </FlatButton>
      );
    },
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
      const deleteSubscriber = rspc.useMutation("list.unsubscribe_subscribers");
      const context = rspc.useContext();

      return (
        <div className="flex gap-2">
          <Button className="p-1" variant="secondary">
            <Pen />
          </Button>
          <AlertDialog
            confirmButtonText={`Yes, Unsubscribe ${row.original.name}`}
            confirmationText={`Unsubscribe ${row.original.name}`}
            title={`Are you sure you want to unsubscribe ${row.original.email}?`}
            description="This action cannot be undone. The subscriber will be removed from the list but NOT from the subscribers table."
            onConfirm={() => {
              const unSubscribeUser = async () => {
                await deleteSubscriber.mutateAsync({
                  subscriber_ids: [row.original.id],
                });

                context.queryClient.invalidateQueries();
                toast.success("Successfully unsubscribed subscriber");
              };

              unSubscribeUser();
            }}
          >
            <Button className="p-1" variant="error">
              <Trash />
            </Button>
          </AlertDialog>
        </div>
      );
    },
  },
];
