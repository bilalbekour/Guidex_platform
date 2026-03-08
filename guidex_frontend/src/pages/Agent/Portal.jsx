import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, ArrowRight, Activity, Zap, Play, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AgentPortal() {
    const { logout } = useAuth();
    const [procedures, setProcedures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/procedures/')
            .then(res => {
                setProcedures(res.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading procedures", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-cinematic-950 font-sans relative overflow-hidden text-white selection:bg-primary-500 selection:text-black">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <header className="h-[70px] bg-cinematic-900/50 backdrop-blur-2xl border-b border-white/5 px-10 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4 group cursor-pointer transition-transform hover:scale-105">
                    <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-all shadow-lg">
                        <span className="text-black font-black text-xl">G</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tighter text-white uppercase leading-none">Guidex</h1>
                        <p className="text-[7px] font-bold text-primary-500/60 uppercase tracking-[0.4em] mt-1">Portal de Asesor</p>
                    </div>
                </div>
                <button onClick={logout} className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-6 py-2.5 rounded-xl transition-all border border-white/5">Salir</button>
            </header>

            <main className="max-w-5xl mx-auto py-16 px-8 relative z-10">
                <div className="mb-14 animate-in fade-in slide-in-from-top-8 duration-700">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-[1px] w-8 bg-primary-500"></span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">Flujos de Atención</span>
                    </div>
                    <h2 className="text-5xl font-bold text-white tracking-tighter uppercase mb-4">Procedimientos <span className="text-white/20">Disponibles</span></h2>
                    <p className="text-lg text-white/30 font-medium max-w-xl leading-relaxed">Selecciona un procedimiento para iniciar la atención asistida.</p>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent animate-spin rounded-full mb-6"></div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">Cargando Flujos...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {procedures.length === 0 ? (
                            <div className="col-span-full py-20 px-10 bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] text-center">
                                <Activity className="w-12 h-12 text-white/10 mx-auto mb-6" />
                                <p className="text-sm font-black text-white/20 uppercase tracking-[0.2em]">Bandeja de Entrada Vacía</p>
                            </div>
                        ) : (
                            procedures.map(proc => (
                                <Link 
                                    to={`/agent/execute/${proc.id}`} 
                                    key={proc.id} 
                                    className="card group hover:border-primary-500/50 flex flex-col justify-between !p-8 relative overflow-hidden transform hover:-translate-y-2"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:opacity-10 transition-opacity">
                                        <Zap className="w-24 h-24 text-primary-500" />
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary-500 transition-all">
                                            <Play className="w-5 h-5 text-primary-500 group-hover:text-black fill-current" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white tracking-tighter mb-2 group-hover:text-primary-400 transition-colors">{proc.name}</h3>
                                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mb-8 leading-relaxed">Versión del Sistema 1.0.P</p>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-primary-500 relative z-10">
                                        <span>Iniciar Flujo</span>
                                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
