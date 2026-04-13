"use client";

import { useState, useEffect } from "react";
import { Users, FileText, Send, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "./ui/Skeleton";

export function Dashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [stats, setStats] = useState({ leads: 0, templates: 5, sent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [leadsRes, emailsRes] = await Promise.all([
          fetch("/api/leads"),
          fetch("/api/emails")
        ]);
        
        const leadsData = await leadsRes.json();
        const emailsData = await emailsRes.json();
        
        if (Array.isArray(leadsData) && Array.isArray(emailsData)) {
          setStats(prev => ({ 
            ...prev, 
            leads: leadsData.length,
            sent: emailsData.length
          }));
        }
      } catch (error) {
        console.error("Failed to fetch statistics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Leads", value: stats.leads, icon: Users, color: "text-blue-400", tab: "leads" },
    { label: "Active Templates", value: stats.templates, icon: FileText, color: "text-purple-400", tab: "templates" },
    { label: "Emails Sent", value: stats.sent, icon: Send, color: "text-emerald-400", tab: "inbox" },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-16">
      <header className="relative space-y-1 text-center lg:text-left">
        <h1 className="text-2xl md:text-3xl font-black tracking-tightest text-white text-glow leading-none uppercase">
          Dashboard
        </h1>
        <p className="text-zinc-500 text-[10px] font-medium tracking-[0.2em] max-w-lg leading-relaxed mx-auto lg:mx-0 uppercase opacity-60">
          The future of outreach is personal. Here is your <span className="text-white">performance matrix</span>.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="group relative bg-white/5 glass-morphism p-10 rounded-[2.5rem] hover:bg-white/[0.08] transition-all duration-500 border border-white/5 overflow-hidden cursor-pointer"
            onClick={() => setActiveTab(card.tab)}
          >
            {/* Ambient background glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity ${card.color.replace('text', 'bg')}`} />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className={`p-4 rounded-2xl bg-white text-black shadow-2xl shadow-white/20 transition-transform group-hover:rotate-12`}>
                  <card.icon size={28} strokeWidth={2.5} />
                </div>
                <ArrowRight size={20} className="text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">{card.label}</p>
              <h3 className="text-5xl font-black text-white lining-nums">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="relative group p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[3rem] overflow-hidden">
        <div className="bg-black/40 glass-morphism rounded-[2.9rem] p-16 md:p-24 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tightest">
              Ready to accelerate your growth?
            </h2>
            <p className="text-zinc-400 mb-12 text-lg md:text-xl font-light leading-relaxed">
              Our high-conversion email engine uses advanced personalization to ensure your message lands with impact.
            </p>
            <button
              onClick={() => setActiveTab("send")}
              className="px-12 py-5 bg-white text-black rounded-full font-black text-lg hover:bg-zinc-200 transition-all transform hover:scale-105 shadow-2xl shadow-white/20 active:scale-95"
            >
              Compose New Email
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-16 animate-pulse">
      <header className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-96 opacity-40" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 opacity-40" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="h-80 w-full rounded-[3rem]" />
    </div>
  );
}
