import React from "react";

export const PlayingAnimationBars: React.FC = () => {
  return (
    <div className="flex playing-animation items-end gap-0.5 absolute bottom-1 right-1">
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );
};
