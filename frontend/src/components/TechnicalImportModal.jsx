import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    X,
    FileSpreadsheet,
    Upload,
    Download,
    CheckCircle2,
    AlertTriangle,
    RefreshCw,
    Cpu,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../utils/config';

export default function TechnicalImportModal({ isOpen, onClose, onImportSuccess }) {
    const [file, setFile] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [previewError, setPreviewError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);

    const getAuthConfig = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            const original = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = original; };
        }
    }, [isOpen]);

    // Escape key
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape' && !isSaving) handleClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isSaving]);

    const handleClose = () => {
        setFile(null);
        setPreviewData(null);
        setPreviewError(null);
        setSaveSuccessMsg(null);
        onClose?.();
    };

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setSaveSuccessMsg(null);
            uploadAndPreview(selected);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files?.[0];
        if (dropped && (dropped.name.endsWith('.xlsx') || dropped.name.endsWith('.xls'))) {
            setFile(dropped);
            setSaveSuccessMsg(null);
            uploadAndPreview(dropped);
        } else {
            setPreviewError('Please drop a valid .xlsx or .xls Excel file.');
        }
    };

    // Step 1: Upload and preview
    const uploadAndPreview = async (targetFile) => {
        setIsValidating(true);
        setPreviewError(null);
        setPreviewData(null);

        const formData = new FormData();
        formData.append('file', targetFile);

        try {
            const { data } = await axios.post(
                `${API_URL}/events/technical/import/preview`,
                formData,
                {
                    headers: {
                        ...getAuthConfig().headers,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setPreviewData(data);
        } catch (err) {
            console.error('Preview error:', err);
            setPreviewError(err.response?.data?.message || err.message || 'Failed to read Excel file. Please ensure it has valid columns.');
        } finally {
            setIsValidating(false);
        }
    };

    // Step 2: Save directly to MongoDB Atlas
    const handleSaveToMongoDB = async () => {
        if (!previewData?.events) return;
        setIsSaving(true);
        setPreviewError(null);

        try {
            const validEvents = previewData.events.filter(e => e.isValid);
            const { data } = await axios.post(
                `${API_URL}/events/technical/import/execute`,
                {
                    events: validEvents,
                    mode: 'upsert', // Automatically inserts new and updates matching
                    fileName: previewData.fileName
                },
                getAuthConfig()
            );

            setSaveSuccessMsg(data.message || `Successfully saved ${data.summary?.insertedCount + data.summary?.updatedCount} events to MongoDB Atlas!`);
            onImportSuccess?.();
        } catch (err) {
            console.error('Save error:', err);
            setPreviewError(err.response?.data?.message || err.message || 'Failed to save events to database.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0c111d] border border-[#24BCE0]/40 shadow-2xl text-white overflow-hidden"
            >
                {/* Header */}
                <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-gradient-to-r from-[#0f1d35] to-[#0c111d]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#24BCE0]/20 border border-[#24BCE0]/40 flex items-center justify-center text-[#24BCE0]">
                            <Cpu size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold">Import Technical Events (Excel)</h2>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#24BCE0]/20 text-[#24BCE0] border border-[#24BCE0]/40">
                                    Technical Only
                                </span>
                            </div>
                            <p className="text-xs text-white/60">
                                Upload an Excel file to add new Technical events or update existing ones in MongoDB.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                        title="Close (Esc)"
                    >
                        <X size={20} />
                    </button>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                    {/* Excel Download Bar */}
                    <div className="flex items-center justify-between flex-wrap gap-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="text-xs text-white/70">
                            Need the current event spreadsheet with all column headers?
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={`${API_URL}/events/technical/export`}
                                download="KALAM_2026_Technical_Events.xlsx"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#24BCE0]/15 hover:bg-[#24BCE0]/25 text-[#24BCE0] border border-[#24BCE0]/30 text-xs font-semibold transition-all cursor-pointer"
                            >
                                <Download size={14} />
                                <span>Download Current Events (.xlsx)</span>
                            </a>
                        </div>
                    </div>

                    {/* Success Banner */}
                    {saveSuccessMsg && (
                        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-100 flex items-center gap-3">
                            <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                            <div>
                                <span className="font-bold text-white block">{saveSuccessMsg}</span>
                                <span className="text-xs text-emerald-300/80">The public website and admin table have been refreshed with the new data.</span>
                            </div>
                        </div>
                    )}

                    {/* Upload Box */}
                    {!saveSuccessMsg && (
                        <div>
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all cursor-pointer relative ${
                                    file ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-white/20 hover:border-[#24BCE0]/50 bg-white/[0.01]'
                                }`}
                            >
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="w-12 h-12 rounded-2xl bg-[#24BCE0]/15 border border-[#24BCE0]/30 flex items-center justify-center text-[#24BCE0]">
                                        <Upload size={22} />
                                    </div>
                                    <span className="text-sm font-bold text-white">
                                        {file ? file.name : 'Click to select or drag & drop Technical Excel file (.xlsx / .xls)'}
                                    </span>
                                    <span className="text-xs text-white/50">
                                        {file ? `${(file.size / 1024).toFixed(1)} KB (Ready to preview)` : 'Supports all Technical columns (Title, Department, Date, Venue, Prizes, Rounds, Rules)'}
                                    </span>
                                </div>
                            </div>

                            {isValidating && (
                                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#24BCE0]">
                                    <RefreshCw className="animate-spin" size={14} />
                                    <span>Reading Excel file and checking database...</span>
                                </div>
                            )}

                            {previewError && (
                                <div className="mt-3 p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2">
                                    <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={16} />
                                    <div>{previewError}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Preview Table & Summary */}
                    {previewData && !saveSuccessMsg && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2 text-xs font-semibold">
                                    <span className="text-white">Detected: {previewData.summary.totalRows} Events</span>
                                    <span className="text-emerald-400">({previewData.summary.newCount} New to add, {previewData.summary.updateCount} to update)</span>
                                </div>
                                {previewData.summary.invalidRows > 0 && (
                                    <span className="text-xs text-rose-400 font-semibold">
                                        ⚠️ {previewData.summary.invalidRows} row(s) have errors and will be skipped
                                    </span>
                                )}
                            </div>

                            {/* Simple Table */}
                            <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/40 max-h-64 overflow-y-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead className="bg-white/5 text-white/60 uppercase font-mono text-[10px] sticky top-0 backdrop-blur-md">
                                        <tr>
                                            <th className="py-2 px-3">#</th>
                                            <th className="py-2 px-3">Event Title</th>
                                            <th className="py-2 px-3">Dept</th>
                                            <th className="py-2 px-3">Date</th>
                                            <th className="py-2 px-3">Venue</th>
                                            <th className="py-2 px-3">Prize</th>
                                            <th className="py-2 px-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {previewData.events.map((evt) => (
                                            <tr key={evt.eventId || evt.rowNumber} className={`hover:bg-white/[0.02] ${!evt.isValid ? 'bg-rose-950/20 text-rose-300' : ''}`}>
                                                <td className="py-2 px-3 font-mono text-white/50 text-[11px] whitespace-nowrap">
                                                    {evt.rowRange || `#${evt.rowNumber}`}
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div className="font-medium text-white max-w-[220px] truncate" title={evt.title}>
                                                        {evt.title}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                        {evt.rounds?.length > 0 && (
                                                            <span className="text-[9px] bg-[#24BCE0]/20 text-[#24BCE0] px-1.5 py-0.5 rounded font-semibold">
                                                                {evt.rounds.length} {evt.rounds.length === 1 ? 'Round' : 'Rounds'}
                                                            </span>
                                                        )}
                                                        {evt.rules?.length > 0 && (
                                                            <span className="text-[9px] bg-amber-400/15 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
                                                                {evt.rules.length} {evt.rules.length === 1 ? 'Rule' : 'Rules'}
                                                            </span>
                                                        )}
                                                        {(evt.facultyCoordinators?.length > 0 || evt.studentCoordinators?.length > 0) && (
                                                            <span className="text-[9px] bg-purple-400/20 text-purple-300 px-1.5 py-0.5 rounded font-semibold">
                                                                {(evt.facultyCoordinators?.length || 0) + (evt.studentCoordinators?.length || 0)} Coords
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3 text-[#24BCE0] font-semibold">{evt.department || 'Technical'}</td>
                                                <td className="py-2 px-3 text-white/70 whitespace-nowrap">{evt.dateFormatted || '—'}</td>
                                                <td className="py-2 px-3 text-white/70 max-w-[120px] truncate">{evt.venue || '—'}</td>
                                                <td className="py-2 px-3 text-emerald-400 font-mono">{evt.winnerPrize || '—'}</td>
                                                <td className="py-2 px-3 text-right whitespace-nowrap">
                                                    {evt.status === 'NEW' && (
                                                        <span className="px-2 py-0.5 rounded bg-[#24BCE0]/20 text-[#24BCE0] font-bold text-[10px]">
                                                            + ADD NEW
                                                        </span>
                                                    )}
                                                    {evt.status === 'UPDATE' && (
                                                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                                                            ↻ UPDATE
                                                        </span>
                                                    )}
                                                    {evt.status === 'CONFLICT_CULTURAL' && (
                                                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                                                            🚫 CULTURAL (BLOCKED)
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Row error explanations if any */}
                            {previewData.errors?.length > 0 && (
                                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                                    <span className="font-bold block">Validation Errors:</span>
                                    {previewData.errors.map((e, idx) => (
                                        <div key={idx}>• Row {e.rowNumber} ("{e.title || 'Untitled'}"): {e.errors?.join(', ')}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="px-6 py-4 border-t border-white/10 flex items-center justify-between shrink-0 bg-[#0c111d]">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                        {saveSuccessMsg ? 'Close' : 'Cancel'}
                    </button>

                    {previewData && !saveSuccessMsg && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => { setFile(null); setPreviewData(null); }}
                                className="px-3 py-2 rounded-xl text-xs text-white/60 hover:text-white"
                            >
                                Change File
                            </button>

                            <button
                                type="button"
                                disabled={isSaving || previewData.summary.validRows === 0 || previewData.summary.conflictCount > 0}
                                onClick={handleSaveToMongoDB}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#24BCE0] to-[#1E6FD9] hover:from-[#1da7c8] hover:to-[#175cb5] disabled:opacity-50 text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-[#24BCE0]/30 active:scale-95 flex items-center gap-2"
                            >
                                {isSaving ? <RefreshCw className="animate-spin" size={15} /> : <CheckCircle2 size={16} />}
                                <span>Save Events to MongoDB</span>
                            </button>
                        </div>
                    )}
                </footer>
            </motion.div>
        </div>
    );
}
