// "use client";

const Fallback = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div
        className="absolute top-[7vw] md:top-[15vw] lg:top-[-10vw] left-1/2 -translate-x-1/2
               w-[200vw] h-[200vw] md:w-[100vw] md:h-[100vw]
               rounded-full pointer-events-none opacity-40 z-0"
      />
      <div className="relative z-10 fade-soft"></div>
    </div>
  );
};

export default Fallback;
