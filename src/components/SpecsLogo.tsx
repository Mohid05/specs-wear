/** Reusable SPECS WEAR logo matching the business card style */
export default function SpecsLogo({ className = "", addTagline = false, variant = "header" }: { className?: string, addTagline?: boolean, variant?: "header" | "card" }) {
  // If in header, use primary color for text to match the theme.
  // If in card, use dark/blue colors because the background is yellow.
  const isHeader = variant === "header";

  const textColorClass = isHeader ? "text-primary" : "text-[#1E293B]";
  const badgeBgClass = isHeader ? "bg-blue-accent" : "bg-[#1D70B8]";
  const badgeTextClass = isHeader ? "text-primary-foreground" : "text-white";
  const iconColorClass = isHeader ? "text-blue-accent" : "text-[#1D70B8]";

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex items-center gap-1">
        {/* Text Container */}
        <div className="flex flex-col items-end pt-1">
          <span className={`font-display text-2xl font-bold tracking-tighter ${textColorClass}`} style={{ fontFamily: "Georgia, serif" }}>
            SPECS
          </span>
          <div className={`${badgeBgClass} px-1.5 py-0.5 mt-[-4px] mr-1`}>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${badgeTextClass} leading-none block`}>
              WEAR
            </span>
          </div>
        </div>

        {/* Realistic Glasses Icon */}
        <svg viewBox="0 0 100 40" className={`h-[35px] w-auto ml-[-6px] ${iconColorClass}`} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          {/* Left Lens Frame */}
          <path d="M 6.5,8 C 18,5 34,7 42,15 C 36,36 20,38 12,35 C 5,30 2,15 6.5,8 Z M 12.5,13.5 C 9,19 11,28 17,30 C 25,32 34,28 35,18 C 36,13 22,9.5 12.5,13.5 Z" />
          {/* Right Lens Frame */}
          <path d="M 93.5,8 C 82,5 66,7 58,15 C 64,36 80,38 88,35 C 95,30 98,15 93.5,8 Z M 87.5,13.5 C 91,19 89,28 83,30 C 75,32 66,28 65,18 C 64,13 78,9.5 87.5,13.5 Z" />
          {/* Bridge */}
          <path d="M 40,16 Q 50,11 60,16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          {/* Temples */}
          <path d="M 7,10 L 1,6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M 93,10 L 99,6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      {/* Tagline */}
      {addTagline && (
        <div className={`mt-3 flex items-center text-[7.5px] font-bold ${iconColorClass} tracking-[0.2em] uppercase`}>
          <span>SPECS WEAR</span>
          <span className={`mx-2 w-[2px] h-[10px] ${badgeBgClass} block`}></span>
          <span>SEE CLEAR</span>
        </div>
      )}
    </div>
  );
}
