'use client';

import { useState } from 'react';


import Navbar from "@/components/Navbar";
import { Alert, AlertDescription } from '@/components/ui/alert';
import BlogForm from '@/components/BlogForm';
import SummaryDisplay from '@/components/SummaryDisplay';
import { Button } from '@/components/ui/button';

// ✅ ShadCN Card
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

interface ApiResponse {
  title: string;
  summary: string;
  urduSummary: string;
  error?: string;
}

export default function BlogPage() {
  const [title, setTitle] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [urduSummary, setUrduSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (url: string) => {
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);
    setError(null);
    setTitle(null);
    setSummary(null);
    setUrduSummary(null);

    try {
      const response = await fetch('/api/summarise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
        setTitle(data.title || 'Untitled Blog');
        setSummary(data.summary);
        setUrduSummary(data.urduSummary);
      } else {
        setError(data.error || 'Failed to fetch summary');
      }
    } catch (err) {
      setError('An error occurred while processing the request');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle(null);
    setSummary(null);
    setUrduSummary(null);
    setError(null);
  };

  return (
    <main
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://wallpaperaccess.com/full/788673.jpg')",
      }}
    >
      {/* ✅ Subtle dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50" />

      {/* ✅ Top bar with DotPattern + Navbar */}
      <div className="relative z-10 bg-black/70 h-15 overflow-hidden border-b border-white/10">
        <Navbar />
      </div>

      {/* ✅ Main Card */}
      <div className="relative z-10 container mx-auto p-4 flex justify-center">
        <Card className="w-full max-w-3xl bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl">
          <CardHeader className="text-center mb-4">
            <CardTitle className="text-3xl font-bold text-white drop-shadow-md">
              Summarise a Blog
            </CardTitle>
          </CardHeader>

          <CardContent>
            <BlogForm onSubmit={handleSubmit} loading={loading} />

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {summary && urduSummary && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-2 text-white drop-shadow-md">
                  {title}
                </h2>
                <SummaryDisplay
                  summary={summary}
                  urduSummary={urduSummary}
                  title={title || ''}
                />
                <Button onClick={handleReset} className="mt-4">
                  Clear Summary
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
