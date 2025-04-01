import React, { useEffect, useState } from "react";
import {
  connector,
  ContainerProps,
} from "./container/download-app-button.container";
import { FormattedMessage } from "@/components/formatted-message/formatted-message";

const Wrapper: React.FC<ContainerProps> = (props) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if app is installed using multiple methods
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches || // Works on Android
      (navigator as any).standalone || // Works on iOS
      window.location.href.includes("utm_source=pwa"); // Optional: URL parameter fallback

    if (isInStandaloneMode) {
      setIsInstalled(true);
      return;
    }

    // Only add install prompt listener for non-iOS devices
    if (!isIOSDevice) {
      // Listen for install prompt
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
      });

      // Listen for successful install
      window.addEventListener("appinstalled", () => {
        setIsInstalled(true);
        setDeferredPrompt(null);
      });
    }
  }, []);

  const onInstall = async () => {
    props.onClick();

    if (isIOS) {
      return props.onOpenDownloadAppIOSModal();
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  // Don't show button if already installed or can't install (except for iOS)
  if (isInstalled || (!deferredPrompt && !isIOS)) return null;

  return (
    <button
      onClick={onInstall}
      className="text-sm text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded px-2 py-1.5 cursor-pointer outline-none"
    >
      <FormattedMessage id="download-app-ios-button/title" />
    </button>
  );
};

export const DownloadAppButton = connector(Wrapper);
