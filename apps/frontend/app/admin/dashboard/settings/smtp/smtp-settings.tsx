import { useFormContext } from "react-hook-form";
import { Input } from "ui";
import { SMTPFormFields } from "./new-smtp";

const SMTPSettings = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SMTPFormFields>();

  return (
    <div className="w-full mt-4 gap-4 grid grid-cols-5">
      <div className="flex flex-col">
        <label className="text-sm font-medium">Host</label>
        <Input
          {...register("host", {
            required: {
              message: "Host is required",
              value: true,
            },
          })}
          variant={errors.host ? "error" : "primary"}
          placeholder="smtp.gmail.com"
          className="w-full"
        />
        {errors.host && (
          <span className="text-xs text-error-stroke">
            {errors.host.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Port</label>
        <Input
          {...register("port", {
            required: {
              message: "Port is required",
              value: true,
            },
          })}
          variant={errors.port ? "error" : "primary"}
          placeholder="465"
          className="w-full"
          type="number"
        />
        {errors.port && (
          <span className="text-xs text-error-stroke">
            {errors.port.message}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 col-span-3 gap-3 w-full">
        <div className="flex flex-col col-span-1">
          <label className="text-sm font-medium">Username</label>
          <Input
            {...register("username", {
              required: {
                message: "Username is required",
                value: true,
              },
            })}
            variant={errors.username ? "error" : "primary"}
            className="w-full"
            placeholder="smtpusername"
          />
          {errors.username && (
            <span className="text-xs text-error-stroke">
              {errors.username.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-full">
          <label className="text-sm font-medium">Password</label>
          <Input
            {...register("password", {
              required: {
                message: "Password is required",
                value: true,
              },
            })}
            variant={errors.password ? "error" : "primary"}
            className="w-full"
            placeholder="password"
            type="password"
          />
          {errors.password && (
            <span className="text-xs text-error-stroke">
              {errors.password.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SMTPSettings;
