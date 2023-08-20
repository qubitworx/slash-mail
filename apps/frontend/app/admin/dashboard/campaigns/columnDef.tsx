import { Button, Checkbox, DataTable, FlatButton } from "ui";
import { ColumnDef } from "@tanstack/react-table";
import DropdownMenu from "ui/src/Dropdown";
import { ArrowUp, Copy, DotsThree, Pen } from "ui/icons";
import RowActions from "./row-actions";

export type Subscriber = {
  name: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  description: string;
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
          Created At
          <ArrowUp className="ml-2 h-4 w-4" />
        </FlatButton>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <FlatButton
          variant="nooutline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated At
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
        <></>
      );
    },
  },
];
