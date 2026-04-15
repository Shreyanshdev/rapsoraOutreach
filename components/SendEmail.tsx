"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Lead } from "@/lib/types";
import { DEFAULT_TEMPLATES, replaceVariables } from "@/lib/templates";
import { Send, Eye, Loader2, Plus, Paperclip, X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./Toast";
import { Skeleton } from "./ui/Skeleton";

interface AttachedFile {
  name: string;
  size: number;
  base64: string;
}

export function SendEmail() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(DEFAULT_TEMPLATES[0].id);
  const [sending, setSending] = useState(false);
  const [sendPhase, setSendPhase] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom attachments
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [includeBrochure, setIncludeBrochure] = useState(true);

  // Combine defaults with custom templates
  const templates = useMemo(() => {
    return [...DEFAULT_TEMPLATES, ...customTemplates];
  }, [customTemplates]);

  // Form state for live preview
  const [customName, setCustomName] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  
  // Custom HTML Editor states
  const [customHtml, setCustomHtml] = useState("");
  const [manualSubject, setManualSubject] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [leadsRes, templatesRes] = await Promise.all([
          fetch("/api/leads"),
          fetch("/api/templates")
        ]);
        
        const leadsData = await leadsRes.json();
        const templatesData = await templatesRes.json();
        
        if (Array.isArray(leadsData)) setLeads(leadsData);
        if (Array.isArray(templatesData)) setCustomTemplates(templatesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedLead = leads.find(l => (l._id || l.id) === selectedLeadId);
  const isCustomMode = selectedTemplateId === "custom";
  const selectedTemplate = templates.find(t => (t._id || t.id) === selectedTemplateId) || {
    id: "custom",
    name: "Custom HTML",
    subject: manualSubject,
    bodyHTML: customHtml
  };

  const previewData = {
    name: selectedLead ? selectedLead.name : customName,
    company: selectedLead ? selectedLead.company : customCompany
  };

  const previewHTML = replaceVariables(selectedTemplate.bodyHTML, previewData);
  
  // Sync subject when template or lead changes, but allow manual edits
  useEffect(() => {
    if (selectedTemplate) {
      const baseSubject = selectedTemplate.subject || "";
      const syncSubject = replaceVariables(baseSubject, previewData);
      setManualSubject(syncSubject);
    }
  }, [selectedTemplateId, selectedLeadId]);

  // File attachment handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setAttachedFiles(prev => [
          ...prev,
          { name: file.name, size: file.size, base64 }
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSend = async () => {
    const emailTo = selectedLead ? selectedLead.email : manualEmail;
    if (!emailTo) {
      toast("Target receptor email required", "error");
      return;
    }

    setSending(true);

    // Phase 1: Preparing
    setSendPhase("Preparing attachments...");
    await new Promise(r => setTimeout(r, 600));

    // Phase 2: Uploading
    const totalAttachmentSize = attachedFiles.reduce((sum, f) => sum + f.size, 0);
    const hasBigPayload = totalAttachmentSize > 1024 * 1024; // > 1MB
    setSendPhase(hasBigPayload ? `Uploading ${formatFileSize(totalAttachmentSize)} payload...` : "Uploading payload...");
    await new Promise(r => setTimeout(r, 400));

    // Phase 3: Transmitting
    setSendPhase("Deploying transmission...");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailTo,
          subject: manualSubject,
          html: previewHTML,
          includeBrochure,
          customAttachments: attachedFiles.map(f => ({
            filename: f.name,
            content: f.base64
          }))
        })
      });

      const result = await response.json();
      if (response.ok) {
        toast("Transmission deployed successfully", "success");
        setAttachedFiles([]); // Clear attachments after success
      } else {
        const errorMessage = typeof result.error === 'object' 
          ? (result.error.message || JSON.stringify(result.error)) 
          : (result.error || "Transmission failure.");
        toast(errorMessage, "error");
      }
    } catch (error) {
      toast("Engine critical failure during transmission", "error");
    } finally {
      setSending(false);
      setSendPhase("");
    }
  };

  if (loading) {
    return <SendEmailSkeleton />;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-6 overflow-hidden">
      <header className="relative space-y-1 text-center md:text-left shrink-0">
        <h1 className="text-2xl md:text-3xl font-black tracking-tightest text-white text-glow leading-none uppercase">
          Communicate
        </h1>
        <p className="text-zinc-500 text-[10px] font-medium tracking-[0.2em] max-w-lg leading-relaxed mx-auto md:mx-0 uppercase opacity-60">
          Deploy your personalized <span className="text-white">outreach sequence</span> with precision.
        </p>
      </header>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-8 text-glow-none">
        {/* Left: Controls (7 columns) — Scrolls independently */}
        <div className="xl:col-span-7 min-h-0 overflow-y-auto no-scrollbar">
          <div className="bg-white/5 glass-morphism border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Objective Selection</label>
              <div className="relative group">
                <select
                  value={selectedLeadId}
                  onChange={(e) => {
                    setSelectedLeadId(e.target.value);
                    if (e.target.value === "") {
                      setCustomName("");
                      setCustomCompany("");
                    }
                  }}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:bg-white/10 transition-all appearance-none font-medium"
                >
                  <option value="" className="bg-[#0b0b0f]">Manual Entry / Select Lead...</option>
                  {leads.map(lead => (
                    <option key={lead._id || lead.id} value={lead._id || lead.id} className="bg-[#0b0b0f]">
                      {lead.name} • {lead.company}
                    </option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-white transition-colors">
                   <Plus size={20} className="rotate-45" />
                </div>
              </div>
            </div>

            {!selectedLeadId && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Name Override</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:bg-white/10 transition-all font-light"
                    placeholder="E.g. Alexander"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Entity Override</label>
                  <input
                    type="text"
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:bg-white/10 transition-all font-light"
                    placeholder="E.g. Nexus Corp"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Email Receptor</label>
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:bg-white/10 transition-all font-light"
                    placeholder="E.g. alex@nexus.com"
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Subject Protocol</label>
              <input
                type="text"
                value={manualSubject}
                onChange={(e) => setManualSubject(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:bg-white/10 transition-all font-bold text-lg"
                placeholder="Transmission Objective..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Blueprint Protocol</label>
                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                  {templates.length} Available
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {templates.map(t => (
                  <button
                    key={t._id || t.id}
                    onClick={() => setSelectedTemplateId(t._id || t.id)}
                    className={`text-center px-4 py-4 rounded-2xl text-xs transition-all border duration-300 ${
                      selectedTemplateId === (t._id || t.id)
                        ? "bg-white text-black border-white font-black shadow-2xl shadow-white/20 scale-[1.02]" 
                        : "bg-white/5 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {t.name.split(' ')[0]}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedTemplateId("custom")}
                  className={`text-center px-4 py-4 rounded-2xl text-xs transition-all border duration-300 ${
                    selectedTemplateId === "custom" 
                      ? "bg-emerald-500 text-white border-emerald-500 font-black shadow-2xl shadow-emerald-500/20 scale-[1.02]" 
                      : "bg-white/5 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white"
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {isCustomMode && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-6 border-t border-white/5"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">HTML Content (supports [Name], [CompanyName])</label>
                  <textarea
                    value={customHtml}
                    onChange={(e) => setCustomHtml(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-6 py-6 text-white focus:outline-none focus:bg-white/10 transition-all font-mono text-xs min-h-[300px] leading-relaxed resize-none"
                    placeholder="<div style='background: #f0f...'>Hello [Name]...</div>"
                  />
                </div>
              </motion.div>
            )}

            {/* Attachment Section — Available in all modes */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Attachments</label>
                <span className="text-[9px] font-medium text-zinc-600 uppercase tracking-wider">
                  {includeBrochure ? "brochure" : "no brochure"} + {attachedFiles.length} custom
                </span>
              </div>

              {/* Brochure toggle */}
              <button
                onClick={() => setIncludeBrochure(!includeBrochure)}
                className={`flex items-center gap-3 w-full px-5 py-3 rounded-xl border transition-all text-left ${
                  includeBrochure
                    ? "bg-white/5 border-white/10 text-white"
                    : "bg-transparent border-white/5 text-zinc-600"
                }`}
              >
                <div className={`w-9 h-5 rounded-full relative transition-all ${includeBrochure ? "bg-emerald-500" : "bg-zinc-800"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${includeBrochure ? "left-[18px]" : "left-0.5"}`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold">rapsora.pdf (~18 MB)</p>
                  <p className="text-[8px] text-zinc-500">Company brochure attachment</p>
                </div>
              </button>

              {/* Attached files chips */}
              <AnimatePresence>
                {attachedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-3"
                  >
                    {attachedFiles.map((file, index) => (
                      <motion.div
                        key={`${file.name}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 group"
                      >
                        <FileText size={14} className="text-zinc-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-white truncate max-w-[140px]">{file.name}</p>
                          <p className="text-[8px] text-zinc-500 font-medium">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="p-1 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-zinc-600 transition-all"
                        >
                          <X size={10} />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.gif,.txt,.zip"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-dashed border-white/10 rounded-2xl text-zinc-400 hover:text-white hover:border-white/30 hover:bg-white/[0.08] transition-all w-full justify-center group"
              >
                <Paperclip size={16} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Attach Files</span>
              </button>
            </div>

            {/* Send Button */}
            <div className="pt-4 w-full">
              <button
                onClick={handleSend}
                disabled={sending || (!selectedLeadId && (!customName || !customCompany || !manualEmail)) || (isCustomMode && !customHtml) || !manualSubject}
                className="w-full flex flex-col items-center justify-center gap-2 px-6 md:px-10 py-4 md:py-6 bg-white text-black rounded-2xl md:rounded-[2rem] font-black text-sm md:text-xl hover:bg-zinc-200 transition-all disabled:opacity-20 disabled:scale-100 shadow-2xl shadow-white/10 scale-[1.01] active:scale-95 group uppercase tracking-widest md:tracking-normal relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  {sending ? <Loader2 size={24} className="animate-spin" /> : <Send size={20} className="md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={3} />}
                  {sending ? "TRANSMITTING..." : "DEPLOY OUTREACH"}
                </div>
                
                {/* Progress indicator */}
                {sending && sendPhase && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full space-y-2"
                  >
                    <p className="text-[10px] font-medium text-black/60 tracking-widest uppercase">{sendPhase}</p>
                    <div className="w-full h-1 bg-black/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-black/40 rounded-full"
                        initial={{ width: "5%" }}
                        animate={{ width: "95%" }}
                        transition={{ duration: 8, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Right: Live Preview (5 columns) — Scrolls independently */}
        <div className="xl:col-span-5 min-h-0 overflow-y-auto no-scrollbar space-y-4">
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-3 text-zinc-500">
              <Eye size={20} className="text-white/40" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Preview</span>
            </div>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10"></div>
            </div>
          </div>
          
          <div className="bg-white/5 glass-morphism border border-white/10 rounded-[3rem] p-2 shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden scale-100">
            <div className="bg-white/[0.03] rounded-[2rem] p-8 border-b border-white/5 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Receptor</span>
                <span className="text-sm text-zinc-300 font-mono truncate">{selectedLead ? selectedLead.email : (manualEmail || "recipient@example.com")}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Objective</span>
                <span className="text-sm text-white font-bold tracking-tight line-clamp-1">{manualSubject || "(No Subject)"}</span>
              </div>
            </div>
            <div className="bg-white h-[600px] overflow-auto rounded-[2rem] no-scrollbar">
              <div 
                className="transform scale-100 origin-top"
                dangerouslySetInnerHTML={{ __html: previewHTML || "<div style='padding:40px; color:#999; text-align:center;'>Awaiting Transmission Script...</div>" }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SendEmailSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      <header className="space-y-3">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72 opacity-40" />
      </header>
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-7 bg-white/5 border border-white/5 rounded-[3rem] p-12 space-y-10">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-4 gap-4">
               {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
            </div>
          </div>
          <Skeleton className="h-20 w-full rounded-[2rem] opacity-40" />
        </div>
        <div className="col-span-5 space-y-6">
           <div className="flex justify-between px-6">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                 <Skeleton className="h-3 w-3 rounded-full" />
                 <Skeleton className="h-3 w-3 rounded-full" />
                 <Skeleton className="h-3 w-3 rounded-full" />
              </div>
           </div>
           <div className="bg-white/5 border border-white/5 rounded-[3rem] p-8 h-[600px] space-y-8">
              <div className="space-y-4">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-full w-full rounded-[2rem] opacity-20" />
           </div>
        </div>
      </div>
    </div>
  );
}
