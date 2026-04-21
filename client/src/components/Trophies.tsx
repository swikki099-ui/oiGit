import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, GitCommit, GitPullRequest, Users, BookOpen, Code2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TrophyData {
  name: string;
  description: string;
  rank: "S" | "A" | "B" | "C" | "?";
  icon: string;
  achieved: boolean;
}

interface TrophiesProps {
  trophies: TrophyData[];
  onEmbed?: () => void;
}

const iconMap: { [key: string]: React.ElementType } = {
  star: Star,
  commit: GitCommit,
  pr: GitPullRequest,
  followers: Users,
  repo: BookOpen,
  language: Code2,
};

const rankPriority: Record<string, number> = { S: 0, A: 1, B: 2, C: 3, "?": 4 };

export function Trophies({ trophies, onEmbed }: TrophiesProps) {
  const sorted = [...trophies].sort((a, b) => {
    if (a.achieved !== b.achieved) return a.achieved ? -1 : 1;
    return (rankPriority[a.rank] ?? 5) - (rankPriority[b.rank] ?? 5);
  });

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

      <div className="border-b-4 border-[#111111] p-6 bg-[#F9F9F7]">
        <span className="font-mono text-xs uppercase tracking-widest block mb-2 text-[#CC0000]">Volume 7.0</span>
        <h2 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tighter leading-none">
          Verified<br/>Achievements
        </h2>
      </div>

      <CardContent className="p-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y divide-[#111111]">
        {sorted.map((trophy, index) => {
          const IconComponent = iconMap[trophy.icon] || Trophy;
          
          return (
            <div
              key={index}
              className={`flex flex-col items-center text-center p-6 relative group bg-white hover:bg-[#111111] hover:text-white transition-colors ${!trophy.achieved ? 'opacity-40 grayscale' : ''} -mt-px -ml-px`}
            >
              <div className={`absolute top-2 right-2 text-[10px] font-mono font-bold px-1.5 py-0.5 border border-[#111111] group-hover:border-white ${trophy.rank === 'S' ? 'bg-[#CC0000] text-white border-transparent' : 'bg-[#F9F9F7] text-[#111111]'}`}>
                {trophy.rank}
              </div>
              
              <div className={`mb-4 mt-2 p-3 border-2 border-[#111111] group-hover:border-white ${trophy.achieved ? 'bg-[#111111] text-white' : 'bg-transparent text-[#111111] group-hover:text-black group-hover:bg-white'}`}>
                <IconComponent size={24} strokeWidth={1.5} />
              </div>
              
              <h3 className="font-serif font-bold text-sm mb-2">{trophy.name}</h3>
              <p className="font-mono text-[9px] uppercase tracking-widest leading-tight">{trophy.description}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
