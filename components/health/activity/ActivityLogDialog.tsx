"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { type ActivityCreate, activityApi } from "@/lib/api";
import { isDemoMode, demoDelay } from "@/lib/api-config";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onSuccess: () => void;
}

const ACTIVITY_TYPES = [
  { value: "WALKING", label: "Walking" },
  { value: "RUNNING", label: "Running" },
  { value: "CYCLING", label: "Cycling" },
  { value: "SWIMMING", label: "Swimming" },
  { value: "YOGA", label: "Yoga" },
  { value: "STRENGTH_TRAINING", label: "Strength Training" },
  { value: "DANCE", label: "Dance" },
  { value: "SPORT", label: "Sport (e.g. Tennis, Basketball)" },
  { value: "HIKING", label: "Hiking" },
  { value: "HOUSEHOLD_ACTIVITY", label: "Household Activity" },
  { value: "OTHER", label: "Other" },
];

const INTENSITY_OPTIONS = [
  { value: "LOW", label: "Low (Easy)" },
  { value: "MODERATE", label: "Moderate (Breaking a sweat)" },
  { value: "HIGH", label: "High (Hard breathing)" },
];

export function ActivityLogDialog({ isOpen, onClose, token, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activityType, setActivityType] = useState("WALKING");
  const [duration, setDuration] = useState("30");
  const [intensity, setIntensity] = useState("MODERATE");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const durNum = parseInt(duration, 10);
    if (isNaN(durNum) || durNum <= 0) {
      setError("Please enter a valid duration");
      setIsSubmitting(false);
      return;
    }

    // Local ISO date for today
    const localDate = new Date();
    const isoDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;

    const data: ActivityCreate = {
      activity_date: isoDate,
      activity_type: activityType,
      duration_minutes: durNum,
      intensity: intensity,
    };

    try {
      if (isDemoMode()) await demoDelay(800);
      else await activityApi.addActivity(token, data);
      
      setDuration("30");
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to log activity. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-blush/20 flex justify-between items-center">
          <h3 className="font-semibold text-ink">Log Activity</h3>
          <button onClick={onClose} className="text-ink/50 hover:text-ink">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}
          
          <Select
            label="Activity"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            options={ACTIVITY_TYPES}
          />
          
          <Input
            label="Duration (minutes)"
            type="number"
            min="1"
            max="1440"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
          
          <Select
            label="Intensity"
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            options={INTENSITY_OPTIONS}
          />
          
          <div className="pt-4 flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
