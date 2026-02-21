import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Study with Ayesha – Smart Learning Made Simple",
  description:
    "Experience the future of focused education through luxury architectural design and advanced generative intelligence.",
};

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col architectural-bg bg-[#1a1614] text-[#e8e4db]"
      style={{ fontFamily: "Lexend, sans-serif" }}>
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <Hero />

        {/* Stats bar */}
        <section className="border-y border-[rgba(242,185,13,0.1)] bg-[rgba(42,36,32,0.3)] py-12 px-6 lg:px-20">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10k+", label: "Elite Learners" },
              { value: "98%", label: "Success Rate" },
              { value: "45+", label: "Countries" },
              { value: "24/7", label: "AI Support" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center md:items-start">
                <span className="text-[#f2b90d] text-3xl font-bold mb-1">
                  {value}
                </span>
                <span className="text-[rgba(232,228,219,0.4)] text-xs uppercase tracking-widest font-bold">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Cards */}
        <FeatureCards />

        {/* CTA Banner */}
        <section className="px-6 lg:px-20 py-32 bg-[#f2b90d] flex flex-col items-center text-center">
          <h2 className="serif-title text-4xl md:text-6xl text-[#1a1614] mb-8">
            Ready to Elevate Your Mind?
          </h2>
          <p className="text-[rgba(26,22,20,0.7)] max-w-2xl mb-12 text-lg">
            Join the world's most exclusive AI learning platform and transform
            the way you process complex information.
          </p>
          <Link
            href="/chat"
            className="bg-[#1a1614] text-white px-12 py-5 rounded-lg text-xl font-bold hover:brightness-125 transition-all shadow-2xl"
          >
            Get Lifetime Access
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
