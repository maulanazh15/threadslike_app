import AccountProfile from "@/components/forms/AccountProfile";
import LoginForm from "@/components/forms/LoginForm";
import { currentUser } from "@clerk/nextjs/app-beta";

export default async function Page() {
    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">Log In</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Login to thread
            </p>

            <section className="mt-9 bg-dark-2 p-10">
                <LoginForm />
            </section>
        </main>
    )
}