import { signup } from "@/app/actions";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="max-w-sm mx-auto pt-16">
      <p className="text-muted text-xs font-mono mb-1">// join</p>
      <h1 className="text-2xl font-semibold text-white mb-1" style={{ letterSpacing: "-0.03em" }}>
        sign up
      </h1>
      <p className="text-muted text-sm mb-8">
        already have one?{" "}
        <Link href="/login" className="text-accent hover:underline">
          log in
        </Link>
      </p>
      <AuthForm action={signup} type="signup" />
    </div>
  );
}
