import { useEffect, useState } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Browser fires this when app meets install criteria
    const onBeforeInstall = (e) => {
      e.preventDefault();            // prevent auto-mini-infobar
      setDeferredPrompt(e);          // save for the click
      setVisible(true);              // show our button
    };

    const onInstalled = () => {
      setInstalled(true);
      setVisible(false);
      setDeferredPrompt(null);
      // Optional: toast “Installed!”
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    // outcome: 'accepted' | 'dismissed'
    setDeferredPrompt(null);
    setVisible(false);
  };

  // Hide if already installed or criteria not met yet
  if (!visible || installed) return null;

  return (
    <button
      onClick={handleInstall}
      style={{
        padding: '0.5rem 0.9rem',
        borderRadius: '0.5rem',
        border: '1px solid #0ea5e9',
        background: 'white',
        cursor: 'pointer'
      }}
      aria-label="Install Rail Watch"
      title="Install Rail Watch"
    >
      Install App
    </button>
  );
}
