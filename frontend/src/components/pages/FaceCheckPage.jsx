import React from 'react';
import FaceDetector from '../face-detector/FaceDetector';
import { Camera, Sun, Smile, ShieldCheck } from 'lucide-react';

export default function FaceCheckPage({ faceResult, onFaceResult }) {
  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-[1152px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
      {/* PAGE HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#362d59] bg-[#150f23] text-xs font-semibold uppercase tracking-[0.25px] text-[#79628c] mb-3">
          <span className="w-2 h-2 rounded-full bg-[#c2ef4e]" />
          Real-Time Webcam Scanner
        </div>
        <h1 className="text-[32px] md:text-[40px] font-bold text-[#ffffff] tracking-tight m-0">
          Live Webcam <span className="chip-lime-keyword">Face Check</span>
        </h1>
        <p className="text-sm md:text-base text-[#bdb8c0] max-w-[680px] mt-2 font-normal leading-relaxed">
          Look straight into your camera! Our smart computer eye will find your face and draw a bright green box around it in real time. We never save or record your photos.
        </p>
      </div>

      {/* WEBCAM DETECTOR CONTAINER */}
      <section className="bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col items-center gap-5">
        {faceResult?.detected && (
          <div className="w-full max-w-[640px] px-4 py-3 rounded-md bg-[#1f1633] border border-[#c2ef4e] text-[#c2ef4e] text-xs font-semibold uppercase tracking-[0.2px] flex items-center justify-between">
            <span>✓ Found {faceResult.faceCount || 1} face in camera</span>
            <span className="font-mono">{Math.round((faceResult.confidence || 0) * 100)}% match</span>
          </div>
        )}

        <div className="w-full flex justify-center">
          <FaceDetector onResult={onFaceResult} autoStart={false} />
        </div>
      </section>

      {/* 3 FRIENDLY TIPS (IN SIMPLE 5-YEAR-OLD ENGLISH) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-md bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#c2ef4e]">
            <Sun size={20} />
          </div>
          <h3 className="text-sm font-semibold text-[#ffffff] m-0">Turn on the lights</h3>
          <p className="text-xs text-[#bdb8c0] leading-relaxed m-0 font-normal">
            Make sure your room has bright light so the camera can clearly see your eyes and nose.
          </p>
        </div>

        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-md bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#c2ef4e]">
            <Smile size={20} />
          </div>
          <h3 className="text-sm font-semibold text-[#ffffff] m-0">Look straight ahead</h3>
          <p className="text-xs text-[#bdb8c0] leading-relaxed m-0 font-normal">
            Look directly at the tiny camera circle at the top of your screen. Take off dark sunglasses.
          </p>
        </div>

        <div className="bg-[#150f23] border border-[#362d59] rounded-xl p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-md bg-[#1f1633] border border-[#362d59] grid place-items-center text-[#c2ef4e]">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-sm font-semibold text-[#ffffff] m-0">100% Private</h3>
          <p className="text-xs text-[#bdb8c0] leading-relaxed m-0 font-normal">
            Your webcam feed runs only on your computer. No pictures are ever saved on any secret server.
          </p>
        </div>
      </section>
    </div>
  );
}
