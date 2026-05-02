import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "preptrack_install_dismissed";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) {
      setDismissed(true);
      return;
    }
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore — iOS Safari
      window.navigator.standalone === true;
    if (isStandalone) {
      setDismissed(true);
      return;
    }

    const ua = window.navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
    if (isIos && isSafari) setShowIos(true);

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setShowIos(false);
      setDismissed(true);
      localStorage.setItem(DISMISS_KEY, "1");
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (dismissed) return null;
  if (!deferred && !showIos) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md rounded-2xl border border-primary/30 bg-card/95 p-4 shadow-2xl backdrop-blur-sm sm:left-6 sm:right-auto">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
          {showIos ? <Share className="h-5 w-5 text-primary" /> : <Download className="h-5 w-5 text-primary" />}
        </div>
        <div className="flex-1">
          <h4 className="font-display text-sm font-semibold text-foreground">
            Add PrepTrack to home screen
          </h4>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
            {showIos
              ? "Tap the Share icon in Safari, then 'Add to Home Screen'. Open it first thing every day."
              : "Install as a real app — opens straight to today's challenges & streak."}
          </p>
          {!showIos && (
            <Button size="sm" onClick={install} className="mt-2 h-8 gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" /> Install now
            </Button>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
