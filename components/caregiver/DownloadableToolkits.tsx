"use client";

import { useState, useEffect } from "react";
import { DownloadCloud, Headphones, Play, Pause, FileText, CheckCircle2, Volume2, VolumeX } from "lucide-react";

export function DownloadableToolkits() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(160); // 2:40 default from screenshot
  const duration = 495; // 8:15 in seconds
  const [isMuted, setIsMuted] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Playback timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleDownload = (lang: "en" | "hi") => {
    setDownloadSuccess(lang === "en" ? "English PDF" : "Hindi PDF");
    setTimeout(() => setDownloadSuccess(null), 3000);

    // Open a beautifully styled printable checklist
    const printableWindow = window.open("", "_blank");
    if (printableWindow) {
      printableWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Sakhi AI - Printable Period Tracker & School Checklist</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e1e24; max-width: 700px; margin: auto; }
            h1 { color: #7B3E73; margin-bottom: 5px; }
            h2 { color: #3F1F36; border-bottom: 2px solid #F5D8E8; padding-bottom: 8px; margin-top: 30px; }
            .item { margin: 12px 0; font-size: 15px; display: flex; align-items: center; gap: 10px; }
            .box { width: 18px; height: 18px; border: 2px solid #7B3E73; display: inline-block; border-radius: 4px; }
            .note { background: #FCF4F8; padding: 15px; border-radius: 12px; margin-top: 30px; font-style: italic; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>🌸 Sakhi AI Caregiver Kit</h1>
          <p><strong>First Period School Backpack Checklist (${lang === "en" ? "English" : "हिंदी"})</strong></p>
          <h2>🎒 Emergency Locker / Backpack Items</h2>
          <div class="item"><span class="box"></span> 2 Regular Organic Cotton Sanitary Pads</div>
          <div class="item"><span class="box"></span> 1 Spare pair of clean cotton underwear</div>
          <div class="item"><span class="box"></span> 1 Discrete waterproof ziploc pouch for soiled clothes</div>
          <div class="item"><span class="box"></span> 1 Pack unscented soothing intimate wipes</div>
          <div class="item"><span class="box"></span> 1 Small handwritten note with emergency contacts</div>
          <h2>🩺 Nurse Note Template</h2>
          <p><em>"Please allow [Student Name] restroom access or hot water bottle access for primary menstrual discomfort without penalty."</em></p>
          <div class="note">Printed from Sakhi AI Grounded Health Sanctuary. Clinically vetted for adolescent reassurance.</div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
      `);
      printableWindow.document.close();
    }
  };

  return (
    <div id="toolkits" className="mb-10">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-berry">
          <DownloadCloud size={13} />
          <span>FREE MULTI-FORMAT RESOURCES</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1">
          Downloadable Toolkits &amp; Audio Guidance
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Keep these handy offline on your phone or print them out for the refrigerator door.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Printable Period Tracker & School Checklist */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#EDE2E7] bg-white p-5 sm:p-6 shadow-2xs transition-all hover:border-berry/30 hover:shadow-md">
          <div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-berry/10 text-berry shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <span className="rounded-md bg-berry/10 px-2.5 py-0.5 text-[10px] font-bold text-berry">
                  Bilingual PDF (2.4 MB)
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-ink mt-1.5 leading-snug">
                  Printable Period Tracker &amp; School Checklist
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Illustrated color-in daily cycle tracker, mood stars, emergency locker supply checklist, and quick nurse note templates. Available in clean English and Hindi (हिंदी).
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleDownload("en")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F1F36] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#522947] active:scale-[0.98]"
            >
              <DownloadCloud size={13} />
              <span>Download PDF (English)</span>
            </button>
            <button
              onClick={() => handleDownload("hi")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50"
            >
              <span>हिंदी डाउनलोड</span>
            </button>
            {downloadSuccess && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 animate-fade-in">
                <CheckCircle2 size={13} /> Ready!
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Audio Guide Player (Interactive) */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#EDE2E7] bg-white p-5 sm:p-6 shadow-2xs transition-all hover:border-berry/30 hover:shadow-md">
          <div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-peach/40 text-rose-800 shrink-0">
                <Headphones size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="rounded-md bg-peach/40 px-2.5 py-0.5 text-[10px] font-bold text-rose-800">
                  Audio Companion (8 Mins)
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-ink mt-1.5 leading-snug">
                  Audio Guide: 5 Things Never to Say to a Girl Having Her First Period
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Narrated with gentle humor and psychologist insights. Learn what unintended hurt phrases like &ldquo;You&apos;re a woman now!&rdquo; can cause, and what to say instead.
                </p>
              </div>
            </div>
          </div>

          {/* Audio Scrubber Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3F1F36] text-white shadow-sm transition-all hover:bg-[#522947] active:scale-95 shrink-0"
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" fill="currentColor" />}
              </button>

              <div className="flex-1">
                {/* Progress bar */}
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  className="w-full accent-berry cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="rounded-lg p-2 text-slate-400 hover:text-ink transition-colors shrink-0"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
