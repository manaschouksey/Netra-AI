import React from 'react';
import { Eye, ShieldCheck, Cpu, ArrowRight, Lock, CheckCircle2, Scan } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="flex flex-col gap-14 sm:gap-20 max-w-[1152px] mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center gap-5 sm:gap-7 pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#362d59] bg-[#150f23] text-xs font-semibold uppercase tracking-[0.25px] text-[#79628c]">
          <span className="w-2 h-2 rounded-full bg-[#c2ef4e] animate-pulse-glow" />
          Smart Robot ID Checker
        </div>

        <h1 className="text-[34px] sm:text-[52px] md:text-[66px] font-bold text-[#ffffff] tracking-tight leading-[1.08] max-w-[920px]">
          Stop fake IDs before they cause <span className="chip-lime-keyword">trouble</span>.
        </h1>

        <p className="text-[15px] sm:text-[18px] md:text-[19px] text-[#bdb8c0] max-w-[680px] leading-relaxed font-normal">
          Upload any passport or ID card. Our smart robot reads the letters, inspects the picture, and tells you right away if it is 100% real or completely made up.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center mt-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onNavigate('Verify ID')}
            className="btn-inverted interactive-btn flex items-center justify-center gap-2 w-full sm:w-auto py-3 px-6 text-sm"
          >
            <span>Start Checking IDs</span>
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('Live Face Check')}
            className="btn-ghost-on-dark interactive-btn flex items-center justify-center gap-2 w-full sm:w-auto py-3 px-6 text-sm"
          >
            <span>Try Webcam Face Check</span>
          </button>
        </div>

        {/* TERMINAL CODE SNIPPET (Monaco font) */}
        <div className="w-full max-w-[640px] mt-4 text-left">
          <div className="rounded-lg border border-[#362d59] bg-[#150f23] p-4 text-xs font-mono overflow-x-auto shadow-sm">
            <div className="text-[#79628c] mb-2 select-none"># Verify any ID card in 1 second using simple curl command</div>
            <div className="text-[#ffffff] whitespace-pre">
              <span className="text-[#fa7faa]">curl</span> -X POST https://netra-ai-backend-edb7.onrender.com/api/verify-document \
            </div>
            <div className="text-[#ffffff] pl-4 whitespace-pre">
              -F <span className="text-[#c2ef4e]">"document=@passport.jpg"</span> \
            </div>
            <div className="text-[#ffffff] pl-4 whitespace-pre">
              -F <span className="text-[#c2ef4e]">"live_photo=@selfie.jpg"</span>
            </div>
            <div className="text-[#c2ef4e] mt-3 pt-2 border-t border-[#362d59] flex items-center gap-2">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>Response: &#123;"status": "AUTHENTIC", "safe": true, "matchScore": "98%"&#125;</span>
            </div>
          </div>
        </div>
      </section>

      {/* REAL ENGINE CAPABILITIES (100% REAL SYSTEM DATA, ZERO FAKE STATS) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 flex flex-col gap-2 interactive-card">
          <div className="flex items-center justify-between">
            <Scan size={18} className="text-[#c2ef4e]" />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f1633] text-[#c2ef4e] border border-[#362d59]">OPERATIONAL</span>
          </div>
          <div className="font-bold text-sm text-[#ffffff] mt-1">Live Backend API</div>
          <div className="text-xs text-[#bdb8c0] leading-relaxed">
            FastAPI endpoint processing multipart image streams with sub-second turnaround.
          </div>
        </div>

        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 flex flex-col gap-2 interactive-card">
          <div className="flex items-center justify-between">
            <Eye size={18} className="text-[#c2ef4e]" />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f1633] text-[#c2ef4e] border border-[#362d59]">ACTIVE</span>
          </div>
          <div className="font-bold text-sm text-[#ffffff] mt-1">OCR Text Engine</div>
          <div className="text-xs text-[#bdb8c0] leading-relaxed">
            Extracts name, birth date, ID numbers & MRZ checksums without manual typing.
          </div>
        </div>

        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 flex flex-col gap-2 interactive-card">
          <div className="flex items-center justify-between">
            <Cpu size={18} className="text-[#c2ef4e]" />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f1633] text-[#c2ef4e] border border-[#362d59]">READY</span>
          </div>
          <div className="font-bold text-sm text-[#ffffff] mt-1">Biometric Matcher</div>
          <div className="text-xs text-[#bdb8c0] leading-relaxed">
            WebAssembly TinyFace neural model compares card portrait to selfie feed.
          </div>
        </div>

        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 flex flex-col gap-2 interactive-card">
          <div className="flex items-center justify-between">
            <Lock size={18} className="text-[#c2ef4e]" />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f1633] text-[#c2ef4e] border border-[#362d59]">ENFORCED</span>
          </div>
          <div className="font-bold text-sm text-[#ffffff] mt-1">Private & Ephemeral</div>
          <div className="text-xs text-[#bdb8c0] leading-relaxed">
            Zero permanent storage. Documents and photos are analyzed in RAM and purged.
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (IN 3 SIMPLE STEPS FOR 5-YEAR-OLDS) */}
      <section className="flex flex-col gap-8">
        <div className="text-center flex flex-col items-center gap-2">
          <h2 className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.25px] text-[#79628c] m-0">
            How It Works
          </h2>
          <p className="text-[24px] sm:text-[32px] font-bold text-[#ffffff] m-0">
            Checking an ID is as easy as 1, 2, 3.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-3 interactive-card">
            <div className="w-10 h-10 rounded-lg bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#c2ef4e] font-bold text-base">
              1
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[#ffffff] m-0">Take a photo of the card</h3>
            <p className="text-xs sm:text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              Snap a clean picture of any government plastic card — a passport, driver's license, or national ID.
            </p>
          </div>

          <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-3 interactive-card">
            <div className="w-10 h-10 rounded-lg bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#c2ef4e] font-bold text-base">
              2
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[#ffffff] m-0">Our robot inspects it</h3>
            <p className="text-xs sm:text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              In one second, the computer reads every letter, checks if the photo was glued or changed, and looks at the face.
            </p>
          </div>

          <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-3 interactive-card">
            <div className="w-10 h-10 rounded-lg bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#c2ef4e] font-bold text-base">
              3
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[#ffffff] m-0">Green light means safe!</h3>
            <p className="text-xs sm:text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              If the card is genuine, you get a big green checkmark. If someone is trying to trick you, an alarm warns you immediately.
            </p>
          </div>
        </div>
      </section>

      {/* 3 FEATURE SPOTLIGHT CARDS */}
      <section className="flex flex-col gap-8">
        <div className="text-center flex flex-col items-center gap-2">
          <h2 className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.25px] text-[#79628c] m-0">
            What Our Robot Does
          </h2>
          <p className="text-[24px] sm:text-[32px] font-bold text-[#ffffff] m-0">
            Three superpowers in one box.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-4 interactive-card">
            <div className="w-11 h-11 rounded-lg bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#c2ef4e]">
              <Eye size={22} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#ffffff] mb-1.5">Reading Words (OCR)</h3>
              <p className="text-xs sm:text-sm text-[#bdb8c0] leading-relaxed font-normal">
                Our computer reads the name, birth date, and ID numbers off the card. You don't have to type anything by hand ever again.
              </p>
            </div>
          </div>

          <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-4 interactive-card">
            <div className="w-11 h-11 rounded-lg bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#fa7faa]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#ffffff] mb-1.5">Catching Trick Photos</h3>
              <p className="text-xs sm:text-sm text-[#bdb8c0] leading-relaxed font-normal">
                If bad actors try to glue a new picture or change the birth year on Photoshop, our computer sees the secret cuts and rings the alarm.
              </p>
            </div>
          </div>

          <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-4 interactive-card">
            <div className="w-11 h-11 rounded-lg bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#c2ef4e]">
              <Cpu size={22} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#ffffff] mb-1.5">Matching Faces</h3>
              <p className="text-xs sm:text-sm text-[#bdb8c0] leading-relaxed font-normal">
                We compare the photo on the card with the real person standing right in front of you. 100% private: we never save your selfies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CALL TO ACTION */}
      <section className="bg-[#150f23] border border-[#362d59] rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center gap-4">
        <h2 className="text-[26px] sm:text-[34px] font-bold text-[#ffffff] m-0">
          Ready to test a card right now?
        </h2>
        <p className="text-xs sm:text-sm text-[#bdb8c0] max-w-[560px] m-0 font-normal leading-relaxed">
          It takes 2 seconds and costs nothing to try. Upload a picture and watch the robot do its magic.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('Verify ID')}
          className="btn-inverted interactive-btn flex items-center gap-2 mt-2 text-sm py-3 px-6"
        >
          <span>Check an ID Right Now</span>
          <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}
