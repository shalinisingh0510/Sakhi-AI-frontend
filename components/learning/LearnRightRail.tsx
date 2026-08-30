"use client";

import { LearningProgressCard } from "./LearningProgressCard";
import { ContinueLearning } from "./sections/ContinueLearning";

interface LearnRightRailProps {
  className?: string;
}

export function LearnRightRail({ className = "" }: LearnRightRailProps) {
  return (
    <aside className={`flex flex-col ${className}`}>
      {/* 
        The right rail contains summary information that is 
        useful to have alongside the feed on large screens. 
      */}
      
      <div className="sticky top-24 space-y-6">
        {/* User's learning progress summary */}
        <LearningProgressCard />
        
        {/* Continue learning banner */}
        <ContinueLearning />
        
        {/* Additional widgets can go here later, such as:
            - Weekly goal progress
            - Streak gamification detailed view
            - Popular tags
        */}
      </div>
    </aside>
  );
}
