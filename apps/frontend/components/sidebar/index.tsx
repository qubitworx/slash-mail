import { motion } from "framer-motion";
import useSidebarState from "./state";
import Header from "./header";
import List from "./list";

const Sidebar = () => {
  const { isOpen, setIsOpen } = useSidebarState((s) => s);

  return (
    <motion.div
      animate={{
        width: isOpen ? "300px" : "69px",
        minWidth: isOpen ? "300px" : "69px",
      }}
      className="max-w-xs h-full border-r border-white-stroke p-4"
    >
      <Header />
      <List />
    </motion.div>
  );
};

export default Sidebar;
