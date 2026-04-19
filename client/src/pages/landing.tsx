import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, Trophy, Globe, Sparkles, Users } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";

function ArabicPattern() {
  return (
    <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/images/pattern-bg.png')`,
          backgroundSize: "400px",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: Brain,
      title: "Adaptive Learning",
      desc: "AI-powered system that adjusts to your pace and level automatically",
      titleAr: "التعلم التكيفي",
    },
    {
      icon: BookOpen,
      title: "Rich Exercises",
      desc: "Fill blanks, reorder sentences, multiple choice, and free writing",
      titleAr: "تمارين متنوعة",
    },
    {
      icon: Globe,
      title: "Cultural Immersion",
      desc: "Learn through Arabic proverbs, stories, and real-life situations",
      titleAr: "غوص ثقافي",
    },
    {
      icon: Trophy,
      title: "Gamified Progress",
      desc: "Earn XP, maintain streaks, unlock badges and climb the leaderboard",
      titleAr: "تقدم محفز",
    },
    {
      icon: Sparkles,
      title: "4 Core Skills",
      desc: "Master reading, writing, listening, and speaking with tracked progress",
      titleAr: "أربع مهارات",
    },
    {
      icon: Users,
      title: "Community",
      desc: "Compete with learners worldwide on the global leaderboard",
      titleAr: "مجتمع تعليمي",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <ArabicPattern />

      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg" style={{ fontFamily: "'Amiri', serif" }}>
                ع
              </span>
            </div>
            <span className="font-bold text-lg" data-testid="text-logo">Arabica</span>
          </div>
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={toggleTheme} data-testid="button-theme-toggle">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <a href="/api/login">
              <Button variant="outline" data-testid="button-login">Log in</Button>
            </a>
            <a href="/api/login">
              <Button data-testid="button-get-started">Get Started</Button>
            </a>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-accent-foreground bg-accent/60 inline-block px-3 py-1 rounded-md" data-testid="text-tagline">
                  Innovative Arabic Learning Platform
                </p>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" data-testid="text-hero-title">
                Master Arabic
                <br />
                <span className="text-primary">Your Way</span>
              </h1>
              <p
                className="text-5xl font-bold text-accent/80 leading-tight"
                style={{ fontFamily: "'Amiri', serif" }}
                dir="rtl"
                data-testid="text-hero-arabic"
              >
                تعلّم العربية
              </p>
              <p className="text-lg text-muted-foreground max-w-lg" data-testid="text-hero-description">
                An adaptive, gamified platform that teaches Arabic to non-native speakers
                through cultural immersion, interactive exercises, and personalized learning paths.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a href="/api/login">
                  <Button size="lg" data-testid="button-hero-start">
                    Start Learning Free
                  </Button>
                </a>
                <a href="#features">
                  <Button size="lg" variant="outline" data-testid="button-hero-features">
                    Explore Features
                  </Button>
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Free forever plan
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Adaptive AI engine
                </span>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative rounded-md overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                <img
                  src="/images/hero-arabic.png"
                  alt="Arabic calligraphy"
                  className="w-full h-[480px] object-cover transition-transform duration-700"
                  data-testid="img-hero"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <p className="text-white/90 text-sm font-medium">Start with the basics</p>
                  <p
                    className="text-white text-3xl mt-1"
                    style={{ fontFamily: "'Amiri', serif" }}
                    dir="rtl"
                  >
                    بسم الله الرحمن الرحيم
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold" data-testid="text-features-title">
              Everything You Need to Learn Arabic
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive platform designed with proven language acquisition methodologies
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="hover-elevate" data-testid={`card-feature-${i}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p
                      className="text-sm text-muted-foreground mt-0.5"
                      style={{ fontFamily: "'Amiri', serif" }}
                      dir="rtl"
                    >
                      {feature.titleAr}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5 relative">
        <ArabicPattern />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold" data-testid="text-cta-title">
            Begin Your Arabic Journey Today
          </h2>
          <p
            className="text-4xl text-primary/60"
            style={{ fontFamily: "'Amiri', serif" }}
            dir="rtl"
          >
            رحلة الألف ميل تبدأ بخطوة
          </p>
          <p className="text-muted-foreground text-lg">
            "A journey of a thousand miles begins with a single step"
          </p>
          <a href="/api/login">
            <Button size="lg" className="mt-4" data-testid="button-cta-start">
              Start Learning Now
            </Button>
          </a>
        </div>
      </section>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs" style={{ fontFamily: "'Amiri', serif" }}>ع</span>
            </div>
            <span>Arabica</span>
          </div>
          <p data-testid="text-copyright">Built with passion for Arabic language education</p>
        </div>
      </footer>
    </div>
  );
}
