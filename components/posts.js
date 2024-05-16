"use client";
import { formatDate } from "@/lib/format";
import Image from "next/image";
import LikeButton from "./like-icon";
import { togglePostLikeStatus } from "@/actions/post";
import { useOptimistic } from "react";

function Post({ post, action }) {
    // The `imageLoader` function is used to optimize the image URL.
    function imageLoader(config) {
        const urlStart = config.src.split("upload/")[0];
        const urlEnd = config.src.split("upload/")[1];
        // Return the optimized image URL.
        console.log(config);
        return `${urlStart}upload/w_200,q_${config.quality}/${urlEnd}`;
    }

    return (
        <article className="post">
            <div className="post-image">
                <Image
                    loader={imageLoader}
                    src={post.image}
                    width={200}
                    height={120}
                    alt={post.title}
                    quality={50}
                />
            </div>
            <div className="post-content">
                <header>
                    <div>
                        <h2>{post.title}</h2>
                        <p>
                            Shared by {post.userFirstName} on{" "}
                            <time dateTime={post.createdAt}>
                                {formatDate(post.createdAt)}
                            </time>
                        </p>
                    </div>
                    <div>
                        <form
                            action={action.bind(null, post.id)}
                            className={post.isLiked ? "liked" : ""}
                        >
                            <LikeButton />
                        </form>
                    </div>
                </header>
                <p>{post.content}</p>
            </div>
        </article>
    );
}

export default function Posts({ posts }) {
    // The `useOptimistic` hook is used to manage the state of the posts.
    // It takes two arguments: the initial state (`posts`) and an update function.

    // The initial state (`posts`) is an array of post objects.

    // The update function takes the current state (`posts`) and an `updatePostId` as arguments.
    // It returns a new state based on the current state and the `updatePostId`.

    // The `useOptimistic` hook returns an array with two elements: the current state and a function to update the state.
    // These are destructured into `optimisticPosts` and `updateOptimisticPosts`, respectively.
    const [optimisticPosts, updateOptimisticPosts] = useOptimistic(
        posts,
        (posts, updatePostId) => {
            // Find the index of the post with the `updatePostId`.
            // If no such post is found, `findIndex` returns -1.
            const updatedPostIndex = posts.findIndex(
                (post) => post.id === updatePostId
            );

            // If no post with the `updatePostId` is found, return the current state without any changes.
            if (updatedPostIndex === -1) {
                return posts;
            }

            // Create a copy of the post to be updated (the one we clicked).
            const updatedPosts = { ...posts[updatedPostIndex] };

            // Update the `likes` property of the post.
            // If the post is liked, decrement the `likes` by -1.
            // If the post is not liked, increment the `likes` by 1.
            updatedPosts.likes =
                updatedPosts.likes + (updatedPosts.isLiked ? -1 : 1);

            // Toggle the `isLiked` property of the post.
            // so if the post is liked, set it to `false`, and vice versa.
            updatedPosts.isLiked = !updatedPosts.isLiked;

            // Create a copy of the current state.
            const newPosts = [...posts];

            // Replace the post to be updated with the updated post in the new state.
            newPosts[updatedPostIndex] = updatedPosts;

            // Return the new state.
            return newPosts;
        }
    );

    if (!optimisticPosts || optimisticPosts.length === 0) {
        return <p>There are no posts yet. Maybe start sharing some?</p>;
    }

    async function updatePost(postId) {
        updateOptimisticPosts(postId);
        // Call the `togglePostLikeStatus` function to update the post's like status.
        await togglePostLikeStatus(postId);
    }

    return (
        <ul className="posts">
            {optimisticPosts.map((post) => (
                <li key={post.id}>
                    <Post post={post} action={updatePost} />
                </li>
            ))}
        </ul>
    );
}
