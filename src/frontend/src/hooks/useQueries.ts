import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Media, Post } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.getAllPosts();
      return posts.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<boolean>({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      caption,
      media,
    }: { caption: string; media: Media[] }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPost(caption, media);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      caption,
      media,
    }: { id: string; caption: string; media: Media[] }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePost(id, caption, media);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
