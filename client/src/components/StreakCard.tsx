import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Share2 } from "lucide-react";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  startDate: string;
  endDate: string;
  onEmbed?: () => void;
}

export function StreakCard({
  currentStreak,
  longestStreak,
  totalContributions,
  startDate,
  endDate,
  onEmbed
}: StreakCardProps) {
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
        <span className="font-mono text-xs uppercase tracking-widest block mb-2 text-[#CC0000]">Volume 3.0</span>
        <h2 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tighter leading-none">
          Activity<br/>Streaks
        </h2>
      </div>

      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="grid grid-cols-2 divide-x divide-[#111111] border-b-4 border-[#111111] flex-1">
          <div className="p-6 flex flex-col items-center justify-center text-center hover:bg-neutral-100 transition-colors">
            <div className="text-6xl md:text-7xl font-serif font-black text-[#CC0000] leading-none mb-2">{currentStreak}</div>
            <div className="font-mono text-xs uppercase tracking-widest">Current</div>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center hover:bg-neutral-100 transition-colors">
            <div className="text-6xl md:text-7xl font-serif font-black text-[#111111] leading-none mb-2">{longestStreak}</div>
            <div className="font-mono text-xs uppercase tracking-widest">Longest</div>
          </div>
        </div>
        
        <div className="p-6 bg-[#111111] text-[#F9F9F7] font-mono text-xs uppercase tracking-widest text-center">
           <div className="flex justify-between border-b border-dotted border-[#404040] pb-2 mb-2">
              <span>Start</span>
              <span>{startDate}</span>
           </div>
           <div className="flex justify-between border-b border-dotted border-[#404040] pb-2 mb-2">
              <span>End</span>
              <span>{endDate}</span>
           </div>
           <div className="flex justify-between">
              <span>Total Commits</span>
              <span className="text-[#CC0000] font-bold">{totalContributions}</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
