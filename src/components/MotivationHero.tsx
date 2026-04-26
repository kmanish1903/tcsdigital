import { useEffect, useState } from "react";
import { Sparkles, Shuffle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote, dailyImage, dailyQuotes, randomImage, randomQuote } from "@/lib/motivation";

interface Props {
  videosToday: number;
  target?: number;
  dateISO: string;
}

export function MotivationHero({ videosToday, target = 2, dateISO }: Props) {
  const [image, setImage] = useState<string>(() => dailyImage(dateISO));
  const [quotes, setQuotes] = useState<Quote[]>(() => dailyQuotes(dateISO, 3));

  // Reset when the day changes
  useEffect(() => {
    setImage(dailyImage(dateISO));
    setQuotes(dailyQuotes(dateISO, 3));
  }, [dateISO]);

  const shuffleAll = () => {
    setImage(randomImage());
    setQuotes([randomQuote(), randomQuote(), randomQuote()]);
  };

  const remaining = Math.max(0, target - videosToday);
  const pct = Math.min(100, (videosToday / target) * 100);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-card)]">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt="Daily motivation"
          className="h-full w-full object-cover transition-opacity duration-700"
          width={1536}
          height={768}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />
      </div>

      <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10 lg:p-10">
        {/* Left: big motivation */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> 3.5 LPA → 8–15 LPA
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-[1.1] text-foreground sm:text-4xl lg:text-5xl">
              You already cracked TCS.
              <br />
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Now level up — every single day.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              2 videos. 1 mirror speaking session. 108 Naam Jap. 3 Hanuman Chalisa.
              Compound this for 90 days — the offer comes.
            </p>
          </div>

          {/* Daily target tracker */}
          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur">
            <div>
              <div className="font-display text-3xl font-bold tabular-nums text-foreground">
                {videosToday}
                <span className="text-muted-foreground">/{target}</span>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Videos today
              </p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs font-medium text-foreground">
                {remaining > 0
                  ? `🎯 ${remaining} more to hit today's target`
                  : "🔥 Daily target smashed. Bonus videos = bonus offers."}
              </p>
            </div>
            <Button onClick={shuffleAll} variant="outline" size="sm" className="gap-1.5">
              <Shuffle className="h-3.5 w-3.5" /> Shuffle
            </Button>
          </div>
        </div>

        {/* Right: quote carousel */}
        <div className="relative">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Today's mantras
            </p>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {quotes.map((q, idx) => (
                <CarouselItem key={idx}>
                  <div className="rounded-2xl border border-border bg-card/90 p-5 backdrop-blur min-h-[220px] flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="font-display text-lg font-semibold leading-snug text-foreground">
                        {q.te}
                      </p>
                      <p className="text-sm font-medium text-foreground/90">
                        {q.hi}
                      </p>
                      <p className="text-sm italic text-muted-foreground">
                        “{q.en}”
                      </p>
                    </div>
                    {q.author && (
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-primary">
                        — {q.author}
                      </p>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-2" />
            <CarouselNext className="-right-2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
