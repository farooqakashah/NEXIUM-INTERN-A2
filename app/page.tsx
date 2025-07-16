'use client';

import Link from "next/link";

import { Particles } from "@/components/magicui/particles";
import Navbar from "@/components/Navbar";

// ✅ ShadCN UI Components
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://wallpaperaccess.com/full/788673.jpg')",
      }}
    >
      {/* Subtle dark overlay to boost contrast but keep image visible */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Optional gradient fade at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Navbar */}
      <header className="relative z-10">
        <div className="relative h-16 overflow-hidden border-b border-white/10">
          <Navbar />
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex items-center justify-center min-h-[80vh] px-4">
        <Card className="relative w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden">
          {/* Particles layered behind content */}
          <div className="absolute inset-0">
            <Particles className="h-full w-full opacity-20" />
          </div>

          <CardHeader className="relative z-10 text-center text-white space-y-4">
            <CardTitle className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
              Welcome to Blog Summariser
            </CardTitle>
            <CardDescription className="text-lg md:text-xl text-gray-300 drop-shadow-sm">
              Paste any blog URL and get a clean, concise summary — in English and Urdu.
              Perfect when you’re short on time or just want the essence fast.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 flex justify-center">
            <Link href="/blog">
              <Button variant="secondary" className="mt-4">
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
