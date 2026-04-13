"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Loader2, X, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lead } from "@/lib/types";
import { ConfirmationModal } from "./ConfirmationModal";
import { useToast } from "./Toast";
import { Skeleton } from "./ui/Skeleton";

export function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  const [newLead, setNewLead] = useState({ name: "", email: "", company: "" });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/leads");
      const data = await response.json();
      if (Array.isArray(data)) {
        setLeads(data);
      }
    } catch (error) {
      console.error("Failed to fetch leads", error);
      toast("Communication failure during leads retrieval", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (response.ok) {
        setLeads(leads.filter(l => (l._id || l.id) !== id));
        toast("Lead successfully purged from database", "success");
      } else {
        toast("Failed to authorize lead deletion", "error");
      }
    } catch (error) {
      toast("System error during lead purge", "error");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      if (response.ok) {
        setIsAdding(false);
        setNewLead({ name: "", email: "", company: "" });
        fetchLeads();
        toast("New lead synchronized successfully", "success");
      } else {
        toast("Lead validation failed", "error");
      }
    } catch (error) {
      toast("Error during lead synchronization", "error");
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.company.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black tracking-tightest text-white uppercase">Leads</h1>
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">Target matrix of your high-value outreach.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-black text-xs hover:bg-zinc-200 transition-all shadow-xl shadow-white/10 active:scale-95"
        >
          <Plus size={16} strokeWidth={3} />
          ADD LEAD
        </button>
      </header>

      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search leads by name, company, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 glass-morphism border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:bg-white/10 transition-all font-light text-lg"
        />
      </div>

      <div className="bg-white/5 glass-morphism rounded-[2.5rem] overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-4 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Contact</th>
                <th className="hidden md:table-cell px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Affiliation</th>
                <th className="px-4 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-4 md:px-8 py-4 md:py-6 text-right text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <LeadsSkeleton />
              ) : (
                filteredLeads.map((lead, i) => (
                  <motion.tr 
                    key={lead._id || lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group"
                  >
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm md:text-lg tracking-tight truncate max-w-[120px] md:max-w-none">{lead.name}</span>
                        <span className="text-zinc-500 text-[10px] md:text-xs font-mono lowercase opacity-60 truncate max-w-[120px] md:max-w-none">{lead.email}</span>
                        <span className="md:hidden text-zinc-400 text-[9px] font-bold uppercase tracking-widest mt-1">{lead.company}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                          <span className="text-[10px] font-black">{lead.company.charAt(0)}</span>
                        </div>
                        <span className="text-zinc-300 font-medium">{lead.company}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-blue-500/10 text-blue-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-blue-500/20 whitespace-nowrap">
                        ID'd
                      </span>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                      <button 
                        onClick={() => {
                          setLeadToDelete(lead._id || lead.id!);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-3 bg-white/5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[200] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0b0b0f] glass-morphism border border-white/10 rounded-[3rem] p-10 md:p-12 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl shadow-white/20">
                  <UserPlus size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tightest">New Target</h2>
                  <p className="text-zinc-500 text-sm font-medium">Intel collection for outreach</p>
                </div>
              </div>

              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Objective Name</label>
                  <input
                    required
                    type="text"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:bg-white/10 transition-all font-light"
                    placeholder="E.g. Alexander Knight"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Communication Link</label>
                  <input
                    required
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:bg-white/10 transition-all font-mono"
                    placeholder="alex@nexus.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Entity</label>
                  <input
                    required
                    type="text"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:bg-white/10 transition-all font-light"
                    placeholder="Nexus Corp"
                  />
                </div>
                <div className="flex gap-4 mt-12">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-8 py-4 bg-white/5 text-zinc-400 rounded-2xl font-bold hover:bg-white/10 hover:text-white transition-all"
                  >
                    Abort
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-white text-black rounded-2xl font-black hover:bg-zinc-200 transition-all shadow-xl shadow-white/10"
                  >
                    Deploy
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => leadToDelete && handleDelete(leadToDelete)}
        title="Purge Target"
        message="Permanently remove this intel from the database? This action is absolute."
        confirmLabel="PURGE INTEL"
      />
    </div>
  );
}

function LeadsSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <tr key={i} className="border-b border-white/5 animate-pulse">
          <td className="px-8 py-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-48 opacity-40" />
            </div>
          </td>
          <td className="px-8 py-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 w-28 opacity-60" />
            </div>
          </td>
          <td className="px-8 py-6">
            <Skeleton className="h-6 w-16 rounded-full opacity-40" />
          </td>
          <td className="px-8 py-6 text-right">
            <Skeleton className="h-10 w-10 rounded-xl ml-auto opacity-40" />
          </td>
        </tr>
      ))}
    </>
  );
}
