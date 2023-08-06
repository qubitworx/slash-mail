import { DataTable } from "ui";
import Header from "./header";
import { rspc } from "@/rspc/utils";
import { columns } from "./columnDef";
import dayjs from "dayjs";

interface Props {
  id: string;
}

const Subscribers = (props: Props) => {
  const subscribers = rspc.useQuery(["list.get_subscribers", props.id]);

  if (subscribers.isLoading) {
    return null;
  }

  return (
    <div>
      <DataTable
        Header={Header}
        columns={columns}
        data={
          subscribers.data?.map((subscriber) => ({
            name: subscriber.subscriber.name,
            email: subscriber.subscriber.email,
            id: subscriber.id,
            status: subscriber.status.toUpperCase(),
            createdAt: dayjs(subscriber.created_at).format("MMM DD, YYYY"),
          })) ?? []
        }
        filterColumn="email"
      />
    </div>
  );
};

export default Subscribers;
