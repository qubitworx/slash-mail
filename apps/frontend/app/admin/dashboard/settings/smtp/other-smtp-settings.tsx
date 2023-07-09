import { useFormContext } from "react-hook-form";
import { Input, Select } from "ui";
import { SMTPFormFields } from "./new-smtp";

const OtherSMTPSettings = () => {
  const methods = useFormContext<SMTPFormFields>();

  return (
    <div className="w-full mt-4 grid grid-cols-5 gap-3">
      <div className="flex flex-col col-span-1">
        <label className="text-sm font-medium">Auth Protocol</label>
        <Select
          placeholder="Auth Protocol"
          ariaLabel="auth-protocol"
          onChange={(value) => methods.setValue("authProtocol", value)}
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
      <div className="flex flex-col col-span-3">
        <label className="text-sm font-medium">Helo hostname (optional)</label>
        <Input
          {...methods.register("helo", {})}
          placeholder="Helo hostname"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default OtherSMTPSettings;
