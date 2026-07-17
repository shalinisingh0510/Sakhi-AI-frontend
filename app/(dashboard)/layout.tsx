import { AppNav } from "@/components/layout/AppNav";
import { MobileNav } from "@/components/layout/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppNav />
      <main id="main-content" className="flex-1 pb-20 md:pb-0" tabIndex={-1}>
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
