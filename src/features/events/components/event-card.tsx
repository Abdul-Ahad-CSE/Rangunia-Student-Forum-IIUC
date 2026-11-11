import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface PublicEventCardData {
  id: string;
  title: string;
  bannerUrl?: string | null;
  eventDate: Date | string;
  eventTime: string;
  venue: string;
  registrationDeadline: Date | string;
  description: string;
  postEventRecap?: string | null;
  postEventPhotos?: string[];
}

interface EventCardProps {
  event: PublicEventCardData;
}

export function EventCard({ event }: EventCardProps) {
  const eDate = new Date(event.eventDate);
  const rDeadline = new Date(event.registrationDeadline);
  const now = new Date();

  const isCompleted = now > eDate;
  const isRegistrationOpen = now <= rDeadline;

  const formattedDate = eDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Banner Image or Gradient Header */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 border-b border-white/5">
          {event.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-950/80 via-zinc-900 to-[#07130f] flex flex-col items-center justify-center p-6 text-center">
              <Calendar className="w-10 h-10 text-emerald-400/60 mb-2" />
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-300/80">
                Forum Gathering
              </span>
            </div>
          )}

          {/* Status Badge Overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {isCompleted ? (
              <Badge variant="outline" className="border-white/10 bg-black/60 backdrop-blur-md text-zinc-300 text-[10px] font-mono">
                Concluded
              </Badge>
            ) : isRegistrationOpen ? (
              <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-black font-semibold text-[10px] shadow-lg">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                Registration Open
              </Badge>
            ) : (
              <Badge variant="outline" className="border-amber-500/40 bg-amber-950/70 backdrop-blur-md text-amber-300 text-[10px] font-mono">
                Registration Closed
              </Badge>
            )}
          </div>
        </div>

        {/* Content Body */}
        <CardContent className="p-5 space-y-3.5">
          <div className="space-y-1.5">
            <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
              {event.title}
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="space-y-2 text-xs text-zinc-300 border-t border-white/5 pt-3">
            <div className="flex items-center gap-2 text-zinc-300">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-medium">{formattedDate}</span>
              <span className="text-zinc-600">•</span>
              <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="text-zinc-400">{event.eventTime}</span>
            </div>

            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Footer Link */}
      <div className="p-5 pt-0">
        <Link href={`/events/${event.id}`} className="block w-full">
          <div className="w-full py-2.5 px-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-emerald-950/30 hover:border-emerald-500/40 text-xs font-semibold text-zinc-200 hover:text-emerald-300 transition-all flex items-center justify-between">
            <span>View Event Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-400" />
          </div>
        </Link>
      </div>
    </Card>
  );
}
