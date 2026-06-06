import { SignupForm } from "@/components/auth/signup-form";

export default function Page() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(232,184,75,0.22),transparent_34%),linear-gradient(180deg,var(--background),var(--muted))] p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SignupForm />
            </div>
        </div>
    );
}
