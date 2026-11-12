import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight, Activity, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface PublicActivityCardData {
  id: string;
  title: string;
  date: Date | string;
  time: string;
  location: string;
  photos: string[];
  description: string;
}

interface ActivityCardProps {
  activity: PublicActivityCardData;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const pDate = new Date(activity.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const primaryPhoto = activity.photos?.[0] || null;

  return (
    <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Primary Cover Photo or Gradient */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 border-b border-white/5">
          {primaryPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryPhoto}
              alt={activity.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-950/80 via-zinc-900 to-[#07130f] flex flex-col items-center justify-center p-6 text-center">
              <Activity className="w-10 h-10 text-emerald-400/60 mb-2" />
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-300/80">
                Community Initiative
              </span>
            </div>
          )}

          {/* Photos Count Badge Overlay */}
          {activity.photos && activity.photos.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono text-zinc-300 flex items-center gap-1 shadow-md">
              <Camera className="w-3 h-3 text-emerald-400" />
              <span>{activity.photos.length} photos</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <CardContent className="p-5 space-y-3.5">
          <div className="space-y-1.5">
            <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
              {activity.title}
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              {activity.description}
            </p>
          </div>

          <div className="space-y-2 text-xs text-zinc-300 border-t border-white/5 pt-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-medium">{pDate}</span>
              <span className="text-zinc-600">•</span>
              <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="text-zinc-400">{activity.time}</span>
            </div>

            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{activity.location}</span>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Footer Link */}
      <div className="p-5 pt-0">
        <Link href={`/activities/${activity.id}`} className="block w-full">
          <div className="w-full py-2.5 px-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-emerald-950/30 hover:border-emerald-500/40 text-xs font-semibold text-zinc-200 hover:text-emerald-300 transition-all flex items-center justify-between">
            <span>Explore Activity</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-400" />
          </div>
        </Link>
      </div>
    </Card>
  );
}
