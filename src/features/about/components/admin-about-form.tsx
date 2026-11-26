"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import { UploadCloud, Trash2, Save, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { updateAboutContentAction, type AboutContentData } from "../actions/about-actions";

interface AdminAboutFormProps {
  initialData: AboutContentData;
}

export function AdminAboutForm({ initialData }: AdminAboutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const [title, setTitle] = React.useState(initialData.title || "");
  const [subtitle, setSubtitle] = React.useState(initialData.subtitle || "");
  const [content, setContent] = React.useState(initialData.content || "");
  const [photos, setPhotos] = React.useState<string[]>(
    initialData.photos && initialData.photos.length > 0
      ? initialData.photos.slice(0, 3)
      : ["/images/rsf1.jpg", "/images/rsf2.jpg", "/images/rsf3.jpg"]
  );

  const handlePhotoUpload = (slotIndex: number, newUrl: string) => {
    setPhotos((prev) => {
      const updated = [...prev];
      updated[slotIndex] = newUrl;
      return updated;
    });
    toast.success(`Photo ${slotIndex + 1} updated successfully!`);
  };

  const handlePhotoRemove = (slotIndex: number) => {
    setPhotos((prev) => {
      const updated = [...prev];
      // fallback to placeholder or remove
      updated[slotIndex] = `/images/rsf${slotIndex + 1}.jpg`;
      return updated;
    });
    toast.info(`Photo ${slotIndex + 1} reset to default.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please provide a title.");
      return;
    }

    if (!content.trim()) {
      toast.error("Please provide the story/mission content.");
      return;
    }

    startTransition(async () => {
      const result = await updateAboutContentAction({
        title,
        subtitle,
        content,
        photos,
      });

      if (result.success) {
        toast.success("About page content synchronized successfully!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update About content.");
      }
    });
  };

  const photoLabels = [
    { title: "Left Wing (Tilted -3°)", desc: "Left focal photograph" },
    { title: "Centerpiece (Main)", desc: "Primary center photograph" },
    { title: "Right Wing (Tilted +3°)", desc: "Right focal photograph" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Main Narrative Details */}
      <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Narrative & Editorial Copy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="about-title" className="text-xs font-semibold text-zinc-300">
                Primary Title <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="about-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Rangunia Students Forum (IIUC)"
                className="bg-black/40 border-white/10 text-white focus-visible:ring-emerald-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about-subtitle" className="text-xs font-semibold text-zinc-300">
                Subheading / Tagline
              </Label>
              <Input
                id="about-subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Rooted in Rangunia, Thriving at IIUC"
                className="bg-black/40 border-white/10 text-white focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="about-content" className="text-xs font-semibold text-zinc-300">
                Story, Mission & History Content <span className="text-rose-400">*</span>
              </Label>
              <span className="text-[11px] font-mono text-zinc-500">
                {content.length} characters
              </span>
            </div>
            <Textarea
              id="about-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="Write the full mission statement, university brotherhood values, and community welfare initiatives..."
              className="bg-black/40 border-white/10 text-white focus-visible:ring-emerald-500 font-sans leading-relaxed text-sm resize-y"
              required
            />
            <p className="text-[11px] text-zinc-500">
              Paragraph breaks will automatically render as spaced editorial blocks on the public landing page.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Three-Photo Cloudinary Manager */}
      <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-lg font-semibold text-white">Three-Photo Showcase Triad</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Signed Cloudinary uploads for the 3 floating motion images displayed on the homepage.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((slotIndex) => {
              const currentPhoto = photos[slotIndex] || `/images/rsf${slotIndex + 1}.jpg`;
              const label = photoLabels[slotIndex];

              return (
                <div
                  key={slotIndex}
                  className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-300 block">{label.title}</span>
                    <span className="text-[10px] text-zinc-500 block">{label.desc}</span>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentPhoto}
                      alt={label.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                      <span className="text-[10px] text-zinc-300 font-mono">Slot {slotIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => handlePhotoRemove(slotIndex)}
                        title="Reset photo"
                        className="h-7 w-7 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Cloudinary Upload Trigger */}
                  <React.Suspense
                    fallback={
                      <div className="h-9 w-full rounded-lg border border-white/10 bg-white/5 animate-pulse" />
                    }
                  >
                    <CldUploadWidget
                      signatureEndpoint="/api/cloudinary/sign"
                      config={{
                        cloud: {
                          cloudName:
                            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
                            "yoqifwb9",
                          apiKey:
                            process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
                            "171588185773459",
                        },
                      }}
                      options={{
                        multiple: false,
                        resourceType: "image",
                        clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                        maxFileSize: 5 * 1024 * 1024,
                      }}
                      onSuccess={(result) => {
                        if (
                          result.info &&
                          typeof result.info === "object" &&
                          "secure_url" in result.info
                        ) {
                          handlePhotoUpload(slotIndex, result.info.secure_url);
                        }
                      }}
                    >
                      {({ open }) => (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => open?.()}
                          className="w-full h-9 border-white/10 bg-white/5 hover:bg-emerald-950/40 hover:border-emerald-500/30 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2"
                        >
                          <UploadCloud className="w-4 h-4 text-emerald-400" />
                          <span>Replace Photo {slotIndex + 1}</span>
                        </Button>
                      )}
                    </CldUploadWidget>
                  </React.Suspense>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Action Bar */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/dashboard")}
          className="border-white/10 bg-white/5 text-zinc-300 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 h-11 flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Publish Live</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
