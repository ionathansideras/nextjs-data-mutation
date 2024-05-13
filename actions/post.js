"use server";
import { redirect } from "next/navigation";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function createPost(prevState, formData) {
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

    if (!image || image.size === 0) {
        errors.push("Image is required.");
    }

    if (errors.length > 0) {
        return { errors };
    }

    let imageUrl;
    try {
        imageUrl = await uploadImage(image);
    } catch (error) {
        throw new Error("Failed to upload image");
    }

    storePost({
        imageUrl: imageUrl,
        title,
        content,
        userId: 1,
    });

    redirect("/feed");
}

export async function togglePostLikeStatus(postId) {
    updatePostLikeStatus(postId, 2);
    // the revalidatePath function is used to revalidate the  page
    // because the nextjs cache is used to cache the  page
    // and we need to call it to update the cache with the new changes
    revalidatePath("/", "layout");
}
