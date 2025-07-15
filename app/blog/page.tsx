'use client';

import { useState } from 'react';
import { DotPattern } from "@/components/magicui/dot-pattern";
import { FlickeringGrid } from "@/components/magicui/flickering-grid"; // 🧩 Import

import Navbar from "@/components/Navbar";
import { Alert, AlertDescription } from '@/components/ui/alert';
import BlogForm from '@/components/BlogForm';
import SummaryDisplay from '@/components/SummaryDisplay';
import { Button } from '@/components/ui/button';

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
    <main className="relative min-h-screen overflow-hidden">
      {/* 🔮 Background grid effect */}
      <FlickeringGrid className="absolute inset-0 z-0 bg-black" />
      
      {/* 🔲 Top bar pattern with navbar */}
      <div className="relative z-10 bg-black h-20 overflow-hidden">
        <DotPattern glow className="z-0" />
        <Navbar />
      </div>

      {/* 💡 Main content area */}
      <div className="relative z-10 container mx-auto p-4">
        <h1 className="text-3xl font-bold mt-8 mb-6 text-white">Summarise a Blog</h1>

        <BlogForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {summary && urduSummary && (
          <>
            <h2 className="text-2xl font-semibold mt-6 mb-2 text-white">{title}</h2>
            <SummaryDisplay summary={summary} urduSummary={urduSummary} />
            <Button onClick={handleReset} className="mt-4">Clear Summary</Button>
          </>
        )}
      </div>
    </main>
  );
}
