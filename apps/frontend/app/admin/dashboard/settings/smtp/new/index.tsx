"use client";

import { FormProvider, useForm } from "react-hook-form";
import { Button } from "ui";
import SMTPSettings from "./smtp-settings";
import OtherSMTPSettings from "./other-smtp-settings";
import PerfSMTPSettings from "./perf-smtp-settings";
import { rspc } from "@/rspc/utils";
import { SMTPCreateArgs } from "@/rspc/bindings";

interface Props {
  smtp?: SMTPCreateArgs;
  setCreate: (create: boolean) => void;
}

const NewSMTP = ({ setCreate, smtp }: Props) => {
  const methods = useForm<SMTPCreateArgs>({
    defaultValues: smtp ?? {
      max_retries: 5,
      idle_timeout: 10,
      wait_timeout: 5,
      max_connections: 5,
      smtp_port: "465",
      smtp_tls: true,
      auth_protocol: "plain",
      tls: "ssl/tls",
      custom_headers: "",
    },
  });
  const { handleSubmit } = methods;
  const createSMTPServerMutation = rspc.useMutation(["smtp.create"]);
  const context = rspc.useContext();

  const onClick = (form: SMTPCreateArgs) => {
    createSMTPServerMutation.mutate(
      {
        ...form,
      },
      {
        onSuccess: () => {
          setCreate(false);
          context.queryClient.invalidateQueries(["smtp.get"]);
        },
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full p-3 border-2 border-white-stroke shadow-[0px_2px_0px_0px] shadow-white-stroke rounded-lg">
        <h1 className="text-lg font-medium">Connect SMTP Server</h1>
        <SMTPSettings />
        <OtherSMTPSettings />
        <PerfSMTPSettings />
        <div className="w-full flex items-center justify-end gap-2">
          <Button
            variant={"secondary"}
            className="w-fit mt-4"
            onClick={() => setCreate(false)}
          >
            Cancel
          </Button>

          <Button
            loading={createSMTPServerMutation.isLoading}
            className="w-fit mt-4"
            onClick={handleSubmit(onClick)}
          >
            Connect
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

export default NewSMTP;
