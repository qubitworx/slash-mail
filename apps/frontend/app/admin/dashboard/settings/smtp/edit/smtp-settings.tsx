import { SmtpSettings } from "@/rspc/bindings";
import { useFormContext } from "react-hook-form";
import { Input } from "ui";

const SMTPSettings = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SmtpSettings>();

  return (
    <div className="w-full mt-4 gap-4 grid grid-cols-5">
      <div className="flex flex-col">
        <label className="text-sm font-medium">Host</label>
        <Input
          {...register("smtp_host", {
            required: {
              message: "Host is required",
              value: true,
            },
          })}
          variant={errors.smtp_host ? "error" : "primary"}
          placeholder="smtp.gmail.com"
          className="w-full"
        />
        {errors.smtp_host && (
          <span className="text-xs text-error-stroke">
            {errors.smtp_host.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Port</label>
        <Input
          {...register("smtp_port", {
            required: {
              message: "Port is required",
              value: true,
            },
          })}
          variant={errors.smtp_port ? "error" : "primary"}
          placeholder="465"
          className="w-full"
          type="number"
        />
        {errors.smtp_port && (
          <span className="text-xs text-error-stroke">
            {errors.smtp_port.message}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 col-span-3 gap-3 w-full">
        <div className="flex flex-col col-span-1">
          <label className="text-sm font-medium">Username</label>
          <Input
            {...register("smtp_user", {
              required: {
                message: "Username is required",
                value: true,
              },
            })}
            variant={errors.smtp_user ? "error" : "primary"}
            className="w-full"
            placeholder="smtpusername"
          />
          {errors.smtp_user && (
            <span className="text-xs text-error-stroke">
              {errors.smtp_user.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-full">
          <label className="text-sm font-medium">Password</label>
          <Input
            {...register("smtp_pass", {
              required: {
                message: "Password is required",
                value: true,
              },
            })}
            variant={errors.smtp_pass ? "error" : "primary"}
            className="w-full"
            placeholder="password"
            type="password"
          />
          {errors.smtp_pass && (
            <span className="text-xs text-error-stroke">
              {errors.smtp_pass.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SMTPSettings;
