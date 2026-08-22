export function VideoPlaceholderBlock() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full h-[180px] sm:h-[220px] lg:h-[260px] bg-black border-b border-white/10 overflow-hidden"
    >
      {/* Architectural Grid Line Container matching the site */}
      <div className="relative z-10 max-w-[1820px] h-full mx-auto border-l border-r border-white/10 pointer-events-none" />
    </div>
  );
}
