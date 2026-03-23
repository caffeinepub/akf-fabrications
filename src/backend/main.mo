import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  type PostId = Text;

  type MediaType = { #image; #video };

  type Media = {
    blob : Storage.ExternalBlob;
    mediaType : MediaType;
  };

  type Post = {
    id : PostId;
    caption : Text;
    media : [Media];
    createdAt : Time.Time;
    author : Principal;
  };

  module Post {
    public func compareByCreatedAt(post1 : Post, post2 : Post) : Order.Order {
      Int.compare(post2.createdAt, post1.createdAt);
    };
  };

  let posts = Map.empty<PostId, Post>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  func getPostInternal(id : PostId) : Post {
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) { post };
    };
  };

  public query ({ caller }) func getPost(id : PostId) : async Post {
    getPostInternal(id);
  };

  public query ({ caller }) func getAllPosts() : async [Post] {
    posts.values().toArray().sort(Post.compareByCreatedAt);
  };

  public shared ({ caller }) func createPost(caption : Text, media : [Media]) : async Post {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create posts");
    };
    let id = caption.concat(Time.now().toText());
    let post : Post = {
      id;
      caption;
      media;
      createdAt = Time.now();
      author = caller;
    };
    posts.add(id, post);
    post;
  };

  public shared ({ caller }) func updatePost(id : PostId, caption : Text, media : [Media]) : async Post {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update posts");
    };
    let existingPost = getPostInternal(id);
    let updatedPost : Post = {
      id;
      caption;
      media;
      createdAt = existingPost.createdAt;
      author = existingPost.author;
    };
    posts.add(id, updatedPost);
    updatedPost;
  };

  public shared ({ caller }) func deletePost(id : PostId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };
    ignore getPostInternal(id);
    posts.remove(id);
  };
};
