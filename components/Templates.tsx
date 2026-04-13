"use client";

import { DEFAULT_TEMPLATES } from "@/lib/templates";
import { 
  ChevronDown, Smartphone, Tablet, Monitor, 
  FileText, Check, Copy, Plus, X, Save, Eye,
  Code, Type, Trash2, Loader2
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "./ConfirmationModal";
import { useToast } from "./Toast";
import { Skeleton } from "./ui/Skeleton";

type ViewMode = "mobile" | "tablet" | "desktop";

export function Templates() {
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState(DEFAULT_TEMPLATES[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>("mobile");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  
  // Deletion modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  // Editor States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [liveHtml, setLiveHtml] = useState("");
  const [liveSubject, setLiveSubject] = useState("");
  const [liveName, setLiveName] = useState("");
  
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setInitialLoading(true);
      const response = await fetch('/api/templates');
      const data = await response.json();
      if (Array.isArray(data)) {
        setCustomTemplates(data);
      }
    } catch (error) {
      console.error('Failed to fetch templates', error);
      toast("Communication failure during blueprint retrieval", "error");
    } finally {
      setInitialLoading(false);
    }
  };

  // Combine defaults with custom templates
  const templates = useMemo(() => {
    return [...DEFAULT_TEMPLATES, ...customTemplates];
  }, [customTemplates]);

  const selectedTemplate = useMemo(() => {
    if (isEditorOpen) {
      return {
        id: "preview",
        name: liveName || "New Blueprint",
        subject: liveSubject || "Enter Subject Protocol",
        bodyHTML: liveHtml || "<div style='padding:40px; text-align:center; color:#999;'>Transmission Script Empty</div>"
      };
    }
    return templates.find(t => (t._id || t.id) === selectedId) || templates[0];
  }, [isEditorOpen, selectedId, templates, liveHtml, liveSubject, liveName]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedTemplate.bodyHTML);
    setCopied(true);
    toast("Blueprint script copied to buffer", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenEditor = () => {
    setLiveHtml("");
    setLiveSubject("");
    setLiveName("");
    setIsEditorOpen(true);
  };

  const handleSave = async () => {
    if (!liveName || !liveSubject || !liveHtml) {
      toast("Incomplete blueprint protocol", "error");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: liveName,
          subject: liveSubject,
          bodyHTML: liveHtml
        })
      });

      if (response.ok) {
        const newTemplate = await response.json();
        setCustomTemplates(prev => [newTemplate, ...prev]);
        setSelectedId(newTemplate._id);
        setIsEditorOpen(false);
        toast("New blueprint synchronized to engine", "success");
      } else {
        toast("Blueprint validation failed", "error");
      }
    } catch (error) {
      toast("Error during blueprint synchronization", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCustomTemplates(prev => prev.filter(t => t._id !== id));
        if (selectedId === id) {
          setSelectedId(DEFAULT_TEMPLATES[0].id);
        }
        toast("Blueprint successfully purged from engine", "success");
      } else {
        toast("Unauthorized purge request", "error");
      }
    } catch (error) {
      toast("System error during blueprint purge", "error");
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const getDeviceDimensions = () => {
    switch (viewMode) {
      case "tablet": return "w-[480px] h-[640px] rounded-[3.5rem]";
      case "desktop": return "w-full max-w-[850px] aspect-video rounded-[1.5rem]";
      default: return "w-[340px] h-[680px] rounded-[4rem]";
    }
  };

  if (initialLoading) {
    return <TemplatesSkeleton />;
  }

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Header Container - Minimalist */}
      <div className="w-full max-w-6xl mx-auto pt-0 shrink-0 px-4 md:px-0">
        <header className="relative flex flex-col md:flex-row justify-between items-center gap-6 md:items-center">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black tracking-tightest text-white text-glow leading-none uppercase">
              Blueprints
            </h1>
            <p className="text-zinc-500 text-[10px] font-medium tracking-[0.2em] max-w-lg leading-relaxed mx-auto md:mx-0 uppercase opacity-60">
              High-fidelity communication <span className="text-white">blueprints</span> for impact.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {!isEditorOpen && (
              <>
                {/* View Mode Context Switcher */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  {(["mobile", "tablet", "desktop"] as ViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`p-2 rounded-lg transition-all relative ${viewMode === mode ? "text-black" : "text-zinc-500 hover:text-white"}`}
                    >
                      {viewMode === mode && (
                        <motion.div 
                          layoutId="viewHighlight" 
                          className="absolute inset-0 bg-white rounded-lg" 
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">
                        {mode === "mobile" && <Smartphone size={16} />}
                        {mode === "tablet" && <Tablet size={16} />}
                        {mode === "desktop" && <Monitor size={16} />}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative group min-w-[200px]">
                    <div className="relative">
                      <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="w-full bg-white/5 glass-morphism border border-white/10 rounded-xl px-5 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:bg-white/10 transition-all font-bold tracking-tight pr-10 text-[10px]"
                      >
                        {templates.map(t => (
                          <option key={t._id || t.id} value={t._id || t.id} className="bg-[#0b0b0f] text-white">
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-hover:text-white transition-colors" size={14} />
                    </div>
                  </div>

                  {customTemplates.some(t => t._id === selectedId) && (
                    <button
                      onClick={() => {
                        setTemplateToDelete(selectedId);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                      title="Delete Blueprint"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <button
                  onClick={handleOpenEditor}
                  disabled={loading}
                  className="px-5 py-3 bg-white text-black rounded-xl font-black text-[10px] hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl shadow-white/10 disabled:opacity-50"
                >
                  <Plus size={14} strokeWidth={3} />
                  ADD NEW
                </button>
              </>
            )}
            
            {isEditorOpen && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-black text-[10px] hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20"
                >
                  <Save size={14} strokeWidth={3} />
                  SAVE BLUEPRINT
                </button>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <X size={14} strokeWidth={3} />
                  CANCEL
                </button>
              </div>
            )}
          </div>
        </header>
      </div>

      <div className={`flex-1 w-full max-w-7xl mx-auto overflow-hidden ${isEditorOpen ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : "flex justify-center"}`}>
        <AnimatePresence>
          {isEditorOpen && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="flex flex-col h-full overflow-hidden pb-4"
            >
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 bg-white/5 glass-morphism border border-white/5 rounded-[2rem] p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-white text-black rounded-lg shadow-lg">
                      <Code size={16} strokeWidth={2.5} />
                   </div>
                   <h2 className="text-sm font-black tracking-tight text-white uppercase">Logic Builder</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-2">Internal Registry Name</label>
                    <input
                      type="text"
                      value={liveName}
                      onChange={(e) => setLiveName(e.target.value)}
                      placeholder="E.g. Enterprise Outreach 2.0"
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-2 text-white italic tracking-wide text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-2">Objective Protocol</label>
                    <input
                      type="text"
                      value={liveSubject}
                      onChange={(e) => setLiveSubject(e.target.value)}
                      placeholder="Transmission Subject..."
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-2 text-white italic tracking-wide text-xs"
                    />
                  </div>
                  <div className="flex-1 flex flex-col min-h-0 space-y-1">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-2 shrink-0">Blueprint Script (HTML)</label>
                    <textarea
                      value={liveHtml}
                      onChange={(e) => setLiveHtml(e.target.value)}
                      className="flex-1 w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-white font-mono text-xs resize-none outline-none no-scrollbar"
                      placeholder="Transmission Source Code..."
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`relative h-full flex flex-col items-center justify-center ${isEditorOpen ? "w-full" : "w-full max-w-4xl"}`}>
          <motion.div
            layout
            className={`relative z-10 bg-[#0c0c0f] border-[10px] border-[#1a1a1f] shadow-[0_40px_100px_rgba(0,0,0,0.6),inset_0_0_60px_rgba(255,255,255,0.01)] transition-all duration-1000 ease-[0.23,1,0.32,1] overflow-hidden flex flex-col scale-90 lg:scale-100 ${getDeviceDimensions()}`}
          >
            {/* Camera Detail */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/5 border border-white/10 z-[60]" />
            
            <div className="flex-1 bg-white overflow-y-auto no-scrollbar relative flex flex-col">
              <div 
                className="w-full origin-top transform scale-100"
                dangerouslySetInnerHTML={{ __html: selectedTemplate.bodyHTML }} 
              />
            </div>
          </motion.div>
          
          {viewMode === "desktop" && !isEditorOpen && (
            <div className="relative group">
              <motion.div 
                 layout
                 initial={{ opacity: 0, y: -5 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="w-[850px] h-3 bg-[#1a1a1f] rounded-b-xl border-t border-white/10 shadow-2xl relative z-0 -mt-2.5"
              >
                {/* Trackpad Indent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/5 rounded-full" />
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => templateToDelete && handleDelete(templateToDelete)}
        title="Purge Blueprint"
        message="Terminate this transmission sequence forever? This action is absolute."
        confirmLabel="PURGE BLUEPRINT"
      />
    </div>
  );
}

function TemplatesSkeleton() {
  return (
    <div className="h-full flex flex-col space-y-8 animate-pulse p-4">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64 opacity-40" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32 rounded-xl" />
          <Skeleton className="h-12 w-48 rounded-xl" />
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-[340px] h-[680px] bg-[#1a1a1f] rounded-[4rem] border-[10px] border-[#222] p-4 flex flex-col gap-4">
          <Skeleton className="h-40 w-full rounded-2xl opacity-40" />
          <div className="space-y-4 p-4">
             <Skeleton className="h-8 w-3/4" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-2/3" />
             <Skeleton className="h-20 w-full rounded-xl opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
