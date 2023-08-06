"use client";

import DashboardLayout from "@/layout/dashboard";
import { rspc } from "@/rspc/utils";
import { Tabs } from "ui";
import { List, Lock } from "ui/icons";
import Subscribers from "./subscribers";

interface Props {
  params: {
    id: string;
  };
}

const ListPage = (props: Props) => {
  const list = rspc.useQuery(["list.get", { id: props.params.id }]);

  return (
    <DashboardLayout
      name={list.data?.name || ""}
      icon={<>{list.data?.requires_confirmation ? <Lock /> : <List />}</>}
    >
      <Tabs
        items={[
          {
            children: <Subscribers id={props.params.id} />,
            id: "subscribers",
            label: "Subscribers",
          },
          { children: "Settings", id: "settings", label: "Settings" },
        ]}
      />
    </DashboardLayout>
  );
};

export default ListPage;
