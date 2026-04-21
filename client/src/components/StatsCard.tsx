import { Star, GitCommit, GitPullRequest, Disc, BookOpen, Share2, CheckCircle2, Eye, GitFork, Building2, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StatsCardProps {
  username: string;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  contributedTo: number;
  prsReviewed: number;
  mergedPRs: number;
  totalForks: number;
  organizations: number;
  accountAgeDays: number;
  onEmbed?: () => void;
}

export function StatsCard({
  username,
  totalStars,
  totalCommits,
  totalPRs,
  totalIssues,
  contributedTo,
  prsReviewed,
  mergedPRs,
  totalForks,
  organizations,
  accountAgeDays,
  onEmbed
}: StatsCardProps) {
  const stats = [
    { icon: Star, label: "Stars", value: totalStars.toLocaleString() },
    { icon: GitCommit, label: "Commits", value: totalCommits.toLocaleString() },
    { icon: GitPullRequest, label: "Total PRs", value: totalPRs.toLocaleString() },
    { icon: CheckCircle2, label: "Merged", value: mergedPRs.toLocaleString() },
    { icon: Disc, label: "Issues", value: totalIssues.toLocaleString() },
    { icon: Eye, label: "Reviewed", value: prsReviewed.toLocaleString() },
    { icon: BookOpen, label: "Contributed", value: contributedTo.toLocaleString() },
    { icon: GitFork, label: "Forks", value: totalForks.toLocaleString() },
    { icon: Building2, label: "Orgs", value: organizations.toLocaleString() },
    { icon: Calendar, label: "Age (Yrs)", value: Math.max(1, Math.round(accountAgeDays / 365)) },
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
        <span className="font-mono text-xs uppercase tracking-widest block mb-2 text-[#CC0000]">Volume 1.0</span>
        <h2 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tighter leading-none">
          Performance<br/>Metrics
        </h2>
      </div>

      <CardContent className="p-0 grid grid-cols-2 md:grid-cols-5 divide-x divide-y divide-[#111111] border-b-0 border-t-0 flex-1">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 flex flex-col items-start justify-center group hover:bg-[#111111] hover:text-[#F9F9F7] transition-colors -mt-px -ml-px min-h-[120px]">
            <div className="mb-4 p-2 border-2 border-[#111111] group-hover:border-white">
              <stat.icon size={20} strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tighter leading-none mb-2">
              {stat.value}
            </div>
            <div className="text-xs uppercase tracking-widest font-mono">
              {stat.label}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
