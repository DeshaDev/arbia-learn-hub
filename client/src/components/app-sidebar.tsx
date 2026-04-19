import { useLocation, Link } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LayoutDashboard, BookOpen, Brain, Gamepad2, Globe, Trophy, BarChart3, BookMarked } from "lucide-react";

const navItems = [
  { title: "Dashboard", titleAr: "الرئيسية", url: "/", icon: LayoutDashboard },
  { title: "Lessons", titleAr: "الدروس", url: "/lessons", icon: BookOpen },
  { title: "Practice", titleAr: "التدريب", url: "/practice", icon: Brain },
  { title: "Games", titleAr: "الألعاب", url: "/games", icon: Gamepad2 },
  { title: "Quranic Arabic", titleAr: "القرآن", url: "/quran", icon: BookMarked },
  { title: "Culture", titleAr: "الثقافة", url: "/culture", icon: Globe },
  { title: "Leaderboard", titleAr: "المتصدرين", url: "/leaderboard", icon: Trophy },
  { title: "Progress", titleAr: "التقدم", url: "/progress", icon: BarChart3 },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-lg" style={{ fontFamily: "'Amiri', serif" }}>
              ع
            </span>
          </div>
          <div>
            <p className="font-bold text-sm" data-testid="text-sidebar-logo">Arabica</p>
            <p className="text-xs text-sidebar-foreground/60">Learn Arabic</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.url === "/" ? location === "/" : location.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} data-testid={`nav-${item.title.toLowerCase()}`}>
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs">
              M
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" data-testid="text-user-name">
              Learner
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
              متعلم
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
