'use client';

import React, { useState } from 'react';
import { Camera, Upload, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface FoodCandidate {
  name: string;
  estimated_quantity: string;
  confidence: string;
  canonical_food_id?: string;
  warning?: string;
}

export function FoodVisionUpload() {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<FoodCandidate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    setLoading(true);
    setError(null);
    setCandidates(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // POST to backend API (from phase 13)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/food-vision/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // assuming token auth
        },
        body: formData
      });
      
      if (!res.ok) {
        throw new Error('Failed to analyze image. Please try again.');
      }
      
      const data = await res.json();
      setCandidates(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full flex flex-col p-4 bg-white">
      <div className="mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-ink">
          <Camera className="w-5 h-5 text-peach" />
          AI Food Vision
        </h3>
        <p className="text-sm text-ink/70">Upload a photo of your meal to automatically estimate macros and log it.</p>
      </div>
      <div className="space-y-4">
        
        {!previewUrl && (
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 border-slate-300">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                <Upload className="w-8 h-8 mb-3" />
                <p className="mb-2 text-sm font-semibold">Click to upload or take photo</p>
                <p className="text-xs">JPEG, PNG, WEBP (Max 10MB)</p>
              </div>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        )}

        {previewUrl && (
          <div className="relative rounded-lg overflow-hidden h-48 w-full border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Food preview" className="object-cover w-full h-full" />
            <Button 
              size="sm" 
              variant="secondary" 
              className="absolute top-2 right-2 shadow-md"
              onClick={() => { setPreviewUrl(null); setCandidates(null); setError(null); }}
            >
              Clear
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-peach" />
            <p>Sakhi AI is analyzing your food...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-200">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {candidates && candidates.length > 0 && (
          <div className="space-y-3 mt-4">
            <h4 className="font-semibold text-sm text-ink">Detected Items</h4>
            {candidates.map((c, i) => (
              <div key={i} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg bg-slate-50 shadow-sm">
                <div>
                  <p className="font-medium text-ink">{c.name}</p>
                  <p className="text-xs text-slate-500">Est: {c.estimated_quantity}</p>
                  {c.warning && <p className="text-xs text-orange-600 mt-1">{c.warning}</p>}
                </div>
                <Button size="sm" variant={c.canonical_food_id ? "primary" : "secondary"} disabled={!c.canonical_food_id}>
                  {c.canonical_food_id ? 'Log Food' : 'Unrecognized'}
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {candidates && candidates.length === 0 && (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg flex items-start gap-3 border border-blue-200">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">No food detected</p>
              <p className="text-sm">We couldn&apos;t confidently identify food in this image. Try taking a clearer photo.</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
