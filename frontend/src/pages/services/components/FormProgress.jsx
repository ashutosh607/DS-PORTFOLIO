import React from 'react';

export default function FormProgress({ currentStep, onPrevStep, onReset, onSelectStep }) {
  const steps = [
    { num: 1, label: 'About You' },
    { num: 2, label: 'Your Event' },
    { num: 3, label: 'Your Vision' },
  ];

  return (
    <div className="w-full border-b border-[#E0D8CB] bg-[#FAF9F6]/90 backdrop-blur-md py-4 px-4 sm:px-8 mb-10">
      <div className="container mx-auto max-w-[1240px] flex items-center justify-between">

        {/* Center: Persistent Step Indicators */}
        <div className="flex items-center gap-6 sm:gap-12 mx-auto">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isActive = currentStep === s.num;

            return (
              <div
                key={s.num}
                onClick={() => {
                  if (isCompleted && onSelectStep) {
                    onSelectStep(s.num);
                  }
                }}
                className={`relative flex items-center gap-2 pb-1.5 transition-colors select-none ${
                  isCompleted ? 'cursor-pointer hover:text-[#1E1B18]' : ''
                } ${
                  isActive
                    ? 'text-[#1E1B18] font-bold'
                    : isCompleted
                    ? 'text-[#58483B] font-medium'
                    : 'text-[#8C8070] font-normal'
                }`}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                {/* Number or Checkmark */}
                {isCompleted ? (
                  <span className="text-xs font-bold text-[#685444]">✓</span>
                ) : (
                  <span className="font-mono text-xs font-medium">0{s.num}</span>
                )}
                <span>{s.label}</span>

                {/* Underline for active */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1E1B18] rounded-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Back button & Close */}
        <div className="flex items-center gap-4 text-xs font-mono font-medium tracking-wider text-[#3D372E]">
          {currentStep > 1 && (
            <button
              onClick={onPrevStep}
              className="hover:text-black transition-colors cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EFE9DE] hover:bg-[#E2D8C9]"
            >
              <span>←</span>
              <span>Back</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="hover:text-black transition-colors cursor-pointer text-sm px-2.5 py-1 rounded bg-[#EFE9DE] hover:bg-[#E2D8C9]"
            aria-label="Cancel and return to top"
          >
            ✕
          </button>
        </div>

      </div>
    </div>
  );
}
