import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, GitFork, ExternalLink, Share2 } from "lucide-react";
import type { TopRepo } from "@shared/schema";

interface TopReposCardProps {
  repos: TopRepo[];
  onEmbed?: () => void;
}

export function TopReposCard({ repos, onEmbed }: TopReposCardProps) {
  if (!repos.length) return null;

  return (
    <Card className="sharp-corners border-4 border-[#111111] bg-white relative p-0 flex flex-col">
      {onEmbed && (
        <div className="absolute top-0 right-0 z-10 border-l border-b border-[#111111] bg-[#F9F9F7] hover:bg-[#111111] hover:text-[#F9F9F7] transition-colors">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 sharp-corners text-[#111111] hover:text-[#F9F9F7]"
                onClick={onEmbed}
              >
                <Share2 size={16} strokeWidth={1.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Embed this card</TooltipContent>
          </Tooltip>
        </div>
      )}

      <div className="border-b-4 border-[#111111] p-6 bg-[#111111] text-[#F9F9F7]">
        <span className="font-mono text-xs uppercase tracking-widest block mb-2 text-[#CC0000]">Volume 6.0</span>
        <h2 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tighter leading-none">
          Top<br/>Repositories
        </h2>
      </div>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#111111] border-b border-[#111111]">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col p-6 hover:bg-[#111111] hover:text-[#F9F9F7] transition-colors group"
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <span className="font-serif font-bold text-xl leading-none">
                  {repo.name}
                </span>
                <ExternalLink size={16} strokeWidth={1.5} className="shrink-0 group-hover:text-[#F9F9F7] text-[#111111]" />
              </div>

              <p className="font-body text-sm leading-relaxed flex-1 mb-6 text-justify-news">
                {repo.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest pt-4 border-t border-dotted border-[#737373]">
                {repo.language ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 border border-current"
                      style={{ backgroundColor: repo.languageColor }}
                    />
                    {repo.language}
                  </span>
                ) : (
                  <span>Unknown</span>
                )}
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Star size={12} strokeWidth={2} />
                    {repo.stars.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={12} strokeWidth={2} />
                    {repo.forks.toLocaleString()}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
