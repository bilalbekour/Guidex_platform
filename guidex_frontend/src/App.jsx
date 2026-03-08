import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Settings, Users, Activity, CheckCircle, Zap, Shield, Sparkles, Globe, Cpu, Layers } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/Admin/Dashboard';
import FlowBuilder from './pages/Admin/FlowBuilder';
import AgentPortal from './pages/Agent/Portal';
import ExecutionEngine from './pages/Agent/ExecutionEngine';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnterPlatform = () => {
    if (user) {
      if (user.role === 'admin' || user.is_staff) {
        navigate('/admin');
      } else {
        navigate('/agent');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#050505] text-white font-sans selection:bg-primary-500 selection:text-black">
      {/* Ultra-Premium Cinematic Background */}
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary-500/10 blur-[180px] rounded-full pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-600/5 blur-[180px] rounded-full pointer-events-none delay-1000"></div>
      
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505] pointer-events-none"></div>

      {/* Glass Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-12 py-10 max-w-7xl mx-auto w-full animate-in fade-in duration-1000">
        <div className="flex items-center gap-5 group cursor-pointer transition-transform hover:scale-105">
          <div className="relative w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-[15deg] transition-all duration-700 shadow-[0_0_50px_rgba(250,204,21,0.3)]">
             <div className="absolute w-[70%] h-[20%] bg-black/40 rounded-full blur-[1px]"></div>
             <span className="text-black font-black text-3xl italic relative z-10">G</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold tracking-tighter text-white uppercase leading-none">Guidex</span>
            <span className="text-[8px] font-bold tracking-[0.6em] text-primary-500/60 uppercase mt-1 leading-none">Operational Excellence</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-12 text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity">
            <a href="#" className="hover:text-primary-500 transition-all active:scale-90">Soluciones</a>
            <a href="#" className="hover:text-primary-500 transition-all active:scale-90">Gobernanza</a>
            <a href="#" className="hover:text-primary-500 transition-all active:scale-90">Arquitectura</a>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={handleEnterPlatform} 
            className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-primary-500 hover:text-black hover:border-primary-500 transition-all transform hover:-translate-y-1 shadow-2xl active:scale-95"
          >
            {user ? 'Acceso Corporativo' : 'Acceso Restringido'}
          </button>
        </div>
      </nav>

      {/* Main Hero Stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 text-center pb-40">
        <div className="inline-flex items-center space-x-4 bg-white/[0.03] backdrop-blur-3xl px-8 py-3 rounded-full border border-white/5 mb-16 shadow-2xl animate-in fade-in slide-in-from-top-12 duration-1000">
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-ping"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">v2.0 Deploying Operational Decorum</span>
        </div>

        <h1 className="text-7xl md:text-[8rem] font-bold tracking-tighter leading-[0.8] max-w-7xl mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          EXCELENCIA <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-white">
            OPERATIVA
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/30 max-w-4xl mx-auto font-medium leading-relaxed mb-20 animate-in fade-in duration-1000 delay-500">
          Infraestructura de procesos diseñada para organizaciones de alto prestigio. <br />
          <span className="text-white/60">Flujos de asistencia ergonómicos para la élite del sector BPO.</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
          <button 
            onClick={handleEnterPlatform} 
            className="group relative bg-primary-500 hover:bg-primary-400 text-black font-bold py-6 px-16 rounded-2xl shadow-xl transition-all transform hover:-translate-y-2 flex items-center text-xl uppercase tracking-tighter overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
            Desplegar Plataformas <ArrowRight className="ml-5 w-7 h-7 transform group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Feature Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-52 max-w-7xl w-full text-left px-12 border-t border-white/5 pt-24 animate-in fade-in duration-1000 delay-1000">
            <div className="space-y-6 group cursor-default">
                <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-black transition-all duration-500 transform group-hover:rotate-[360deg]">
                    <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold tracking-tighter">Alcance Global</h3>
                <p className="text-white/30 font-medium leading-relaxed">Sincronización masiva de procesos en tiempo real para equipos operativos distribuidos a nivel mundial.</p>
            </div>
            <div className="space-y-6 group cursor-default">
                <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-black transition-all duration-500 transform group-hover:rotate-[360deg]">
                    <Cpu className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold tracking-tighter">Núcleo Dinámico</h3>
                <p className="text-white/30 font-medium leading-relaxed">Motor de decisión React-Flow optimizado para máximo rendimiento en entornos de alta presión corporativa.</p>
            </div>
            <div className="space-y-6 group cursor-default">
                <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-black transition-all duration-500 transform group-hover:rotate-[360deg]">
                    <Layers className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold tracking-tighter">Matriz RBAC</h3>
                <p className="text-white/30 font-medium leading-relaxed">Sistema de permisos multinivel con personalización granular de roles y trazabilidad corporativa.</p>
            </div>
        </div>
      </main>

      {/* Cinematic Footer */}
      <footer className="relative z-10 border-t border-white/5 py-16 px-12 flex flex-col md:flex-row justify-between items-center bg-[#050505] text-white/20 text-[10px] font-bold tracking-[0.5em] uppercase">
        <div>© 2026 GUIDEX OPERATIONAL EXCELLENCE INC.</div>
        <div className="mt-6 md:mt-0 flex gap-12">
            <a href="#" className="hover:text-white transition-colors">Terminals</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/builder/:procedureId?" element={
            <ProtectedRoute roleRequired="admin">
              <FlowBuilder />
            </ProtectedRoute>
          } />

          {/* Agent Routes */}
          <Route path="/agent" element={
            <ProtectedRoute>
              <AgentPortal />
            </ProtectedRoute>
          } />
          <Route path="/agent/execute/:sessionId?" element={
            <ProtectedRoute>
              <ExecutionEngine />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
