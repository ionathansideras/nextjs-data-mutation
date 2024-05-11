import { storePost } from "@/lib/posts";
import { redirect } from "next/navigation";
import FormPost from "@/components/form-post";

export default function NewPostPage() {
    async function createPost(prevState, formData) {
        "use server";
        const title = formData.get("title");
        const image = formData.get("image");
        const content = formData.get("content");

        let errors = [];

        if (!title || title.trim().length === 0) {
            errors.push("Title cannot be empty.");
        }

        if (!content || content.trim().length === 0) {
            errors.push("Content cannot be empty.");
        }

        if (!image) {
            errors.push("Image is required.");
        }

        if (errors.length > 0) {
            return { errors };
        }

        storePost({
            imageUrl: "",
            title,
            content,
            userId: 1,
        });

        redirect("/feed");
    }

    return (
        <>
            <FormPost action={createPost} />
        </>
    );
}
