import { rspc } from "@/rspc/utils";

interface Props {
  searchQuery: string;
}

const List = (props: Props) => {
  const subscribers = rspc.useQuery([
    "subscriber.get_all",
    {
      name: props.searchQuery,
      skip: 0,
      take: 10,
    },
  ]);

  return <div>{JSON.stringify(subscribers.data)}</div>;
};

export default List;
