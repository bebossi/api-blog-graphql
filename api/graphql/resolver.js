const database = require("../models/index.js");
const FeedController = require("../controllers/feed.js");
const AuthController = require("../controllers/auth.js");
const { ApolloError } = require("apollo-server");
const isAuth = require("../middleware/isAuth");

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      const user = await AuthController.getUser(id);
      if (!user) {
        throw notFoundError("No user found with id " + id);
      }
      return user;
    },

    users: async () => {
      const users = await AuthController.getUsers();
      if (!users) {
        throw notFoundError("No user found with id ");
      }
      return users;
    },

    profile: async (_, { id }) => {
      const profilePosts = await FeedController.profilePosts(id);
      return profilePosts;
    },

    post: async (_, { id }) => {
      const post = await FeedController.getPostById(id);
      if (!post) {
        throw notFoundError("No post found with id " + id);
      }
      return post;
    },

    posts: async () => {
      const posts = await FeedController.getPosts();
      return posts;
    },
  },

  Mutation: {
    createPost: async (
      _root,
      { input: { title, content, imageUrl } },
      { user }
    ) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }

      const post = await FeedController.createPost({
        userId: user.id,
        title,
        content,
        imageUrl,
      });
      return post;
    },

    deletePost: async (_root, { id }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      const post = await FeedController.deletePost(id, user.id);

      if (!post) {
        throw notFoundError("Post not found");
      }
      return post;
    },

    updatePost: async (
      _root,
      { input: { id, title, content, imageUrl } },
      { user }
    ) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }

      const post = await FeedController.updatePost({
        id: id,
        userId: user.id,
        title,
        content,
        imageUrl,
      });

      if (!post) {
        throw notFoundError("Post not found");
      }
      return post;
    },

    createComment: async (_root, { input: { comment, postId } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }

      const CreatedComment = await FeedController.createComment({
        userId: user.id,
        comment,
        postId: 54,
      });
      return CreatedComment;
    },

    updateComment: async (_root, { input: { commentId, postId } }) => {
      const updateComment = await FeedController.updateComment(
        commentId,
        postId
      );
      return updateComment;
    },
  },

  User: {
    posts: async (user, _args, { postLoader }) => {
      const posts = await FeedController.postLoader.load(user.id);
      return posts;
    },
  },
  Post: {
    user: (post) => {
      return post.User;
    },

    comments: async (post) => {
      const comments = await FeedController.getCommentsByPost({
        postId: post.id,
      });

      return comments;
    },
  },
};

function notFoundError(message) {
  return new ApolloError(message, "NOT_FOUND");
}

function unauthorizedError(message) {
  return new ApolloError(message, "UNAUTHORIZED");
}
module.exports = resolvers;
