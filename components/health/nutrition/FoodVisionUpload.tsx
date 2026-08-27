'use client';

import React, { useState } from 'react';
import { Camera, Upload, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { apiClient } from '@/lib/api/client';

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
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          AI Food Vision
        </CardTitle>
        <CardDescription>Upload a photo of your meal to automatically estimate macros and log it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {!previewUrl && (
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/50 border-muted">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                <Upload className="w-8 h-8 mb-3" />
                <p className="mb-2 text-sm font-semibold">Click to upload or take photo</p>
                <p className="text-xs">JPEG, PNG, WEBP (Max 10MB)</p>
              </div>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        )}

        {previewUrl && (
          <div className="relative rounded-lg overflow-hidden h-48 w-full border border-border">
            <img src={previewUrl} alt="Food preview" className="object-cover w-full h-full" />
            <Button 
              size="sm" 
              variant="secondary" 
              className="absolute top-2 right-2"
              onClick={() => { setPreviewUrl(null); setCandidates(null); setError(null); }}
            >
              Clear
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p>Sakhi AI is analyzing your food...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <Info className="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {candidates && candidates.length > 0 && (
          <div className="space-y-3 mt-4">
            <h4 className="font-semibold text-sm">Detected Items</h4>
            {candidates.map((c, i) => (
              <div key={i} className="flex justify-between items-center p-3 border border-border rounded-md bg-card shadow-sm">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Est: {c.estimated_quantity}</p>
                  {c.warning && <p className="text-xs text-orange-500 mt-1">{c.warning}</p>}
                </div>
                <Button size="sm" variant={c.canonical_food_id ? "default" : "outline"} disabled={!c.canonical_food_id}>
                  {c.canonical_food_id ? 'Log Food' : 'Unrecognized'}
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {candidates && candidates.length === 0 && (
          <Alert>
            <Info className="w-4 h-4" />
            <AlertTitle>No food detected</AlertTitle>
            <AlertDescription>We couldn't confidently identify food in this image. Try taking a clearer photo.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
