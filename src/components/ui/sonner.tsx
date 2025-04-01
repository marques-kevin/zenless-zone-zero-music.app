import React from "react";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast border-none group-[.toaster]:bg-zinc-700 group-[.toaster]:text-zinc-50 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-zinc-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
