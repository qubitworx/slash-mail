"use client";
import { useCallback, useRef, useState } from "react";
import { FlatButton, Dialog, DialogTitle, DialogButtons, Button } from "ui";
import { Image, Trash } from "ui/icons";
import { useDropzone } from "react-dropzone";
import { toast } from "ui/toast";
import { rspc } from "@/rspc/utils";

const UploadModal = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMediaMutation = rspc.useMutation("media.upload");
  const [files, setFiles] = useState<{ content: ArrayBuffer; name: string }[]>(
    []
  );

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    let notImageFiles = acceptedFiles.filter(
      (file) => !file.type.includes("image") || file.type === "image/svg+xml"
    );

    if (notImageFiles.length > 0) {
      toast.error("Only images are allowed");

      return;
    }

    for (let f in acceptedFiles) {
      let file = acceptedFiles[f];

      if (file.size > 25000000) {
        throw new Error("File size should be less than 25MB");
      }

      // convert to byte array (integers)
      let buffer = await file.arrayBuffer();

      setFiles((prev) => [
        ...prev,
        {
          content: buffer,
          name: file.name,
        },
      ]);
    }

    return;
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
  });

  return (
    <Dialog>
      <FlatButton className="w-2/12 flex gap-2 items-center justify-center">
        <Image />
        Upload Media
      </FlatButton>
      <div className="flex flex-col gap-2 w-full">
        <DialogTitle>Upload Media</DialogTitle>
        <div
          {...getRootProps()}
          onClick={() => {
            inputRef.current?.click();
          }}
          className="w-full h-full border-2 border-dashed min-h-[320px] rounded-lg border-white-stroke grid place-items-center hover:bg-white-stroke/50 transition-all cursor-pointer"
        >
          <input
            // only allow images
            {...getInputProps()}
            ref={inputRef}
          />
          <div className="text-white-stroke text-2xl">
            {isDragActive ? "Drag here" : "Drag to upload"}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg p-2 overflow-x-auto">
          {files.map((file) => (
            <div
              key={file.name}
              className="w-28 h-28 relative"
              style={{
                backgroundImage: `url(${URL.createObjectURL(
                  new Blob([file.content])
                )})`,
                objectFit: "cover",
                backgroundSize: "cover",
              }}
            >
              <div className="-top-2 -right-2 absolute">
                <FlatButton
                  onClick={() => {
                    setFiles((prev) =>
                      prev.filter((f) => f.name !== file.name)
                    );
                  }}
                  className="p-1"
                  variant={"secondary"}
                >
                  <Trash />
                </FlatButton>
              </div>
            </div>
          ))}
        </div>
        <DialogButtons
          disabled={files.length === 0}
          confirmationText="Upload Files"
          onClick={async () => {
            const upload = async () => {
              for (let f in files) {
                let file = files[f];
                await uploadMediaMutation.mutateAsync({
                  filename: file.name,
                  content: Array.from(new Uint8Array(file.content)),
                });
              }

              setFiles([]);

              return;
            };

            toast.promise(upload(), {
              loading: "Uploading images...",
              success: "Images uploaded successfully",
              // Show the error
              error: (err) => {
                return err.message;
              },
            });
          }}
        />
      </div>
    </Dialog>
  );
};

export default UploadModal;
