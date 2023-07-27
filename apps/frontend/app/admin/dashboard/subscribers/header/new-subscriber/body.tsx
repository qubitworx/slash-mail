"use client";
import { rspc } from "@/rspc/utils";
import { useForm } from "react-hook-form";
import { Select, FlatInput, DialogButtons, TextArea, Button } from "ui";
import { Clipboard, File } from "ui/icons";
import { toast } from "ui/toast";

export interface InputProps {
  name: string;
  email: string;
  type: "enabled" | "blocklisted";
  lists: string[];
  json: string;
}

const NewSubscriberBody = () => {
  const createSubscriber = rspc.useMutation(["subscriber.create"]);

  const {
    register,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<InputProps>({
    mode: "onChange",
    defaultValues: {
      type: "enabled",
      json: "{}",
    },
  });

  const onSubmit = async (data: InputProps) => {
    if (Object.keys(errors).length > 0) {
      toast.error("Form contains errors, please fix them before submitting");
      return;
    }

    await createSubscriber.mutateAsync(
      {
        attributes: data.json,
        email: data.email,
        name: data.name,
        status: data.type,
      },
      {
        onSuccess: (e) => {
          toast.success(`Subscriber ${e.name} created successfully`);
        },
      }
    );
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-white-text-disabled">Name</span>
        <FlatInput
          {...register("name", { required: true })}
          placeholder="Subscriber name"
          className="w-full"
        />
        {errors.name && (
          <span className="text-xs text-red-500">This field is required</span>
        )}
      </div>
      <div className="grid-cols-8 grid gap-2">
        <div className="flex flex-col gap-1 col-span-5">
          <span className="text-sm text-white-text-disabled">Email</span>
          <FlatInput
            {...register("email", {
              required: true,
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                message: "Invalid email",
              },
            })}
            placeholder="Subscriber email"
            className="w-full"
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1 col-span-3">
          <span className="text-sm text-white-text-disabled">Status</span>
          <Select
            onChange={(e) => setValue("type", e as any)}
            items={[
              {
                label: "Enabled",
                value: "enabled",
              },
              {
                label: "Blocklisted",
                value: "blocklisted",
              },
            ]}
            defaultValue="enabled"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 col-span-3">
        <span className="text-sm text-white-text-disabled">
          Subscriber Data (in JSON)
        </span>
        <div className="relative">
          <div className="absolute top-1 right-1 z-[9999]">
            <Button
              onClick={() => {
                // format json
                const json = getValues("json");
                setValue("json", JSON.stringify(JSON.parse(json), null, 2));
              }}
              className="p-1"
              variant={"secondary"}
            >
              <File />
            </Button>
          </div>
          <TextArea
            onKeyDown={(e) => {
              if (e.key == "Tab") {
                // add 4 spaces
                e.preventDefault();
              }
            }}
            {...register("json", {
              required: true,
              validate: (value) => {
                try {
                  JSON.parse(value);
                  return true;
                } catch (e) {
                  return "Invalid JSON";
                }
              },
            })}
            max={10}
            placeholder={`{"name": "Jane Doe", "subscribe": true}`}
            className="w-full h-32"
          />
        </div>
        {errors.json && (
          <span className="text-xs text-red-500">{errors.json.message}</span>
        )}
        <p className="text-xs text-white-text-disabled">
          Attributes are defined as a JSON map, for example:{" "}
          {`{"name": "Jane Doe", "subscribe": true, "location": "New York"}`}
        </p>
      </div>
      <div className="flex flex-col gap-1"></div>
      <DialogButtons
        onClick={async () => {
          await onSubmit(getValues());
        }}
      />
    </div>
  );
};

export default NewSubscriberBody;
