'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DotPattern } from "@/components/magicui/dot-pattern";
import Navbar from "@/components/Navbar";
import { FlipText } from "@/components/magicui/flip-text"; // ✅ Imported FlipText!

export default function AboutPage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "url('https://wallpaperaccess.com/full/788673.jpg')",
      }}
    >
      {/* ✅ Subtle dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* ✅ Background Dot Pattern */}
      <DotPattern glow className="absolute inset-0 z-0 opacity-10" />

      {/* ✅ Navbar */}
      <header className="relative z-10">
        <Navbar />
      </header>

      {/* ✅ About Card */}
      <main className="relative z-10 flex items-center justify-center min-h-[80vh] px-4 py-16">
        <Card className="w-full max-w-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-4xl md:text-5xl font-extrabold drop-shadow-md text-white">
              <FlipText>About Blog Summariser</FlipText>
            </CardTitle>
            <CardDescription className="text-lg text-gray-300">
              Learn how this app works and how it helps you.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 text-gray-200 leading-relaxed text-base md:text-lg">
            <p>
              The Blog Summariser is a modern web app designed to help you quickly
              understand long-form blog posts without reading every word. Paste any blog
              URL, and our scraper intelligently extracts the main content — ignoring ads,
              comments, and clutter.
            </p>
            <p>
              The summariser uses advanced natural language processing techniques,
              including term frequency-inverse document frequency (TF-IDF) scoring and
              cosine similarity, to identify the most important sentences.
            </p>
            <p>
              You can get a concise, human-like summary in both English and Urdu, making it
              ideal for bilingual users or readers who prefer native language support.
            </p>
            <p>
              This tool is perfect for students, researchers, or busy professionals who
              want to save time and get to the point — fast.
            </p>
            <p>
              Stay tuned — more AI-powered features are on the way!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
