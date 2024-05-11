import FormPost from "@/components/form-post";
import { createPost } from "@/actions/post";

export default function NewPostPage() {
    return (
        <>
            <FormPost action={createPost} />
        </>
    );
}
