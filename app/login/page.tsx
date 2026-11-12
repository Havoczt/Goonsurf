import { login } from "@/app/actions";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto pt-16">
      <p className="text-muted text-xs font-mono mb-1">// access</p>
      <h1 className="text-2xl font-semibold text-white mb-1" style={{ letterSpacing: "-0.03em" }}>
        log in
      </h1>
      <p className="text-muted text-sm mb-8">
        no account?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          sign up
        </Link>
      </p>
      <AuthForm action={login} type="login" />
    </div>
  );
}
