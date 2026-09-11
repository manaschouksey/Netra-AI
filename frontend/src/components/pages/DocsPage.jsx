import React from 'react';
import { BookOpen, CheckCircle2, AlertTriangle, Code, ArrowRight } from 'lucide-react';

export default function DocsPage({ onNavigate }) {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 max-w-[1152px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
      {/* PAGE HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#362d59] bg-[#150f23] text-xs font-semibold uppercase tracking-[0.25px] text-[#79628c] mb-3">
          <span className="w-2 h-2 rounded-full bg-[#c2ef4e]" />
          Simple Guide & Developer Docs
        </div>
        <h1 className="text-[32px] md:text-[40px] font-bold text-[#ffffff] tracking-tight m-0">
          How to Check <span className="chip-lime-keyword">IDs</span> in Seconds
        </h1>
        <p className="text-sm md:text-base text-[#bdb8c0] max-w-[680px] mt-2 font-normal leading-relaxed">
          Everything you need to know about checking cards, understanding green versus pink signals, and connecting Netra AI to your own website.
        </p>
      </div>

      {/* SECTION 1: THE 3 COLOR SIGNALS (SUPER EASY EXPLANATION) */}
      <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 md:p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-[#ffffff] m-0">The 3 Color Signals (Super Easy!)</h2>
          <p className="text-xs text-[#bdb8c0] mt-1 m-0">
            Whenever our robot checks an ID, it gives you one of these three simple lights:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-lg border border-[#362d59] p-5 bg-[#1f1633] flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2px] text-[#c2ef4e]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c2ef4e]" />
              Bright Green = Safe!
            </div>
            <h3 className="text-sm font-semibold text-[#ffffff] m-0">Authentic Card</h3>
            <p className="text-xs text-[#bdb8c0] leading-relaxed m-0 font-normal">
              The words match the government records, the photo has zero cuts or glue marks, and the person's face matches the card. You can safely let them in.
            </p>
          </div>

          <div className="rounded-lg border border-[#362d59] p-5 bg-[#1f1633] flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2px] text-[#79628c]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#79628c]" />
              Violet = Look Closer!
            </div>
            <h3 className="text-sm font-semibold text-[#ffffff] m-0">Manual Review</h3>
            <p className="text-xs text-[#bdb8c0] leading-relaxed m-0 font-normal">
              The card picture might be slightly blurry or has bad lighting. A human officer should look at the card for a quick second before deciding.
            </p>
          </div>

          <div className="rounded-lg border border-[#362d59] p-5 bg-[#1f1633] flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2px] text-[#fa7faa]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fa7faa]" />
              Hot Pink = Danger!
            </div>
            <h3 className="text-sm font-semibold text-[#ffffff] m-0">Fake ID Detected</h3>
            <p className="text-xs text-[#bdb8c0] leading-relaxed m-0 font-normal">
              Someone glued a new picture, edited the birth date in Photoshop, or the person standing there is not the person on the card. Do not accept this card!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: DEVELOPER QUICK-CONNECT (MONACO CODE BLOCK) */}
      <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 md:p-8 flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#ffffff] m-0">Connect to Your Website or App</h2>
            <p className="text-xs text-[#bdb8c0] mt-1 m-0">
              Send a picture to our server and get the result back in JSON.
            </p>
          </div>
          <span className="font-mono text-xs text-[#79628c]">REST API v1</span>
        </div>

        <div className="rounded-md border border-[#362d59] bg-[#1f1633] p-4 text-xs font-mono overflow-x-auto text-[#ffffff]">
          <div className="text-[#79628c] mb-2">// 1. Send the government card and selfie to our endpoint</div>
          <div><span className="text-[#fa7faa]">const</span> formData = <span className="text-[#fa7faa]">new</span> FormData();</div>
          <div>formData.append(<span className="text-[#c2ef4e]">"document"</span>, idCardFile);</div>
          <div>formData.append(<span className="text-[#c2ef4e]">"live_photo"</span>, selfieFile);</div>
          <br />
          <div><span className="text-[#fa7faa]">const</span> res = <span className="text-[#fa7faa]">await</span> fetch(<span className="text-[#c2ef4e]">"https://netra-ai-backend-edb7.onrender.com/api/verify-document"</span>, &#123;</div>
          <div className="pl-4">method: <span className="text-[#c2ef4e]">"POST"</span>,</div>
          <div className="pl-4">body: formData,</div>
          <div>&#125;);</div>
          <br />
          <div><span className="text-[#fa7faa]">const</span> data = <span className="text-[#fa7faa]">await</span> res.json();</div>
          <div className="text-[#c2ef4e]">console.log(data.status); // Output: "AUTHENTIC" or "REJECT"</div>
        </div>
      </section>

      {/* SECTION 3: TEST SAMPLES YOU CAN TRY */}
      <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 md:p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-[#ffffff] m-0">What Government IDs Are Supported?</h2>
          <p className="text-xs text-[#bdb8c0] mt-1 m-0">
            Our robot knows how to read all standard government documents:
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="rounded-md border border-[#362d59] p-4 bg-[#1f1633]">
            <div className="font-bold text-[#ffffff]">Passports</div>
            <div className="text-[#bdb8c0] mt-1">Reads MRZ lines & photo page</div>
          </div>
          <div className="rounded-md border border-[#362d59] p-4 bg-[#1f1633]">
            <div className="font-bold text-[#ffffff]">Aadhaar Cards</div>
            <div className="text-[#bdb8c0] mt-1">Checks UIDAI layout & numbers</div>
          </div>
          <div className="rounded-md border border-[#362d59] p-4 bg-[#1f1633]">
            <div className="font-bold text-[#ffffff]">Driver's Licenses</div>
            <div className="text-[#bdb8c0] mt-1">Reads state numbers & expiration</div>
          </div>
          <div className="rounded-md border border-[#362d59] p-4 bg-[#1f1633]">
            <div className="font-bold text-[#ffffff]">National IDs & Voter</div>
            <div className="text-[#bdb8c0] mt-1">Verifies official holographic seal</div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate('Verify ID')}
            className="btn-inverted flex items-center gap-2"
          >
            <span>Go to ID Verifier Console</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
