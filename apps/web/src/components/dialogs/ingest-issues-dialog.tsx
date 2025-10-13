import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "@poker-planner/backend/convex/_generated/api";
import type { Id } from "@poker-planner/backend/convex/_generated/dataModel";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "~/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckIcon, ClipboardCheckIcon, XIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropzoneEmptyState,
  DropzoneContent,
  Dropzone,
} from "../kibo-ui/dropzone";
import { Button } from "../ui/button";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { Spinner } from "../ui/spinner";
import { cn } from "~/lib/utils";

type IngestIssuesDialogContentProps = {
  roomId: Id<"rooms">;
  dialogTrigger?: React.ReactNode;
};

export function IngestIssuesDialog({
  roomId,
  dialogTrigger,
}: IngestIssuesDialogContentProps) {
  const { mutateAsync: generateUploadUrl } = useMutation({
    mutationFn: useConvexMutation(api.issueIngestion.generateUploadUrl),
  });
  const { mutateAsync: createIssueIngestion } = useMutation({
    mutationFn: useConvexMutation(api.issueIngestion.createIssueIngestion),
  });

  const { data: ingestionData } = useQuery(
    convexQuery(api.issueIngestion.getIngestionsByRoom, {
      roomId,
    })
  );

  const hasIngestionInProgress = (ingestionData?.length ?? 0) > 0;

  const hasIngestionProcessing = ingestionData?.some(
    (ingestion) => ingestion.status.type === "processing"
  );

  const hasIngestionFailed = ingestionData?.some(
    (ingestion) => ingestion.status.type === "failed"
  );

  const hasIngestionCompleted = ingestionData?.some(
    (ingestion) => ingestion.status.type === "completed"
  );

  const [image, setImage] = useState<File | undefined>();

  const handleDrop = (files: File[]) => {
    setImage(files.at(0));
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            const file = new File(
              [blob],
              `pasted-image-${Date.now()}.${type.split("/")[1]}`,
              { type }
            );
            setImage(file);
            toast.success("Image pasted from clipboard");
            return;
          }
        }
      }
      toast.error("No image found in clipboard");
    } catch (error) {
      console.error("Failed to paste from clipboard:", error);
      toast.error(
        "Failed to paste from clipboard. Please make sure you have granted clipboard permissions."
      );
    }
  };

  const { mutate: uploadImage } = useMutation({
    mutationFn: async (image: File) => {
      const postUrl = await generateUploadUrl({ roomId });

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": image.type },
        body: image,
      });

      const { storageId } = await result.json();

      await createIssueIngestion({ roomId, imageid: storageId });
    },
    onMutate: () => {
      toast.info("Uploading image...");
    },
    onSuccess: () => {
      toast.success("Image uploaded successfully");
    },
    onError: (error) => {
      toast.error((error as any).data ?? error.message);
    },
    onSettled: () => {
      setImage(undefined);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        {dialogTrigger ?? (
          <Button
            className="w-full rounded-full"
            variant="outline"
            size="sm"
            disabled={hasIngestionInProgress}
          >
            {hasIngestionProcessing ? (
              <>
                <Spinner /> Processing issues...
              </>
            ) : hasIngestionFailed ? (
              <>
                <XIcon /> Ingestion failed
              </>
            ) : hasIngestionCompleted ? (
              <>
                <CheckIcon /> Ingestion completed
              </>
            ) : (
              "AI Issue Ingestion"
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ingest Issues</DialogTitle>
          <DialogDescription>
            <div>
              Upload a screenshot of your issues from any provider and we'll
              parse them for you.
            </div>
            <div>Any issues found will be added to the issue list.</div>
          </DialogDescription>
        </DialogHeader>
        <Button variant="outline" onClick={handlePasteFromClipboard}>
          <ClipboardCheckIcon /> Paste image from clipboard
        </Button>
        <Dropzone
          accept={{ "image/*": [] }}
          maxFiles={10}
          maxSize={1024 * 1024 * 10}
          minSize={1024}
          onDrop={handleDrop}
          onError={console.error}
          src={image ? [image] : undefined}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
        <p className="text-xs text-muted-foreground">
          By clicking "Begin Ingestion", you agree to the{" "}
          <Link to="/terms">Terms of Service</Link> and{" "}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setImage(undefined)}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                if (!image) {
                  toast.error("Please upload an image");
                  return;
                }

                uploadImage(image);
              }}
              disabled={!image}
            >
              Begin Ingestion
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
