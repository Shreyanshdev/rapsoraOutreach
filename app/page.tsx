"use client";

import { useState, Suspense } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { Leads } from "@/components/Leads";
import { Templates } from "@/components/Templates";
import { Sheets } from "@/components/Sheets";
import { SendEmail } from "@/components/SendEmail";
import { Inbox } from "@/components/Inbox";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Loader2, Menu, X, ShieldAlert, ArrowLeft } from "lucide-react";

function HomeContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-zinc-800 animate-spin" />
      </div>
    );
  }

  // Handle Unauthorized / Access Denied State
  if (error === "AccessDenied" && !session) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/5 blur-[120px] rounded-full scale-150" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-morphism border border-red-500/20 rounded-[3rem] p-12 text-center relative z-10 shadow-2xl shadow-red-500/10"
        >
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
            <ShieldAlert size={40} />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-4 tracking-tightest uppercase italic">Access Revoked</h1>
          <p className="text-zinc-500 mb-10 leading-relaxed font-medium">
            Your identity is not authorized to access the Rapsora Engine. Please contact your system administrator for security clearance.
          </p>
          
          <button
            onClick={() => window.location.href = "/"}
            className="flex items-center justify-center gap-3 w-full py-5 bg-white/5 text-zinc-400 rounded-2xl font-black text-xs hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest border border-white/5"
          >
            <ArrowLeft size={16} />
            Back to Entry
          </button>
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10"
        >
          <div className="relative group mb-16 flex justify-center cursor-pointer overflow-visible">
            {/* Massive Global Glow */}
            <div className="absolute inset-[-100%] bg-purple-600/30 blur-[120px] rounded-full pointer-events-none" />
            
            {/* Reactive Hover Glow */}
            <div className="absolute inset-[-50%] bg-purple-500/80 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full pointer-events-none" />
            
            <div className="relative z-10 transition-all duration-1000 group-hover:scale-105 group-hover:brightness-150">
              <img src="/logoblack.png" alt="Rapsora Logo" className="w-48 md:w-64 h-auto object-contain" />
            </div>
          </div>
          <p className="text-zinc-400 mb-12 text-xl md:text-2xl max-w-xl mx-auto leading-relaxed font-light">
            The next generation of personalized cold outreach. <span className="text-white font-medium">Built for the future.</span>
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-4 px-12 py-5 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all transform hover:scale-105 shadow-2xl shadow-white/10 group mx-auto"
            >
              <LogIn size={22} className="group-hover:translate-x-1 transition-transform" />
              Sign in with Google
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050507] text-zinc-100 font-sans overflow-hidden relative">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:block h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={session.user} />
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-[280px] z-[101]"
            >
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }} 
                user={session.user} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-6 glass-morphism sticky top-0 z-50">
          <div className="flex items-center gap-3">
             <div className="relative group cursor-pointer overflow-visible">
                {/* Ambient Glow */}
                <div className="absolute inset-[-40%] bg-purple-500/30 blur-[30px] rounded-full pointer-events-none" />
                
                {/* Hover Surges */}
                <div className="absolute inset-[-60%] bg-purple-500/80 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full pointer-events-none" />
                
                <img src="/logoblack.png" alt="Rapsora Logo" className="w-28 h-auto object-contain relative z-10 transition-all duration-500 group-hover:rotate-3 group-hover:brightness-150" />
             </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="p-6 md:p-12 lg:p-20 max-w-7xl mx-auto"
            >
              {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} />}
              {activeTab === "leads" && <Leads />}
              {activeTab === "templates" && <Templates />}
              {activeTab === "sheets" && <Sheets />}
              {activeTab === "inbox" && <Inbox />}
              {activeTab === "send" && <SendEmail />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-zinc-800 animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
