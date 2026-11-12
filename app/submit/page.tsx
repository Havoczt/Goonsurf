import { createPost } from "@/app/actions";
import SubmitForm from "@/components/SubmitForm";

export default function SubmitPage() {
  return (
    <div className="max-w-lg mx-auto pt-10">
      <p className="text-muted text-xs font-mono mb-1">// new link</p>
      <h1 className="text-2xl font-semibold text-white mb-8" style={{ letterSpacing: "-0.03em" }}>
        submit
      </h1>
      <SubmitForm action={createPost} />
    </div>
  );
}
