import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Share2 } from "lucide-react";

interface Language {
  name: string;
  percentage: number;
  color: string;
}

interface LanguageCardProps {
  languages: Language[];
  onEmbed?: () => void;
}

export function LanguageCard({ languages, onEmbed }: LanguageCardProps) {
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

      <div className="border-b-4 border-[#111111] p-6 bg-[#111111] text-[#F9F9F7]">
         <span className="font-mono text-xs uppercase tracking-widest block mb-2 text-[#CC0000]">Volume 2.0</span>
         <h2 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tighter leading-none">
          Syntax<br/>Breakdown
        </h2>
      </div>

      <CardContent className="p-6 flex-1 bg-white space-y-6">
        {languages.map((lang, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between font-mono text-sm uppercase tracking-widest">
              <span className="font-bold text-[#111111]">{lang.name}</span>
              <span className="text-[#111111]">{lang.percentage}%</span>
            </div>
            {/* Stark mechanical progress bar */}
            <div className="h-4 w-full border border-[#111111] bg-[#F9F9F7] relative">
              <div
                className="h-full bg-[#111111] transition-all duration-1000 border-r border-[#111111]"
                style={{ width: `${lang.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
