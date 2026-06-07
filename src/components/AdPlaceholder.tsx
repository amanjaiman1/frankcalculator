export default function AdPlaceholder({ className = '' }: { className?: string }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm flex items-center justify-center ${className}`}
    >
      {/* Faint grid texture */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      {/* Soft corner glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 bg-electric-blue/10 blur-2xl pointer-events-none" />

      <div className="relative flex flex-col items-center gap-1 text-center">
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-electric-blue/60" />
          Ad Space
        </span>
        <span className="text-[11px] text-gray-600">Advertisement</span>
      </div>
    </div>
  );
}
