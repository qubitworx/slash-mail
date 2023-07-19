"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Question } from "ui/icons";

interface Props {
  text: string;
}

const Helper = (props: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="w-12 h-12 relative">
        <AnimatePresence>
          {open && (
            <motion.div
              className="bg-white-active border border-secondary-border rounded-md p-4 shadow-lg bottom-14 w-[22rem] right-0 absolute"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <p className="w-full">{props.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          className="w-full h-full bg-white-fill border border-white-stroke hover:bg-hover-background rounded-full grid place-items-center"
          onClick={() => setOpen(!open)}
        >
          <Question size={24} />
        </button>
      </div>
    </div>
  );
};

export default Helper;
