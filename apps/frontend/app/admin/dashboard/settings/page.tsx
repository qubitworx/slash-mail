import DashboardLayout from "@/layout/dashboard";
import { Gear } from "ui/icons";
import { Tabs } from "ui";
import SMTPSettings from "./smtp";

const Settings = () => {
  return (
    <DashboardLayout icon={<Gear />} name="Settings">
      <Tabs
        items={[
          {
            children: "General",
            id: "general",
            label: "General",
          },
          {
            children: "Performance",
            id: "performance",
            label: "Performance",
          },
          {
            children: <SMTPSettings />,
            id: "smtp",
            label: "SMTP",
          },
        ]}
      />
    </DashboardLayout>
  );
};

export default Settings;
