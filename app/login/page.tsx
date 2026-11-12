import { login } from "@/app/actions";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto pt-16">
      <h1 className="text-xl font-bold mb-1">log in</h1>
      <p className="text-zinc-500 text-sm mb-6">
        no account?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          sign up
        </Link>
      </p>
      <AuthForm action={login} type="login" />
    </div>
  );
}
