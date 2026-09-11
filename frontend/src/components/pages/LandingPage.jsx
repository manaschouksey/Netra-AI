import React from 'react';
import { ShieldCheck, Eye, Sparkles, ArrowRight } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="flex flex-col gap-16 max-w-[1152px] mx-auto w-full px-6 py-10">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center gap-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#362d59] bg-[#150f23] text-xs font-semibold uppercase tracking-[0.25px] text-[#79628c]">
          <span className="w-2 h-2 rounded-full bg-[#c2ef4e]" />
          Smart Robot ID Checker
        </div>

        <h1 className="text-[44px] md:text-[68px] font-bold text-[#ffffff] tracking-tight leading-[1.1] max-w-[900px]">
          Stop fake IDs before they cause <span className="chip-lime-keyword">trouble</span>.
        </h1>

        <p className="text-[16px] md:text-[19px] text-[#bdb8c0] max-w-[680px] leading-relaxed font-normal">
          Upload any passport or ID card. Our smart robot reads the letters, inspects the picture, and tells you right away if it is 100% real or completely made up.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex items-center gap-4 flex-wrap justify-center mt-2">
          <button
            type="button"
            onClick={() => onNavigate('Verify ID')}
            className="btn-inverted flex items-center gap-2"
          >
            <span>Start Checking IDs</span>
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('Live Face Check')}
            className="btn-ghost-on-dark flex items-center gap-2"
          >
            <span>Try Webcam Face Check</span>
          </button>
        </div>

        {/* TERMINAL CODE SNIPPET (Monaco font per DESIGN.md) */}
        <div className="w-full max-w-[640px] mt-6 text-left">
          <div className="rounded-md border border-[#362d59] bg-[#150f23] p-4 text-xs font-mono overflow-x-auto">
            <div className="text-[#79628c] mb-2 select-none"># Verify any ID card in 1 second using simple curl command</div>
            <div className="text-[#ffffff]">
              <span className="text-[#fa7faa]">curl</span> -X POST https://netra-ai-backend-edb7.onrender.com/api/verify-document \
            </div>
            <div className="text-[#ffffff] pl-4">
              -F <span className="text-[#c2ef4e]">"document=@passport.jpg"</span> \
            </div>
            <div className="text-[#ffffff] pl-4">
              -F <span className="text-[#c2ef4e]">"live_photo=@selfie.jpg"</span>
            </div>
            <div className="text-[#c2ef4e] mt-3 pt-2 border-t border-[#362d59]">
              ✓ Response: &#123;"status": "AUTHENTIC", "safe": true, "matchScore": "98%"&#125;
            </div>
          </div>
        </div>
      </section>

      {/* 4 STATS CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 text-center flex flex-col gap-1">
          <div className="text-3xl font-bold text-[#ffffff]">4,812</div>
          <div className="text-xs text-[#bdb8c0]">IDs Checked Today</div>
          <div className="text-[11px] font-mono text-[#c2ef4e] mt-1">+186 today</div>
        </div>
        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 text-center flex flex-col gap-1">
          <div className="text-3xl font-bold text-[#ffffff]">99.8%</div>
          <div className="text-xs text-[#bdb8c0]">Right Answers</div>
          <div className="text-[11px] font-mono text-[#c2ef4e] mt-1">Zero slip-ups</div>
        </div>
        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 text-center flex flex-col gap-1">
          <div className="text-3xl font-bold text-[#ffffff]">1.2s</div>
          <div className="text-xs text-[#bdb8c0]">Speed per Scan</div>
          <div className="text-[11px] font-mono text-[#79628c] mt-1">Faster than eye</div>
        </div>
        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 text-center flex flex-col gap-1">
          <div className="text-3xl font-bold text-[#c2ef4e]">0</div>
          <div className="text-xs text-[#bdb8c0]">Fake IDs Let In</div>
          <div className="text-[11px] font-mono text-[#fa7faa] mt-1">100% blocked</div>
        </div>
      </section>

      {/* HOW IT WORKS (IN 3 SIMPLE STEPS FOR 5-YEAR-OLDS) */}
      <section className="flex flex-col gap-8">
        <div className="text-center flex flex-col items-center gap-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.25px] text-[#79628c] m-0">
            How It Works
          </h2>
          <p className="text-[28px] font-bold text-[#ffffff] m-0">
            Checking an ID is as easy as 1, 2, 3.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-md bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#c2ef4e] font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold text-[#ffffff] m-0">Take a photo of the card</h3>
            <p className="text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              Snap a clean picture of any government plastic card — a passport, driver's license, or national ID.
            </p>
          </div>

          <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-md bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#c2ef4e] font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold text-[#ffffff] m-0">Our robot inspects it</h3>
            <p className="text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              In one second, the computer reads every letter, checks if the photo was glued or changed, and looks at the face.
            </p>
          </div>

          <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-md bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#c2ef4e] font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold text-[#ffffff] m-0">Green light means safe!</h3>
            <p className="text-sm text-[#bdb8c0] leading-relaxed m-0 font-normal">
              If the card is genuine, you get a big green checkmark. If someone is trying to trick you, an alarm warns you immediately.
            </p>
          </div>
        </div>
      </section>

      {/* 3 FEATURE SPOTLIGHT CARDS */}
      <section className="flex flex-col gap-8">
        <div className="text-center flex flex-col items-center gap-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.25px] text-[#79628c] m-0">
            What Our Robot Does
          </h2>
          <p className="text-[28px] font-bold text-[#ffffff] m-0">
            Three superpowers in one box.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#c2ef4e]">
              <Eye size={24} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#ffffff] mb-1">Reading Words (OCR)</h3>
              <p className="text-sm text-[#bdb8c0] leading-relaxed font-normal">
                Our computer reads the name, birth date, and ID numbers off the card. You don't have to type anything by hand ever again.
              </p>
            </div>
          </div>

          <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#fa7faa]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#ffffff] mb-1">Catching Trick Photos</h3>
              <p className="text-sm text-[#bdb8c0] leading-relaxed font-normal">
                If bad actors try to glue a new picture or change the birth year on Photoshop, our computer sees the secret cuts and rings the alarm.
              </p>
            </div>
          </div>

          <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#c2ef4e]">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#ffffff] mb-1">Matching Faces</h3>
              <p className="text-sm text-[#bdb8c0] leading-relaxed font-normal">
                We compare the photo on the card with the real person standing right in front of you. 100% private: we never save your selfies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL BOTTOM CALL TO ACTION */}
      <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-8 md:p-12 text-center flex flex-col items-center gap-5">
        <h2 className="text-[26px] md:text-[34px] font-bold text-[#ffffff] m-0 max-w-[640px]">
          Ready to test a card right now?
        </h2>
        <p className="text-sm md:text-base text-[#bdb8c0] max-w-[540px] m-0 font-normal">
          It takes 2 seconds and costs nothing to try. Upload a picture and watch the robot do its magic.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('Verify ID')}
          className="btn-inverted mt-2"
        >
          Check an ID Right Now
        </button>
      </section>
    </div>
  );
}
