import React from "react";
import { languagesAvailable } from "@/constants/langs";
import {
  connector,
  ContainerProps,
} from "./containers/select-language-modal.container";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { Drawer, DrawerContent, DrawerPortal } from "../ui/drawer";
import { ChevronDown } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { Link, useLocation } from "@reach/router";
export const Wrapper: React.FC<ContainerProps> = (props) => {
  const { isOpen } = useModal(MODAL_KEYS["change-language"]);
  const { search } = useLocation();

  return (
    <Drawer open={isOpen} onClose={props.onClose}>
      <DrawerPortal>
        <DrawerContent className="fixed bottom-0 px-8 pt-8 border-none left-0 right-0 flex h-[90%] flex-col rounded-md bg-zinc-900 z-50">
          <div className="relative max-w-md mx-auto mb-8">
            <div className="mx-auto  h-1.5 w-40 flex-shrink-0 rounded-full bg-zinc-700" />
          </div>

          <button
            onClick={props.onClose}
            className="absolute md:block hidden top-4 right-4"
          >
            <div className="flex items-center justify-end p-2 hover:bg-zinc-700 text-zinc-50 rounded-full">
              <ChevronDown className="h-6 w-6 text-zinc-400" />
            </div>
          </button>

          <div className="overflow-auto grid gap-4 md:mt-8 pb-8 md:grid-cols-4 max-w-2xl w-full mx-auto text-zinc-50">
            {languagesAvailable.map((lang) => (
              <Link
                to={`${
                  lang.id === "en" ? "/" + search : `/${lang.id}/` + search
                }`}
                key={lang.id}
                className="w-full flex items-center justify-normal cursor-pointer rounded py-2 px-2 hover:bg-zinc-800 font-medium outline-none transition-all duration-300 ease-in-out "
              >
                <img
                  className="block h-6 w-6 rounded"
                  src={`/flags/${lang.id}.svg`}
                />
                <div className="px-2">{lang.label}</div>
              </Link>
            ))}
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};

export const SelectLanguageModal = connector(Wrapper);
