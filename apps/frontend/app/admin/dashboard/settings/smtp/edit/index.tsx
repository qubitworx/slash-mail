"use client";

import { FormProvider, useForm } from "react-hook-form";
import { Button } from "ui";
import SMTPSettings from "./smtp-settings";
import OtherSMTPSettings from "./other-smtp-settings";
import PerfSMTPSettings from "./perf-smtp-settings";
import { rspc } from "@/rspc/utils";
import { SmtpSettings } from "@/rspc/bindings";

interface Props {
  smtp?: SmtpSettings;
}

const EditSMTP = ({ smtp }: Props) => {
  const methods = useForm<SmtpSettings>({
    defaultValues: smtp,
  });
  const { handleSubmit } = methods;
  const createSMTPServerMutation = rspc.useMutation(["smtp.edit"]);
  const context = rspc.useContext();

  const onClick = (form: SmtpSettings) => {
    createSMTPServerMutation.mutate(
      {
        ...form,
      },
      {
        onSuccess: () => {
          context.queryClient.invalidateQueries(["smtp.get"]);
        },
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full p-3 border-2 border-white-stroke shadow-[0px_2px_0px_0px] shadow-white-stroke rounded-lg">
        <h1 className="text-lg font-medium">SMTP Server</h1>
        <SMTPSettings />
        <OtherSMTPSettings />
        <PerfSMTPSettings />
        <div className="w-full flex items-center justify-end gap-2">
          <Button
            variant={"secondary"}
            className="w-fit mt-4"
            loading={createSMTPServerMutation.isLoading}
            onClick={handleSubmit(onClick)}
          >
            Edit
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

export default EditSMTP;
