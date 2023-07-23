"use client";
import { useCallback, useRef } from "react";
import { FlatButton, Dialog, DialogTitle } from "ui";
import { Image } from "ui/icons";
import { useDropzone } from "react-dropzone";
import { toast } from "ui/toast";
import { rspc } from "@/rspc/utils";

const UploadModal = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMediaMutation = rspc.useMutation("media.upload");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    let notImageFiles = acceptedFiles.filter(
      (file) => !file.type.includes("image")
    );

    if (notImageFiles.length > 0) {
      toast.error("Only images are allowed");

      return;
    }

    const upload = async () => {
      for (let f in acceptedFiles) {
        let file = acceptedFiles[f];

        if (file.size > 10000000) {
          throw new Error("File size should be less than 10MB");
        }

        // convert to byte array (integers)
        let buffer = await file.arrayBuffer();

        await uploadMediaMutation.mutateAsync({
          filename: file.name,
          content: Array.from(new Uint8Array(buffer)),
        });
      }

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
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
            accept="image/*"
            {...getInputProps()}
            ref={inputRef}
          />
          <div className="text-white-stroke text-2xl">
            {isDragActive ? "Drag here" : "Drag to upload"}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default UploadModal;
