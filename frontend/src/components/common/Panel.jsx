export default function Panel({ title, eyebrow, action, className = '', children }) {
  return (
    <section className={`bg-[#150f23] border border-[#362d59] rounded-xl p-6 flex flex-col gap-4 min-w-0 ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3">
          <div>
            {eyebrow && (
              <div className="font-sans text-[11px] font-semibold tracking-[0.25px] uppercase text-[#79628c] mb-1">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="font-sans text-[18px] font-semibold text-[#ffffff] m-0 leading-tight">
                {title}
              </h2>
            )}
          </div>
          {action}
        </header>
      )}
      <div className="min-w-0">{children}</div>
    </section>
  );
}
