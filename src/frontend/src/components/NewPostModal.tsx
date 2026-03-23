import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, MediaType } from "../backend";
import type { Media } from "../backend";
import { useCreatePost } from "../hooks/useQueries";

interface FilePreview {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

interface NewPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewPostModal({
  open,
  onOpenChange,
}: NewPostModalProps) {
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createPost = useCreatePost();

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;
    const newFiles: FilePreview[] = [];
    for (const file of Array.from(selected)) {
      const isVideo = file.type.startsWith("video/");
      newFiles.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        type: isVideo ? "video" : "image",
      });
    }
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (!caption.trim() && files.length === 0) {
      toast.error("Please add a caption or media.");
      return;
    }

    try {
      const totalFiles = files.length || 1;
      const media: Media[] = await Promise.all(
        files.map(async (fp, idx) => {
          const bytes = new Uint8Array(await fp.file.arrayBuffer());
          const blob = ExternalBlob.fromBytes(bytes).withUploadProgress(
            (pct) => {
              setUploadProgress(
                Math.round(((idx + pct / 100) / totalFiles) * 100),
              );
            },
          );
          return {
            blob,
            mediaType: fp.type === "video" ? MediaType.video : MediaType.image,
          };
        }),
      );

      await createPost.mutateAsync({ caption, media });
      toast.success("Post published!");
      setCaption("");
      setFiles([]);
      setUploadProgress(0);
      onOpenChange(false);
    } catch {
      toast.error("Failed to publish post.");
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!createPost.isPending) {
      for (const f of files) URL.revokeObjectURL(f.preview);
      setFiles([]);
      setCaption("");
      setUploadProgress(0);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        data-ocid="feed.dialog"
        className="bg-card border-border max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-700 uppercase tracking-wide text-foreground">
            New Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="caption"
              className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
            >
              Caption
            </Label>
            <Textarea
              id="caption"
              data-ocid="feed.textarea"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe your project..."
              rows={3}
              className="bg-background border-border resize-none"
            />
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Media (Images &amp; Videos)
            </Label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="feed.upload_button"
              className="w-full border-2 border-dashed border-border hover:border-primary/50 transition-colors p-6 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary"
            >
              <ImagePlus className="w-8 h-8" />
              <span className="text-sm font-body">
                Click to add photos or videos
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {files.map((fp) => (
                <div
                  key={fp.id}
                  className="relative aspect-square bg-muted overflow-hidden"
                >
                  {fp.type === "video" ? (
                    // biome-ignore lint/a11y/useMediaCaption: preview thumbnail
                    <video
                      src={fp.preview}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={fp.preview}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(fp.id)}
                    className="absolute top-1 right-1 bg-background/80 rounded-sm p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {createPost.isPending && uploadProgress > 0 && (
            <div data-ocid="feed.loading_state">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1" />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={createPost.isPending}
              data-ocid="feed.cancel_button"
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createPost.isPending}
              data-ocid="feed.submit_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-700 uppercase tracking-wider"
            >
              {createPost.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Publishing...
                </>
              ) : (
                <>
                  Publish <Upload className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
