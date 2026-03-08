import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    Settings, Plus, Activity, Clock, LogOut, 
    AlertTriangle, Users as UsersIcon, ShieldCheck, 
    LayoutDashboard, UserPlus, ChevronRight, Mail, Trash2, Edit3, X, Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function AdminDashboard() {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, users, permissions
    const [procedures, setProcedures] = useState([]);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [modal, setModal] = useState({ open: false, type: null, data: null });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [procRes, userRes, roleRes] = await Promise.all([
                axios.get(`${API_BASE}/procedures/`),
                axios.get(`${API_BASE}/users/`),
                axios.get(`${API_BASE}/roles/`)
            ]);
            setProcedures(procRes.data || []);
            setUsers(userRes.data || []);
            setRoles(roleRes.data || []);
        } catch (err) {
            console.error("Error loading admin data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveRole = async (roleData) => {
        try {
            if (roleData.id) {
                await axios.patch(`${API_BASE}/roles/${roleData.id}/`, roleData);
            } else {
                await axios.post(`${API_BASE}/roles/`, roleData);
            }
            setModal({ open: false, type: null, data: null });
            fetchData();
        } catch (err) {
            alert("Error al guardar el rol");
        }
    };

    const handleSaveUser = async (userData) => {
        try {
            // Simplified for demo: in a real app would handle passwords etc.
            if (userData.id) {
                await axios.patch(`${API_BASE}/users/${userData.id}/`, userData);
            } else {
                await axios.post(`${API_BASE}/users/`, { ...userData, password: 'defaultPassword123' });
            }
            setModal({ open: false, type: null, data: null });
            fetchData();
        } catch (err) {
            alert("Error al guardar el usuario");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este operativo?")) return;
        try {
            await axios.delete(`${API_BASE}/users/${id}/`);
            fetchData();
        } catch (err) {
            alert("Error al eliminar");
        }
    };

    const renderDashboard = () => (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="h-[1px] w-8 bg-primary-500"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Inteligencia de Negocio</span>
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Panel de <span className="text-white/20">Control</span></h2>
                </div>
                <Link to="/admin/builder" className="btn-primary group !py-2.5 !px-6 !text-[10px]">
                    <Plus className="mr-2 w-4 h-4 inline-block group-hover:rotate-90 transition-transform" /> Crear Master Flow
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: 'Flujos Operativos', value: procedures.length, icon: Activity, color: 'text-primary-500', bg: 'bg-primary-500/5' },
                    { label: 'Eficiencia Global', value: '94.8%', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/5' },
                    { label: 'Tiempo Promedio', value: '3m 42s', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/5' }
                ].map((stat, i) => (
                    <div key={i} className={`card !p-8 group relative overflow-hidden`}>
                        <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
                            <stat.icon className="w-16 h-16" />
                        </div>
                        <h3 className="text-white/30 font-black mb-2 text-[10px] uppercase tracking-[0.3em] font-display">{stat.label}</h3>
                        <p className={`text-5xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="card !p-0 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Procedimientos Guardados</h3>
                    <div className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40">Total: {procedures.length}</div>
                </div>

                <div className="p-3">
                    {procedures.length === 0 ? (
                        <div className="text-center py-20 opacity-10"><Plus className="w-12 h-12 mx-auto mb-6" /><p className="text-sm">No hay datos</p></div>
                    ) : (
                        <div className="grid gap-3">
                            {procedures.map(proc => (
                                <div key={proc.id} className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.05] hover:border-primary-500/30 transition-all group">
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mr-8 text-primary-500 font-bold text-2xl border border-white/5 group-hover:bg-primary-500 group-hover:text-black transition-all">{proc.name.charAt(0)}</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">{proc.name}</h4>
                                            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] flex items-center"><span className="w-2 h-2 rounded-full bg-primary-500 mr-3 animate-pulse"></span> v{proc.versions?.length || 1}</p>
                                        </div>
                                    </div>
                                    <Link to={`/admin/builder/${proc.id}`} className="flex items-center text-white/40 hover:text-white bg-white/5 hover:bg-primary-500/20 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Editor <ChevronRight className="ml-3 w-4 h-4" /></Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2"><span className="h-[1px] w-8 bg-primary-500"></span><span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Capital Humano</span></div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Gestión de <span className="text-white/20">Personal</span></h2>
                </div>
                <button onClick={() => setModal({ open: true, type: 'user', data: { username: '', email: '', is_staff: false, is_active: true } })} className="btn-primary !py-2.5 !px-6 !text-[10px] flex items-center">
                    <UserPlus className="mr-2 w-4 h-4" /> Añadir Usuario
                </button>
            </header>

            <div className="card !p-0 overflow-hidden">
                <table className="w-full text-left font-display">
                    <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                            <th className="px-10 py-8 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Identidad</th>
                            <th className="px-10 py-8 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Privilegios</th>
                            <th className="px-10 py-8 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Estado</th>
                            <th className="px-10 py-8 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] text-right">Mantenimiento</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-10 py-8">
                                    <div className="flex items-center text-white">
                                        <div className="w-14 h-14 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold mr-6 text-xl border border-primary-500/20 group-hover:bg-primary-500 group-hover:text-black transition-all uppercase">{user.username.charAt(0)}</div>
                                        <div><p className="font-bold text-white text-lg uppercase">{user.username}</p><p className="text-[10px] text-white/30 font-bold tracking-widest">{user.email}</p></div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${user.is_staff ? 'bg-primary-500/20 text-primary-500' : 'bg-white/5 text-white/40'}`}>{user.is_staff ? 'Administrador' : 'Agente'}</span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center"><span className={`w-2.5 h-2.5 rounded-full mr-3 ${user.is_active ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-red-500'}`}></span><span className="text-[10px] font-black uppercase tracking-widest text-white/60">{user.is_active ? 'Activo' : 'Offline'}</span></div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setModal({ open: true, type: 'user', data: user })} className="p-3 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="p-3 bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderPermissions = () => (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2"><span className="h-[1px] w-8 bg-primary-500"></span><span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Seguridad</span></div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Roles y <span className="text-white/20">Permisos</span></h2>
                </div>
                <button onClick={() => setModal({ open: true, type: 'role', data: { name: '', description: '', can_create_flows: false, can_edit_flows: false, can_manage_users: false, can_execute_flows: true } })} className="btn-primary !py-2.5 !px-6 !text-[10px] flex items-center">
                    <Plus className="mr-2 w-4 h-4" /> Nuevo Rol
                </button>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {roles.map(role => (
                    <div key={role.id} className="card border-t-4 border-t-primary-500 flex flex-col relative group transition-all hover:-translate-y-1">
                         <div className="absolute top-0 right-0 p-8 opacity-[0.03] transition-opacity"><ShieldCheck className="w-24 h-24 text-primary-500" /></div>
                        <h3 className="text-2xl font-bold mb-2 text-white tracking-tighter uppercase">{role.name}</h3>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-8 border-b border-white/5 pb-4">{role.description || 'Sin descripción corporativa'}</p>
                        
                        <div className="space-y-6 flex-1">
                            {[
                                { lab: 'Creación de Flujos', val: role.can_create_flows },
                                { lab: 'Edición Operativa', val: role.can_edit_flows },
                                { lab: 'Gestión de Personal', val: role.can_manage_users },
                                { lab: 'Ejecución en Vivo', val: role.can_execute_flows }
                            ].map((perm, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${perm.val ? 'text-white' : 'text-white/10'}`}>{perm.lab}</span>
                                    <div className={`w-3 h-3 rounded-full ${perm.val ? 'bg-primary-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-white/5'}`}></div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setModal({ open: true, type: 'role', data: role })} className="w-full mt-10 py-4 bg-white/5 hover:bg-primary-500 hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Editar Matriz</button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-cinematic-950 flex font-sans overflow-hidden text-white selection:bg-primary-500 selection:text-black">
            {/* Sidebar */}
            <aside className="w-64 bg-cinematic-900 border-r border-white/5 flex flex-col justify-between p-8 relative z-30 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[200px] bg-primary-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                <div>
                    <div className="flex items-center gap-4 mb-12 group">
                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg">
                            <span className="text-black font-black text-xl">G</span>
                        </div>
                        <div><h1 className="text-xl font-bold text-white uppercase tracking-tighter leading-none">Guidex</h1><p className="text-[7px] font-bold text-primary-500/60 uppercase tracking-[0.4em] mt-1">Sistemas</p></div>
                    </div>
                    <nav className="space-y-2">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                            { id: 'users', label: 'Personal', icon: UsersIcon },
                            { id: 'permissions', label: 'Seguridad', icon: ShieldCheck }
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center px-4 py-3.5 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary-500 text-black shadow-lg' : 'text-white/30 hover:bg-white/5 hover:text-white'}`}><tab.icon className="mr-3 w-4 h-4" /> {tab.label}</button>
                        ))}
                    </nav>
                </div>
                <button onClick={logout} className="flex items-center w-full px-5 py-4 rounded-xl font-black text-[9px] uppercase tracking-widest text-white/20 hover:bg-red-500/10 hover:text-red-400 transition-all"><LogOut className="mr-4 w-4 h-4" /> Salir</button>
            </aside>

            {/* Main Area */}
            <main className="flex-1 p-12 overflow-y-auto relative z-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                <div className="max-w-6xl mx-auto w-full">
                    {loading ? (
                        <div className="py-40 flex flex-col items-center"><div className="w-16 h-16 border-4 border-primary-500 border-t-transparent animate-spin rounded-full mb-8"></div><p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em]">Sincronizando Guidex Core...</p></div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && renderDashboard()}
                            {activeTab === 'users' && renderUsers()}
                            {activeTab === 'permissions' && renderPermissions()}
                        </>
                    )}
                </div>
            </main>


            {/* Management Portal Modal */}
            {modal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="card w-full max-w-2xl relative animate-in zoom-in-95 duration-300">
                        <button onClick={() => setModal({ open: false })} className="absolute top-10 right-10 text-white/20 hover:text-white"><X className="w-8 h-8" /></button>
                        
                        <div className="mb-12">
                            <h3 className="text-3xl font-bold uppercase tracking-tighter mb-2">{modal.type === 'user' ? 'Gestión de Usuario' : 'Configuración de Rol'}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Panel de Administración Guidex</p>
                        </div>

                        <div className="space-y-8">
                            {modal.type === 'user' ? (
                                <>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div><label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 block">Nombre de Agente</label><input type="text" className="input-field" value={modal.data.username} onChange={e => setModal({...modal, data: {...modal.data, username: e.target.value}})} /></div>
                                        <div><label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 block">Email Despliegue</label><input type="email" className="input-field" value={modal.data.email} onChange={e => setModal({...modal, data: {...modal.data, email: e.target.value}})} /></div>
                                    </div>
                                    <div className="flex gap-10">
                                        <button onClick={() => setModal({...modal, data: {...modal.data, is_staff: !modal.data.is_staff}})} className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${modal.data.is_staff ? 'bg-primary-500 text-black border-primary-500' : 'bg-white/5 text-white/40 border-white/10'}`}>Administrador</button>
                                        <button onClick={() => setModal({...modal, data: {...modal.data, is_active: !modal.data.is_active}})} className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${modal.data.is_active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>{modal.data.is_active ? 'Estado: Activo' : 'Estado: Offline'}</button>
                                    </div>
                                    <button onClick={() => handleSaveUser(modal.data)} className="btn-primary w-full py-6 flex items-center justify-center"><Save className="w-5 h-5 mr-3" /> Aplicar Configuración</button>
                                </>
                            ) : (
                                <>
                                    <div><label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 block">Nombre del Rol</label><input type="text" className="input-field" value={modal.data.name} onChange={e => setModal({...modal, data: {...modal.data, name: e.target.value}})} /></div>
                                    <div><label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 block">Descripción Operativa</label><textarea className="input-field h-24" value={modal.data.description} onChange={e => setModal({...modal, data: {...modal.data, description: e.target.value}})} /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'can_create_flows', label: 'Crear Flujos' },
                                            { id: 'can_edit_flows', label: 'Editar Flujos' },
                                            { id: 'can_manage_users', label: 'Gestionar Equipo' },
                                            { id: 'can_execute_flows', label: 'Ejecutar' }
                                        ].map(perm => (
                                            <button 
                                                key={perm.id}
                                                onClick={() => setModal({...modal, data: {...modal.data, [perm.id]: !modal.data[perm.id]}})}
                                                className={`p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between border ${modal.data[perm.id] ? 'bg-primary-500/10 border-primary-500/50 text-white' : 'bg-white/5 border-white/10 text-white/20'}`}
                                            >
                                                {perm.label} {modal.data[perm.id] ? <CheckCircle className="w-4 h-4 text-primary-500" /> : <div className="w-4 h-4 rounded-full border border-white/20"></div>}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => handleSaveRole(modal.data)} className="btn-primary w-full py-6 flex items-center justify-center"><Save className="w-5 h-5 mr-3" /> Re-calibrar Matriz</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const CheckCircle = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>);
