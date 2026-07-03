import { useState, useEffect } from 'react';
import { NavigationTab, Currency, Recipe, BreweryProfile, NotificationItem } from './types';
import { INITIAL_PROFILE, INITIAL_NOTIFICATIONS, DEFAULT_BLANK_RECIPE } from './data/mockData';
import { createRecipe, deleteRecipe, getRecipes, isPersistedRecipeId, updateRecipe } from './services/recipeService';
import { getProfileByUserId, updateProfile } from './services/profileService';
import { useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardView } from './components/DashboardView';
import { CostingView } from './components/CostingView';
import { HistoryView } from './components/HistoryView';
import { RecipesView } from './components/RecipesView';
import { ConfigView } from './components/ConfigView';
import { HelpView } from './components/HelpView';
import { AdminView } from './components/AdminView';
import { LoginView } from './components/LoginView';
import { NewBatchModal } from './components/modals/NewBatchModal';
import { NewRecipeModal } from './components/modals/NewRecipeModal';
import { LayoutDashboard, LineChart, BookOpen, History, Settings, HelpCircle, Plus, X, Loader2, Shield } from 'lucide-react';
import { BrandLogo } from './components/BrandLogo';
import { BRAND_BACKGROUND } from './constants/branding';

function pickLatestRecipe(recipeList: Recipe[]): Recipe | null {
  if (recipeList.length === 0) return null;
  return [...recipeList].sort((a, b) => {
    const aMs = Date.parse(a.lastModified);
    const bMs = Date.parse(b.lastModified);
    const aValid = !Number.isNaN(aMs);
    const bValid = !Number.isNaN(bMs);
    if (aValid && bValid) return bMs - aMs;
    if (bValid) return 1;
    if (aValid) return -1;
    return 0;
  })[0];
}

function profileFromAuthUser(user: NonNullable<ReturnType<typeof useAuth>['user']>): Partial<BreweryProfile> {
  const metadata = user.user_metadata as Record<string, string | undefined>;
  return {
    email: user.email ?? '',
    name: metadata.brewery_name ?? '',
    masterBrewer: metadata.master_brewer ?? '',
  };
}

export default function App() {
  const { user, loading, signOut, isAdmin, profile: authProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [currency, setCurrency] = useState<Currency>('CLP');
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (!user) return;

    getRecipes()
      .then(setRecipes)
      .catch((error) => {
        console.error('Error al cargar recetas desde Supabase:', error);
      });
  }, [user]);

  // Active context recipes
  const [currentDashboardRecipe, setCurrentDashboardRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    setCurrentDashboardRecipe((prev) => {
      if (recipes.length === 0) return null;
      if (prev) {
        const updated = recipes.find((r) => r.id === prev.id);
        if (updated) return updated;
      }
      return pickLatestRecipe(recipes);
    });
  }, [recipes]);

  const [currentCostingRecipe, setCurrentCostingRecipe] = useState<Recipe>(() => ({
    ...DEFAULT_BLANK_RECIPE,
    ingredients: [...DEFAULT_BLANK_RECIPE.ingredients],
    indirectCosts: {
      ...DEFAULT_BLANK_RECIPE.indirectCosts,
      custom: [...DEFAULT_BLANK_RECIPE.indirectCosts.custom],
    },
  }));

  const openRecipeInCostingEditor = (recipe: Recipe) => {
    const recipeFromCatalog = recipes.find((r) => r.id === recipe.id);
    setCurrentCostingRecipe(recipeFromCatalog ?? recipe);
    setCostingSessionKey((k) => k + 1);
    setActiveTab('costeo');
  };

  // Profile & System
  const [profile, setProfile] = useState<BreweryProfile>(INITIAL_PROFILE);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    if (!user) return;

    setProfile((prev) => ({
      ...prev,
      email: user.email ?? prev.email,
      name: authProfile?.brewery_name ?? profileFromAuthUser(user).name ?? prev.name,
      masterBrewer: authProfile?.master_brewer ?? profileFromAuthUser(user).masterBrewer ?? prev.masterBrewer,
    }));
  }, [user, authProfile]);

  useEffect(() => {
    if (!user || activeTab !== 'configuracion') return;

    getProfileByUserId(user.id)
      .then(({ profile: fetchedProfile, error }) => {
        if (error) {
          console.error('Error al cargar la configuración desde Supabase:', error);
          return;
        }

        if (!fetchedProfile) return;

        setProfile((prev) => ({
          ...prev,
          name: fetchedProfile.brewery_name ?? prev.name,
          masterBrewer: fetchedProfile.master_brewer ?? prev.masterBrewer,
          email: user.email ?? prev.email,
        }));
      })
      .catch((error) => {
        console.error('Error al cargar la configuración desde Supabase:', error);
      });
  }, [user, activeTab]);

  // Modals & Mobile Drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newBatchModalOpen, setNewBatchModalOpen] = useState(false);
  const [newRecipeModalOpen, setNewRecipeModalOpen] = useState(false);
  const [exportToast, setExportToast] = useState(false);
  const [costingSessionKey, setCostingSessionKey] = useState(0);

  // Actions
  const handleStartNewBatch = (newBatch: Recipe) => {
    setRecipes([newBatch, ...recipes]);
    setCurrentDashboardRecipe(newBatch);
    setActiveTab('dashboard');
    
    // Add simulated alert
    setNotifications([
      {
        id: `notif-${Date.now()}`,
        title: `Lote ${newBatch.code} Iniciado`,
        message: `Cocina de ${newBatch.volumeL}L de "${newBatch.name}" en maceración activa.`,
        time: 'Justo ahora',
        type: 'info',
        read: false,
      },
      ...notifications,
    ]);
  };

  const handleCreateNewRecipe = (newRecipe: Recipe) => {
    setRecipes([newRecipe, ...recipes]);
    setCurrentCostingRecipe(newRecipe);
    setCostingSessionKey((k) => k + 1);
    setActiveTab('costeo');
  };

  const handleSaveCostingRecipe = async (savedRecipe: Recipe): Promise<string | null> => {
    try {
      const recipeToStore = isPersistedRecipeId(String(savedRecipe.id))
        ? await updateRecipe(savedRecipe)
        : await createRecipe(savedRecipe);

      setCurrentCostingRecipe(recipeToStore);
      setRecipes((prev) => {
        const exists = prev.some((r) => r.id === savedRecipe.id);
        if (exists) {
          return prev.map((r) => (r.id === savedRecipe.id ? recipeToStore : r));
        }
        return [recipeToStore, ...prev];
      });
      setCurrentDashboardRecipe((prev) =>
        !prev || prev.id === savedRecipe.id ? recipeToStore : prev,
      );

      return null;
    } catch (error) {
      console.error('Error al guardar la receta en Supabase:', error);
      return error instanceof Error
        ? error.message
        : 'No se pudo guardar la receta. Intenta nuevamente.';
    }
  };

  const handleDuplicateRecipe = (recipe: Recipe) => {
    const copy: Recipe = {
      ...recipe,
      id: `copy-${Date.now()}`,
      code: `${recipe.code}-COPY`,
      name: `${recipe.name} (Copia)`,
      status: 'BORRADOR',
      lastModified: 'Hace un instante',
    };
    setRecipes([copy, ...recipes]);
    setCurrentCostingRecipe(copy);
    setCostingSessionKey((k) => k + 1);
    setActiveTab('costeo');
  };

  const handleDeleteRecipe = async (id: string | number) => {console.log("CLICK ELIMINAR", id);
    const idStr = String(id);
    // Si corresponde a un borrador local, se elimina únicamente del estado local
    if (idStr.startsWith('draft-') || idStr.startsWith('copy-') || idStr.startsWith('recipe-')) {
      setRecipes(prev => prev.filter(r => r.id !== id));
      return;
    }

    // En cualquier otro caso, se intenta eliminar en el servidor
    try {
      await deleteRecipe(id);

      // Solamente si termina correctamente, se actualiza el estado local
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      // Si lanza un error, NO se modifica el estado local y solo se registra el error
      console.error("Error al eliminar la receta:", error);
    }
  };

  const triggerExport = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 3500);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleSaveProfile = async (): Promise<string | null> => {
    if (!user) {
      return 'No hay una sesión activa. Inicia sesión e intenta nuevamente.';
    }

    const { error } = await updateProfile(user.id, {
      breweryName: profile.name,
      masterBrewer: profile.masterBrewer,
    });

    if (error) {
      console.error('Error al guardar la configuración en Supabase:', error);
      return 'No se pudo guardar la configuración. Intenta nuevamente.';
    }

    return null;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 text-white"
        style={{ backgroundColor: BRAND_BACKGROUND }}
      >
        <BrandLogo variant="icon" theme="dark" className="h-20 w-auto" />
        <Loader2 className="w-8 h-8 animate-spin text-[#F5A623]" />
        <p className="text-sm font-semibold text-slate-300">Verificando sesión...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-[#0D1B2A] antialiased">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewBatchClick={() => setNewBatchModalOpen(true)}
        profile={profile}
      />

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative bc-sidebar text-white w-[280px] h-full bc-shadow p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 select-none">
            <div>
              <div className="flex items-center justify-between mb-8">
                <BrandLogo variant="short" theme="dark" className="shrink-0" />
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-300 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setNewBatchModalOpen(true);
                }}
                className="w-full bg-[#F5A623] text-[#0D1B2A] font-bold py-3 px-4 rounded-xl mb-6 flex items-center justify-center gap-2 bc-shadow"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                Nuevo Lote
              </button>

              <nav className="flex flex-col gap-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
                  { id: 'costeo', label: 'Nueva Evaluación de Receta', icon: <LineChart className="w-5 h-5" /> },
                  { id: 'recetas', label: 'Mis Recetas', icon: <BookOpen className="w-5 h-5" /> },
                  { id: 'historial', label: 'Historial', icon: <History className="w-5 h-5" /> },
                  ...(isAdmin
                    ? [{ id: 'administracion', label: 'Administración', icon: <Shield className="w-5 h-5" /> }]
                    : []),
                  { id: 'configuracion', label: 'Configuración', icon: <Settings className="w-5 h-5" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as NavigationTab);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                      activeTab === item.id ? 'bg-white/15 text-[#F5A623]' : 'text-[rgba(255,255,255,0.55)] hover:bg-white/10'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setActiveTab('ayuda');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[rgba(255,255,255,0.55)] hover:text-white w-full text-left"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Ayuda y Fórmulas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-[280px] min-h-screen overflow-hidden w-full relative">
        {/* Topbar */}
        <Topbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currency={currency}
          onCurrencyChange={setCurrency}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          notifications={notifications}
          onMarkNotificationRead={markNotificationRead}
          onSignOut={handleSignOut}
        />

        {/* Simulated Export Toast */}
        {exportToast && (
          <div className="fixed top-20 right-8 bg-[#0D1B2A] text-white px-5 py-3 rounded-2xl bc-shadow border border-[#F5A623] flex items-center gap-3 z-50 animate-in slide-in-from-top-4">
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="text-xs font-bold">Generando archivo de exportación CSV/Excel...</span>
          </div>
        )}

        {/* Canvas Body */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] relative">
          {activeTab === 'dashboard' && (
            <DashboardView
              recipe={currentDashboardRecipe}
              currency={currency}
              onEditRecipe={openRecipeInCostingEditor}
              onExport={triggerExport}
              onTabChange={setActiveTab}
              onStartFirstBatch={() => setNewBatchModalOpen(true)}
            />
          )}

          {activeTab === 'costeo' && (
            <CostingView
              key={costingSessionKey}
              sessionKey={costingSessionKey}
              recipe={currentCostingRecipe}
              onUpdateRecipe={setCurrentCostingRecipe}
              onSaveRecipe={handleSaveCostingRecipe}
              currency={currency}
              onCurrencyChange={setCurrency}
              onExportExcel={triggerExport}
              onBackToList={() => setActiveTab('recetas')}
              onNewRecipe={() => setNewRecipeModalOpen(true)}
            />
          )}

          {activeTab === 'historial' && (
            <HistoryView
              recipes={recipes}
              currency={currency}
              onCurrencyChange={setCurrency}
              onSelectRecipe={(rec) => {
                setCurrentDashboardRecipe(rec);
                setActiveTab('dashboard');
              }}
              onExport={triggerExport}
            />
          )}

          {activeTab === 'recetas' && (
            <RecipesView
              recipes={recipes}
              currency={currency}
              onNewRecipeClick={() => setNewRecipeModalOpen(true)}
              onEditRecipe={openRecipeInCostingEditor}
              onDuplicateRecipe={handleDuplicateRecipe}
              onDeleteRecipe={handleDeleteRecipe}
            />
          )}

          {activeTab === 'configuracion' && (
            <ConfigView
              profile={profile}
              onUpdateProfile={setProfile}
              currency={currency}
              onCurrencyChange={setCurrency}
              onSave={handleSaveProfile}
            />
          )}

          {activeTab === 'administracion' && isAdmin && <AdminView />}

          {activeTab === 'ayuda' && <HelpView />}
        </main>
      </div>

      {/* Interactive Modals */}
      <NewBatchModal
        isOpen={newBatchModalOpen}
        onClose={() => setNewBatchModalOpen(false)}
        recipes={recipes}
        onStartBatch={handleStartNewBatch}
      />

      <NewRecipeModal
        isOpen={newRecipeModalOpen}
        onClose={() => setNewRecipeModalOpen(false)}
        onCreateRecipe={handleCreateNewRecipe}
      />
    </div>
  );
}
