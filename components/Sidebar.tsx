"use client";

import { useState } from "react";
import { LayoutDashboard, Users, FileText, Send, LogOut, Mail, Database } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { ConfirmationModal } from "./ConfirmationModal";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
}

export function Sidebar({ activeTab, setActiveTab, user }: SidebarProps) {
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "Leads", icon: Users },
    { id: "templates", label: "Templates", icon: FileText },
    { id: "sheets", label: "Records", icon: Database },
    { id: "inbox", label: "Inbox", icon: Mail },
    { id: "send", label: "Send Email", icon: Send },
  ];

  return (
    <>
      <aside className="w-[280px] lg:w-80 h-full border-r border-white/5 flex flex-col p-8 gap-12 bg-zinc-950/20 glass-morphism backdrop-blur-3xl">
        <div className="flex items-center px-4 py-8 relative">
          {/* High-Intensity Global Glow (Behind everything in this area) */}
          <div className="absolute inset-x-0 top-0 h-32 bg-purple-600/40 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative group cursor-pointer lg:overflow-visible flex items-center">
            {/* Direct Logo Glow */}
            <div className="absolute inset-[-100%] bg-purple-500/80 blur-[80px] opacity-40 group-hover:opacity-100 transition-opacity duration-500 rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <img 
                src="/logoblack.png" 
                alt="Rapsora Logo" 
                className="w-32 md:w-48 h-auto object-contain transition-all duration-700 group-hover:scale-105 group-hover:brightness-150" 
              />
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 group font-bold tracking-tight ${
                activeTab === item.id 
                  ? "bg-white text-black shadow-2xl shadow-white/20 scale-[1.02]" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={20} className={`${activeTab === item.id ? "text-black" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-6">
          <div className="flex items-center gap-4 px-2 p-3 rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full grayscale hover:grayscale-0 transition-all border border-white/10 shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                {user.name?.[0] || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate italic uppercase tracking-widest">{user.name}</p>
              <p className="text-[9px] text-zinc-500 truncate font-medium uppercase tracking-tighter">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSignOutModalOpen(true)}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl text-zinc-500 hover:text-white hover:bg-red-500/10 transition-all w-full text-left group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sign Out</span>
          </button>
        </div>
      </aside>

      <ConfirmationModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={() => signOut()}
        title="Signal Loss?"
        message="Terminate your session and disconnect from the Rapsora Engine?"
        confirmLabel="DISCONNECT"
        cancelLabel="STAY"
        type="warning"
      />
    </>
  );
}
