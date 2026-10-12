"use client";

import { X } from "lucide-react";
import { CaregiverSidebar } from "./CaregiverSidebar";

interface CaregiverMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: string;
  onSelectRole: (role: string) => void;
  activeStage: string;
  onSelectStage: (stage: string) => void;
}

export function CaregiverMobileDrawer({
  isOpen,
  onClose,
  activeRole,
  onSelectRole,
  activeStage,
  onSelectStage,
}: CaregiverMobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white p-6 shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <span className="font-display font-bold text-lg text-ink">Caregiver Navigation</span>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-ink/40 hover:bg-slate-100 hover:text-ink transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 flex-1">
          <CaregiverSidebar 
            activeRole={activeRole}
            onSelectRole={(role) => {
              onSelectRole(role);
              onClose();
            }}
            activeStage={activeStage}
            onSelectStage={(stage) => {
              onSelectStage(stage);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
