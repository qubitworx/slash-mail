"use client";
import { rspc } from "@/rspc/utils";
import { useRef } from "react";
import { EditorRef, EmailEditor } from "react-email-editor";
import { useForm, useFormContext } from "react-hook-form";
import { DialogButtons, Input } from "ui";
import { toast } from "ui/toast";

export interface InputProps {
  name: string;
  identifier: string;
  html: string;
  json: string;
}

const NewTemplateBody = () => {
  const form = useForm<InputProps>({
    mode: "all"
  });
  const createTemplateMutation = rspc.useMutation(["templates.create"])
  const context = rspc.useContext();
  const emailEditorRef = useRef<EditorRef>(null);

  const onSubmit = async (data: InputProps) => {
    const _onSubmit = async (edata: any) => {
      const { design, html } = edata;

      await createTemplateMutation.mutateAsync({
        html: html,
        identifier: data.identifier,
        json: JSON.stringify(design),
        name: data.name,
      })

      await context.queryClient.invalidateQueries()
    }


    const completionFunc = () => {
      return new Promise((resolve, reject) => {
        emailEditorRef.current!.editor!.exportHtml((data) => {

          toast.promise(_onSubmit(data), {
            loading: "Creating...",
            success: "Created!",
            error: "Failed to create.",
          })

          resolve(data)

        })
      })
    }

    await completionFunc();

  }


  return (
    <div
      className="flex flex-col w-full gap-2 h-full">
      <div className="overflow-y-auto max-h-[72vh] flex flex-col w-full gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <Input
            {...form.register("name", {
              required: {
                value: true,
                message: "Name is required",
              }
            })}
            placeholder="template"
            containerClassName="w-full"
            className="w-full"
          />
          {form.formState.errors.name && (
            <span className="text-red-500">
              {form.formState.errors.name.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Identifier</label>
          <Input
            {...form.register("identifier", {
              // Convert spaces to hyphens
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: "Identifier must be lowercase and contain no spaces (use hyphens)",
              },
              required: {
                value: true,
                message: "Identifier is required",
              }
            })}
            placeholder="my-identifier"
            containerClassName="w-full"
            className="w-full"
          />
          {form.formState.errors.identifier && (
            <span className="text-red-500">
              {form.formState.errors.identifier.message}
            </span>
          )}
        </div>
        <div className="flex gap-2 flex-col">
          <label htmlFor="name">Content</label>
          <EmailEditor
            ref={emailEditorRef}
            onReady={() => console.log("ready")}
          />
        </div>
      </div>
      <DialogButtons
        onClick={async () => {
          await onSubmit(form.getValues())
        }}
      />
    </div>
  );
};

export default NewTemplateBody;

