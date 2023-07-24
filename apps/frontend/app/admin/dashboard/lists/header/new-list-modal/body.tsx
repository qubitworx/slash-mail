"use client";
import { rspc } from "@/rspc/utils";
import { useForm } from "react-hook-form";
import { Select, FlatInput, DialogButtons } from "ui";

export interface InputProps {
  name: string;
  description: string;
  confirmation: "requires-confirmation" | "doesnt-require-confirmation";
}

const NewListBody = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<InputProps>();
  const createListMutation = rspc.useMutation(["list.create"]);
  const context = rspc.useContext();

  const onSubmit = async (data: InputProps) => {
    createListMutation.mutate(
      {
        name: data.name,
        description: data.description,
        requires_confirmation: data.confirmation === "requires-confirmation",
      },
      {
        onSuccess: () => {
          context.queryClient.invalidateQueries();
          document.getElementById("dialog-close")?.click();
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-2"
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm text-white-text-disabled">Name</span>
        <FlatInput
          {...register("name", { required: true })}
          placeholder="List name"
          className="w-full"
        />
        {errors.name && (
          <span className="text-xs text-red-500">This field is required</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-white-text-disabled">Description</span>
        <textarea
          {...register("description", { required: true })}
          placeholder="List description"
          className="w-full h-32 p-2 rounded-md bg-white-fill border-2 border-white-stroke text-white-text active:bg-white-fill focus:outline-none placeholder:placeholder-white-hover placeholder:text-sm focus:border-blue-stroke"
        />
        {errors.description && (
          <span className="text-xs text-red-500">This field is required</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-white-text-disabled">
          Opt-in confirmation
        </span>
        <Select
          placeholder="Opt-in confirmation"
          ariaLabel="requires-confirmation"
          onChange={(value) => setValue("confirmation", value as any)}
          defaultValue="requires-confirmation"
          items={[
            {
              label: "Requires Confirmation",
              value: "requires-confirmation",
            },
            {
              label: "Doesn't Require Confirmation",
              value: "doesnt-require-confirmation",
            },
          ]}
        />
        <p className="text-xs text-white-text/40">
          {`If you select "Requires Confirmation", subscribers will receive an
              email asking them to confirm their subscription. If you select
              "Doesn't Require Confirmation", subscribers will be subscribed
              immediately.`}
        </p>
      </div>
      <DialogButtons />
    </form>
  );
};

export default NewListBody;
