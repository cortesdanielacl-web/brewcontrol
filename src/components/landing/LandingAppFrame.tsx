import React from 'react';

interface LandingAppFrameProps {
  children: React.ReactNode;
}

export const LandingAppFrame: React.FC<LandingAppFrameProps> = ({ children }) => {
  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-3xl border border-bc-border bg-white bc-shadow">
        <div className="flex items-center gap-2 border-b border-bc-border bg-bc-gray-light px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-3 text-xs font-medium text-bc-muted">app.brewcontrol.cl</span>
        </div>

        {children}
      </div>
    </div>
  );
};
