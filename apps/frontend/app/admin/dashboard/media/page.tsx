"use client";
import DashboardLayout from "@/layout/dashboard";
import Header from "./header";
import { useState } from "react";
import { rspc } from "@/rspc/utils";
import { Image as ImageIcon, Link as LinkIcon, Trash } from "ui/icons";
import { AlertDialog, Button } from "ui";
import Link from "next/link";
import { toast } from "ui/toast";

const Media = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const all_media = rspc.useQuery(["media.get_all"]);
  const delete_media_mutation = rspc.useMutation(["media.delete"]);

  return (
    <DashboardLayout name="Media" icon={<ImageIcon />}>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex gap-2 items-center flex-wrap">
        {all_media.data?.map((media) => (
          <div
            className="max-w-[300px] max-h-[300px] w-full h-full relative"
            key={media.id}
            style={{
              width: "300px",
              height: "300px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              width={300}
              height={300}
              src={`${process.env.NEXT_PUBLIC_API_URL}/media/${media.filename}`}
              className="w-full h-full object-cover"
            />
            <div className="w-full h-full bg-gradient-to-b hover:to-black from-transparent to-transparent absolute bottom-0 transition-all duration-150 flex items-end justify-between text-white-stroke p-2 opacity-0 hover:opacity-100">
              {media.filename}
              <div className="flex gap-1 items-center">
                <Button className="p-1" variant={"secondary"}>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}/media/${media.filename}`}
                    passHref
                  >
                    <LinkIcon />
                  </Link>
                </Button>
                <AlertDialog
                  confirmButtonText="Delete"
                  description="Are you sure you want to delete this media? This action cannot be undone. Any emails that use this media will be broken."
                  title="Delete Media"
                  confirmationText={`Delete ${media.filename}`}
                  onConfirm={() => {
                    delete_media_mutation.mutate(media.id, {
                      onSuccess: () => {
                        all_media.refetch();
                        toast.success("Media deleted successfully");
                      },
                    });
                  }}
                >
                  <Button className="p-1" variant={"error"}>
                    <Trash />
                  </Button>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Media;
