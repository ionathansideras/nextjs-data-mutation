import Posts from "@/components/posts";
import { getPosts } from "@/lib/posts";

// static metadata
// export const metadata = {
//     title: "Feed",
//     description: "All posts by all users",
// };

// dyanmic metadata
export async function generateMetadata() {
    const posts = await getPosts();
    return {
        title: `Feed ${posts.length} posts.`,
        description: `There are ${posts.length} posts.`,
    };
}

export default async function FeedPage() {
    const posts = await getPosts();
    return (
        <>
            <h1>All posts by all users</h1>
            <Posts posts={posts} />
        </>
    );
}
