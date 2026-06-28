import React, { useState } from 'react';
import { NavigationTab, Currency, NotificationItem } from '../types';
import { Menu, Bell, UserCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface TopbarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onMobileMenuToggle: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  onTabChange,
  currency,
  onCurrencyChange,
  onMobileMenuToggle,
  notifications,
  onMarkNotificationRead,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'costeo': return 'Nuevo Costeo';
      case 'recetas': return 'Mis Recetas';
      case 'historial': return 'Historial de Costeos';
      case 'configuracion': return 'Configuración de Cervecería';
      case 'ayuda': return 'Centro de Ayuda y Fórmulas';
      default: return 'BrewControl';
    }
  };

  return (
    <header className="bg-white sticky top-0 z-30 border-b border-[#c4c6cc]/60 flex justify-between items-center w-full px-4 md:px-8 h-16 shadow-xs select-none">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-[#031d34] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Brand */}
        <span className="text-xl font-black text-[#0f1c2c] md:hidden tracking-tight">
          BrewControl
        </span>

        {/* Desktop Breadcrumb / Tabs */}
        <div className="hidden md:flex items-center gap-6 h-16">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`h-full flex items-center text-base font-bold transition-all cursor-pointer border-b-2 px-1 ${
              activeTab === 'dashboard'
                ? 'text-[#0f1c2c] border-[#795900]'
                : 'text-[#74777d] border-transparent hover:text-[#0f1c2c]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange('costeo')}
            className={`h-full flex items-center text-base font-bold transition-all cursor-pointer border-b-2 px-1 ${
              activeTab === 'costeo'
                ? 'text-[#0f1c2c] border-[#795900]'
                : 'text-[#74777d] border-transparent hover:text-[#0f1c2c]'
            }`}
          >
            Costeo
          </button>
          <button
            onClick={() => onTabChange('recetas')}
            className={`h-full flex items-center text-base font-bold transition-all cursor-pointer border-b-2 px-1 ${
              activeTab === 'recetas'
                ? 'text-[#0f1c2c] border-[#795900]'
                : 'text-[#74777d] border-transparent hover:text-[#0f1c2c]'
            }`}
          >
            Recetas
          </button>
          <button
            onClick={() => onTabChange('historial')}
            className={`h-full flex items-center text-base font-bold transition-all cursor-pointer border-b-2 px-1 ${
              activeTab === 'historial'
                ? 'text-[#0f1c2c] border-[#795900]'
                : 'text-[#74777d] border-transparent hover:text-[#0f1c2c]'
            }`}
          >
            Historial
          </button>
        </div>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-4 relative">
        {/* Currency Toggle (matching screenshot 2 & 3) */}
        <div className="flex bg-[#eef4ff] rounded-lg p-1 border border-[#c4c6cc]">
          {(['CLP', 'USD', 'EUR'] as Currency[]).map((curr) => (
            <button
              key={curr}
              onClick={() => onCurrencyChange(curr)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                currency === curr
                  ? 'bg-white text-[#0f1c2c] shadow-xs scale-105'
                  : 'text-[#74777d] hover:text-[#0f1c2c]'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#0f1c2c] hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer"
            title="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 bg-[#0f1c2c] text-white flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Bell className="w-4 h-4 text-[#ffc641]" />
                  <span>Alertas de Cervecería</span>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-300 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    No hay notificaciones pendientes.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                        !n.read ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {n.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-normal">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Trigger */}
        <div 
          onClick={() => onTabChange('configuracion')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity text-[#0f1c2c] pl-1"
        >
          <UserCircle className="w-7 h-7 text-[#0f1c2c]" />
          <span className="text-sm font-bold hidden md:block">Perfil</span>
        </div>
      </div>
    </header>
  );
};
