import Link from "next/link";
import {
  Cog,
  Image,
  LayoutDashboard,
  ListIcon,
  Rocket,
  Users,
  Workflow,
} from "ui/icons";
import useSidebarState from "./state";

const list_items = [
  {
    name: "Dashboard",
    link: "/",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Workflows",
    link: "/workflows",
    icon: <Workflow size={20} />,
  },
  {
    name: "Lists",
    link: "/lists",
    icon: <ListIcon size={20} />,
  },
  {
    name: "Subscribers",
    link: "/subscribers",
    icon: <Users size={20} />,
  },
  {
    name: "Campaigns",
    link: "/campaigns",
    icon: <Rocket size={20} />,
  },
  {
    name: "Media",
    link: "/media",
    // eslint-disable-next-line jsx-a11y/alt-text
    icon: <Image size={20} />,
  },
  {
    name: "Settings",
    link: "/settings",
    icon: <Cog size={20} />,
  },
];

const List = () => {
  const { isOpen } = useSidebarState((s) => s);

  return (
    <div className="w-full flex flex-col gap-1 mt-6 relative items-center justify-center">
      {list_items.map((item, index) => (
        <Link
          key={index}
          href={"/admin/dashboard" + item.link}
          className="w-full"
        >
          <button className="flex items-center gap-2 p-2 rounded-md hover:bg-white-hover/20 transition-all duration-150 w-full">
            {item.icon}
            {isOpen && (
              <span className="text-base font-normal">{item.name}</span>
            )}
          </button>
        </Link>
      ))}
    </div>
  );
};

export default List;
