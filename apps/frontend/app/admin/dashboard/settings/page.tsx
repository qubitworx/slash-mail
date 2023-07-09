import DashboardLayout from "@/layout/dashboard";
import { Gear } from "ui/icons";
import { Tabs } from "ui";
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
            children: "SMTP ",
            id: "smtp",
            label: "SMTP Settings",
          },
        ]}
      />
    </DashboardLayout>
  );
};

export default Settings;
