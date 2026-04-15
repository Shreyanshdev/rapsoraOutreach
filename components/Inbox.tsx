"use client";

import { useState, useEffect } from "react";
import { Mail, Search, RefreshCw, Clock, Reply, Loader2, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "./ui/Skeleton";
import { useToast } from "./Toast";

export function Inbox() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [search, setSearch] = useState("");

  // Reply state
  const [replyMode, setReplyMode] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyPhase, setReplyPhase] = useState("");

  const { toast } = useToast();

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/emails");
      const data = await response.json();
      if (Array.isArray(data)) {
        setEmails(data);
      }
    } catch (error) {
      console.error("Failed to fetch emails", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const filteredEmails = emails.filter(e => 
    e.to.toLowerCase().includes(search.toLowerCase()) || 
    e.subject.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'opened': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'replied': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'delivered': return 'text-zinc-300 bg-white/5 border-white/10';
      default: return 'text-zinc-500 bg-white/5 border-white/10';
    }
  };

  const handleReply = async () => {
    if (!replyBody.trim() || !selectedEmail) return;

    setSendingReply(true);
    setReplyPhase("Preparing reply...");
    await new Promise(r => setTimeout(r, 400));
    setReplyPhase("Deploying transmission...");

    try {
      const replyHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; padding: 20px;">
          <div style="white-space: pre-wrap; font-size: 15px; line-height: 1.7; color: #333;">
${replyBody}
          </div>
          <br/>
          <div style="border-left: 3px solid #e5e7eb; padding-left: 16px; margin-top: 24px; color: #9ca3af; font-size: 13px;">
            <p style="margin: 0 0 8px; font-weight: 600; color: #6b7280;">On previous message to ${selectedEmail.to}:</p>
            <p style="margin: 0; font-style: italic;">${selectedEmail.subject}</p>
          </div>
        </div>
      `;

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedEmail.to,
          subject: `Re: ${selectedEmail.subject.replace(/^Re:\s*/i, '')}`,
          html: replyHtml,
          customAttachments: []
        })
      });

      if (response.ok) {
        toast("Reply transmitted successfully", "success");
        setReplyMode(false);
        setReplyBody("");
        fetchEmails(); // Refresh to show the new reply
      } else {
        const result = await response.json();
        const errorMessage = typeof result.error === 'object' 
          ? (result.error.message || JSON.stringify(result.error)) 
          : (result.error || "Reply transmission failure.");
        toast(errorMessage, "error");
      }
    } catch (error) {
      toast("Engine failure during reply transmission", "error");
    } finally {
      setSendingReply(false);
      setReplyPhase("");
    }
  };

  // Reset reply mode when selecting a different email
  useEffect(() => {
    setReplyMode(false);
    setReplyBody("");
  }, [selectedEmail?._id]);

  if (loading && emails.length === 0) {
    return <InboxSkeleton />;
  }

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0 shrink-0">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black tracking-tightest text-white text-glow leading-none uppercase">Inbox</h1>
          <p className="text-zinc-500 text-[10px] font-medium tracking-[0.2em] max-w-lg leading-relaxed mx-auto md:mx-0 uppercase opacity-60">
            Real-time <span className="text-white">transmission logs</span> and lead interactions.
          </p>
        </div>
        <button
          onClick={fetchEmails}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/5 text-white rounded-xl font-black text-[10px] hover:bg-white/10 transition-all shadow-xl shrink-0"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          REFRESH
        </button>
      </header>

      {/* Main Container: Two independently scrolling columns */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Email List — Scrolls independently */}
        <div className="lg:col-span-4 flex flex-col min-h-0 space-y-4">
          <div className="relative group shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
            <input
              type="text"
              placeholder="Filter by lead or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 glass-morphism border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs text-white focus:outline-none focus:bg-white/10 transition-all font-light"
            />
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredEmails.map((email, i) => (
                <motion.div
                  key={email._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedEmail(email)}
                  className={`group p-5 rounded-[1.5rem] border transition-all cursor-pointer relative overflow-hidden ${
                    selectedEmail?._id === email._id 
                      ? "bg-white border-white text-black" 
                      : "bg-white/5 border-white/5 hover:border-white/20 text-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedEmail?._id === email._id ? "bg-black/10" : "bg-white/10"}`}>
                        <Mail size={14} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">
                        {email.to.split('@')[0]}
                      </span>
                    </div>
                    <span className={`text-[8px] font-black px-2 py-1 rounded-full border uppercase tracking-tighter ${
                      selectedEmail?._id === email._id ? "border-black/10 bg-black/5" : getStatusColor(email.status)
                    }`}>
                      {email.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold truncate mb-1">{email.subject}</h3>
                  <div className="flex items-center gap-2 opacity-50 text-[9px] font-medium uppercase tracking-tighter">
                    <Clock size={10} />
                    {formatDistanceToNow(new Date(email.createdAt))} ago
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredEmails.length === 0 && !loading && (
              <div className="h-40 flex flex-col items-center justify-center text-zinc-600 space-y-4">
                <Mail size={32} className="opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Silence in Sector 7</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detail View — Scrolls independently */}
        <div className="lg:col-span-8 min-h-0 bg-white/5 glass-morphism rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {selectedEmail ? (
              <motion.div 
                key={selectedEmail._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col min-h-0"
              >
                {/* Detail Header — Sticky */}
                <div className="p-6 md:p-8 border-b border-white/10 bg-white/[0.02] shrink-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">To:</span>
                        <span className="text-sm font-bold text-white">{selectedEmail.to}</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-black text-white tracking-tightest leading-tight">
                        {selectedEmail.subject}
                      </h2>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <div className="bg-white/5 px-4 py-2 rounded-xl text-center border border-white/5">
                        <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Status</div>
                        <div className="text-[10px] font-bold text-white uppercase">{selectedEmail.status}</div>
                      </div>
                      <div className="bg-white/5 px-4 py-2 rounded-xl text-center border border-white/5">
                        <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Sender</div>
                        <div className="text-[10px] font-bold text-zinc-300 uppercase truncate max-w-[80px]">{selectedEmail.userName || "System"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Content Body — Scrolls independently */}
                <div className="flex-1 min-h-0 overflow-y-auto bg-white rounded-t-[2rem] mt-2 no-scrollbar">
                  <div className="p-6 md:p-10">
                    <div 
                      className="prose prose-sm font-sans max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHTML }} 
                    />
                  </div>
                </div>

                {/* Footer Actions / Reply — Sticky bottom */}
                <div className="bg-white border-t border-zinc-100 shrink-0">
                  <AnimatePresence mode="wait">
                    {replyMode ? (
                      <motion.div
                        key="reply-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-6 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Reply size={16} className="text-zinc-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                              Replying to {selectedEmail.to.split('@')[0]}
                            </span>
                          </div>
                          <button
                            onClick={() => { setReplyMode(false); setReplyBody(""); }}
                            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                          >
                            <X size={14} className="text-zinc-400" />
                          </button>
                        </div>

                        <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-1">
                          <textarea
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            placeholder="Write your reply..."
                            rows={4}
                            className="w-full bg-transparent px-4 py-3 text-sm text-zinc-800 resize-none outline-none placeholder:text-zinc-400"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          {sendingReply && replyPhase && (
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{replyPhase}</p>
                          )}
                          {!sendingReply && <div />}
                          <button
                            onClick={handleReply}
                            disabled={sendingReply || !replyBody.trim()}
                            className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl font-black text-xs hover:bg-zinc-800 transition-all disabled:opacity-30"
                          >
                            {sendingReply ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            {sendingReply ? "SENDING..." : "SEND REPLY"}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="reply-button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6 flex justify-end"
                      >
                        <button
                          onClick={() => setReplyMode(true)}
                          className="px-8 py-4 bg-black text-white rounded-2xl font-black text-xs hover:bg-zinc-800 transition-all flex items-center gap-2"
                        >
                          <Reply size={14} />
                          REPLY TO THREAD
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center animate-pulse">
                  <Mail size={40} className="text-zinc-700" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-zinc-500 tracking-tightest uppercase">Select Transmission</h3>
                  <p className="text-zinc-600 text-[10px] font-medium tracking-[0.3em] uppercase max-w-xs">
                    View deep telemetry for <span className="text-zinc-400">individual communications</span>.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function InboxSkeleton() {
  return (
    <div className="h-full flex flex-col space-y-6 animate-pulse">
      <header className="flex justify-between items-end gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-3 w-64 opacity-40" />
        </div>
        <Skeleton className="h-12 w-32 rounded-xl" />
      </header>
      
      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        <div className="col-span-4 space-y-4">
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-[1.5rem] space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12 rounded-full opacity-40" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-16 opacity-30" />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-8 bg-white/5 border border-white/5 rounded-[2.5rem] p-12 space-y-8">
           <div className="flex justify-between">
             <div className="space-y-4">
               <Skeleton className="h-3 w-20 opacity-40" />
               <Skeleton className="h-12 w-64" />
             </div>
             <div className="flex gap-3">
               <Skeleton className="h-12 w-20 rounded-xl" />
               <Skeleton className="h-12 w-20 rounded-xl" />
             </div>
           </div>
           <Skeleton className="h-[400px] w-full rounded-[2.5rem] opacity-20" />
        </div>
      </div>
    </div>
  );
}
