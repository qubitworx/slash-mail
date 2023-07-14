"use client";

import { rspc } from "@/rspc/utils";
import { useState } from "react";
import { Button } from "ui";
import { Plus } from "ui/icons";
import { LoadingSkeleton } from "ui/src/Loading";
import NewSMTP from "./new";
import EditSMTP from "./edit";

const SMTPSettings = () => {
  const smtpServers = rspc.useQuery(["smtp.get"]);
  const [create, setCreate] = useState(false);

  if (smtpServers.isLoading) {
    return (
      <div className="flex flex-col gap-2 w-full h-full">
        <LoadingSkeleton width="100%" height="15rem" />
        <LoadingSkeleton width="100%" height="15rem" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {smtpServers.data?.map((smtpServer, idx) => (
        <EditSMTP key={idx} smtp={smtpServer as any} />
      ))}
      {create ? (
        <NewSMTP setCreate={setCreate} />
      ) : (
        <Button
          onClick={() => setCreate(true)}
          variant={"secondary"}
          className="w-fit flex items-center gap-2 px-12"
        >
          <Plus />
          Create
        </Button>
      )}
    </div>
  );
};

export default SMTPSettings;
