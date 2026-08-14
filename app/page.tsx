import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import Slideshow from "@/components/Slideshow";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { getUserCompanions, getUserSessions, getBookmarkedCompanions } from "@/lib/actions/companion.actions";
import Link from "next/link";

export const dynamic = 'force-dynamic';

const Page = async () => {
    const user = await currentUser();

    // =====================================================================
    // 1. JIKA BELUM LOGIN (LANDING PAGE + SLIDESHOW)
    // =====================================================================
    if (!user) {
        return (
            <main className="min-h-[85vh] flex items-center justify-center">
                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 py-12">
                    <div className="space-y-8 max-lg:text-center max-lg:flex max-lg:flex-col max-lg:items-center">
                        <div className="inline-block bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-indigo-100 shadow-sm">
                            ✨ Real-time AI Teaching Platform
                        </div>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight sm:text-6xl/tight">
                            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">EunoiaLab</span>
                        </h1>
                        <p className="text-lg text-slate-500 sm:text-xl leading-relaxed max-w-lg">
                            Design your custom AI tutors, engage in interactive voice sessions, and accelerate your learning journey with intelligent, real-time feedback.
                        </p>
                        <div className="pt-2">
                            <Link 
                                href="/sign-in" 
                                className="inline-block px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                Get Started Now
                            </Link>
                        </div>
                    </div>
                    <Slideshow />
                </div>
            </main>
        );
    }

    // =====================================================================
    // 2. JIKA SUDAH LOGIN (DASHBOARD UTAMA)
    // =====================================================================
    const userName = user.firstName || user.username || "Learner";

    const userCompanions = await getUserCompanions(user.id);
    const userSessions = await getUserSessions(user.id);
    const myBookmarks = await getBookmarkedCompanions(user.id);

    const bookmarkedIds = myBookmarks.map((b: any) => b.id);

    const displayCompanions = userCompanions.slice(0, 3).map((c: any) => ({
        ...c,
        bookmarked: bookmarkedIds.includes(c.id)
    }));
    
    const displaySessions = userSessions.slice(0, 10).map((s: any) => ({
        ...s,
        bookmarked: bookmarkedIds.includes(s.id)
    }));

    return (
        <main>
            {/* Sapaan Personal di Atas */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">
                    Hello, {userName}! 👋
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Ready to continue your interactive learning journey today?
                </p>
            </div>

            {/* Bagian Tengah: CTA & Recent Sessions (Posisi dan Ukuran Asli) */}
            <section className="home-section flex flex-col lg:flex-row gap-8 w-full justify-between items-start mb-12">
                <CTA />
                <CompanionsList
                    title="Recent Learning Sessions"
                    companions={displaySessions}
                    classNames="w-full lg:w-2/3"
                />
            </section>

            {/* Bagian Bawah: AI Tutors dengan 3 Kolom Menyamping */}
            <section className="home-section flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-slate-900">AI Tutors</h2>

                {displayCompanions.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center">
                        <p className="text-slate-500">You haven't created any AI tutors yet. Click the button above to start!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {displayCompanions.map((companion: any) => (
                            <CompanionCard
                                key={companion.id}
                                {...companion}
                                color={getSubjectColor(companion.subject)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Page;