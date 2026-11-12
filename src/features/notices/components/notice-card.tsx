import * as React from "react";
import Link from "next/link";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface PublicNoticeCardData {
  id: string;
  title: string;
  date: Date | string;
  bannerUrl?: string | null;
  content: string;
}

interface NoticeCardProps {
  notice: PublicNoticeCardData;
}

export function NoticeCard({ notice }: NoticeCardProps) {
  const pDate = new Date(notice.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Banner or Styled Fallback */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 border-b border-white/5">
          {notice.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={notice.bannerUrl}
              alt={notice.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-950/80 via-zinc-900 to-[#07130f] flex flex-col items-center justify-center p-6 text-center">
              <FileText className="w-10 h-10 text-emerald-400/60 mb-2" />
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-300/80">
                Official Circular
              </span>
            </div>
          )}

          {/* Date Tag Overlay */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[11px] font-mono text-emerald-300 flex items-center gap-1.5 shadow-md">
            <Calendar className="w-3 h-3 text-emerald-400" />
            <span>{pDate}</span>
          </div>
        </div>

        {/* Content Body */}
        <CardContent className="p-5 space-y-3">
          <div className="space-y-1.5">
            <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
              {notice.title}
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
              {notice.content}
            </p>
          </div>
        </CardContent>
      </div>

      {/* Footer Link */}
      <div className="p-5 pt-0">
        <Link href={`/notices/${notice.id}`} className="block w-full">
          <div className="w-full py-2.5 px-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-emerald-950/30 hover:border-emerald-500/40 text-xs font-semibold text-zinc-200 hover:text-emerald-300 transition-all flex items-center justify-between">
            <span>Read Full Notice</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-400" />
          </div>
        </Link>
      </div>
    </Card>
  );
}
