import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserCompanions,
  getUserSessions,
  getBookmarkedCompanions,
} from "@/lib/actions/companion.actions";
import Image from "next/image";
import CompanionsList from "@/components/CompanionsList";
import Link from "next/link";

const Profile = async () => {
  const user = await currentUser();
  const { has } = await auth();

  if (!user) redirect("/sign-in");

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);
  const bookmarkedCompanions = await getBookmarkedCompanions(user.id);

  // Cek status plan user
  const isPro = has({ plan: 'pro' }) || has({ plan: 'core' });
  const planName = isPro ? "Pro / Core Plan" : "Free Plan";

  return (
    <main className="min-lg:w-3/4 max-w-5xl mx-auto px-4 py-8">
      {/* BAGIAN ATAS: Statistik & Status Langganan */}
      <section className="flex flex-col-reverse md:flex-row justify-between items-center w-full gap-8 mb-12">
        <div className="flex flex-wrap gap-4 w-full md:w-auto max-sm:justify-center">
          
          {/* Card Statistik Lama */}
{/* Card 1: Lessons Completed */}
          <div className="flex flex-col justify-center items-start border border-slate-200 bg-white rounded-3xl p-6 shadow-sm min-w-[170px]">
            <div className="flex gap-3 items-center mb-2">
              <Image
                src="/icons/check.svg"
                alt="checkmark"
                width={26}
                height={26}
              />
              <p className="text-3xl font-bold text-slate-900">{sessionHistory.length}</p>
            </div>
            <div className="text-sm font-medium text-slate-500">Lessons completed</div>
          </div>
          
          {/* Card 2: Companions Created */}
          <div className="flex flex-col justify-center items-start border border-slate-200 bg-white rounded-3xl p-6 shadow-sm min-w-[170px]">
            <div className="flex gap-3 items-center mb-2">
              <Image 
                src="/icons/robot.svg" 
                alt="robot" 
                width={26} 
                height={26} 
              />
              <p className="text-3xl font-bold text-slate-900">{companions.length}</p>
            </div>
            <div className="text-sm font-medium text-slate-500">Companions created</div>
          </div>

          {/* Card Status Langganan Baru */}
          <div className="flex flex-col justify-between items-start border border-indigo-100 bg-indigo-50/30 rounded-3xl p-6 shadow-sm min-w-[180px]">
            <span className="text-xs font-semibold uppercase text-indigo-600 mb-1">Active Plan</span>
            <p className="text-lg font-bold text-slate-900">{planName}</p>
            <Link href="/subscription" className="text-xs font-bold text-indigo-600 mt-2 hover:underline">
              {isPro ? "Manage Billing" : "Upgrade Plan"}
            </Link>
          </div>
        </div>

        {/* Info Profil */}
        <div className="flex items-center gap-5 text-right">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-2xl text-slate-900">{user.firstName} {user.lastName}</h1>
            <p className="text-sm text-slate-500">{user.emailAddresses[0].emailAddress}</p>
          </div>
          <div className="relative rounded-full overflow-hidden size-[90px]">
            <Image src={user.imageUrl} alt="Profile" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* BAGIAN BAWAH: Accordion Bookmarks (Gaya Awal Tetap Utuh) */}
      <Accordion type="multiple" className="flex flex-col gap-4 w-full">
        <AccordionItem 
          value="bookmarks" 
          className="border border-slate-200 bg-white rounded-3xl shadow-sm overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-5 hover:no-underline">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-slate-800">Bookmarked Companions</span>
              <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
                {bookmarkedCompanions.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2 border-t border-slate-100">
            <CompanionsList
              companions={bookmarkedCompanions}
              // Hapus atau kosongkan title di sini agar tidak muncul tulisan duplikat di dalam kotak
              title="" 
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default Profile;