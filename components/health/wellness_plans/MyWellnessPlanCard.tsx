"use client";

import React, { useState, useEffect } from "react";
import { Check, Clock, X, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

type WellnessPlan = {
  id: string;
  title: string;
  action_type: string;
  frequency: string;
  status: string;
  reasoning: string;
  created_at: string;
};

export function MyWellnessPlanCard() {
  const [plans, setPlans] = useState<WellnessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await api.get("/wellness/plans");
      setPlans(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load wellness plans.");
    } finally {
      setLoading(false);
    }
  };

  const generatePlans = async () => {
    try {
      setLoading(true);
      const data = await api.post("/wellness/plans/generate", {});
      setPlans(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate wellness plans.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/wellness/plans/${id}`, { status });
      // Remove from list if completed or skipped
      setPlans(plans.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading && plans.length === 0) {
    return (
      <Card className="animate-pulse bg-gray-50 dark:bg-gray-900 border-none">
        <CardHeader>
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-100 bg-red-50/50">
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchPlans} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (plans.length === 0) {
    return (
      <Card className="border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 overflow-hidden shadow-sm">
        <CardHeader className="pb-3 text-center">
          <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
          <CardTitle className="text-xl text-emerald-900 dark:text-emerald-100">All caught up!</CardTitle>
          <CardDescription className="text-emerald-700/80 dark:text-emerald-300/80">
            You've completed your wellness actions for today.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button onClick={generatePlans} variant="outline" className="bg-white/50 hover:bg-white border-emerald-200 text-emerald-700">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Plan
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-emerald-100 dark:border-emerald-900/30 overflow-hidden shadow-sm">
      <div className="bg-emerald-500/10 dark:bg-emerald-500/5 px-6 py-4 flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/30">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center text-emerald-900 dark:text-emerald-100">
            <CheckCircle className="mr-2 h-5 w-5 text-emerald-500" />
            Today's Focus
          </CardTitle>
          <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-1">
            Personalized actions based on your wellness goals.
          </p>
        </div>
      </div>
      
      <CardContent className="p-0">
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
                  size="sm" 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => updateStatus(plan.id, "COMPLETED")}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark Complete
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => updateStatus(plan.id, "SKIPPED")}
                >
                  Skip
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
