import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, LayoutDashboard, Gamepad2, Phone, User, Menu, X } from "lucide-react";
import Mascot from "./components/Mascot";

const navigationItems = [
  { title: "Dashboard", url: "Dashboard", icon: LayoutDashboard },
  { title: "Therapeutic Games", url: "Games", icon: Gamepad2 },
  { title: "Emergency Support", url: "Helplines", icon: Phone },
  { title: "Profile", url: "Profile", icon: User },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Top Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 px-4 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-gray-900 text-lg hidden sm:block">AuraCare</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === `/${item.url}` || location.pathname === createPageUrl(item.url);
              return (
                <Link
                  key={item.title}
                  to={`/${item.url}`}
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
            <Link to="/Helplines">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold transition-all">
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
                const isActive = location.pathname === `/${item.url}`;
                return (
                  <Link
                    key={item.title}
                    to={`/${item.url}`}
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
              <Link to="/Helplines" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50">
                <Phone className="w-5 h-5" />
                Emergency Help
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">
        {children || <Outlet />}
      </main>

      <Mascot />
    </div>
  );
}