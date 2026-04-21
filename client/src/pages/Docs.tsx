import { Link } from "wouter";
import { ArrowLeft, BookOpen, Code2, Copy, FileText, Settings, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Docs() {
  const baseUrl = window.location.origin + "/api";

  const endpoints = [
    {
      name: "Stats",
      path: "?type=stats&username={username}",
      desc: "Displays 10 advanced performance metrics including merged PRs, PRs reviewed, and account age.",
    },
    {
      name: "Languages",
      path: "?type=languages&username={username}",
      desc: "Byte-accurate percentage breakdown of your top 5 most used programming languages.",
    },
    {
      name: "Streak",
      path: "?type=streak&username={username}",
      desc: "Tracks your current and longest contribution streaks.",
    },
    {
      name: "Trophies",
      path: "?type=trophies&username={username}",
      desc: "Dynamically generated achievements based on milestones reached.",
    },
    {
      name: "Overview (Global Rank)",
      path: "?type=overview&username={username}",
      desc: "Calculates an algorithmic global developer rank (S, A+, A, B, C, D).",
    },
    {
      name: "Activity Heatmap",
      path: "?type=heatmap&username={username}",
      desc: "A stylized 52-week bar-chart representation of your commit activity.",
    },
    {
      name: "Top Repositories",
      path: "?type=repos&username={username}",
      desc: "Highlights your top 3 most starred repositories.",
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground newsprint-texture font-body">
      {/* Header */}
      <header className="w-full border-b-4 border-[#111111] bg-background relative z-10 sticky top-0">
        <div className="flex justify-between items-center px-6 py-4 max-w-screen-xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-10 w-10 border border-[#111111] sharp-corners hover:bg-[#111111] hover:text-[#F9F9F7]">
                <ArrowLeft size={16} strokeWidth={1.5} />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 border border-[#111111] bg-[#111111] overflow-hidden">
                 <img src="/favicon.png" alt="Oi Git Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif text-2xl font-black uppercase tracking-tight">Oi Git <span className="text-[#CC0000] ml-2 tracking-widest font-mono text-sm">/ DOCS</span></span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x border-x border-b-4 border-[#111111] min-h-[calc(100vh-80px)]">
        
        {/* Sidebar */}
        <aside className="md:col-span-3 p-8 bg-white border-b-4 md:border-b-0 border-[#111111] hidden md:block">
          <h3 className="font-mono text-xs uppercase tracking-widest mb-6 text-[#737373]">Table of Contents</h3>
          <ul className="space-y-4 font-serif text-lg font-bold">
            <li><a href="#introduction" className="hover:text-[#CC0000] hover:underline underline-offset-4 decoration-2">Introduction</a></li>
            <li><a href="#endpoints" className="hover:text-[#CC0000] hover:underline underline-offset-4 decoration-2">API Endpoints</a></li>
            <li><a href="#themes" className="hover:text-[#CC0000] hover:underline underline-offset-4 decoration-2">Theming System</a></li>
            <li><a href="#rate-limits" className="hover:text-[#CC0000] hover:underline underline-offset-4 decoration-2">Rate Limits</a></li>
          </ul>
        </aside>

        {/* Content */}
        <div className="md:col-span-9 p-8 md:p-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-serif font-black uppercase tracking-tighter leading-none mb-6">
              Technical<br/>Documentation
            </h1>
            <p className="text-xl leading-relaxed text-[#404040] mb-12 text-justify-news">
              <span className="text-5xl float-left mr-3 mt-1 leading-none font-black font-serif">W</span>elcome to the Oi Git technical manual. This document details the usage of our REST API for generating dynamic SVG data visualizations of your GitHub statistics. All generation is done on the fly and returned as highly optimized, scalable vector graphics suitable for any `README.md`.
            </p>

            {/* Introduction Section */}
            <section id="introduction" className="mb-16">
              <h2 className="text-3xl font-serif font-black uppercase border-b-2 border-[#111111] pb-2 mb-6 flex items-center gap-3">
                <BookOpen size={24} /> 1. Introduction
              </h2>
              <p className="mb-6 leading-relaxed">
                The core concept of Oi Git is simplicity. There is no authentication required to generate embeds for public repositories. You simply construct an image URL pointing to our API and drop it into your markdown.
              </p>
              <div className="bg-[#111111] text-[#F9F9F7] p-6 sharp-corners font-mono text-sm relative group border border-[#111111]">
                <code>[![My Stats]({baseUrl}?username=torvalds)](https://github.com/torvalds)</code>
              </div>
            </section>

            {/* Endpoints Section */}
            <section id="endpoints" className="mb-16">
              <h2 className="text-3xl font-serif font-black uppercase border-b-2 border-[#111111] pb-2 mb-6 flex items-center gap-3">
                <Terminal size={24} /> 2. API Endpoints
              </h2>
              <p className="mb-6 leading-relaxed">
                The base URL for all SVG generation is <code>/api</code>. You control the output using the <code>type</code> and <code>username</code> query parameters.
              </p>

              <div className="grid gap-6">
                {endpoints.map((ep, i) => (
                  <div key={i} className="border border-[#111111] bg-white p-6 relative">
                    <div className="absolute top-0 right-0 bg-[#111111] text-[#F9F9F7] font-mono text-[10px] px-3 py-1 uppercase tracking-widest">
                      GET
                    </div>
                    <h3 className="font-serif text-2xl font-bold mb-2">{ep.name}</h3>
                    <code className="block bg-[#F9F9F7] p-3 border border-dotted border-[#737373] text-sm text-[#CC0000] font-bold mb-4">
                      {ep.path}
                    </code>
                    <p className="text-[#404040] leading-relaxed">{ep.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Themes Section */}
            <section id="themes" className="mb-16">
              <h2 className="text-3xl font-serif font-black uppercase border-b-2 border-[#111111] pb-2 mb-6 flex items-center gap-3">
                <Palette size={24} /> 3. Theming System
              </h2>
              <p className="mb-6 leading-relaxed">
                By default, Oi Git returns widgets using the "GitHub Dark Dimmed" aesthetic. If you prefer the stark, high-contrast, editorial style of this website, you can append the <code>theme</code> parameter to any endpoint.
              </p>

              <div className="border border-[#111111] bg-[#F9F9F7] p-8">
                <h4 className="font-mono text-xs uppercase tracking-widest text-[#737373] mb-4">Available Themes</h4>
                <ul className="space-y-6">
                  <li className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="font-bold font-mono text-lg w-32 border-b-2 border-[#111111] pb-1">default</span>
                    <span className="text-[#404040]">Dark grey background, rounded corners, Segoe UI font.</span>
                  </li>
                  <li className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="font-bold font-mono text-lg w-32 border-b-2 border-[#CC0000] text-[#CC0000] pb-1">newsprint</span>
                    <span className="text-[#404040]">White background, absolute black borders, sharp corners (0px radius), Times New Roman / Monospace fonts.</span>
                  </li>
                </ul>

                <div className="mt-8 bg-[#111111] text-[#F9F9F7] p-6 sharp-corners font-mono text-sm">
                  <code>{baseUrl}?type=stats&username=torvalds<strong className="text-[#CC0000]">&theme=newsprint</strong></code>
                </div>
              </div>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits" className="mb-16">
              <h2 className="text-3xl font-serif font-black uppercase border-b-2 border-[#111111] pb-2 mb-6 flex items-center gap-3">
                <Settings size={24} /> 4. Rate Limits & Caching
              </h2>
              <p className="mb-6 leading-relaxed">
                To respect GitHub's API rate limits and ensure maximum uptime, our server implements strict in-memory caching.
              </p>
              <ul className="list-disc list-outside ml-6 space-y-3 leading-relaxed text-[#404040]">
                <li>All profile data is heavily cached for <strong>30 minutes</strong>. New commits pushed to GitHub will not reflect on your SVG embeds until the cache expires.</li>
                <li>When possible, we utilize the GitHub GraphQL API to fetch deep historical data (e.g., reviewed PRs, exact contribution counts).</li>
                <li>If the primary GraphQL token is exhausted, the system automatically falls back to the REST API, resulting in a "Limited Data" warning on certain SVGs.</li>
              </ul>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-[#111111] bg-[#F9F9F7]">
        <div className="border-t border-[#111111] p-6 text-center font-mono text-xs uppercase tracking-widest bg-[#111111] text-[#F9F9F7]">
          © {new Date().getFullYear()} Oi Git Publishing. Documentation Vol. 1
        </div>
      </footer>
    </div>
  );
}

function Palette(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}
