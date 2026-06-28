import { useState, useEffect } from 'react';
import { NavigationTab, Currency, Recipe, BreweryProfile, NotificationItem } from './types';
import { INITIAL_RECIPES, INITIAL_PROFILE, INITIAL_NOTIFICATIONS, DEFAULT_BLANK_RECIPE } from './data/mockData';
import { createRecipe, deleteRecipe, getRecipes, recipeExists, updateRecipe } from './services/recipeService';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardView } from './components/DashboardView';
import { CostingView } from './components/CostingView';
import { HistoryView } from './components/HistoryView';
import { RecipesView } from './components/RecipesView';
import { ConfigView } from './components/ConfigView';
import { HelpView } from './components/HelpView';
import { NewBatchModal } from './components/modals/NewBatchModal';
import { NewRecipeModal } from './components/modals/NewRecipeModal';
import { LayoutDashboard, LineChart, BookOpen, History, Settings, HelpCircle, Plus, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [currency, setCurrency] = useState<Currency>('CLP');
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    getRecipes()
      .then(setRecipes)
      .catch((error) => {
        console.error('Error al cargar recetas desde Supabase:', error);
      });
  }, []);

  // Active context recipes
  const [currentDashboardRecipe, setCurrentDashboardRecipe] = useState<Recipe | null>(INITIAL_RECIPES[0] || null);
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
    setActiveTab('costeo');
  };

  // Profile & System
  const [profile, setProfile] = useState<BreweryProfile>(INITIAL_PROFILE);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals & Mobile Drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newBatchModalOpen, setNewBatchModalOpen] = useState(false);
  const [newRecipeModalOpen, setNewRecipeModalOpen] = useState(false);
  const [exportToast, setExportToast] = useState(false);

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
    setActiveTab('costeo');
  };

  const handleSaveCostingRecipe = async (savedRecipe: Recipe) => {
    let recipeToStore = savedRecipe;

    try {
      recipeToStore = (await recipeExists(savedRecipe.id))
        ? await updateRecipe(savedRecipe)
        : await createRecipe(savedRecipe);
      setCurrentCostingRecipe(recipeToStore);
    } catch (error) {
      console.error('Error al guardar la receta en Supabase:', error);
    }

    const exists = recipes.some((r) => r.id === savedRecipe.id);
    if (exists) {
      setRecipes(recipes.map((r) => (r.id === savedRecipe.id ? recipeToStore : r)));
    } else {
      setRecipes([recipeToStore, ...recipes]);
    }

    if (!currentDashboardRecipe || currentDashboardRecipe.id === savedRecipe.id) {
      setCurrentDashboardRecipe(recipeToStore);
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

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA] text-[#031d34] antialiased">
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
          <div className="relative bg-[#0f1c2c] text-white w-[280px] h-full shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 select-none">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-2xl font-black text-white">BrewControl</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-300 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setNewBatchModalOpen(true);
                }}
                className="w-full bg-[#ffc641] text-[#715300] font-bold py-3 px-4 rounded-xl mb-6 flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                Nuevo Lote
              </button>

              <nav className="flex flex-col gap-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
                  { id: 'costeo', label: 'Nuevo Costeo', icon: <LineChart className="w-5 h-5" /> },
                  { id: 'recetas', label: 'Mis Recetas', icon: <BookOpen className="w-5 h-5" /> },
                  { id: 'historial', label: 'Historial', icon: <History className="w-5 h-5" /> },
                  { id: 'configuracion', label: 'Configuración', icon: <Settings className="w-5 h-5" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as NavigationTab);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                      activeTab === item.id ? 'bg-white/15 text-[#ffc641]' : 'text-[#bac8dc] hover:bg-white/10'
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
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#bac8dc] hover:text-white w-full text-left"
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
        />

        {/* Simulated Export Toast */}
        {exportToast && (
          <div className="fixed top-20 right-8 bg-[#0D1B2A] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#ffc641] flex items-center gap-3 z-50 animate-in slide-in-from-top-4">
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="text-xs font-bold">Generando archivo de exportación CSV/Excel...</span>
          </div>
        )}

        {/* Canvas Body */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] relative">
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
              key={currentCostingRecipe.id}
              recipe={currentCostingRecipe}
              onUpdateRecipe={setCurrentCostingRecipe}
              onSaveRecipe={handleSaveCostingRecipe}
              currency={currency}
              onCurrencyChange={setCurrency}
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
            />
          )}

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
