import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin, Building2, Link2, Users, BookOpen, UserCheck, Share2, ExternalLink } from "lucide-react";

interface ProfileCardProps {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  company: string;
  blog: string;
  followers: number;
  following: number;
  publicRepos: number;
  onEmbed?: () => void;
}

export function ProfileCard({
  username, name, avatarUrl, bio, location, company, blog,
  followers, following, publicRepos, onEmbed
}: ProfileCardProps) {
  const blogUrl = blog
    ? blog.startsWith("http") ? blog : `https://${blog}`
    : null;

  return (
    <Card className="sharp-corners border-4 border-[#111111] bg-[#F9F9F7] h-full relative group">
      {/* Embed button */}
      {onEmbed && (
        <div className="absolute top-0 right-0 z-10 border-l border-b border-[#111111] bg-white hover:bg-[#111111] hover:text-white transition-colors">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 sharp-corners text-[#111111] hover:text-[#F9F9F7]" onClick={onEmbed}>
                <Share2 size={16} strokeWidth={1.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Embed profile card</TooltipContent>
          </Tooltip>
        </div>
      )}

      <CardContent className="p-0 flex flex-col h-full">
        {/* Header Block */}
        <div className="border-b-2 border-[#111111] p-6 bg-white relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(#111111_1px,transparent_1px)] opacity-5 [background-size:12px_12px]" />
           <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
              <img
                src={avatarUrl}
                alt={name}
                className="w-24 h-24 border-2 border-[#111111] grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="flex-1 overflow-hidden mt-2 md:mt-0">
                <h2 className="font-serif font-black text-3xl md:text-4xl leading-none uppercase tracking-tighter truncate">{name}</h2>
                <p className="text-sm font-mono tracking-widest uppercase mt-2 border border-[#111111] inline-block px-2 py-0.5 bg-[#111111] text-[#F9F9F7]">@{username}</p>
              </div>
           </div>
        </div>

        {/* Bio */}
        {bio && (
          <div className="p-6 border-b border-[#111111] bg-[#F9F9F7]">
             <p className="font-body text-base text-[#111111] leading-relaxed text-justify-news line-clamp-3">
               <span className="text-3xl float-left mr-2 mt-1 leading-none font-black font-serif">{bio.charAt(0)}</span>{bio.slice(1)}
             </p>
          </div>
        )}

        {/* Meta info */}
        <div className="p-6 border-b border-[#111111] bg-white font-mono text-xs uppercase tracking-widest space-y-3">
          {location && (
            <div className="flex items-center gap-3 truncate">
              <MapPin size={14} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
          {company && (
            <div className="flex items-center gap-3 truncate">
              <Building2 size={14} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate">{company}</span>
            </div>
          )}
          {blogUrl && (
            <a
              href={blogUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 hover:bg-[#111111] hover:text-[#F9F9F7] p-1 -ml-1 transition-colors truncate"
            >
              <Link2 size={14} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate underline underline-offset-4 decoration-[#CC0000]">
                {blog.replace(/^https?:\/\//, "")}
              </span>
              <ExternalLink size={12} strokeWidth={1.5} className="shrink-0" />
            </a>
          )}
        </div>

        {/* Stats pills */}
        <div className="grid grid-cols-3 divide-x divide-[#111111] mt-auto bg-[#111111] text-[#F9F9F7]">
          {[
            { label: "Followers", value: followers },
            { label: "Following", value: following },
            { label: "Repos", value: publicRepos },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 text-center hover:bg-white hover:text-[#111111] transition-colors">
              <div className="font-bold font-mono text-xl md:text-2xl leading-none mb-1">{value.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
