import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Share2 } from "lucide-react";

interface ActivityHeatmapProps {
  weeklyContributions: number[];
  username: string;
  isFullData: boolean;
  onEmbed?: () => void;
}

function getColor(count: number, max: number): string {
  if (count === 0) return "bg-[#E5E5E0]";
  const ratio = count / max;
  if (ratio < 0.25) return "bg-[#A3A3A3]";
  if (ratio < 0.5)  return "bg-[#737373]";
  if (ratio < 0.75) return "bg-[#404040]";
  return "bg-[#111111]";
}

export function ActivityHeatmap({
  weeklyContributions, isFullData, onEmbed
}: ActivityHeatmapProps) {
  const weeks = weeklyContributions.length > 0
    ? weeklyContributions
    : Array(52).fill(0);

  const max = Math.max(...weeks, 1);
  const total = weeks.reduce((s, v) => s + v, 0);

  const monthLabels: { label: string; col: number }[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now);
    d.setDate(1);
    d.setMonth(now.getMonth() - 11 + i);
    const weekIndex = Math.round(((i / 12) * 52));
    monthLabels.push({
      label: d.toLocaleString("default", { month: "short" }),
      col: weekIndex,
    });
  }

  const barMax = Math.max(...weeks, 1);

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
        <span className="font-mono text-xs uppercase tracking-widest block mb-2 text-[#CC0000]">Volume 5.0</span>
        <h2 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tighter leading-none">
          Activity<br/>Heatmap
        </h2>
      </div>

      <CardContent className="p-6">
        {!isFullData && (
          <div className="bg-[#CC0000] text-white p-2 text-center font-mono text-[10px] uppercase tracking-widest mb-6">
             Data Limited - Requires GitHub Token
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="min-w-0">
            <div className="flex gap-[3px] mb-2 text-[10px] font-mono uppercase tracking-widest text-[#737373]">
              {monthLabels.map(({ label, col }) => (
                <span
                  key={label + col}
                  style={{ width: `calc(${(1 / 12) * 100}%)`, minWidth: 0 }}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="flex items-end gap-[3px] h-24 border-b-2 border-[#111111]">
              {weeks.map((count, i) => {
                const heightPct = count === 0 ? 4 : Math.max(8, (count / barMax) * 100);
                return (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div
                        className={`flex-1 ${getColor(count, max)} transition-opacity hover:opacity-80 min-w-[3px] border-t border-l border-r border-[#111111]`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs sharp-corners bg-[#111111] text-white border-none font-mono uppercase tracking-widest">
                      {count} contributions
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest mt-6 pt-4 border-t border-[#111111]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg leading-none">{total.toLocaleString()}</span>
            <span>Contributions<br/>Last Year</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            <span>Less</span>
            {["bg-[#E5E5E0]", "bg-[#A3A3A3]", "bg-[#737373]", "bg-[#404040]", "bg-[#111111]"].map(c => (
              <div key={c} className={`w-4 h-4 border border-[#111111] ${c}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
