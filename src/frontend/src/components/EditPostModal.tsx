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
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, MediaType } from "../backend";
import type { Media, Post } from "../backend";
import { useUpdatePost } from "../hooks/useQueries";

interface FilePreview {
  id: string;
  file?: File;
  preview: string;
  type: "image" | "video";
  existing?: Media;
}

interface EditPostModalProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditPostModal({
  post,
  open,
  onOpenChange,
}: EditPostModalProps) {
  const [caption, setCaption] = useState(post.caption);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updatePost = useUpdatePost();

  useEffect(() => {
    setCaption(post.caption);
    setFiles(
      post.media.map((m, i) => ({
        id: `existing-${i}`,
        preview: m.blob.getDirectURL(),
        type: m.mediaType === MediaType.video ? "video" : "image",
        existing: m,
      })),
    );
  }, [post]);

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
      if (item?.file) URL.revokeObjectURL(item.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleSubmit = async () => {
    try {
      const totalFiles = files.filter((f) => f.file).length || 1;
      let uploadIdx = 0;
      const media: Media[] = await Promise.all(
        files.map(async (fp) => {
          if (fp.existing && !fp.file) {
            return fp.existing;
          }
          const idx = uploadIdx++;
          const bytes = new Uint8Array(await fp.file!.arrayBuffer());
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

      await updatePost.mutateAsync({ id: post.id, caption, media });
      toast.success("Post updated!");
      setUploadProgress(0);
      onOpenChange(false);
    } catch {
      toast.error("Failed to update post.");
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!updatePost.isPending) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        data-ocid="edit.dialog"
        className="bg-card border-border max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-700 uppercase tracking-wide text-foreground">
            Edit Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="edit-caption"
              className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
            >
              Caption
            </Label>
            <Textarea
              id="edit-caption"
              data-ocid="edit.textarea"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="bg-background border-border resize-none"
            />
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Media
            </Label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="edit.upload_button"
              className="w-full border-2 border-dashed border-border hover:border-primary/50 transition-colors p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary"
            >
              <ImagePlus className="w-5 h-5" />
              <span className="text-sm">Add more media</span>
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

          {updatePost.isPending && uploadProgress > 0 && (
            <div data-ocid="edit.loading_state">
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
              disabled={updatePost.isPending}
              data-ocid="edit.cancel_button"
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updatePost.isPending}
              data-ocid="edit.submit_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-700 uppercase tracking-wider"
            >
              {updatePost.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  Save Changes <Upload className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
