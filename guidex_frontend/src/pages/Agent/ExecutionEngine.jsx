import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft, ChevronRight, CheckCircle, 
    AlertCircle, Clock, Map, MessageSquare, 
    Zap, Sparkles, Image as ImageIcon, Volume2, ShieldCheck, History, X
} from 'lucide-react';

export default function ExecutionEngine() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [procedure, setProcedure] = useState(null);
    const [currentNode, setCurrentNode] = useState(null);
    const [sessionStatus, setSessionStatus] = useState('IN_PROGRESS');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Robust ID handling (strip 'live_' if present)
        const id = sessionId ? sessionId.replace('live_', '') : '1';
        
        axios.get(`http://127.0.0.1:8000/api/procedures/${id}/`)
            .then(res => {
                const proc = res.data;
                setProcedure(proc);
                if (proc.versions?.length > 0) {
                    const latest = proc.versions.sort((a,b) => b.version_number - a.version_number)[0];
                    const startNode = latest.nodes.find(n => n.is_start_node) || latest.nodes[0];
                    setCurrentNode(startNode);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading execution data", err);
                setLoading(false);
            });
    }, [sessionId]);

    const handleAction = (edge) => {
        const nextNode = procedure.versions[0].nodes.find(n => n.id === edge.target_node);
        setHistory([...history, { node: currentNode, edge }]);
        if (nextNode) {
            setCurrentNode(nextNode);
        } else {
            setSessionStatus('COMPLETED');
        }
    };

    const handleBack = () => {
        if (history.length === 0) {
            navigate('/agent');
            return;
        }
        const lastStep = history[history.length - 1];
        setHistory(history.slice(0, -1));
        setCurrentNode(lastStep.node);
    };

    const handleRestart = () => {
        setSessionStatus('IN_PROGRESS');
        setHistory([]);
        if (procedure?.versions?.length > 0) {
            const latest = procedure.versions.sort((a,b) => b.version_number - a.version_number)[0];
            const startNode = latest.nodes.find(n => n.is_start_node) || latest.nodes[0];
            setCurrentNode(startNode);
        }
    };

    if (loading) return (
        <div className="h-screen bg-cinematic-950 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent animate-spin rounded-full mb-6"></div>
            <p className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.4em]">Preparando Flujo...</p>
        </div>
    );

    if (sessionStatus === 'COMPLETED') return (
        <div className="min-h-screen bg-cinematic-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500 shadow-xl">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">Flujo <span className="text-emerald-400">Completado</span></h2>
            <p className="text-white/30 text-base font-medium max-w-md mx-auto mb-10 animate-in fade-in duration-700">El flujo de atención se ha completado. Los registros han sido procesados.</p>
            <div className="flex gap-4 items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <button onClick={handleRestart} className="btn-primary !py-2.5 !px-8 !text-[10px]">Reiniciar Flujo</button>
                <Link to="/agent" className="btn-secondary !py-2.5 !px-8 !text-[10px]">Cerrar</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-cinematic-950 flex flex-col font-sans text-white overflow-hidden relative selection:bg-primary-500 selection:text-black">
            {/* Cinematic Overlay */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none"></div>

            {/* Step-by-Step Centered Flow */}
            <div className="flex-1 flex flex-col items-center">
                {/* Minimal Top Header */}
                <header className="w-full h-[60px] px-8 flex items-center justify-between z-40 bg-cinematic-900/30 backdrop-blur-xl border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBack} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/30 transition-all border border-white/5 hover:text-white">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight">{procedure?.name}</h1>
                            <p className="text-[7px] font-bold text-primary-500/60 uppercase tracking-[0.3em] mt-1">ID Nodo: {currentNode?.id || '—'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/10">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[8px] font-bold uppercase tracking-widest leading-none">Guidex Assist</span>
                    </div>
                </header>

                <div className="flex-1 w-full max-w-3xl flex flex-col justify-center p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-8 duration-[800ms] cubic-bezier(0.2, 0, 0, 1)">
                    <div className="card !p-8 lg:!p-10 border-t-2 border-primary-500 relative group">
                        {/* Progress Indicator */}
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-5 transition-opacity">
                            <Zap className="w-40 h-40" />
                        </div>

                        <div className="relative z-10">
                             <div className="flex items-center gap-4 mb-6">
                                <div className="px-3 py-1 bg-primary-500 rounded-lg text-black text-[9px] font-bold uppercase tracking-widest">
                                    Paso {history.length + 1}
                                </div>
                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">v2026.03</span>
                            </div>

                            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tighter leading-[1.1] mb-8">
                                {currentNode?.title}
                            </h2>

                            {currentNode?.image && (
                                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 mb-8 transform group-hover:scale-[1.01] transition-all duration-700">
                                    <img 
                                        src={currentNode.image.startsWith('http') ? currentNode.image : `http://127.0.0.1:8000${currentNode.image}`} 
                                        className="w-full h-auto max-h-[300px] object-contain mx-auto"
                                        alt="Visual Reference"
                                    />
                                </div>
                            )}

                             {currentNode?.content && (
                                <div className="bg-white/5 border-l-2 border-primary-500 p-6 rounded-r-xl mb-10">
                                    <div className="flex items-center gap-2 mb-2 text-primary-500/70">
                                        <Volume2 className="w-4 h-4" />
                                        <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Guía Operativa</span>
                                    </div>
                                    <p className="text-base text-white/60 font-medium leading-relaxed">{currentNode.content}</p>
                                </div>
                            )}

                            {/* Response Matrix */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {currentNode?.outgoing_edges?.map((edge) => (
                                    <button
                                        key={edge.id}
                                        onClick={() => handleAction(edge)}
                                        className="group relative flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-primary-500/30 transition-all text-left transform active:scale-[0.98]"
                                    >
                                         <span className="text-base font-bold tracking-tighter group-hover:text-primary-400 transition-colors">{edge.label || 'Siguiente'}</span>
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary-500 transition-all border border-white/5">
                                            <ChevronRight className="w-4 h-4 group-hover:text-black" />
                                        </div>
                                    </button>
                                ))}
                                {(!currentNode?.outgoing_edges || currentNode.outgoing_edges.length === 0) && (
                                     <button
                                        onClick={() => setSessionStatus('COMPLETED')}
                                        className="col-span-full group relative flex items-center justify-center p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all text-center transform active:scale-[0.98]"
                                    >
                                        <span className="text-base font-bold tracking-tighter text-emerald-400 group-hover:text-emerald-300">Finalizar Atención</span>
                                        <CheckCircle className="ml-3 w-5 h-5 text-emerald-500" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Step History Trace (Floating Footer) */}
                    <div className="mt-12 flex justify-center gap-2">
                        {history.map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-500/40"></div>
                        ))}
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
