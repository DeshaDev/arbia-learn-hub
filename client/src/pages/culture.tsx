import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Quote, Users, MapPin } from "lucide-react";
import type { CulturalContent } from "@shared/schema";

const typeConfig: Record<string, { icon: typeof BookOpen; label: string; labelAr: string }> = {
  proverb: { icon: Quote, label: "Proverbs", labelAr: "أمثال" },
  story: { icon: BookOpen, label: "Stories", labelAr: "قصص" },
  situation: { icon: Users, label: "Life Situations", labelAr: "مواقف حياتية" },
  tradition: { icon: MapPin, label: "Traditions", labelAr: "تقاليد" },
};

function CulturalCard({ item }: { item: CulturalContent }) {
  const config = typeConfig[item.type] || typeConfig.proverb;
  const Icon = config.icon;

  return (
    <Card className="hover-elevate" data-testid={`card-cultural-${item.id}`}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-md bg-accent/20 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">{config.label}</Badge>
            <Badge variant="outline" className="text-xs">Level {item.level}</Badge>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm mt-0.5" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
            {item.titleAr}
          </p>
        </div>

        <div className="p-4 rounded-md bg-primary/5 border border-primary/10" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
          <p className="text-lg leading-relaxed text-center">{item.contentAr}</p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
      </CardContent>
    </Card>
  );
}

export default function CulturePage() {
  const { data: culturalContent, isLoading } = useQuery<CulturalContent[]>({
    queryKey: ["/api/cultural-content"],
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-10 w-64" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}
      </div>
    );
  }

  const types = ["all", "proverb", "story", "situation", "tradition"];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" data-testid="text-culture-title">Arabic Culture</h1>
        <p className="text-muted-foreground mt-1">Discover the richness of Arabic culture through language</p>
        <p className="text-lg mt-1" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
          الثقافة العربية
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all" data-testid="tab-culture-all">All</TabsTrigger>
          {Object.entries(typeConfig).map(([key, config]) => (
            <TabsTrigger key={key} value={key} data-testid={`tab-culture-${key}`}>
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {types.map((type) => (
          <TabsContent key={type} value={type}>
            <div className="grid sm:grid-cols-2 gap-4">
              {culturalContent
                ?.filter((c) => type === "all" || c.type === type)
                .map((item) => <CulturalCard key={item.id} item={item} />)}
            </div>
            {(!culturalContent || culturalContent.filter((c) => type === "all" || c.type === type).length === 0) && (
              <div className="text-center py-16 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No content available yet</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
