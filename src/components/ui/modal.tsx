import { Drawer } from "vaul";
import React from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import clsx from "clsx";

export const ModalTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-2xl font-medium">{children}</div>;
};

export const ModalDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="text-zinc-400">{children}</div>;
};

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = (props) => {
  return (
    <Drawer.Root open={props.isOpen} onClose={props.onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-zinc-900/90 z-50" />
        <Drawer.Content className="fixed outline-none max-w-lg shadow-xl bottom-0 pt-8 left-0 right-0 z-50 flex mx-auto h-[100dvh] flex-col text-zinc-50">
          <VisuallyHidden>
            <Drawer.Title>Modal</Drawer.Title>
            <Drawer.Description>Modal</Drawer.Description>
          </VisuallyHidden>
          <div
            className={clsx(
              "flex-1 px-8 overflow-auto pt-4 pb-8 rounded-lg bg-zinc-800"
            )}
          >
            <div className="mx-auto mb-8 h-1.5 w-40 flex-shrink-0 rounded-full bg-zinc-700" />

            {props.children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
