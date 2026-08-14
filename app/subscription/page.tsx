import { PricingTable } from "@clerk/nextjs";

const Subscription = () => {
    return (
        <main className="flex flex-col items-center justify-start min-h-screen px-4 pt-6 pb-12">
            {/* Bagian Header / Judul Halaman */}
            <div className="text-center mb-8 max-w-xl">
                <h1 className="text-3xl font-bold mt-3 mb-2">
                    Choose the Right Plan for Your Learning
                </h1>
                <p className="text-muted-foreground text-sm">
                    Unlock unlimited companions, longer session durations, and advanced AI features to maximize your potential.
                </p>
            </div>

            {/* Tabel Harga dari Clerk */}
            <div className="w-full max-w-6xl flex justify-center items-center">
                <PricingTable />
            </div>
        </main>
    );
};

export default Subscription;