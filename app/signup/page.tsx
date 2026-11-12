import { signup } from "@/app/actions";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="max-w-sm mx-auto pt-16">
      <h1 className="text-xl font-bold mb-1">sign up</h1>
      <p className="text-zinc-500 text-sm mb-6">
        already have one?{" "}
        <Link href="/login" className="text-accent hover:underline">
          log in
        </Link>
      </p>
      <AuthForm action={signup} type="signup" />
    </div>
  );
}
