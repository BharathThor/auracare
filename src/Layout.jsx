import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, LayoutDashboard, Gamepad2, Phone, User, Sparkles, Menu, X } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
          {/* Top Navigation Bar */}
          <header className="bg-white/90 backdrop-blur-sm border-b border-purple-100/60 px-4 py-3 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* Logo */}
              <Link to={createPageUrl("Landing")} className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-gray-900 text-lg hidden sm:block">AuraCare</span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-1">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === createPageUrl(item.url);
                  return (
                    <Link
                      key={item.title}
                      to={createPageUrl(item.url)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                          : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>

              {/* Emergency + Mobile toggle */}
              <div className="flex items-center gap-2">
                <Link to={createPageUrl("Helplines")}>
                  <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold transition-all">
                    <Phone className="w-4 h-4" />
                    <span className="hidden lg:block">Emergency</span>
                  </button>
                </Link>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  {mobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
                </button>
              </div>
            </div>

            {/* Mobile Nav Dropdown */}
            {mobileOpen && (
              <div className="md:hidden mt-3 pb-2 border-t border-purple-100 pt-3">
                <div className="flex flex-col gap-1">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === createPageUrl(item.url);
                    return (
                      <Link
                        key={item.title}
                        to={createPageUrl(item.url)}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "text-gray-700 hover:bg-purple-50"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.title}
                      </Link>
                    );
                  })}
                  <Link to={createPageUrl("Helplines")} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50">
                    <Phone className="w-5 h-5" />
                    Emergency Help
                  </Link>
                </div>
              </div>
            )}
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