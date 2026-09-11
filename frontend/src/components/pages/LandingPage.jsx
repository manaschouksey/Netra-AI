import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Copy, Check, Terminal, Shield, Zap, Eye, Lock, Cpu, Scan } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  const [copied, setCopied] = useState(false);

  const curlCommand = `curl -X POST https://netra-ai-backend-edb7.onrender.com/api/verify-document \\
  -F "document=@passport.jpg" \\
  -F "live_photo=@selfie.jpg"`;

  const handleCopy = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-14 flex flex-col gap-16 sm:gap-24 animate-fade-in">
      {/* 2-COLUMN HERO & INTERACTIVE COMMAND STUDIO */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* LEFT COLUMN: HERO CONTENT (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#362d59] bg-[#150f23] text-xs font-semibold uppercase tracking-[0.25px] text-[#79628c] w-fit">
            <span className="w-2 h-2 rounded-full bg-[#c2ef4e] animate-pulse-glow" />
            Smart Robot ID Checker
          </div>

          <h1 className="text-[36px] sm:text-[54px] md:text-[68px] font-bold text-[#ffffff] tracking-tight leading-[1.06] m-0">
            Stop fake IDs before they cause <span className="chip-lime-keyword">trouble</span>.
          </h1>

          <p className="text-[16px] sm:text-[19px] text-[#bdb8c0] max-w-[640px] leading-relaxed font-normal m-0">
            Upload any passport or ID card. Our smart robot reads the letters, inspects the picture, and tells you right away if it is 100% real or completely made up.
          </p>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap mt-2">
            <button
              type="button"
              onClick={() => onNavigate('Verify ID')}
              className="btn-inverted interactive-btn flex items-center justify-center gap-2.5 py-3.5 px-7 text-sm font-bold shadow-md cursor-pointer"
            >
              <span>Start Checking IDs</span>
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('Live Face Check')}
              className="btn-ghost-on-dark interactive-btn flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-bold cursor-pointer"
            >
              <span>Try Webcam Face Check</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: PRECISION TERMINAL CONSOLE (5 COLS) */}
        <div className="lg:col-span-5 w-full">
          <div className="rounded-2xl border border-[#362d59] bg-[#150f23] overflow-hidden shadow-xl">
            {/* TERMINAL TOPBAR */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1f1633] border-b border-[#362d59]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#fa7faa]/40 border border-[#fa7faa]/70" />
                <span className="w-3 h-3 rounded-full bg-[#c2ef4e]/40 border border-[#c2ef4e]/70" />
                <span className="w-3 h-3 rounded-full bg-[#79628c]/40 border border-[#79628c]/70" />
                <span className="ml-2 font-mono text-[11px] text-[#79628c] uppercase tracking-[0.2px]">
                  terminal // verify-document
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[11px] font-mono text-[#bdb8c0] hover:text-[#ffffff] bg-transparent border-none cursor-pointer transition-colors p-1"
                title="Copy curl command"
              >
                {copied ? <Check size={13} className="text-[#c2ef4e]" /> : <Copy size={13} />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            {/* TERMINAL BODY */}
            <div className="p-5 font-mono text-xs flex flex-col gap-4 overflow-x-auto">
              <div className="text-[#ffffff] leading-relaxed whitespace-pre">
                <span className="text-[#fa7faa]">curl</span> -X POST https://netra-ai-backend-edb7.onrender.com/api/verify-document \<br />
                {"  "}-F <span className="text-[#c2ef4e]">"document=@passport.jpg"</span> \<br />
                {"  "}-F <span className="text-[#c2ef4e]">"live_photo=@selfie.jpg"</span>
              </div>

              {/* RESPONSE DRAWER */}
              <div className="p-3.5 rounded-xl bg-[#1f1633] border border-[#362d59] flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#79628c]">
                  <span>HTTP 200 OK</span>
                  <span>184ms</span>
                </div>
                <div className="text-[#c2ef4e] text-xs font-mono leading-relaxed">
                  Response: &#123;"status": "AUTHENTIC", "safe": true, "matchScore": "98%"&#125;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTINUOUS ARCHITECTURE RIBBON (REPLACING VIBECODED 4 CARDS) */}
      <section className="rounded-2xl border border-[#362d59] bg-[#150f23] overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#362d59]">
          {/* SEGMENT 1 */}
          <div className="p-6 sm:p-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#79628c]">01 // API_GATEWAY</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f1633] text-[#c2ef4e] border border-[#362d59]">
                OPERATIONAL
              </span>
            </div>
            <h3 className="text-base font-bold text-[#ffffff] m-0">Live Backend API</h3>
            <p className="text-xs sm:text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              FastAPI endpoint processing multipart image streams with sub-second turnaround.
            </p>
          </div>

          {/* SEGMENT 2 */}
          <div className="p-6 sm:p-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#79628c]">02 // OCR_PIPELINE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f1633] text-[#c2ef4e] border border-[#362d59]">
                ACTIVE
              </span>
            </div>
            <h3 className="text-base font-bold text-[#ffffff] m-0">OCR Text Engine</h3>
            <p className="text-xs sm:text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              Extracts name, birth date, ID numbers &amp; MRZ checksums without manual typing.
            </p>
          </div>

          {/* SEGMENT 3 */}
          <div className="p-6 sm:p-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#79628c]">03 // BIOMETRIC_MATCH</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f1633] text-[#c2ef4e] border border-[#362d59]">
                READY
              </span>
            </div>
            <h3 className="text-base font-bold text-[#ffffff] m-0">Biometric Matcher</h3>
            <p className="text-xs sm:text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              WebAssembly TinyFace neural model compares card portrait to selfie feed.
            </p>
          </div>

          {/* SEGMENT 4 */}
          <div className="p-6 sm:p-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#79628c]">04 // SECURITY_RAM</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f1633] text-[#c2ef4e] border border-[#362d59]">
                ENFORCED
              </span>
            </div>
            <h3 className="text-base font-bold text-[#ffffff] m-0">Private &amp; Ephemeral</h3>
            <p className="text-xs sm:text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              Zero permanent storage. Documents and photos are analyzed in RAM and purged.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (STEP PIPELINE RUNWAY) */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-mono uppercase tracking-[0.25px] text-[#79628c]">
            VERIFICATION FLOW // PIPELINE
          </div>
          <h2 className="text-[28px] sm:text-[38px] font-bold text-[#ffffff] m-0">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-[#bdb8c0] m-0 font-normal">
            Checking an ID is as easy as 1, 2, 3.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* STEP 1 */}
          <div className="bg-[#150f23] border border-[#362d59] rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#1f1633] border border-[#362d59] text-sm font-mono font-bold grid place-items-center text-[#c2ef4e]">
              01
            </div>
            <h3 className="text-lg font-bold text-[#ffffff] m-0">Take a photo of the card</h3>
            <p className="text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              Snap a clean picture of any government plastic card — a passport, driver's license, or national ID.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="bg-[#150f23] border border-[#362d59] rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#1f1633] border border-[#362d59] text-sm font-mono font-bold grid place-items-center text-[#c2ef4e]">
              02
            </div>
            <h3 className="text-lg font-bold text-[#ffffff] m-0">Our robot inspects it</h3>
            <p className="text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              In one second, the computer reads every letter, checks if the photo was glued or changed, and looks at the face.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="bg-[#150f23] border border-[#362d59] rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#1f1633] border border-[#362d59] text-sm font-mono font-bold grid place-items-center text-[#c2ef4e]">
              03
            </div>
            <h3 className="text-lg font-bold text-[#ffffff] m-0">Green light means safe!</h3>
            <p className="text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              If the card is genuine, you get a big green checkmark. If someone is trying to trick you, an alarm warns you immediately.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT OUR ROBOT DOES (3 FORENSIC PILLARS) */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-mono uppercase tracking-[0.25px] text-[#79628c]">
            CORE CAPABILITIES // ROBOT ENGINE
          </div>
          <h2 className="text-[28px] sm:text-[38px] font-bold text-[#ffffff] m-0">
            What Our Robot Does
          </h2>
          <p className="text-sm sm:text-base text-[#bdb8c0] m-0 font-normal">
            Three superpowers in one box.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PILLAR 1 */}
          <div className="bg-[#150f23] border border-[#362d59] rounded-2xl p-7 flex flex-col gap-4">
            <span className="text-[11px] font-mono text-[#79628c]">PILLAR 01 // TEXT</span>
            <h3 className="text-lg font-bold text-[#ffffff] m-0">Reading Words (OCR)</h3>
            <p className="text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              Our computer reads the name, birth date, and ID numbers off the card. You don't have to type anything by hand ever again.
            </p>
          </div>

          {/* PILLAR 2 */}
          <div className="bg-[#150f23] border border-[#362d59] rounded-2xl p-7 flex flex-col gap-4">
            <span className="text-[11px] font-mono text-[#79628c]">PILLAR 02 // SPLICING</span>
            <h3 className="text-lg font-bold text-[#ffffff] m-0">Catching Trick Photos</h3>
            <p className="text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              If bad actors try to glue a new picture or change the birth year on Photoshop, our computer sees the secret cuts and rings the alarm.
            </p>
          </div>

          {/* PILLAR 3 */}
          <div className="bg-[#150f23] border border-[#362d59] rounded-2xl p-7 flex flex-col gap-4">
            <span className="text-[11px] font-mono text-[#79628c]">PILLAR 03 // BIOMETRICS</span>
            <h3 className="text-lg font-bold text-[#ffffff] m-0">Matching Faces</h3>
            <p className="text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              We compare the photo on the card with the real person standing right in front of you. 100% private: we never save your selfies.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM ACTION BANNER */}
      <section className="bg-[#150f23] border border-[#362d59] rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-[720px]">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#ffffff] m-0">
            Ready to test a card right now?
          </h2>
          <p className="text-sm sm:text-base text-[#bdb8c0] m-0 font-normal leading-relaxed">
            It takes 2 seconds and costs nothing to try. Upload a picture and watch the robot do its magic.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('Verify ID')}
          className="btn-inverted interactive-btn flex items-center justify-center gap-2 py-3.5 px-8 text-sm font-bold shrink-0 cursor-pointer shadow-lg w-full md:w-auto"
        >
          <span>Check an ID Right Now</span>
          <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}
