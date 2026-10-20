"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { FiExternalLink, FiLogOut } from "react-icons/fi";
import logo from "../../public/logo.webp";
import { auth } from "@/firebase";

const TABS = [
  { href: "/admin", label: "Tours" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/gallery", label: "Gallery" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-ink text-sand-100">
        <div className="container-x flex h-16 items-center gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src={logo} alt="" width={36} height={30} className="h-8 w-auto rounded-md" />
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-sun-300 sm:block">
              JETT · Admin
            </span>
          </Link>
          <nav className="ml-2 flex gap-1 sm:ml-6">
            {TABS.map((tab) => {
              const active = tab.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition sm:px-4 ${
                    active ? "bg-sand-50 text-ink" : "text-sand-300 hover:bg-white/10 hover:text-sand-50"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <a
              href="/"
              target="_blank"
              className="hidden items-center gap-2 rounded-full px-3 py-1.5 text-sm text-sand-300 hover:bg-white/10 hover:text-sand-50 md:flex"
            >
              View site <FiExternalLink />
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-sand-300 hover:bg-white/10 hover:text-sand-50"
              aria-label="Log out"
            >
              <FiLogOut /> <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>
      <div className="container-x py-8">{children}</div>
    </div>
  );
}
