import { useFormContext } from "react-hook-form";
import { SMTPFormFields } from "./new-smtp";
import { Checkbox, Input } from "ui";

const PerfSMTPSettings = () => {
  const {
    formState: { errors },
    setValue,
    register,
  } = useFormContext<SMTPFormFields>();

  return (
    <div className="w-full mt-4 grid grid-cols-5 gap-2">
      <div className="flex flex-col justify-center h-full">
        <label className="text-sm font-medium">Skip TLS verification</label>
        <div className="flex gap-1 items-center whitespace-nowrap mt-2">
          <Checkbox onChange={(value) => setValue("skipTLS", value)} />
          <span className="text-sm">Skip TLS verification</span>
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Retries</label>
        <Input
          {...register("retries", {
            min: {
              value: 1,
              message: "Max connections must be greater than 0",
            },
            max: {
              value: 15,
              message: "Max connections must be less than 15",
            },
          })}
          variant={errors.retries ? "error" : "primary"}
          placeholder="2"
          className="w-full"
          type="number"
        />
        {errors.retries && (
          <span className="text-xs text-error-stroke">
            {errors.retries.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Max connections</label>
        <Input
          {...register("maxConnections", {
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
          variant={errors.maxConnections ? "error" : "primary"}
          placeholder="10"
          className="w-full"
          type="number"
        />
        {errors.maxConnections && (
          <span className="text-xs text-error-stroke">
            {errors.maxConnections.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Idle Timeout (in s)</label>
        <Input
          {...register("idleTimeout", {
            required: {
              message: "Idle Timeout is required",
              value: true,
            },
            min: {
              value: 1,
              message: "Idle Timeout must be greater than 0",
            },
          })}
          variant={errors.idleTimeout ? "error" : "primary"}
          placeholder="10"
          className="w-full"
          type="number"
        />
        {errors.idleTimeout && (
          <span className="text-xs text-error-stroke">
            {errors.idleTimeout.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Wait Timeout (in s)</label>
        <Input
          {...register("waitTimeout", {
            required: {
              message: "Wait Timeout is required",
              value: true,
            },
            min: {
              value: 1,
              message: "Wait Timeout must be greater than 0",
            },
          })}
          variant={errors.waitTimeout ? "error" : "primary"}
          placeholder="5"
          className="w-full"
          type="number"
        />
        {errors.waitTimeout && (
          <span className="text-xs text-error-stroke">
            {errors.waitTimeout.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default PerfSMTPSettings;
