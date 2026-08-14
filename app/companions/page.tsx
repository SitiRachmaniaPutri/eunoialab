import { getUserCompanions, getBookmarkedCompanions } from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import { getSubjectColor } from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import { currentUser } from "@clerk/nextjs/server";

const CompanionsLibrary = async ({ 
    searchParams 
}: { 
    searchParams: Promise<{ subject?: string; topic?: string }> 
}) => {
    // 1. Await searchParams dengan aman untuk Next.js 15
    const filters = await searchParams;
    const subject = filters?.subject || '';
    const topic = filters?.topic || '';

    // 2. Ambil user yang sedang login
    const user = await currentUser();
    if (!user) return null;

    // 3. Ambil HANYA companion milik user yang sedang login (Akun baru akan menghasilkan [])
    const companions = await getUserCompanions(user.id);

    // 4. Filter pencarian/subject jika ada input dari user
    const filteredCompanions = companions.filter((companion: any) => {
        const matchesSubject = subject ? companion.subject?.toLowerCase() === subject.toLowerCase() : true;
        const matchesTopic = topic ? companion.topic?.toLowerCase().includes(topic.toLowerCase()) || companion.name?.toLowerCase().includes(topic.toLowerCase()) : true;
        return matchesSubject && matchesTopic;
    });

    // 5. Ambil daftar bookmark user untuk mencocokkan status 'fill' kartu
    let bookmarkedIds: string[] = [];
    const myBookmarks = await getBookmarkedCompanions(user.id);
    bookmarkedIds = myBookmarks.map((b: any) => b.id);

    // 6. Suntikkan status bookmarked true/false ke setiap companion
    const displayCompanions = filteredCompanions.map((companion: any) => ({
        ...companion,
        bookmarked: bookmarkedIds.includes(companion.id)
    }));

    return (
        <main>
            <section className="flex justify-between gap-4 max-sm:flex-col">
                <h1>Companion Library</h1>
                <div className="flex gap-4">
                    <SearchInput />
                    <SubjectFilter />
                </div>
            </section>
            
            <section className="companions-grid">
                {displayCompanions.length > 0 ? (
                    displayCompanions.map((companion: any) => (
                        <CompanionCard
                            key={companion.id}
                            {...companion}
                            color={getSubjectColor(companion.subject)}
                        />
                    ))
                ) : (
                    <p className="text-muted-foreground col-span-full py-10 text-center">
                        No AI Tutors found. Create your first companion!
                    </p>
                )}
            </section>
        </main>
    );
};

export default CompanionsLibrary;