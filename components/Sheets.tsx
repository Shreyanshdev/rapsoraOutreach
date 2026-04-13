"use client";

import { useState, useEffect } from "react";
import { 
  Database, 
  Plus, 
  Trash2, 
  Search, 
  Table as TableIcon, 
  MoreVertical, 
  Save, 
  X, 
  FileSpreadsheet,
  ChevronRight,
  Filter,
  Download,
  Loader2,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/Toast";
import { ConfirmationModal } from "./ConfirmationModal";
import { Skeleton } from "./ui/Skeleton";

interface Sheet {
  _id: string;
  name: string;
  columns: string[];
  type: 'fixed' | 'custom';
}

interface SheetRow {
  _id: string;
  data: Record<string, string>;
}

export function Sheets() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [activeSheet, setActiveSheet] = useState<Sheet | null>(null);
  const [rows, setRows] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowsLoading, setRowsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sheetToActions, setSheetToActions] = useState<Sheet | null>(null);
  
  // New Sheet Form
  const [newSheetName, setNewSheetName] = useState("");
  const [newSheetColumns, setNewSheetColumns] = useState<string[]>(["Name", "Status"]);
  
  // Editing State
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const { toast } = useToast();

  useEffect(() => {
    fetchSheets();
  }, []);

  useEffect(() => {
    if (activeSheet) {
      fetchRows(activeSheet._id);
    }
  }, [activeSheet]);

  const fetchSheets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sheets");
      const data = await res.json();
      setSheets(data);
      if (data.length > 0 && !activeSheet) {
        setActiveSheet(data[0]);
      }
    } catch (err) {
      toast("Failed to fetch records engine.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchRows = async (sheetId: string) => {
    try {
      setRowsLoading(true);
      const res = await fetch(`/api/sheets/${sheetId}/rows`);
      const data = await res.json();
      setRows(data);
    } catch (err) {
      toast("Unable to load row data.", "error");
    } finally {
      setRowsLoading(false);
    }
  };

  const createSheet = async () => {
    if (!newSheetName || newSheetColumns.length === 0) return;
    try {
      // Add Log Date & Time column if not present
      const finalColumns = [...new Set([...newSheetColumns, "Log Date & Time"])];
      
      const res = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSheetName, columns: finalColumns })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setSheets([...sheets, data]);
      setActiveSheet(data);
      setIsCreateModalOpen(false);
      setNewSheetName("");
      setNewSheetColumns(["Name", "Status"]);
      toast(`New sheet '${newSheetName}' initialized.`, "success");
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  const deleteSheet = async () => {
    if (!sheetToActions) return;
    try {
      const res = await fetch(`/api/sheets/${sheetToActions._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      const updatedSheets = sheets.filter(s => s._id !== sheetToActions._id);
      setSheets(updatedSheets);
      if (activeSheet?._id === sheetToActions._id) {
        setActiveSheet(updatedSheets[0] || null);
      }
      setIsDeleteModalOpen(false);
      toast("Sheet and associated records removed.", "success");
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  const addRow = async () => {
    if (!activeSheet) return;
    try {
      const now = new Date();
      const timestamp = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + " | " + now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      const initialData: Record<string, string> = {};
      activeSheet.columns.forEach(col => {
        if (col === "Log Date & Time") {
          initialData[col] = timestamp;
        } else {
          initialData[col] = "";
        }
      });
      
      const res = await fetch(`/api/sheets/${activeSheet._id}/rows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: initialData })
      });
      const data = await res.json();
      setRows([data, ...rows]);
      setEditingRowId(data._id);
      setEditValues(data.data);
    } catch (err) {
      toast("Failed to add new record row.", "error");
    }
  };

  const saveRow = async (rowId: string) => {
    if (!activeSheet) return;
    try {
      const res = await fetch(`/api/sheets/${activeSheet._id}/rows`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowId, data: editValues })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setRows(rows.map(r => r._id === rowId ? data : r));
      setEditingRowId(null);
      toast("Record updated successfully.", "success");
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  const removeRow = async (rowId: string) => {
    if (!activeSheet) return;
    try {
      const res = await fetch(`/api/sheets/${activeSheet._id}/rows?rowId=${rowId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setRows(rows.filter(r => r._id !== rowId));
      toast("Row removed from matrix.", "success");
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  const exportCSV = () => {
    if (!activeSheet || rows.length === 0) return;
    
    const headers = activeSheet.columns.join(",");
    const csvContent = [
      headers,
      ...rows.map(row => 
        activeSheet.columns.map(col => `"${row.data[col]?.replace(/"/g, '""') || ''}"`).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeSheet.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast("CSV synchronization complete.", "success");
  };

  const filteredRows = rows.filter(row => 
    Object.values(row.data).some(val => 
      val?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return <SheetsSkeleton />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] gap-6">
      {/* Top Navigation Bar (Refined Header Catalog) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] glass-morphism border border-white/5 p-6 rounded-[2rem] overflow-hidden shrink-0">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 md:pb-0 flex-1">
          <div className="flex items-center gap-2 pr-6 border-r border-white/10 shrink-0">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Catalogs</h2>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
            >
              <Plus size={14} className="text-white" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {sheets.map(sheet => (
              <button
                key={sheet._id}
                onClick={() => setActiveSheet(sheet)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all border whitespace-nowrap group ${
                  activeSheet?._id === sheet._id 
                  ? "bg-white border-white text-black shadow-lg shadow-white/10 scale-105" 
                  : "bg-white/[0.02] border-white/5 text-zinc-500 hover:bg-white/[0.05]"
                }`}
              >
                <FileSpreadsheet size={14} className={activeSheet?._id === sheet._id ? "text-black" : "text-zinc-600 transition-colors group-hover:text-white"} />
                <span className="text-xs font-bold tracking-tight">{sheet.name}</span>
                {sheet.type === 'custom' && activeSheet?._id === sheet._id && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSheetToActions(sheet);
                      setIsDeleteModalOpen(true);
                    }}
                    className="ml-1 p-1 rounded-md hover:bg-red-500/10 text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-hover:text-white" size={14} />
              <input 
                type="text" 
                placeholder="Lookup..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900/50 border border-white/5 rounded-xl px-10 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-white/20 transition-all w-48"
              />
            </div>
            <button 
              onClick={addRow}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-black text-xs hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
            >
              <Plus size={14} strokeWidth={3} />
              ENTRY
            </button>
        </div>
      </div>

      {/* Main Grid View (Now with full width) */}
      <div className="flex-1 min-w-0 flex flex-col bg-white/[0.02] glass-morphism border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="flex-1 overflow-auto no-scrollbar">
          {rowsLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <LeadsSkeleton />
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-30">
              <Database size={64} className="text-zinc-800" />
              <p className="font-black text-[10px] uppercase tracking-[0.4em]">Empty Dataspace</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                  {activeSheet?.columns.map(col => (
                    <th key={col} className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-2">
                        {col === "Log Date & Time" && <Calendar size={12} className="opacity-50" />}
                        {col}
                      </div>
                    </th>
                  ))}
                  <th className="px-8 py-5 text-right text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRows.map((row) => (
                  <motion.tr 
                    key={row._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`hover:bg-white/[0.01] transition-colors group ${editingRowId === row._id ? "bg-white/[0.03]" : ""}`}
                  >
                    {activeSheet?.columns.map(col => (
                      <td key={col} className="px-8 py-4">
                        {editingRowId === row._id ? (
                          <input 
                            type="text"
                            value={editValues[col] || ""}
                            onChange={(e) => setEditValues({ ...editValues, [col]: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 font-medium"
                            placeholder="..."
                            autoFocus={activeSheet.columns[0] === col}
                            readOnly={col === "Log Date & Time"}
                          />
                        ) : (
                          <div className="flex flex-col">
                            {col === "Log Date & Time" ? (
                              <span className="text-[11px] font-mono text-zinc-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 w-fit">
                                {row.data[col]}
                              </span>
                            ) : (
                              <span className={`text-sm font-medium ${row.data[col] ? "text-zinc-300" : "text-zinc-700 italic"}`}>
                                {row.data[col] || "---"}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingRowId === row._id ? (
                          <>
                            <button 
                              onClick={() => saveRow(row._id)}
                              className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/10"
                            >
                              <Save size={16} />
                            </button>
                            <button 
                              onClick={() => setEditingRowId(null)}
                              className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => {
                                setEditingRowId(row._id);
                                setEditValues(row.data);
                              }}
                              className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                              title="Edit Entry"
                            >
                              <MoreVertical size={16} />
                            </button>
                            <button 
                              onClick={() => removeRow(row._id)}
                              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Remove Entry"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <footer className="px-8 py-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] leading-none">
            {filteredRows.length} RECORDS IN SHREAD SYNC • {activeSheet?.name.toUpperCase()}
          </p>
          <div className="flex gap-4">
             <button 
               onClick={exportCSV}
               disabled={rows.length === 0}
               className="text-[9px] font-black text-white bg-white/5 border border-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed group"
             >
                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                Dumping Core (CSV)
             </button>
          </div>
        </footer>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsCreateModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
              
              <h2 className="text-3xl font-black text-white mb-2 tracking-tightest uppercase italic">Initialize Catalog</h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8 opacity-60">Define your structural metadata.</p>
              
              <div className="space-y-6 mb-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Catalog Name</label>
                  <input 
                    type="text" 
                    value={newSheetName}
                    onChange={(e) => setNewSheetName(e.target.value)}
                    placeholder="e.g. Pipeline Alpha"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Columns (Comma separated)</label>
                  <input 
                    type="text" 
                    value={newSheetColumns.join(", ")}
                    onChange={(e) => setNewSheetColumns(e.target.value.split(",").map(c => c.trim()).filter(c => c !== ""))}
                    placeholder="Name, Phone, Industry..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-bold font-mono text-sm tracking-tighter"
                  />
                  <p className="text-[9px] text-zinc-500 font-medium ml-2">Note: 'Log Date & Time' is added automatically.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-8 py-4 bg-white/5 text-zinc-500 rounded-2xl font-black text-xs hover:bg-white/10 transition-all uppercase tracking-widest"
                >
                  Terminate
                </button>
                <button 
                  onClick={createSheet}
                  className="flex-1 px-8 py-4 bg-white text-black rounded-2xl font-black text-xs hover:bg-zinc-200 transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                >
                  <Save size={14} />
                  Authorize
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteSheet}
        title="Purge Matrix?"
        message={`Are you sure you want to permanently delete '${sheetToActions?.name}' and all associated records?`}
        confirmLabel="PURGE"
        cancelLabel="ABORT"
        type="danger"
      />
    </div>
  );
}

function SheetsSkeleton() {
  return (
    <div className="flex flex-col h-full gap-6 animate-pulse p-4">
      <div className="h-24 w-full bg-white/5 border border-white/5 rounded-[2rem] flex items-center px-8 gap-8">
        <Skeleton className="h-10 w-32" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>
      <div className="flex-1 bg-white/5 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
        <header className="flex justify-between border-b border-white/5 pb-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </header>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between py-4 border-b border-white/5 opacity-40">
             <Skeleton className="h-6 w-48" />
             <Skeleton className="h-6 w-32" />
             <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadsSkeleton() {
  return (
    <div className="p-8 space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex justify-between border-b border-white/5 py-4 last:border-0">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48 opacity-40" />
          </div>
          <div className="flex items-center gap-3">
             <Skeleton className="h-4 w-24" />
             <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
