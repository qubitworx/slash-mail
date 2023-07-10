import { SMTPCreateArgs } from "@/rspc/bindings";
import { useFormContext } from "react-hook-form";
import { Checkbox, Input } from "ui";

const PerfSMTPSettings = () => {
  const {
    formState: { errors },
    setValue,
    register,
  } = useFormContext<SMTPCreateArgs>();

  return (
    <div className="w-full mt-4 grid grid-cols-5 gap-2">
      <div className="flex flex-col justify-center h-full">
        <label className="text-sm font-medium">Skip TLS verification</label>
        <div className="flex gap-1 items-center whitespace-nowrap mt-2">
          <Checkbox onChange={(value) => setValue("smtp_tls", value)} />
          <span className="text-sm">Skip TLS verification</span>
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Retries</label>
        <Input
          {...register("max_retries", {
            min: {
              value: 1,
              message: "Max connections must be greater than 0",
            },
            max: {
              value: 15,
              message: "Max connections must be less than 15",
            },
            // data type integer
          })}
          type="number"
          variant={errors.max_retries ? "error" : "primary"}
          placeholder="2"
          className="w-full"
        />
        {errors.max_retries && (
          <span className="text-xs text-error-stroke">
            {errors.max_retries.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Max connections</label>
        <Input
          {...register("max_connections", {
            required: {
              message: "Max connections is required",
              value: true,
            },
            min: {
              value: 1,
              message: "Max connections must be greater than 0",
            },
            max: {
              value: 15,
              message: "Max connections must be less than 15",
            },
          })}
          variant={errors.max_connections ? "error" : "primary"}
          placeholder="10"
          className="w-full"
          type="number"
        />
        {errors.max_connections && (
          <span className="text-xs text-error-stroke">
            {errors.max_connections.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Idle Timeout (in s)</label>
        <Input
          {...register("idle_timeout", {
            required: {
              message: "Idle Timeout is required",
              value: true,
            },
            min: {
              value: 1,
              message: "Idle Timeout must be greater than 0",
            },
          })}
          variant={errors.idle_timeout ? "error" : "primary"}
          placeholder="10"
          className="w-full"
          type="number"
        />
        {errors.idle_timeout && (
          <span className="text-xs text-error-stroke">
            {errors.idle_timeout.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Wait Timeout (in s)</label>
        <Input
          {...register("wait_timeout", {
            required: {
              message: "Wait Timeout is required",
              value: true,
            },
            min: {
              value: 1,
              message: "Wait Timeout must be greater than 0",
            },
          })}
          variant={errors.wait_timeout ? "error" : "primary"}
          placeholder="5"
          className="w-full"
          type="number"
        />
        {errors.wait_timeout && (
          <span className="text-xs text-error-stroke">
            {errors.wait_timeout.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default PerfSMTPSettings;
