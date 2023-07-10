import { SmtpSettings } from "@/rspc/bindings";
import { useFormContext } from "react-hook-form";
import { Input, Select } from "ui";

const OtherSMTPSettings = () => {
  const methods = useFormContext<SmtpSettings>();

  return (
    <div className="w-full mt-4 grid grid-cols-5 gap-3">
      <div className="flex flex-col col-span-1">
        <label className="text-sm font-medium">Auth Protocol</label>
        <Select
          placeholder="Auth Protocol"
          ariaLabel="auth-protocol"
          onChange={(value) => methods.setValue("auth_protocol", value)}
          items={[
            {
              label: "LOGIN",
              value: "login",
            },
            {
              label: "CRAM",
              value: "cram",
            },
            {
              label: "PLAIN",
              value: "plain",
            },
            {
              label: "None",
              value: "none",
            },
          ]}
          defaultValue="login"
        />
      </div>
      <div className="flex flex-col col-span-1">
        <label className="text-sm font-medium">TLS</label>
        <Select
          placeholder="TLS"
          ariaLabel="tls"
          onChange={(value) => methods.setValue("tls", value)}
          items={[
            {
              label: "SSL/TLS",
              value: "ssl/tls",
            },
            {
              label: "STARTTLS",
              value: "starttls",
            },
            {
              label: "Off",
              value: "off",
            },
          ]}
          defaultValue="off"
        />
      </div>
      <div className="col-span-3 grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <label className="text-sm font-medium">
            Helo hostname (optional)
          </label>
          <Input
            {...methods.register("helo_host", {})}
            placeholder="Helo hostname"
            className="w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">From address</label>
          <Input
            {...methods.register("smtp_from", {
              required: {
                message: "From address is required",
                value: true,
              },
            })}
            variant={methods.formState.errors.smtp_from ? "error" : "primary"}
            placeholder="John Doe <john@gmail.com>"
            className="w-full"
          />
          {methods.formState.errors.smtp_from && (
            <span className="text-xs text-error-stroke">
              {methods.formState.errors.smtp_from.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtherSMTPSettings;
