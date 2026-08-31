"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LearnSidebar } from "./LearnSidebar";
import { X } from "lucide-react";

interface LearnMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LearnMobileDrawer({ isOpen, onClose }: LearnMobileDrawerProps) {
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] transform bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Learn navigation menu"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h2 className="font-display text-lg font-bold text-ink">Learn Menu</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-ink/60 hover:bg-slate-100 hover:text-ink focus:outline-none"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="h-[calc(100vh-65px)] overflow-y-auto p-4">
          <LearnSidebar />
        </div>
      </div>
    </>
  );
}
