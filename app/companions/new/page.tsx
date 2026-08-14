import CompanionForm from "@/components/CompanionForm";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {newCompanionPermissions} from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";

const NewCompanion = async () => {
    const { userId } = await auth();
    if(!userId) redirect('/sign-in');

    const canCreateCompanion = await newCompanionPermissions();

    return (
        <main className="flex flex-col items-center justify-center my-auto min-h-[calc(100vh-150px)] px-4">
            {canCreateCompanion ? (
                <article className="w-full gap-4 flex flex-col">
                    <h1>AI Tutors Builder</h1>

                    <CompanionForm />
                </article>
                ) : (
                    <article className="companion-limit flex flex-col items-center text-center max-w-md w-full gap-4">
                        {/* Gambar diganti dengan Logo */}
                        {/* <Image src="/images/logo.png" alt="Logo" width={60} height={60} className="mb-2" /> */}

                        <h1 className="text-3xl font-bold">You’ve Reached Your Limit</h1>
                        
                        {/* Teks fitur tambahan */}
                        <p className="text-muted-foreground text-sm">
                            More Companions • Premium Features • Longer Sessions
                        </p>
                        
                        <p className="text-sm text-gray-600 mb-2">
                            You’ve reached your companion limit. Upgrade to create more companions and unlock premium features.
                        </p>

                        <Link href="/subscription" className="btn-primary w-full justify-center">
                            Upgrade My Plan
                        </Link>
                    </article>
                )}
        </main>
    )
}

export default NewCompanion
