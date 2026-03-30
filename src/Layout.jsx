import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, LayoutDashboard, Gamepad2, Phone, User, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Mascot from "./components/Mascot";

const navigationItems = [
  {
    title: "Dashboard",
    url: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Therapeutic Games",
    url: "Games",
    icon: Gamepad2,
  },
  {
    title: "Emergency Support",
    url: "Helplines",
    icon: Phone,
  },
  {
    title: "Profile",
    url: "Profile",
    icon: User,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Sidebar className="border-r border-purple-100/50 backdrop-blur-sm bg-white/80">
          <SidebarHeader className="border-b border-purple-100/50 p-6">
            <Link to={createPageUrl("Landing")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">AuraCare</h2>
                <p className="text-xs text-gray-500 italic">A friend for your thoughts</p>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === createPageUrl(item.url);
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`mb-1 rounded-xl transition-all duration-200 ${
                            isActive 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                              : 'hover:bg-purple-50 text-gray-700'
                          }`}
                        >
                          <Link to={createPageUrl(item.url)} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-6 mx-3 p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border border-purple-200/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Daily Tip</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Take a moment to breathe deeply. You're doing better than you think.
                  </p>
                </div>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-purple-100/50 p-4">
            <Link to={createPageUrl("Helplines")}>
              <Button 
                variant="outline" 
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                <Phone className="w-4 h-4 mr-2" />
                Emergency Help
              </Button>
            </Link>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100/50 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-purple-50 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-900">AuraCare</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
        <Mascot />
      </div>
    </SidebarProvider>
  );
}