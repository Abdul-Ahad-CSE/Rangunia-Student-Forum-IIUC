"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActivityPhotoGalleryProps {
  photos: string[];
  title: string;
}

export function ActivityPhotoGallery({ photos, title }: ActivityPhotoGalleryProps) {
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

  if (!photos || photos.length === 0) {
    return null;
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + photos.length) % photos.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % photos.length);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-2">
          <Camera className="w-4 h-4" />
          <span>Activity Photo Gallery ({photos.length})</span>
        </h3>
        <span className="text-xs text-zinc-400">Click any photo to view full size</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photoUrl, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-zinc-950 cursor-pointer group shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt={`${title} - Photo ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-black/70 border border-white/20 text-xs text-white font-medium">
                View Photo
              </span>
            </div>
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-mono text-zinc-300">
              {idx + 1}/{photos.length}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedIdx !== null} onOpenChange={(open) => !open && setSelectedIdx(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border border-white/15 text-white">
          {selectedIdx !== null && (
            <div className="relative flex flex-col items-center justify-center p-4 min-h-[50vh] sm:min-h-[70vh]">
              {/* Top Bar with Counter and Close */}
              <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10">
                <span className="text-xs font-mono text-zinc-300 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  {selectedIdx + 1} of {photos.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIdx(null)}
                  className="h-8 w-8 p-0 rounded-full bg-black/60 text-zinc-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Main Photo Display */}
              <div className="w-full h-full flex items-center justify-center py-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photos[selectedIdx]}
                  alt={`${title} enlarged`}
                  className="max-h-[75vh] max-w-full object-contain rounded-lg"
                />
              </div>

              {/* Navigation Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous Photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next Photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
