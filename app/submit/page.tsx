import { createPost } from "@/app/actions";
import SubmitForm from "@/components/SubmitForm";

export default function SubmitPage() {
  return (
    <div className="max-w-lg mx-auto pt-10">
      <h1 className="text-xl font-bold mb-6">submit a link</h1>
      <SubmitForm action={createPost} />
    </div>
  );
}
