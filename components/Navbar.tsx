import Link from "next/link";
import Image from "next/image";
import { SignedIn, UserButton } from "@clerk/nextjs";
import NavItems from "@/components/NavItems";

const Navbar = () => {
    return (
        // Seluruh Navbar HANYA akan dirender/ditampilkan jika user sudah login
        <SignedIn>
            <nav className="navbar">
                <Link href="/">
                    <div className="flex items-center gap-2.5 cursor-pointer">
                        <Image
                            src="/images/logo.png"
                            alt="logo"
                            width={46}
                            height={44}
                        />
                    </div>
                </Link>
                <div className="flex items-center gap-8">
                    <NavItems />
                    <UserButton afterSignOutUrl="/" />
                </div>
            </nav>
        </SignedIn>
    )
}

export default Navbar;