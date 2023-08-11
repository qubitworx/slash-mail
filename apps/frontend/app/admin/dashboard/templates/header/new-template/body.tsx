"use client";
import { DialogButtons } from "ui";

export interface InputProps {
  name: string;
}

const NewTemplateBody = () => {


  return (
    <div className="flex flex-col w-full gap-2">
      <DialogButtons
        onClick={async () => {
        }}
      />
    </div>
  );
};

export default NewTemplateBody;
