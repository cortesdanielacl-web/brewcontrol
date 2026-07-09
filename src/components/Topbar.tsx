import React, { useState, useEffect, useRef } from 'react';
import { NavigationTab, Currency, NotificationItem } from '../types';
import { Menu, Bell, UserCircle, CheckCircle2, AlertTriangle, Info, X, Settings, LogOut } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface TopbarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onMobileMenuToggle: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onSignOut: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  onTabChange,
  currency,
  onCurrencyChange,
  onMobileMenuToggle,
  notifications,
  onMarkNotificationRead,
  onSignOut,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!showNotifications && !showUserMenu) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [showNotifications, showUserMenu]);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'costeo': return 'Nueva Evaluación de Receta';
      case 'recetas': return 'Mis Recetas';
      case 'historial': return 'Historial de Evaluaciones de Receta';
      case 'configuracion': return 'Configuración de Cervecería';
      case 'administracion': return 'Administración';
      case 'ayuda': return 'Centro de Ayuda y Fórmulas';
      default: return 'BrewControl';
    }
  };

  return (
    <header ref={headerRef} className="bg-white sticky top-0 z-30 border-b border-bc-border flex justify-between items-center w-full px-4 md:px-8 h-16 select-none">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-bc-navy hover:bg-bc-gray-light rounded-2xl transition-colors cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>

        <BrandLogo variant="short" theme="light" className="shrink-0" />

        <div className="hidden md:flex items-center gap-6 h-16">
          {([
            { id: 'dashboard' as NavigationTab, label: 'Dashboard' },
            { id: 'costeo' as NavigationTab, label: 'Evaluación de Receta' },
            { id: 'recetas' as NavigationTab, label: 'Recetas' },
            { id: 'historial' as NavigationTab, label: 'Historial' },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`h-full flex items-center text-base font-bold transition-all cursor-pointer border-b-2 px-1 ${
                activeTab === tab.id
                  ? 'text-bc-navy border-bc-yellow'
                  : 'text-bc-muted border-transparent hover:text-bc-navy'
              }`}
            >
              <span translate={tab.id === 'dashboard' ? 'no' : undefined}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="bc-segmented flex">
          {(['CLP', 'USD', 'EUR'] as Currency[]).map((curr) => (
            <button
              key={curr}
              onClick={() => onCurrencyChange(curr)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                currency === curr
                  ? 'bg-white text-bc-navy bc-shadow scale-105'
                  : 'text-bc-muted hover:text-bc-navy'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 text-bc-navy hover:bg-bc-gray-light rounded-full transition-colors relative cursor-pointer"
            title="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white bc-card rounded-3xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 bg-bc-navy text-white flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Bell className="w-4 h-4 text-bc-yellow" />
                  <span>Alertas de Cervecería</span>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-white/60 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-bc-border">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-bc-muted text-sm">
                    No hay notificaciones pendientes.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-bc-gray-light transition-colors cursor-pointer flex gap-3 ${
                        !n.read ? 'bg-bc-yellow/5' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {n.type === 'info' && <Info className="w-4 h-4 text-bc-action" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="text-xs font-bold text-bc-navy">{n.title}</p>
                          <span className="text-[10px] text-bc-muted">{n.time}</span>
                        </div>
                        <p className="text-xs text-bc-text-secondary leading-normal">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity text-bc-navy pl-1"
            aria-expanded={showUserMenu}
            aria-haspopup="menu"
          >
            <UserCircle className="w-7 h-7 text-bc-navy" />
            <span className="text-sm font-bold hidden md:block">Perfil</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white bc-card rounded-3xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="py-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onTabChange('configuracion');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-bold text-bc-navy hover:bg-bc-gray-light transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-bc-muted" />
                  Configuración
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSignOut();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
