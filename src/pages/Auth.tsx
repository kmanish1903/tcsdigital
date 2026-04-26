import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { dailyImage } from "@/lib/motivation";

export default function Auth() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [tab, setTab] = useState<"signin" | "signup">(params.get("mode") === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Sign in — PrepTrack";
  }, []);

  if (loading) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }
  if (session) return <Navigate to="/" replace />;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back 🙏");
      navigate("/", { replace: true });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: name || email.split("@")[0] },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! You're in. 🚀");
      navigate("/", { replace: true });
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) {
      setBusy(false);
      toast.error(error.message);
    }
  };

  const heroImg = dailyImage(new Date().toISOString().slice(0, 10));

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Hero side */}
      <div className="relative hidden overflow-hidden lg:block">
        <img src={heroImg} alt="PrepTrack motivation" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/60 to-primary/30" />
        <div className="relative flex h-full flex-col justify-between p-10 text-foreground">
          <div className="flex items-center gap-2 font-display text-2xl font-bold">
            <Sparkles className="h-6 w-6 text-primary" />
            Prep<span className="text-primary">Track</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">3.5 LPA → 8–15 LPA</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight">
              Discipline, devotion, and 2 videos a day.
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Naam Jap, Hanuman Chalisa, DSA, speaking, fitness — one dashboard, every single day.
            </p>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl font-bold">Welcome</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to sync your daily progress across devices.
          </p>

          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <Label htmlFor="si-pwd">Password</Label>
                  <Input id="si-pwd" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" disabled={busy} className="w-full">
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Sign in
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="su-name">Display name</Label>
                  <Input id="su-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <Label htmlFor="su-pwd">Password</Label>
                  <Input id="su-pwd" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" disabled={busy} className="w-full">
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={busy}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" fill="none" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.5-8 19.5-20 0-1.2-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.7-3.6 5l6.2 5.2C41.3 35.4 44 30 44 24c0-1.2-.1-2.3-.4-3.5z"/>
            </svg>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to track yourself with discipline. 🔥
          </p>
        </div>
      </div>
    </div>
  );
}
