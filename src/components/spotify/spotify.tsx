import React from "react";

export const Spotify: React.FC = () => {
  return (
    <>
      <div className="grid h-screen grid-rows-[auto,1fr,auto] dark bg-zinc-950 text-zinc-50">
        <div className="grid md:grid-cols-[auto,1fr,auto] gap-2 overflow-hidden px-2 md:pb-0 pb-[141px]">
          <div className="relative h-full rounded-md overflow-hidden">
            <div className="relative h-full overflow-auto"></div>
          </div>
        </div>
      </div>
    </>
  );
};
