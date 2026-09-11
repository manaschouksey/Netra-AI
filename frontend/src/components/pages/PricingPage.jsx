import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingPage({ onNavigate }) {
  return (
    <div className="flex flex-col gap-12 max-w-[1152px] mx-auto w-full px-6 py-8">
      {/* PAGE HEADER */}
      <div className="text-center flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#362d59] bg-[#150f23] text-xs font-semibold uppercase tracking-[0.25px] text-[#79628c]">
          <span className="w-2 h-2 rounded-full bg-[#c2ef4e]" />
          Simple, Honest Pricing
        </div>
        <h1 className="text-[36px] md:text-[48px] font-bold text-[#ffffff] tracking-tight m-0">
          Pick a plan that fits your <span className="chip-lime-keyword">team</span>.
        </h1>
        <p className="text-sm md:text-base text-[#bdb8c0] max-w-[600px] m-0 font-normal leading-relaxed">
          No hidden fees, no tricky contracts. Pay only for the ID cards you check.
        </p>
      </div>

      {/* 4 PRICING TIERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {/* TIER 1: STARTER */}
        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col justify-between gap-6">
          <div>
            <h2 className="text-base font-bold text-[#ffffff] m-0">Starter</h2>
            <p className="text-xs text-[#79628c] mt-1 m-0">For trying things out</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#ffffff]">$0</span>
              <span className="text-xs text-[#bdb8c0]">/ month</span>
            </div>
            <ul className="mt-6 flex flex-col gap-3 text-xs text-[#bdb8c0] list-none p-0 m-0">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>50 free card checks every month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>Reads words on the card (OCR)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>Webcam face check demo</span>
              </li>
              <li className="flex items-center gap-2 text-[#79628c]">
                <span>— No history saving</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('Verify ID')}
            className="btn-ghost-on-dark w-full text-center"
          >
            Start Free
          </button>
        </div>

        {/* TIER 2: TEAM */}
        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col justify-between gap-6">
          <div>
            <h2 className="text-base font-bold text-[#ffffff] m-0">Small Team</h2>
            <p className="text-xs text-[#79628c] mt-1 m-0">For clubs, hotels & shops</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#ffffff]">$26</span>
              <span className="text-xs text-[#bdb8c0]">/ month</span>
            </div>
            <ul className="mt-6 flex flex-col gap-3 text-xs text-[#bdb8c0] list-none p-0 m-0">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>1,000 card checks every month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>Glue and photo tamper detection</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>Save 30 days of scan history</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>Email help within 24 hours</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('Verify ID')}
            className="btn-ghost-on-dark w-full text-center"
          >
            Choose Team
          </button>
        </div>

        {/* TIER 3: BUSINESS (FEATURED INVERTED CARD PER DESIGN.MD) */}
        <div className="bg-[#150f23] border-2 border-[#c2ef4e] rounded-xl p-6 flex flex-col justify-between gap-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="chip-lime-keyword text-[11px] uppercase tracking-[0.2px] py-0.5">
              Most Popular
            </span>
          </div>
          <div>
            <h2 className="text-base font-bold text-[#ffffff] m-0">Business</h2>
            <p className="text-xs text-[#79628c] mt-1 m-0">For busy airports & banks</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#ffffff]">$80</span>
              <span className="text-xs text-[#bdb8c0]">/ month</span>
            </div>
            <ul className="mt-6 flex flex-col gap-3 text-xs text-[#bdb8c0] list-none p-0 m-0">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>Unlimited card checks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>Super-fast 1-second server speed</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>Loud alarm on fake / stolen IDs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>Download official PDF proof reports</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>Priority 24/7 engineer support</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('Verify ID')}
            className="btn-inverted w-full text-center"
          >
            Start Business Trial
          </button>
        </div>

        {/* TIER 4: ENTERPRISE */}
        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col justify-between gap-6">
          <div>
            <h2 className="text-base font-bold text-[#ffffff] m-0">Enterprise</h2>
            <p className="text-xs text-[#79628c] mt-1 m-0">For governments & borders</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#ffffff]">Custom</span>
            </div>
            <ul className="mt-6 flex flex-col gap-3 text-xs text-[#bdb8c0] list-none p-0 m-0">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>Teach the robot rare country IDs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>Run completely on your private servers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>Direct phone number to our engineers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#c2ef4e] shrink-0" />
                <span>99.99% uptime safety guarantee</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('Docs')}
            className="btn-ghost-on-dark w-full text-center"
          >
            Contact Engineers
          </button>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS (PLAIN 5YO ENGLISH) */}
      <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-8 flex flex-col gap-6 mt-4">
        <h3 className="text-lg font-bold text-[#ffffff] m-0">
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <h4 className="text-sm font-semibold text-[#ffffff] m-0">Can I cancel anytime?</h4>
            <p className="text-xs text-[#bdb8c0] leading-relaxed m-0 font-normal">
              Yes! You can stop with one click at any moment. You will never be billed again.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="text-sm font-semibold text-[#ffffff] m-0">Do you save pictures?</h4>
            <p className="text-xs text-[#bdb8c0] leading-relaxed m-0 font-normal">
              No. Once the robot finishes inspecting the card, the images vanish forever.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="text-sm font-semibold text-[#ffffff] m-0">Does it cost extra for fake IDs?</h4>
            <p className="text-xs text-[#bdb8c0] leading-relaxed m-0 font-normal">
              No extra charge! Every scan costs the same low price, whether the card is real or fake.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
