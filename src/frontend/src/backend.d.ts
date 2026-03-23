import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export type PostId = string;
export interface Post {
    id: PostId;
    media: Array<Media>;
    createdAt: Time;
    author: Principal;
    caption: string;
}
export interface Media {
    blob: ExternalBlob;
    mediaType: MediaType;
}
export enum MediaType {
    video = "video",
    image = "image"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(caption: string, media: Array<Media>): Promise<Post>;
    deletePost(id: PostId): Promise<void>;
    getAllPosts(): Promise<Array<Post>>;
    getCallerUserRole(): Promise<UserRole>;
    getPost(id: PostId): Promise<Post>;
    isCallerAdmin(): Promise<boolean>;
    updatePost(id: PostId, caption: string, media: Array<Media>): Promise<Post>;
}
