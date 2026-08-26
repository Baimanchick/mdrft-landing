import Image from "next/image";

export function Bmw5ReelSection() {
  return (
    <section className="relative w-full h-[260px] min-[480px]:h-[320px] sm:h-[480px] lg:h-[620px] bg-black border-b border-white/10 overflow-hidden">
      <Image
        src="/images/13513.webp"
        alt="BMW M Drift School"
        fill
        sizes="(min-width: 1820px) 1820px, 100vw"
        className="object-cover object-center select-none"
      />

      <div className="relative z-10 max-w-[1820px] h-full mx-auto border-l border-r border-white/10 pointer-events-none" />
    </section>
  );
}
