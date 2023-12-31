import { ListEditInput, SmtpSettings } from "@/rspc/bindings";
import { rspc } from "@/rspc/utils";
import { useForm } from "react-hook-form";
import { Button, Checkbox, Input, Select, TextArea } from "ui";
import { toast } from "ui/toast";

interface Props {
  id: string;
}

interface ListProps {
  list: {
    id: string;
    name: string;
    description: string;
    requires_confirmation: boolean;
    created_at: string;
    updated_at: string;
    defaultSmtpSettings: {
      id: string;
      smtp_host: string;
      smtp_user: string;
    } | null;
  };
  refetch: () => void;
  smtp_servers: {
    id: string;
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    auth_protocol: string;
    tls: string;
    helo_host: string;
    smtp_from: string;
    smtp_tls: boolean;
    max_connections: number;
    max_retries: number;
    idle_timeout: number;
    wait_timeout: number;
    custom_headers: string;
    created_at: string;
  }[];
}

const List = (props: ListProps) => {
  const { list, smtp_servers } = props;
  const saveListMutation = rspc.useMutation("list.edit");
  const context = rspc.useContext();
  const form = useForm<ListEditInput>({
    defaultValues: {
      default_smtp_settings_id: list.defaultSmtpSettings?.id,
      description: list.description,
      id: list.id,
      name: list.name,
      requires_confirmation: list.requires_confirmation,
    },
  });

  const onSaveForm = (data: ListEditInput) => {
    const save = async () => {
      await saveListMutation.mutateAsync(data);

      props.refetch();
    };

    toast.promise(save(), {
      loading: "Saving list...",
      success: "Successfully saved list",
      error: "Failed to save list",
    });
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSaveForm)} className="flex flex-col gap-4">
        <div className="flex-col gap-2 items-start w-full">
          <label className="text-sm font-medium text-gray-700">
            Name
          </label>
          <Input {...form.register("name", {
            required: true,
          })}
            className="w-full"
            containerClassName="w-full"
          />
          {form.formState.errors.name && (
            <span className="text-red-500">
              This field is required
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 items-start w-full">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <TextArea {...form.register("description", {
            required: true,
          })}
            className="w-full"
            containerClassName="w-full"
          />
          {form.formState.errors.name && (
            <span className="text-red-500">
              This field is required
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 items-start w-full">
          <label className="text-sm font-medium text-gray-700">
            Requires confirmation
          </label>
          <div className="flex gap-2 items-center">
            <Checkbox
              defaultChecked={list.requires_confirmation}
              onChange={(value) => form.setValue("requires_confirmation", value)}
            />

          </div>
          {form.formState.errors.name && (
            <span className="text-red-500">
              This field is required
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 items-start w-full">
          <label className="text-sm font-medium text-gray-700">
            Default SMTP Server
          </label>
          <Select
            defaultValue={list.defaultSmtpSettings?.id}
            items={smtp_servers.map((smtp_server) => ({
              label: smtp_server.smtp_user,
              value: smtp_server.id,
            }))}
            onChange={(value) =>
              form.setValue("default_smtp_settings_id", value)
            }
            placeholder="Select a default SMTP server"
          />
        </div>
        <Button type="submit" className="w-fit">Save</Button>
      </form>
    </div>
  );
};

const ListSettings = (props: Props) => {
  const list = rspc.useQuery(["list.get", { id: props.id }]);
  const smtp_servers = rspc.useQuery(["smtp.get"]);
  const saveListMutation = rspc.useMutation("list.edit");
  if (list.isLoading || smtp_servers.isLoading) return null;

  return <List
    refetch={() => {
      list.refetch();
      smtp_servers.refetch();
    }}
    list={list.data!} smtp_servers={smtp_servers.data ?? []} />;
};

export default ListSettings;
