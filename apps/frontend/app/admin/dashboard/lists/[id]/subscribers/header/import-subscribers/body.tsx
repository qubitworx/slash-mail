"use client";
import { rspc } from "@/rspc/utils";
import Link from "next/link";
import { DialogButtons, Button, Input, FlatButton } from "ui";
import Subscriber from "./subscriber";
import { useMemo, useState } from "react";
import { toast } from "ui/toast";
import dayjs from "dayjs";

interface Props {
  id: string;
}
const ImportSubscriberBody = (props: Props) => {
  const availableSubscribers = rspc.useQuery([
    "list.available_subscribers",
    props.id,
  ]);
  const context = rspc.useContext();
  const insertSubscribers = rspc.useMutation("list.add_subscribers");
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filteredSubscribers = useMemo(() => {
    return (
      availableSubscribers.data?.filter(
        (subscriber) =>
          subscriber.email.toLowerCase().includes(search.toLowerCase()) ||
          subscriber.id.toLowerCase().includes(search.toLowerCase()) ||
          subscriber.name.toLowerCase().includes(search.toLowerCase())
      ) ?? []
    );
  }, [availableSubscribers.data, search]);

  return (
    <div className="flex flex-col w-full gap-2">
      {availableSubscribers.data?.length == 0 && (
        <div className="flex flex-col gap-2 items-center justify-center">
          There are no available subscribers to import.
          <Link href="/admin/dashboard/subscribers">
            <Button>Create a subscriber here</Button>
          </Link>
        </div>
      )}
      <Input
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        placeholder="Search..."
        containerClassName="w-full"
        className="w-full"
      />
      <FlatButton
        variant={"secondary"}
        size={"sm"}
        onClick={() => {
          setSelectedSubscribers(
            filteredSubscribers.map((subscriber) => subscriber.id)
          );
        }}
      >
        Select All ({filteredSubscribers.length})
      </FlatButton>
      <div className="border-t max-h-[256px] overflow-y-auto">
        {filteredSubscribers.slice(0, 10000).map((availableSubscriber) => (
          <Subscriber
            isSelected={selectedSubscribers.includes(availableSubscriber.id)}
            key={availableSubscriber.id}
            email={availableSubscriber.email}
            id={availableSubscriber.id}
            onSelected={(id, active) => {
              if (active) {
                setSelectedSubscribers([...selectedSubscribers, id]);
              } else {
                setSelectedSubscribers(
                  selectedSubscribers.filter(
                    (subscriberId) => subscriberId != id
                  )
                );
              }
            }}
          />
        ))}
      </div>
      <DialogButtons
        onClick={async () => {
          const addSubscribers = async () => {
            await insertSubscribers.mutateAsync({
              list_id: props.id,
              subscriber_ids: selectedSubscribers,
            });

            context.queryClient.invalidateQueries();
          };
          console.time("dbsave");

          toast.promise(addSubscribers(), {
            loading: "Importing subscribers...",
            success: () => {
              return `Successfully imported ${
                selectedSubscribers.length
              } subscribers in ${console.timeEnd("dbsave")}`;
            },

            error: "Failed to import subscribers",
          });
        }}
      />
    </div>
  );
};

export default ImportSubscriberBody;
