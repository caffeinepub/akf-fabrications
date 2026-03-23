import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Post } from "../backend";
import { useDeletePost, useGetAllPosts, useIsAdmin } from "../hooks/useQueries";
import EditPostModal from "./EditPostModal";
import NewPostModal from "./NewPostModal";
import PostCard from "./PostCard";

export default function Feed() {
  const { data: posts, isLoading } = useGetAllPosts();
  const { data: isAdmin } = useIsAdmin();
  const deletePost = useDeletePost();
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  return (
    <section id="work" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary font-body text-xs tracking-[0.3em] uppercase font-600">
                Project Gallery
              </span>
            </div>
            <h2 className="font-display font-800 text-4xl md:text-5xl uppercase tracking-tight">
              Our <span className="text-primary">Work</span>
            </h2>
          </div>

          {isAdmin && (
            <Button
              onClick={() => setNewPostOpen(true)}
              data-ocid="feed.open_modal_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-700 tracking-widest uppercase"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          )}
        </motion.div>

        {isLoading ? (
          <div
            data-ocid="feed.loading_state"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-none overflow-hidden"
              >
                <Skeleton className="h-64 w-full" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="feed.empty_state"
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 bg-card border border-border flex items-center justify-center mb-4">
              <ImageOff className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display font-700 text-xl uppercase tracking-wide mb-2">
              No Posts Yet
            </h3>
            <p className="text-muted-foreground text-sm">
              {isAdmin
                ? "Click 'New Post' to share your first project."
                : "Check back soon for project updates."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                index={i + 1}
                isAdmin={!!isAdmin}
                onDelete={() => deletePost.mutate(post.id)}
                onEdit={() => setEditingPost(post)}
                isDeleting={deletePost.isPending}
              />
            ))}
          </div>
        )}
      </div>

      <NewPostModal open={newPostOpen} onOpenChange={setNewPostOpen} />
      {editingPost && (
        <EditPostModal
          post={editingPost}
          open={!!editingPost}
          onOpenChange={(open) => {
            if (!open) setEditingPost(null);
          }}
        />
      )}
    </section>
  );
}
