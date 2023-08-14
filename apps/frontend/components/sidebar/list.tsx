"use client";
import {
  File,
  Image,
  Rocket,
  Users,
  Layout,
  FlowArrow,
  ListChecks,
  Gear,
  PaintBrush,
  Copy,
} from "ui/icons";
import ListItem from "./item";

const list_items = [
  {
    name: "Dashboard",
    link: "/",
    icon: <Layout size={20} />,
  },

  {
    name: "Lists",
    link: "/lists",
    icon: <ListChecks size={20} />,
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
    name: "Templates",
    link: "/templates",
    icon: <Copy size={20} />,
  },
  {
    name: "Settings",
    link: "/settings",
    icon: <Gear size={20} />,
  },
];

const List = () => {
  return (
    <div className="w-full flex flex-col gap-1 mt-6 relative items-center justify-center">
      {list_items.map((item, index) => (
        <ListItem item={item} key={index} />
      ))}
    </div>
  );
};

export default List;
