import DashboardLayout from "@/layout/dashboard";
import { List } from "ui/icons";
import Header from "./header";
import Helper from "@/components/helper";

const Lists = () => {
  return (
    <DashboardLayout icon={<List />} name="Lists">
      <Header />
      <Helper text="Lists are groups of subscribers who are interested on a common topic. You can create a list and add subscribers to it. Further you can send campaigns to these lists." />
    </DashboardLayout>
  );
};

export default Lists;
