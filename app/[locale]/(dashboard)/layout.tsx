import { AppNav } from "@/components/layout/AppNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { AppFooter } from "@/components/layout/AppFooter";
import { AnonymousShieldModal } from "@/components/privacy/AnonymousShieldModal";
import { PanicBlurCurtain } from "@/components/privacy/PanicBlurCurtain";
import { AnonymousTrialBanner } from "@/components/privacy/AnonymousTrialBanner";
import { AnonymousPaywallModal } from "@/components/privacy/AnonymousPaywallModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnonymousTrialBanner />
      <AppNav />
      <main id="main-content" className="flex-1 pb-20 md:pb-0" tabIndex={-1}>
        {children}
      </main>
      <AppFooter />
      <MobileNav />
      <AnonymousShieldModal />
      <AnonymousPaywallModal />
      <PanicBlurCurtain />
    </div>
  );
}
