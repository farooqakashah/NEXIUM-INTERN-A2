'use client';

import { DotPattern } from "@/components/magicui/dot-pattern";
import { Particles } from "@/components/magicui/particles";
import Navbar from "@/components/Navbar"; // Shared Navbar

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/af/8d/63/af8d63a477078732b79ff9d9fc60873f.jpg')",
      }}
    >
      <main className="container mx-auto p-4 backdrop-blur-sm bg-black/40 min-h-screen">
        {/* Navbar with background pattern */}
        <div className="relative bg-black h-20 overflow-hidden">
          <DotPattern glow className="z-0" />
          <Navbar />
        </div>

        {/* Particle Card Section */}
        <section className="mt-16 flex justify-center items-center">
          <div className="relative w-full max-w-xl p-6 rounded-xl overflow-hidden shadow-lg border border-white/10 bg-white/5">
            {/* Particles Background */}
            <div className="absolute inset-0 z-0">
              <Particles className="h-full w-full opacity-40" />
            </div>

            {/* Card Content */}
            <div className="relative z-10 text-center text-white">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to Blog Summariser
              </h1>
              <p className="text-lg text-gray-300">
                This app allows you to paste any blog URL and receive a clean, concise summary of its content — in both English and Urdu. Whether you&apos;re short on time or want to understand the essence quickly, we&apos;ve got you covered.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
