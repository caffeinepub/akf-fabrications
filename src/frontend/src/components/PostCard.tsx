import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Edit, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { MediaType } from "../backend";
import type { Post } from "../backend";

function formatDate(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface PostCardProps {
  post: Post;
  index: number;
  isAdmin: boolean;
  onDelete: () => void;
  onEdit: () => void;
  isDeleting: boolean;
}

export default function PostCard({
  post,
  index,
  isAdmin,
  onDelete,
  onEdit,
  isDeleting,
}: PostCardProps) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const media = post.media;
  const currentMedia = media[mediaIndex];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      data-ocid={`feed.item.${index}`}
      className="bg-card border border-border overflow-hidden group hover:border-primary/40 transition-all duration-300"
    >
      {currentMedia && (
        <div className="relative aspect-video bg-muted overflow-hidden">
          {currentMedia.mediaType === MediaType.video ? (
            // biome-ignore lint/a11y/useMediaCaption: project video content
            <video
              src={currentMedia.blob.getDirectURL()}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentMedia.blob.getDirectURL()}
              alt={post.caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}

          {media.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setMediaIndex((i) => Math.max(0, i - 1))}
                disabled={mediaIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/70 rounded-sm p-1 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setMediaIndex((i) => Math.min(media.length - 1, i + 1))
                }
                disabled={mediaIndex === media.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/70 rounded-sm p-1 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 right-2 bg-background/70 text-xs px-2 py-0.5 rounded-sm">
                {mediaIndex + 1} / {media.length}
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-4">
        <p className="text-sm text-foreground leading-relaxed mb-3 line-clamp-3">
          {post.caption}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatDate(post.createdAt)}</span>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                data-ocid={`feed.edit_button.${index}`}
                className="h-7 px-2 text-muted-foreground hover:text-primary"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                disabled={isDeleting}
                data-ocid={`feed.delete_button.${index}`}
                className="h-7 px-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
