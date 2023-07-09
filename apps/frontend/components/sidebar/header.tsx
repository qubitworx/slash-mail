"use client";
import Image from "next/image";
import useSidebarState from "./state";
import { Kanit } from "next/font/google";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sidebar } from "ui/icons";
import Link from "next/link";

const KanitFont = Kanit({
  weight: "600",
  subsets: ["latin-ext"],
});

const Header = () => {
  const { isOpen, setIsOpen } = useSidebarState((s) => s);

  return (
    <div
      className={`flex items-center ${
        isOpen ? "justify-between" : "justify-center"
      }`}
    >
      {isOpen && (
        <Link href={"/dashboard"}>
          <div className="flex items-center gap-2">
            <Image src="/logo.png" width={32} height={32} alt="Logo" />
            <h1 className={`text-2xl font-medium ${KanitFont.className}`}>
              SlashMail
            </h1>
          </div>
        </Link>
      )}
      <motion.button
        className="p-[1px] hover:bg-white-hover/50 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
        animate={{
          rotate: isOpen ? 180 : 0,
          transition: {
            duration: 0.3,
            delay: 0.1,
          },
        }}
      >
        <ArrowRight weight="bold" />
      </motion.button>
    </div>
  );
};

export default Header;
