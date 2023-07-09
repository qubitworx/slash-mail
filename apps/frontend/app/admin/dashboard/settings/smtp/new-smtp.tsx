"use client";

import { FormProvider, useForm } from "react-hook-form";
import { Button } from "ui";
import SMTPSettings from "./smtp-settings";
import OtherSMTPSettings from "./other-smtp-settings";
import PerfSMTPSettings from "./perf-smtp-settings";

export interface SMTPFormFields {
  host: string;
  port: number;
  username: string;
  password: string;
  authProtocol: string;
  tls: string;
  helo: string;
  skipTLS: boolean;

  maxConnections: number;
  retries: number;

  idleTimeout: number;
  waitTimeout: number;
}

const NewSMTP = ({ setCreate }: any) => {
  const methods = useForm<SMTPFormFields>({
    defaultValues: {
      retries: 3,
      idleTimeout: 10,
      waitTimeout: 5,
      maxConnections: 5,
      port: 465,
    },
  });
  const { handleSubmit } = methods;

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
            className="w-fit mt-4"
            onClick={handleSubmit((data) => console.log(data))}
          >
            Connect
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

export default NewSMTP;
