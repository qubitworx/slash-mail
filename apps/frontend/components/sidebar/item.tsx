"use client";

import Link from "next/link";
import useSidebarState from "./state";
import { useState } from "react";

interface Props {
  item: {
    name: string;
    link: string;
    icon: JSX.Element;
  };
}

const ListItem = ({ item }: Props) => {
  const { isOpen } = useSidebarState((s) => s);
  const [isHover, setIsHover] = useState(true);

  const Icon = () => {
    const Icon = item.icon.type as React.FC<any>;
    return <Icon size={20} />;
  };

  return (
    <Link href={"/admin/dashboard" + item.link} className="w-full">
      <button className="flex items-center gap-2 p-2 rounded-md hover:bg-white-hover/20 transition-all duration-150 w-full border border-transparent hover:border-white-stroke">
        <Icon />
        {isOpen && <span className="text-base font-normal">{item.name}</span>}
      </button>
    </Link>
  );
};

export default ListItem;
