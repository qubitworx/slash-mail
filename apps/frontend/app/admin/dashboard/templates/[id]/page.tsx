"use client";

import DashboardLayout from "@/layout/dashboard";
import { rspc } from "@/rspc/utils";
import { Tabs } from "ui";
import { Copy } from "ui/icons";
import EmailDesigner from "./designer";
import CodeDesigner from "./code";

interface Props {
  params: {
    id: string;
  };
}

const TemplatePage = (props: Props) => {
  const template = rspc.useQuery(["templates.get", { id: props.params.id }]);

  if (template.isLoading) return null;

  return (
    <DashboardLayout
      name={template.data?.name || ""}
      icon={
        <Copy />
      }
    >
      <Tabs
        items={[
          {
            children: <EmailDesigner template={template.data!} />,
            id: "designer",
            label: "Designer",
          },
          {
            children: <CodeDesigner template={template.data!} />,
            id: "code",
            label: "Code",
          },
        ]}
      />
    </DashboardLayout>
  );
};

export default TemplatePage;
