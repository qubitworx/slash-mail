import { Button, Checkbox, DataTable, FlatButton } from "ui";
import { ColumnDef } from "@tanstack/react-table";
import DropdownMenu from "ui/src/Dropdown";
import { ArrowUp, Copy, DotsThree, Pen } from "ui/icons";

export type Subscriber = {
  email: string;
  name: string;
  status: string;
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
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu
          items={[
            {
              title: "Edit",
              id: "edit",
              icon: <Pen />,
            },
            {
              id: "separator-1",
              type: "separator",
            },
            {
              title: "Copy",
              id: "copy",
              icon: <Copy />,
            },
          ]}
          onItemSelect={(item) => alert(item)}
        >
          <FlatButton variant={"secondary"} className="p-1">
            <DotsThree />
          </FlatButton>
        </DropdownMenu>
      );
    },
  },
];
