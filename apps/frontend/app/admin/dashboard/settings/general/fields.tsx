import { useFormContext } from "react-hook-form";
import { Button, FlatInput, TextArea } from "ui";
import { SettingsProps } from ".";

const Fields = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useFormContext<SettingsProps>();
  const onSubmit = (data: SettingsProps) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-4"
    >
      <div className="flex flex-col">
        <label className="text-sm text-white-text/70">Name</label>
        <FlatInput
          placeholder="Name"
          containerClassName="w-full"
          className="w-full"
          {...register("name", {
            required: {
              message: "Name is required",
              value: true,
            },
          })}
        />
        {errors.name && (
          <span className="text-error-stroke text-xs">
            {errors.name.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-white-text/70">Description</label>
        <textarea
          placeholder="Description"
          className="w-full h-32 p-2 rounded-md bg-white-fill border-2 border-white-stroke text-white-text active:bg-white-fill focus:outline-none placeholder:placeholder-white-hover placeholder:text-sm focus:border-blue-stroke"
          {...register("description", {
            required: {
              message: "Description is required",
              value: true,
            },
          })}
        />
        {errors.description && (
          <span className="text-error-stroke text-xs">
            {errors.description.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-white-text/70">API Url</label>
        <FlatInput
          placeholder="API Url"
          className="w-full"
          {...register("api_url", {
            required: {
              message: "API url is required",
              value: true,
            },
            pattern: {
              message: "API url is not valid",
              value: /^https?:\/\/[^\s$.?#].[^\s]*$/gm,
            },
          })}
        />
        {errors.api_url && (
          <span className="text-error-stroke text-xs">
            {errors.api_url.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-white-text/70">Website Url</label>
        <FlatInput
          placeholder="Web Url"
          className="w-full"
          {...register("web_url", {
            required: {
              message: "Web url is required",
              value: true,
            },
            pattern: {
              message: "Web url is not valid",
              value: /^https?:\/\/[^\s$.?#].[^\s]*$/gm,
            },
          })}
        />
        {errors.web_url && (
          <span className="text-error-stroke text-xs">
            {errors.web_url.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-white-text/70">
          Logo (upload in the media tab and enter the path in the form of
          /path.png)
        </label>
        <FlatInput
          placeholder="Logo path"
          className="w-full"
          {...register("logo", {
            required: {
              message: "Logo is required",
              value: true,
            },
            pattern: {
              message: "Logo is not valid",
              value: /^https?:\/\/[^\s$.?#].[^\s]*$/gm,
            },
          })}
        />
        {errors.web_url && (
          <span className="text-error-stroke text-xs">
            {errors.web_url.message}
          </span>
        )}
      </div>

      <div>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default Fields;
