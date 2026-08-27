"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Check, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/auth-store";

type WellnessPlan = {
  id: string;
  title: string;
  action_type: string;
  frequency: string;
  status: string;
  reasoning: string;
  created_at: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.sakhi.ai";

export function MyWellnessPlanCard() {
  const { token } = useAuthStore();
  const [plans, setPlans] = useState<WellnessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlans = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/wellness/plans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load wellness plans.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const generatePlans = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/wellness/plans/generate`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate wellness plans.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/wellness/plans/${id}`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed");
      // Remove from list if completed or skipped
      setPlans(plans.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  if (loading && plans.length === 0) {
    return (
      <Card className="animate-pulse bg-gray-50 dark:bg-gray-900 border-none">
        <div className="mb-4">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div>
          <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-100 bg-red-50/50">
        <div className="pt-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <Button variant="secondary" onClick={fetchPlans} className="mt-4">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (plans.length === 0) {
    return (
      <Card className="border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 overflow-hidden shadow-sm">
        <div className="pb-3 text-center">
          <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
          <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">All caught up!</h2>
          <p className="text-emerald-700/80 dark:text-emerald-300/80 mt-1">
            You&apos;ve completed your wellness actions for today.
          </p>
        </div>
        <div className="flex justify-center pt-2 pb-6">
          <Button onClick={generatePlans} variant="secondary" className="bg-white hover:bg-gray-50 border-emerald-200 text-emerald-700">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Plan
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-emerald-100 dark:border-emerald-900/30 overflow-hidden shadow-sm p-0">
      <div className="bg-emerald-500/10 dark:bg-emerald-500/5 px-6 py-4 flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/30">
        <div>
          <h2 className="text-lg font-semibold flex items-center text-emerald-900 dark:text-emerald-100">
            <CheckCircle className="mr-2 h-5 w-5 text-emerald-500" />
            Today&apos;s Focus
          </h2>
          <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-1">
            Personalized actions based on your wellness goals.
          </p>
        </div>
      </div>
      
      <div className="p-0">
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {plans.map((plan) => (
            <li key={plan.id} className="p-6 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{plan.title}</h3>
                <Badge variant="outline" className="text-xs bg-white dark:bg-gray-950 font-normal border-gray-200">
                  {plan.action_type.replace("LOG_", "")}
                </Badge>
              </div>
              
              <div className="flex items-start text-xs text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-md border border-gray-100 dark:border-gray-800">
                <div className="mr-2 mt-0.5">💡</div>
                <p>{plan.reasoning}</p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => updateStatus(plan.id, "COMPLETED")}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark Complete
                </Button>
                <Button 
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => updateStatus(plan.id, "SKIPPED")}
                >
                  Skip
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
