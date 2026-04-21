import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Search, BarChart2, Zap, Trophy, ArrowRight, Code2, Settings, Palette, Users } from "lucide-react";
import { useState } from "react";
import Marquee from "react-fast-marquee";

export default function Landing() {
  const [username, setUsername] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setLocation(`/u/${username}`);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const features = [
    { icon: BarChart2, title: "Visual Analytics", desc: "Precise charts and graphs representing your commit history and language usage." },
    { icon: Zap, title: "Streak Tracking", desc: "Document your coding consistency with advanced streak metrics and contribution graphs." },
    { icon: Trophy, title: "Achievements", desc: "Unlock and display trophies based on your GitHub activity and verifiable milestones." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground newsprint-texture">
      {/* Header - Editorial Style */}
      <header className="w-full border-b-4 border-[#111111] bg-background relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 py-2 border-b border-[#111111] text-xs font-mono uppercase tracking-widest">
          <span>Vol. 1</span>
          <span>{today}</span>
          <span>Open Source Edition</span>
        </div>
        <div className="flex justify-between items-center px-6 py-6 max-w-screen-xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#111111] bg-[#111111] overflow-hidden">
              <img src="/favicon.png" alt="Oi Git Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-serif text-3xl font-black uppercase tracking-tight">Oi Git</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/docs">
              <span className="font-mono text-xs uppercase tracking-widest hover:text-[#CC0000] cursor-pointer hidden md:block">Documentation</span>
            </Link>
            <a 
              href="https://github.com/chaursia/oiGit" 
            target="_blank" 
            rel="noreferrer"
            className="w-10 h-10 border border-[#111111] flex items-center justify-center hover:bg-[#111111] hover:text-[#F9F9F7] transition-colors"
          >
            <Github strokeWidth={1.5} size={20} />
          </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="grid grid-cols-1 lg:grid-cols-12 border-b-4 border-[#111111] max-w-screen-xl mx-auto">
          {/* Main Headline Area */}
          <div className="lg:col-span-8 p-6 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#111111]">
            <div className="mb-8">
              <span className="inline-block border border-[#111111] px-3 py-1 text-xs font-mono uppercase tracking-widest mb-4">
                Exclusive Report
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black leading-[0.85] tracking-tighter uppercase mb-6">
                Your GitHub,<br />
                In Print.
              </h1>
              <p className="text-lg md:text-xl font-body leading-relaxed max-w-2xl text-justify-news">
                <span className="text-5xl float-left mr-3 mt-1 leading-none font-black font-serif">S</span>howcase your coding journey with absolute clarity. Our visualizer transforms raw GitHub data into stunning, high-contrast editorial layouts. Generate embeddable cards for your README in seconds.
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-0 max-w-xl">
              <div className="flex-1 relative border border-[#111111] bg-white">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]" size={20} />
                <Input 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter GitHub username..." 
                  className="pl-10 h-[56px] border-none font-mono text-base"
                />
              </div>
              <Button size="lg" type="submit" className="sm:w-auto w-full sharp-corners h-[56px] border-l-0 border border-[#111111]">
                INVESTIGATE <ArrowRight className="ml-2" size={18} />
              </Button>
            </form>
          </div>

          {/* Sidebar / Quick Stats */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="p-6 border-b border-[#111111] flex-1">
              <h2 className="font-serif text-3xl font-black uppercase border-b-2 border-[#111111] pb-2 mb-4">The Stats</h2>
              <ul className="space-y-4 font-mono text-sm uppercase tracking-wider">
                <li className="flex justify-between border-b border-dotted border-[#111111] pb-2">
                  <span>Active Users</span>
                  <span className="font-bold">10,000+</span>
                </li>
                <li className="flex justify-between border-b border-dotted border-[#111111] pb-2">
                  <span>Data Source</span>
                  <span className="font-bold">Real-time API</span>
                </li>
                <li className="flex justify-between border-b border-dotted border-[#111111] pb-2">
                  <span>Export</span>
                  <span className="font-bold">Instant Embed</span>
                </li>
              </ul>
            </div>
            {/* Image Placeholder with Newsprint Texture */}
            <div className="p-6 bg-neutral-200 flex-1 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#111111_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />
              <div className="relative border-2 border-[#111111] bg-[#F9F9F7] p-4 text-center transform rotate-2">
                <p className="font-serif text-xl font-bold uppercase">Fig. 1</p>
                <p className="text-xs font-mono">Example Data Visualization</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ticker */}
        <div className="border-b-4 border-[#111111] bg-[#111111] text-[#F9F9F7] py-3 overflow-hidden">
          <Marquee gradient={false} speed={50} className="font-mono text-sm uppercase tracking-widest overflow-hidden flex items-center h-full">
            <span className="mx-8 flex items-center"><span className="text-[#CC0000] mr-2">■</span> BREAKING: NEW TROPHIES ADDED</span>
            <span className="mx-8 flex items-center"><span className="text-[#CC0000] mr-2">■</span> 100% BYTE-ACCURATE LANGUAGE STATS</span>
            <span className="mx-8 flex items-center"><span className="text-[#CC0000] mr-2">■</span> REAL-TIME STREAK TRACKING</span>
            <span className="mx-8 flex items-center"><span className="text-[#CC0000] mr-2">■</span> NO AUTHENTICATION REQUIRED</span>
          </Marquee>
        </div>

        {/* Features Grid */}
        <section className="max-w-screen-xl mx-auto border-b border-[#111111]">
          <div className="p-6 border-b-2 border-[#111111]">
            <h2 className="text-4xl lg:text-5xl font-serif font-black uppercase text-center tracking-tighter">Editorial Features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {features.map((feature, i) => (
              <div key={i} className={`p-8 group hover:bg-neutral-100 transition-colors ${i !== features.length - 1 ? 'md:border-r border-b md:border-b-0 border-[#111111]' : 'border-b md:border-b-0 border-[#111111]'}`}>
                <div className="w-12 h-12 border border-[#111111] flex items-center justify-center mb-6 group-hover:bg-[#111111] group-hover:text-white transition-colors">
                  <feature.icon strokeWidth={1.5} size={24} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-3">{feature.title}</h3>
                <p className="font-body text-neutral-600 leading-relaxed text-justify-news">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Inverted Section */}
        <section className="bg-[#111111] text-[#F9F9F7] border-b border-[#111111]">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 lg:p-24 lg:border-r border-[#404040] flex flex-col justify-center">
                <h2 className="text-5xl lg:text-7xl font-serif font-black uppercase mb-6 leading-none">How It<br/><span className="text-[#CC0000]">Works.</span></h2>
                <p className="font-body text-lg text-neutral-300 leading-relaxed text-justify-news">
                  Our system operates with mechanical precision. We extract your public GitHub data and typeset it into beautiful, permanent records.
                </p>
              </div>
              <div className="p-12 lg:p-24 flex flex-col justify-center space-y-8">
                {[
                  { step: "01", title: "Search", desc: "Input your GitHub handle. No authentication required." },
                  { step: "02", title: "Typeset", desc: "Our engine compiles your data into an editorial layout." },
                  { step: "03", title: "Publish", desc: "Copy the generated markdown and paste into your README." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <span className="font-mono text-xl text-[#CC0000] font-bold mt-1">{item.step}</span>
                    <div>
                      <h3 className="font-serif text-2xl font-bold mb-2">{item.title}</h3>
                      <p className="font-body text-neutral-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-screen-xl mx-auto py-24 px-6 text-center">
           <div className="py-8 text-center font-serif text-2xl text-neutral-400 tracking-[1em] mb-8">
              &#x2727; &#x2727; &#x2727;
            </div>
          <h2 className="text-5xl md:text-7xl font-serif font-black uppercase mb-8">Stop Reading.<br/>Start Building.</h2>
          <form 
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-0 justify-center max-w-md mx-auto"
          >
            <Input 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your GitHub username..." 
              className="px-6 py-4 border border-[#111111] bg-white font-mono text-base h-[56px] sharp-corners sm:border-r-0 focus-visible:bg-[#F0F0F0]"
            />
            <Button size="lg" type="submit" className="sharp-corners h-[56px] border border-[#111111]">
              Generate Report <ArrowRight className="ml-2" size={18} />
            </Button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-[#111111] bg-[#F9F9F7]">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#111111]">
          <div className="p-8">
            <h3 className="font-serif text-2xl font-black uppercase mb-4">Oi Git</h3>
            <p className="font-body text-sm text-neutral-600 max-w-xs">All the stats that are fit to print. An open-source visualizer for developers.</p>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">Edition</span>
            <span className="font-serif font-bold">Vol 1.0</span>
            <Link href="/docs">
              <span className="font-mono text-xs uppercase tracking-widest hover:text-[#CC0000] cursor-pointer mt-4 inline-block">Read The Docs &rarr;</span>
            </Link>
          </div>
          <div className="p-8 flex items-center md:justify-end gap-4">
             <a href="https://github.com/chaursia/oiGit" target="_blank" rel="noreferrer" className="w-12 h-12 border border-[#111111] flex items-center justify-center hover:bg-[#111111] hover:text-[#F9F9F7] transition-colors hard-shadow-hover">
              <Github strokeWidth={1.5} size={24} />
            </a>
          </div>
        </div>
        <div className="border-t border-[#111111] p-4 text-center font-mono text-xs uppercase tracking-widest bg-[#111111] text-[#F9F9F7]">
          © {new Date().getFullYear()} Oi Git Publishing. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
