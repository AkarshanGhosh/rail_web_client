// src/pages/Home.jsx
import React from "react";
import Body from "../components/home/body";

function InstallPWAFab() {
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [visible, setVisible] = React.useState(false);
  const [installed, setInstalled] = React.useState(false);

  // iOS detection + standalone check (iOS Safari has no programmatic prompt)
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone =
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    // old iOS Safari flag
    (window.navigator).standalone;

  React.useEffect(() => {
    const onBeforeInstall = (e) => {
      // Chrome/Edge/Android fire this when criteria are met
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    const onInstalled = () => {
      setInstalled(true);
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // If already running as an installed app, hide the button
    if (isStandalone) {
      setInstalled(true);
      setVisible(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [isStandalone]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice; // { outcome: 'accepted' | 'dismissed' }
    setDeferredPrompt(null);
    setVisible(false);
  };

  // iOS: show a non-blocking tip if not installed
  if (isIos && !isStandalone) {
    return (
      <div className="fixed bottom-5 right-5 z-50 max-w-xs rounded-xl border border-sky-300 bg-white p-3 text-sky-700 shadow-lg">
        <p className="text-sm">
          On iPhone/iPad: open Safari → <b>Share</b> → <b>Add to Home Screen</b>
        </p>
      </div>
    );
  }

  // Other platforms: show install button only when eligible
  if (!visible || installed) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-5 right-5 z-50 rounded-xl border border-sky-500 bg-white px-4 py-2 text-sky-600 shadow-md hover:bg-sky-50 focus:outline-none"
      aria-label="Install Rail Watch"
      title="Install Rail Watch"
    >
      Install App
    </button>
  );
}

const Home = () => {
  return (
    <div className="bg-white text-white px-10 py-8 min-h-screen">
      <Body />
      {/* PWA install button / iOS tip */}
      <InstallPWAFab />
    </div>
  );
};

export default Home;
