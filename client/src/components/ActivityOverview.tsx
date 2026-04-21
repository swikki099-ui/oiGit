import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Share2, GitCommit, GitPullRequest, Zap, Star, Users } from "lucide-react";

interface ActivityOverviewProps {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  followers: number;
  contributedTo: number;
  publicRepos: number;
  isFullData: boolean;
  onEmbed?: () => void;
}

function computeScore(data: {
  totalCommits: number; totalPRs: number; totalIssues: number;
  totalStars: number; followers: number; contributedTo: number;
}): { score: number; rank: string } {
  const raw =
    Math.min(data.totalCommits / 50, 40) +
    Math.min(data.totalPRs / 5, 20) +
    Math.min(data.totalIssues / 5, 10) +
    Math.min(data.totalStars / 10, 20) +
    Math.min(data.followers / 20, 10);

  const score = Math.round(Math.min(raw, 100));

  let rank: string;
  if (score >= 90) { rank = "S"; }
  else if (score >= 75) { rank = "A+"; }
  else if (score >= 60) { rank = "A"; }
  else if (score >= 45) { rank = "B"; }
  else if (score >= 30) { rank = "C"; }
  else { rank = "D"; }

  return { score, rank };
}

export function ActivityOverview({
  totalCommits, totalPRs, totalIssues, totalStars, followers,
  contributedTo, isFullData, onEmbed
}: ActivityOverviewProps) {

  const { score, rank } = computeScore({
    totalCommits, totalPRs, totalIssues, totalStars, followers, contributedTo
  });

  const metrics = [
    { label: "Commits", value: totalCommits, max: 5000 },
    { label: "Pull Requests", value: totalPRs, max: 500 },
    { label: "Issues", value: totalIssues, max: 200 },
    { label: "Stars", value: totalStars, max: 1000 },
    { label: "Followers", value: followers, max: 500 },
  ];

  return (
    <Card className="sharp-corners border-4 border-[#111111] bg-white h-full relative p-0 flex flex-col">
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

      <div className="border-b-4 border-[#111111] p-6 bg-[#F9F9F7]">
        <span className="font-mono text-xs uppercase tracking-widest block mb-2 text-[#CC0000]">Volume 4.0</span>
        <h2 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tighter leading-none">
          Global<br/>Rank
        </h2>
      </div>

      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="flex border-b border-[#111111] bg-[#111111] text-white">
          <div className="w-1/2 p-6 border-r border-[#111111] flex flex-col items-center justify-center">
            <span className="text-7xl font-serif font-black leading-none">{rank}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest mt-2">Class</span>
          </div>
          <div className="w-1/2 p-6 flex flex-col items-center justify-center">
            <span className="text-5xl font-mono font-bold leading-none">{score}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest mt-2">Score / 100</span>
          </div>
        </div>
        
        <div className="p-6 bg-white flex-1 space-y-4">
          {metrics.map(({ label, value, max }) => {
            const pct = Math.min((value / max) * 100, 100);
            return (
              <div key={label}>
                <div className="flex justify-between font-mono text-xs uppercase tracking-widest mb-1">
                  <span>{label}</span>
                  <span className="font-bold">{value.toLocaleString()}</span>
                </div>
                <div className="h-2 border border-[#111111] bg-[#F9F9F7] w-full">
                   <div 
                    className="h-full bg-[#111111] transition-all duration-1000"
                    style={{ width: `${pct}%` }}
                   />
                </div>
              </div>
            );
          })}
        </div>
        {!isFullData && (
           <div className="bg-[#CC0000] text-white p-2 text-center font-mono text-[10px] uppercase tracking-widest">
             Data Limited - Requires GitHub Token
           </div>
        )}
      </CardContent>
    </Card>
  );
}
