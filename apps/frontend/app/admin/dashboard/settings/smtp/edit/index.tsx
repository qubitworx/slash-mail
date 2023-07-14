"use client";

import { FormProvider, useForm } from "react-hook-form";
import { Button } from "ui";
import SMTPSettings from "./smtp-settings";
import OtherSMTPSettings from "./other-smtp-settings";
import PerfSMTPSettings from "./perf-smtp-settings";
import { rspc } from "@/rspc/utils";
import { SmtpSettings } from "@/rspc/bindings";
import { AlertDialog } from "ui";

interface Props {
  smtp: SmtpSettings;
}

const EditSMTP = ({ smtp }: Props) => {
  const methods = useForm<SmtpSettings>({
    defaultValues: smtp,
  });
  const { handleSubmit } = methods;
  const createSMTPServerMutation = rspc.useMutation(["smtp.edit"]);
  const context = rspc.useContext();
  const deleteSMTPServerMutation = rspc.useMutation(["smtp.delete"]);

  const onClick = (form: SmtpSettings) => {
    createSMTPServerMutation.mutate(
      {
        auth_protocol: form.auth_protocol,
        created_at: form.created_at,
        custom_headers: form.custom_headers,
        helo_host: form.helo_host,
        id: form.id,
        idle_timeout: form.idle_timeout,
        max_connections: form.max_connections,
        max_retries: form.max_retries,
        smtp_from: form.smtp_from,
        smtp_host: form.smtp_host,
        smtp_pass: form.smtp_pass,
        smtp_port: form.smtp_port,
        smtp_tls: form.smtp_tls,
        smtp_user: form.smtp_user,
        tls: form.tls,
        updated_at: form.updated_at ?? new Date(),
        wait_timeout: form.wait_timeout,
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
          <AlertDialog
            confirmButtonText="Yes, delete SMTP server"
            description="Are you sure you want to delete this SMTP server? This action cannot be undone."
            title="Delete SMTP server"
            onConfirm={() => {
              deleteSMTPServerMutation.mutate(smtp.id, {
                onSuccess: () => {
                  context.queryClient.invalidateQueries(["smtp.get"]);
                },
              });
            }}
          >
            <Button
              variant={"error"}
              className="w-fit mt-4"
              loading={createSMTPServerMutation.isLoading}
            >
              Delete
            </Button>
          </AlertDialog>

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
