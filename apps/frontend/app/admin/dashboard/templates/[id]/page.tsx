"use client";

import DashboardLayout from "@/layout/dashboard";
import { rspc } from "@/rspc/utils";
import { Tabs } from "ui";
import { Copy } from "ui/icons";
import EmailDesigner from "./designer";
import { useEffect, useState } from "react";
import { toast } from "ui/toast";
import { Template } from "@/rspc/bindings";
import Settings from "./settings";

interface Props {
  params: {
    id: string;
  };
}

const TemplatePage = (props: Props) => {
  const template = rspc.useQuery(["templates.get", { id: props.params.id }]);
  const templateEdit = rspc.useMutation(["templates.edit"])
  const [templateData, setTemplateData] = useState<Template | null>()

  useEffect(() => {
    setTemplateData(template.data)
  }, [template.data])

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
            children: <EmailDesigner
              setTemplate={(t) => {
                setTemplateData(t)

                const saveMutation = async () => {
                  await templateEdit.mutateAsync({
                    html: t?.content,
                    id: t?.id,
                    json: t?.json,
                    identifier: t?.identifier,
                    name: t?.name,
                    ignore_default_template: t?.ignoreDefaultTemplate
                  })


                  await template.refetch()
                }

                toast.promise(saveMutation(), {
                  loading: "Saving...",
                  success: "Saved!",
                  error: "Failed to save.",
                })
              }}
              template={templateData as any} />,
            id: "designer",
            label: "Designer",
          },
          {
            children: <Settings
              template={templateData as any}
            />,
            id: "settings",
            label: "Settings",
          },
        ]}
      />
    </DashboardLayout>
  );
};

export default TemplatePage;
