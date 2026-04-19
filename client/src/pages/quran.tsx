import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Volume2, Eye, Star, Filter } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuranWord } from "@shared/schema";

// ── Category Configuration ──────────────────────────────────────────────────
const categoryConfig: Record<string, { label: string; labelAr: string }> = {
  all: { label: "All", labelAr: "الكل" },
  faith: { label: "Faith", labelAr: "الإيمان" },
  people: { label: "People", labelAr: "الناس" },
  actions: { label: "Actions", labelAr: "الأفعال" },
  nature: { label: "Nature", labelAr: "الطبيعة" },
  qualities: { label: "Qualities", labelAr: "الصفات" },
  time: { label: "Time", labelAr: "الوقت" },
  places: { label: "Places", labelAr: "الأماكن" },
};

const difficultyConfig: Record<number, { label: string; color: string }> = {
  1: { label: "Beginner", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" },
  2: { label: "Intermediate", color: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20" },
  3: { label: "Advanced", color: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20" },
};

const wordTypeColors: Record<string, string> = {
  noun: "bg-primary/10 text-primary border-primary/20",
  verb: "bg-accent/15 text-accent-foreground border-accent/20",
  particle: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  pronoun: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
};

const categoryColors: Record<string, string> = {
  faith: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
  people: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  actions: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  nature: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  qualities: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  time: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  places: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",
  general: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
};

// ── TTS Audio Helper ────────────────────────────────────────────────────────
async function playWordAudio(word: string) {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: word }),
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    audio.onended = () => URL.revokeObjectURL(url);
  } catch {
    // Silently fail if TTS is unavailable
  }
}

// ── Flip Card Component ─────────────────────────────────────────────────────
function QuranWordCard({
  word,
  isFlipped,
  onFlip,
  flipMode,
}: {
  word: QuranWord;
  isFlipped: boolean;
  onFlip: () => void;
  flipMode: boolean;
}) {
  const difficulty = difficultyConfig[word.difficulty || 1] || difficultyConfig[1];
  const wordTypeColor = wordTypeColors[word.wordType] || wordTypeColors.noun;
  const categoryColor = categoryColors[word.category || "general"] || categoryColors.general;

  return (
    <div
      className="perspective-[1000px] cursor-pointer"
      onClick={flipMode ? onFlip : undefined}
      data-testid={`card-quran-${word.id}`}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={flipMode && isFlipped ? { rotateY: 180 } : { rotateY: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* ── Front Face ──────────────────────────────────────── */}
        <Card className={`hover-elevate ${flipMode ? "cursor-pointer" : ""}`} style={{ backfaceVisibility: "hidden" }}>
          <CardContent className="p-5 space-y-4">
            {/* Top row: word type + difficulty + category */}
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <Badge variant="outline" className={`text-xs border ${wordTypeColor}`}>
                {word.wordType}
              </Badge>
              <div className="flex gap-1.5">
                {word.category && (
                  <Badge variant="outline" className={`text-xs border ${categoryColor}`}>
                    {categoryConfig[word.category]?.label || word.category}
                  </Badge>
                )}
                <Badge variant="outline" className={`text-xs border ${difficulty.color}`}>
                  {difficulty.label}
                </Badge>
              </div>
            </div>

            {/* Arabic Word (large) */}
            <div className="text-center py-3" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
              <p className="text-4xl leading-relaxed text-foreground">{word.wordAr}</p>
              <p className="text-sm mt-2 text-muted-foreground">{word.wordTransliteration}</p>
            </div>

            {/* Meaning */}
            <div className="space-y-1">
              <p className="font-semibold text-base">{word.meaningEn}</p>
              <p className="text-sm text-muted-foreground" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                {word.meaningAr}
              </p>
            </div>

            {/* Root Letters & Frequency */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                {word.rootLetters && (
                  <>
                    <span className="font-medium">Root:</span>
                    <span dir="rtl" className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Amiri', serif" }}>
                      {word.rootLetters}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-3 h-3" />
                <span>
                  {word.frequency}× in Quran
                </span>
              </div>
            </div>

            {/* Example Verse */}
            {word.exampleVerseAr && (
              <div className="rounded-md bg-primary/5 border border-primary/10 p-3 space-y-2">
                <p
                  className="text-base leading-relaxed text-center"
                  dir="rtl"
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  {word.exampleVerseAr}
                </p>
                {word.exampleVerseEn && (
                  <p className="text-xs text-muted-foreground text-center italic">
                    "{word.exampleVerseEn}"
                  </p>
                )}
                {word.exampleSurah && (
                  <p className="text-xs text-muted-foreground text-center">
                    — {word.exampleSurah}{word.exampleAyah ? `:${word.exampleAyah}` : ""}
                  </p>
                )}
              </div>
            )}

            {/* Audio Button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-2 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                playWordAudio(word.wordAr);
              }}
            >
              <Volume2 className="w-4 h-4" />
              Listen to Pronunciation
            </Button>

            {flipMode && (
              <p className="text-xs text-center text-muted-foreground">
                Click to flip
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Back Face (flip mode only) ──────────────────────── */}
        {flipMode && (
          <Card
            className="absolute inset-0 hover-elevate"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <CardContent className="p-5 flex flex-col items-center justify-center h-full space-y-4">
              <Eye className="w-8 h-8 text-accent" />
              <div className="text-center space-y-2">
                <p className="font-semibold text-lg">{word.meaningEn}</p>
                <p className="text-sm text-muted-foreground" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                  {word.meaningAr}
                </p>
              </div>
              <div
                className="text-3xl text-center py-3"
                dir="rtl"
                style={{ fontFamily: "'Amiri', serif" }}
              >
                {word.wordAr}
              </div>
              <p className="text-sm text-muted-foreground">{word.wordTransliteration}</p>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  playWordAudio(word.wordAr);
                }}
              >
                <Volume2 className="w-4 h-4" />
                Play Audio
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Click to flip back
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}

// ── Loading Skeletons ───────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80" />
        <Skeleton className="h-7 w-40" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1 max-w-sm" />
        <Skeleton className="h-10 w-28" />
      </div>
      <Skeleton className="h-10 w-full max-w-2xl" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-72 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// ── Stats Bar Component ─────────────────────────────────────────────────────
function StatsBar({ words }: { words: QuranWord[] }) {
  const categories = new Set(words.map((w) => w.category).filter(Boolean));
  const totalFrequency = words.reduce((sum, w) => sum + (w.frequency || 0), 0);

  const stats = [
    { label: "Words", value: words.length, icon: BookOpen },
    { label: "Categories", value: categories.size, icon: Filter },
    { label: "Total Occurrences", value: totalFrequency.toLocaleString(), icon: Star },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="hover-elevate">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-accent/15 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold leading-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="text-center py-16 text-muted-foreground col-span-full">
      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
      <p className="font-medium">{hasSearch ? "No words match your search" : "No Quranic vocabulary available yet"}</p>
      <p className="text-sm mt-1">{hasSearch ? "Try adjusting your search terms or filters" : "Words will appear here once they are added"}</p>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function QuranPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null);
  const [flipMode, setFlipMode] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const { data: quranWords, isLoading } = useQuery<QuranWord[]>({
    queryKey: ["/api/quran-words", categoryFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      const query = params.toString();
      return fetch(`/api/quran-words${query ? `?${query}` : ""}`).then((r) => r.json());
    },
  });

  const toggleFlip = useCallback((id: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Client-side search & difficulty filter
  const filteredWords = (quranWords || []).filter((word) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesArabic = word.wordAr.includes(searchQuery);
      const matchesEnglish = word.meaningEn.toLowerCase().includes(q);
      const matchesTransliteration = word.wordTransliteration.toLowerCase().includes(q);
      if (!matchesArabic && !matchesEnglish && !matchesTransliteration) return false;
    }
    // Difficulty filter
    if (difficultyFilter !== null && word.difficulty !== difficultyFilter) return false;
    return true;
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const allWords = quranWords || [];
  const displayWords = categoryFilter === "all"
    ? filteredWords
    : filteredWords;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold" data-testid="text-quran-title">Quranic Arabic</h1>
        <p className="text-muted-foreground mt-1">
          Explore the beautiful vocabulary of the Quran and deepen your understanding of Classical Arabic
        </p>
        <p
          className="text-xl mt-2 text-accent-foreground"
          dir="rtl"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          العربية القرآنية
        </p>
      </div>

      {/* ── Stats Bar ───────────────────────────────────────────── */}
      {allWords.length > 0 && <StatsBar words={allWords} />}

      {/* ── Search & Controls ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Arabic, English, or transliteration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-quran-search"
          />
        </div>
        <div className="flex gap-2">
          {/* Difficulty Buttons */}
          <Button
            variant={difficultyFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficultyFilter(null)}
            className="text-xs"
          >
            All Levels
          </Button>
          <Button
            variant={difficultyFilter === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficultyFilter(difficultyFilter === 1 ? null : 1)}
            className="text-xs"
          >
            Beginner
          </Button>
          <Button
            variant={difficultyFilter === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficultyFilter(difficultyFilter === 2 ? null : 2)}
            className="text-xs"
          >
            Intermediate
          </Button>
          <Button
            variant={difficultyFilter === 3 ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficultyFilter(difficultyFilter === 3 ? null : 3)}
            className="text-xs"
          >
            Advanced
          </Button>
          <Button
            variant={flipMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFlipMode(!flipMode);
              setFlippedCards(new Set());
            }}
            className="text-xs gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            {flipMode ? "Flip Off" : "Flip Mode"}
          </Button>
        </div>
      </div>

      {/* ── Category Tabs ────────────────────────────────────────── */}
      <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-transparent p-0">
          {Object.entries(categoryConfig).map(([key, config]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="text-xs data-[state=active]:bg-accent/15 data-[state=active]:text-accent-foreground"
              data-testid={`tab-quran-${key}`}
            >
              {config.label}
              <span className="hidden sm:inline text-xs opacity-60 ml-1" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                {config.labelAr}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={categoryFilter}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {categoryFilter === "all" ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {displayWords.map((word) => (
                      <motion.div
                        key={word.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <QuranWordCard
                          word={word}
                          isFlipped={flippedCards.has(word.id)}
                          onFlip={() => toggleFlip(word.id)}
                          flipMode={flipMode}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {displayWords.length === 0 && (
                    <EmptyState hasSearch={searchQuery.trim().length > 0} />
                  )}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {displayWords.map((word) => (
                      <motion.div
                        key={word.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <QuranWordCard
                          word={word}
                          isFlipped={flippedCards.has(word.id)}
                          onFlip={() => toggleFlip(word.id)}
                          flipMode={flipMode}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {displayWords.length === 0 && (
                    <EmptyState hasSearch={searchQuery.trim().length > 0} />
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
