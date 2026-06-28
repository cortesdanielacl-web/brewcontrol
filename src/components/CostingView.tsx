import React, { useState } from 'react';
import { Recipe, Currency, IngredientCategory, IngredientItem } from '../types';
import { PREDEFINED_INGREDIENTS } from '../data/mockData';
import { formatCurrency, formatNumberOnly, calculateRecipeFinancials } from '../utils/formatters';
import { 
  Sliders, 
  Sprout, 
  Package, 
  Trash2, 
  PlusCircle, 
  BarChart3, 
  Info, 
  Droplet, 
  Flame, 
  Home, 
  Wine, 
  CircleDot, 
  Tag, 
  Lightbulb, 
  Truck, 
  FlaskConical, 
  HardHat, 
  Check,
  Sparkles
} from 'lucide-react';

interface CostingViewProps {
  recipe: Recipe;
  onUpdateRecipe: (updated: Recipe) => void;
  onSaveRecipe: (recipe: Recipe) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
}

export const CostingView: React.FC<CostingViewProps> = ({
  recipe,
  onUpdateRecipe,
  onSaveRecipe,
  currency,
  onCurrencyChange,
}) => {
  const [activeTab, setActiveTab] = useState<IngredientCategory>('maltas');
  const [savedToast, setSavedToast] = useState(false);

  if (!recipe || !recipe.ingredients || !recipe.indirectCosts) {
    return (
      <div className="max-w-[1440px] mx-auto p-8 text-center py-24 bg-white rounded-2xl border border-slate-200 mt-8">
        <h2 className="text-xl font-bold text-[#031d34]">Selecciona o crea un lote para comenzar el costeo.</h2>
      </div>
    );
  }

  const financials = calculateRecipeFinancials(recipe);

  const handleGeneralChange = (field: keyof Recipe, value: any) => {
    onUpdateRecipe({ ...recipe, [field]: value, lastModified: 'Hace un momento' });
  };

  const handleIngredientChange = (id: string, field: keyof IngredientItem, value: any) => {
    const nextIngs = recipe.ingredients.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: Number(value) || value };
      }
      return item;
    });
    onUpdateRecipe({ ...recipe, ingredients: nextIngs, lastModified: 'Hace un momento' });
  };

  const handleIngredientDelete = (id: string) => {
    const nextIngs = recipe.ingredients.filter((item) => item.id !== id);
    onUpdateRecipe({ ...recipe, ingredients: nextIngs, lastModified: 'Hace un momento' });
  };

  const handleAddIngredient = () => {
    const predefined = PREDEFINED_INGREDIENTS[activeTab] || [];
    const firstOption = predefined[0] || { name: 'Nuevo Ingrediente', pricePerKg: 1000 };
    const newItem: IngredientItem = {
      id: `ing-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: activeTab !== 'adjuntos' ? '' : firstOption.name,
      category: activeTab,
      quantityKg: activeTab === 'maltas' ? 25 : activeTab === 'lupulos' ? 1 : 0.5,
      pricePerKg: activeTab === 'maltas' ? 1200 : activeTab === 'lupulos' ? 28000 : activeTab === 'levaduras' ? 8000 : firstOption.pricePerKg,
    };
    onUpdateRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, newItem],
      lastModified: 'Hace un momento',
    });
  };

  const handleIndirectChange = (field: keyof typeof recipe.indirectCosts, value: number) => {
    onUpdateRecipe({
      ...recipe,
      indirectCosts: {
        ...recipe.indirectCosts,
        [field]: Number(value) >= 0 ? Number(value) : 0,
      },
      lastModified: 'Hace un momento',
    });
  };

  const handleAddCustomExpense = () => {
    const nextCustom = [
      ...recipe.indirectCosts.custom,
      { id: `cust-${Date.now()}`, name: 'Nuevo Gasto', amount: 0 },
    ];
    onUpdateRecipe({
      ...recipe,
      indirectCosts: { ...recipe.indirectCosts, custom: nextCustom },
      lastModified: 'Hace un momento',
    });
  };

  const handleSave = () => {
    onSaveRecipe(recipe);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  const currentTabIngredients = recipe.ingredients.filter((i) => i.category === activeTab);
  const currentTabSubtotal = currentTabIngredients.reduce((acc, i) => acc + i.quantityKg * i.pricePerKg, 0);

  const indirectConfig = [
    { key: 'agua', label: 'Agua', icon: <Droplet className="w-4 h-4 text-blue-500" /> },
    { key: 'gas', label: 'Gas', icon: <Flame className="w-4 h-4 text-amber-500" /> },
    { key: 'arriendo', label: 'Arriendo', icon: <Home className="w-4 h-4 text-slate-500" /> },
    { key: 'botella', label: 'Botella', icon: <Wine className="w-4 h-4 text-purple-500" /> },
    { key: 'tapas', label: 'Tapas', icon: <CircleDot className="w-4 h-4 text-slate-400" /> },
    { key: 'etiquetas', label: 'Etiquetas', icon: <Tag className="w-4 h-4 text-pink-500" /> },
    { key: 'luz', label: 'Luz', icon: <Lightbulb className="w-4 h-4 text-yellow-500" /> },
    { key: 'transporte', label: 'Transporte', icon: <Truck className="w-4 h-4 text-indigo-500" /> },
    { key: 'co2', label: 'CO2', icon: <FlaskConical className="w-4 h-4 text-teal-500" /> },
    { key: 'manoDeObra', label: 'Mano de Obra', icon: <HardHat className="w-4 h-4 text-orange-500" /> },
  ];

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-8 animate-in fade-in duration-200 pb-16 select-none relative">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-20 right-8 bg-[#0D1B2A] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#ffc641] flex items-center gap-3 z-50 animate-in slide-in-from-top-4 duration-200">
          <div className="bg-[#ffc641] text-[#0D1B2A] p-1 rounded-full">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-bold">Costeo guardado exitosamente</p>
            <p className="text-[11px] text-slate-300">Sincronizado en tu catálogo de recetas</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#031d34]">Nuevo Costeo</h1>
          <p className="text-base text-[#44474c] mt-1.5">Calcula la rentabilidad de un nuevo lote de producción.</p>
        </div>

        {/* Currency Toggle & Action */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex bg-[#eef4ff] rounded-lg p-1 border border-[#c4c6cc]">
            {(['CLP', 'USD', 'EUR'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => onCurrencyChange(c)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  currency === c ? 'bg-white text-[#031d34] shadow-xs' : 'text-[#74777d] hover:text-[#031d34]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="bg-[#0D1B2A] text-white hover:bg-[#1b324a] active:scale-98 transition-all font-bold text-sm px-7 py-3 rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#ffc641]" />
            Guardar Costeo
          </button>
        </div>
      </div>

      {/* Grid Layout: 8 cols left, 4 cols right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Parámetros Generales */}
          <section className="bg-white rounded-xl border border-[#c4c6cc]/70 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-3">
              <Sliders className="w-5 h-5 text-[#795900]" />
              <h2 className="text-lg font-bold text-[#031d34]">1. Parámetros Generales</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#44474c] tracking-wider uppercase">Nombre de la Receta</label>
                <input
                  type="text"
                  value={recipe.name}
                  onChange={(e) => handleGeneralChange('name', e.target.value)}
                  placeholder="Ej: IPA Atómica"
                  className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-lg px-3.5 py-2.5 text-sm text-[#031d34] font-medium focus:border-[#d4a017] focus:ring-1 focus:ring-[#d4a017] outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#44474c] tracking-wider uppercase">Estilo</label>
                <input
                  type="text"
                  value={recipe.style}
                  onChange={(e) => handleGeneralChange('style', e.target.value)}
                  placeholder="Ej: American IPA, Pilsner, Porter..."
                  className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-lg px-3.5 py-2.5 text-sm text-[#031d34] font-medium focus:border-[#d4a017] focus:ring-1 focus:ring-[#d4a017] outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-50">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#44474c] tracking-wider uppercase">Volumen (Lts)</label>
                <input
                  type="number"
                  value={recipe.volumeL || ''}
                  onChange={(e) => handleGeneralChange('volumeL', Number(e.target.value))}
                  className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-lg px-3 py-2 text-sm font-mono font-bold text-[#031d34] text-right focus:border-[#d4a017] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#44474c] tracking-wider uppercase">ABV Estimado (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={recipe.abv || ''}
                  onChange={(e) => handleGeneralChange('abv', Number(e.target.value))}
                  className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-lg px-3 py-2 text-sm font-mono font-bold text-[#031d34] text-right focus:border-[#d4a017] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#44474c] tracking-wider uppercase">IBU</label>
                <input
                  type="number"
                  value={recipe.ibu || ''}
                  onChange={(e) => handleGeneralChange('ibu', Number(e.target.value))}
                  className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-lg px-3 py-2 text-sm font-mono font-bold text-[#031d34] text-right focus:border-[#d4a017] outline-none"
                />
              </div>
            </div>
          </section>

          {/* 2. Ingredientes */}
          <section className="bg-white rounded-xl border border-[#c4c6cc]/70 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <Sprout className="w-5 h-5 text-[#795900]" />
                <h2 className="text-lg font-bold text-[#031d34]">2. Ingredientes</h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">Precios en CLP / kg</span>
            </div>

            {/* Tabs for Category */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
              {(['maltas', 'lupulos', 'levaduras', 'adjuntos'] as IngredientCategory[]).map((cat) => {
                const isActive = activeTab === cat;
                const count = recipe.ingredients.filter((i) => i.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-4 py-2.5 font-bold text-xs capitalize transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
                      isActive
                        ? 'border-[#795900] text-[#031d34] bg-amber-50/50'
                        : 'border-transparent text-slate-500 hover:text-[#031d34]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-[#ffc641] text-[#715300]' : 'bg-slate-100 text-slate-600'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Ingredients Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#eef4ff] border-y border-[#c4c6cc]/60">
                    <th className="py-2.5 px-3 text-xs font-bold text-[#44474c] uppercase w-5/12">Ingrediente</th>
                    <th className="py-2.5 px-3 text-xs font-bold text-[#44474c] uppercase w-2/12 text-right">Cant. (Kg)</th>
                    <th className="py-2.5 px-3 text-xs font-bold text-[#44474c] uppercase w-2/12 text-right">Precio/Kg</th>
                    <th className="py-2.5 px-3 text-xs font-bold text-[#44474c] uppercase w-2/12 text-right">Subtotal</th>
                    <th className="py-2.5 px-1 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentTabIngredients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-slate-400 font-medium bg-slate-50/50">
                        No hay {activeTab} añadidas en esta receta. Haz clic abajo para añadir.
                      </td>
                    </tr>
                  ) : (
                    currentTabIngredients.map((item) => {
                      const options = PREDEFINED_INGREDIENTS[activeTab] || [];
                      const subtotal = item.quantityKg * item.pricePerKg;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="py-2.5 px-3">
                            {activeTab !== 'adjuntos' ? (
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleIngredientChange(item.id, 'name', e.target.value)}
                                placeholder={
                                  activeTab === 'maltas'
                                    ? "Ej: Malta Pilsen, Munich..."
                                    : activeTab === 'lupulos'
                                    ? "Ej: Lúpulo Citra, Mosaic..."
                                    : "Ej: Levadura US-05, S-04, WLP001..."
                                }
                                className="w-full bg-transparent border-0 border-b border-dashed border-slate-300 rounded-none px-1 py-1 text-sm text-[#031d34] font-medium focus:border-[#795900] focus:ring-0 outline-none"
                              />
                            ) : (
                              <select
                                value={item.name}
                                onChange={(e) => {
                                  const matched = options.find((o) => o.name === e.target.value);
                                  if (matched) {
                                    handleIngredientChange(item.id, 'name', matched.name);
                                    handleIngredientChange(item.id, 'pricePerKg', matched.pricePerKg);
                                  } else {
                                    handleIngredientChange(item.id, 'name', e.target.value);
                                  }
                                }}
                                className="w-full bg-transparent border-0 border-b border-dashed border-slate-300 rounded-none px-1 py-1 text-sm text-[#031d34] font-medium focus:border-[#795900] focus:ring-0 outline-none cursor-pointer"
                              >
                                {!options.some((o) => o.name === item.name) && (
                                  <option value={item.name}>{item.name}</option>
                                )}
                                {options.map((opt) => (
                                  <option key={opt.name} value={opt.name}>{opt.name}</option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              step="0.01"
                              value={item.quantityKg || ''}
                              onChange={(e) => handleIngredientChange(item.id, 'quantityKg', e.target.value)}
                              className="w-full bg-transparent border-0 border-b border-dashed border-slate-300 rounded-none px-1 py-1 text-sm font-mono font-bold text-[#031d34] text-right focus:border-[#795900] focus:ring-0 outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              value={item.pricePerKg || ''}
                              onChange={(e) => handleIngredientChange(item.id, 'pricePerKg', e.target.value)}
                              className="w-full bg-transparent border-0 border-b border-dashed border-slate-300 rounded-none px-1 py-1 text-sm font-mono font-bold text-[#031d34] text-right focus:border-[#795900] focus:ring-0 outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-mono text-sm font-bold text-[#031d34] text-right">
                            {formatNumberOnly(subtotal, currency)}
                          </td>
                          <td className="py-2.5 px-1 text-center">
                            <button
                              onClick={() => handleIngredientDelete(item.id)}
                              className="text-slate-300 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                              title="Eliminar ingrediente"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Subtotal & Add Button */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={handleAddIngredient}
                className="flex items-center gap-1.5 text-[#795900] font-bold text-xs hover:text-[#ffc641] bg-amber-50 hover:bg-[#0f1c2c] transition-all px-3.5 py-2 rounded-lg cursor-pointer shadow-2xs"
              >
                <PlusCircle className="w-4 h-4" />
                Añadir {activeTab.slice(0, -1)}
              </button>
              <div className="font-mono text-sm font-bold text-[#031d34] bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                Subtotal {activeTab}: <span className="text-[#795900]">{formatNumberOnly(currentTabSubtotal, currency)}</span>
              </div>
            </div>
          </section>

          {/* 3. Costos Indirectos y Empaque */}
          <section className="bg-white rounded-xl border border-[#c4c6cc]/70 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-3">
              <Package className="w-5 h-5 text-[#795900]" />
              <h2 className="text-lg font-bold text-[#031d34]">3. Costos Indirectos y Empaque</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {indirectConfig.map((item) => {
                const val = (recipe.indirectCosts as any)[item.key];
                return (
                  <div key={item.key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#44474c] tracking-wider uppercase flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </label>
                    <div className="flex items-center bg-[#f8f9ff] border border-[#c4c6cc] rounded-lg px-3 py-2 focus-within:border-[#795900] focus-within:ring-1 focus-within:ring-[#795900] transition-all">
                      <span className="text-slate-400 font-mono text-xs mr-2">$</span>
                      <input
                        type="number"
                        value={val || 0}
                        onChange={(e) => handleIndirectChange(item.key as any, Number(e.target.value))}
                        className="w-full bg-transparent border-0 p-0 text-sm font-mono font-bold text-[#031d34] text-right focus:ring-0 outline-none"
                      />
                    </div>
                  </div>
                );
              })}

              {/* Custom Expenses */}
              {recipe.indirectCosts.custom.map((cust) => (
                <div key={cust.id} className="flex flex-col gap-1.5 relative group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 flex-1 mr-2">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <input
                        type="text"
                        value={cust.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          const nextCust = recipe.indirectCosts.custom.map((c) => c.id === cust.id ? { ...c, name: val } : c);
                          onUpdateRecipe({
                            ...recipe,
                            indirectCosts: { ...recipe.indirectCosts, custom: nextCust },
                          });
                        }}
                        placeholder="Ej: Saneamiento, Botellas..."
                        className="w-full bg-transparent border-0 border-b border-dashed border-teal-300 p-0 text-xs font-bold text-teal-800 uppercase tracking-wider focus:border-teal-600 focus:ring-0 outline-none"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const nextCust = recipe.indirectCosts.custom.filter((c) => c.id !== cust.id);
                        onUpdateRecipe({
                          ...recipe,
                          indirectCosts: { ...recipe.indirectCosts, custom: nextCust },
                        });
                      }}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center bg-teal-50/50 border border-teal-200 rounded-lg px-3 py-2">
                    <span className="text-teal-600 font-mono text-xs mr-2">$</span>
                    <input
                      type="number"
                      value={cust.amount || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        const nextCust = recipe.indirectCosts.custom.map((c) => c.id === cust.id ? { ...c, amount: val } : c);
                        onUpdateRecipe({
                          ...recipe,
                          indirectCosts: { ...recipe.indirectCosts, custom: nextCust },
                        });
                      }}
                      className="w-full bg-transparent border-0 p-0 text-sm font-mono font-bold text-teal-900 text-right focus:ring-0 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-start">
              <button
                onClick={handleAddCustomExpense}
                className="flex items-center gap-1.5 text-[#795900] font-bold text-xs hover:text-[#ffc641] bg-amber-50 hover:bg-[#0f1c2c] transition-all px-4 py-2.5 rounded-lg cursor-pointer shadow-2xs"
              >
                <PlusCircle className="w-4 h-4" />
                Añadir Gasto Adicional
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Calculations & Dashboard (4 cols sticky) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          {/* 4. Calculations Summary (matching exact screenshot 2 right panel) */}
          <section className="bg-[#0D1B2A] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-slate-800">
            {/* Abstract glow */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#ffc641]/15 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold mb-5 relative z-10 flex items-center gap-2.5 text-white tracking-tight border-b border-white/10 pb-4">
              <BarChart3 className="w-5 h-5 text-[#ffc641]" />
              <span>Resumen Financiero</span>
            </h2>

            <div className="space-y-3.5 relative z-10">
              <div className="flex justify-between items-end border-b border-white/10 pb-2.5">
                <span className="text-xs text-[#bac8dc]">Costo Ingredientes</span>
                <span className="font-mono font-bold text-sm text-white">
                  {formatNumberOnly(financials.ingredientsCost, currency)}
                </span>
              </div>

              <div className="flex justify-between items-end border-b border-white/10 pb-2.5">
                <span className="text-xs text-[#bac8dc]">Costos Indirectos</span>
                <span className="font-mono font-bold text-sm text-white">
                  {formatNumberOnly(financials.indirectCost, currency)}
                </span>
              </div>

              {/* Total Cost Production Inner Box */}
              <div className="bg-white/10 rounded-xl p-4 mt-5 border border-white/15 shadow-inner">
                <span className="text-[11px] font-bold uppercase text-[#bac8dc] tracking-wider block mb-1">
                  Costo Total Producción
                </span>
                <div className="text-3xl md:text-4xl font-black text-white tracking-tight font-mono">
                  {formatNumberOnly(financials.totalCost, currency)}
                </div>
              </div>

              {/* Unit Cost Metric */}
              <div className="flex justify-between items-center bg-white/5 rounded-xl p-3.5 border border-white/10">
                <span className="text-xs font-semibold text-[#bac8dc]">Costo por Litro ({recipe.volumeL}L)</span>
                <span className="font-mono text-base font-black text-[#ffdfa0]">
                  {formatNumberOnly(financials.costPerLiter, currency)} / L
                </span>
              </div>
            </div>

            {/* Profitability Simulator */}
            <div className="mt-8 pt-6 border-t border-white/15 relative z-10">
              <h3 className="text-sm font-bold mb-4 text-[#ffdfa0] uppercase tracking-wider flex items-center justify-between">
                <span>Simulador de Margen</span>
                <span className="text-[10px] bg-[#ffc641]/20 text-[#ffc641] px-2 py-0.5 rounded">En tiempo real</span>
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-[#bac8dc] uppercase tracking-wider">Margen Deseado (%)</label>
                    <span className="font-mono font-black text-sm text-[#ffc641] bg-white/10 px-2 py-0.5 rounded">
                      {recipe.desiredMargin}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="90"
                    step="1"
                    value={recipe.desiredMargin}
                    onChange={(e) => handleGeneralChange('desiredMargin', Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#ffc641]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Mínimo (5%)</span>
                    <span>Recomendado (55-65%)</span>
                    <span>Premium (90%)</span>
                  </div>
                </div>

                <div className="bg-[#1b324a] text-white rounded-xl p-4 border border-blue-400/30 shadow-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Precio Venta Sugerido / L</span>
                  </div>
                  <div className="text-3xl font-black text-[#60a5fa] tracking-tight font-mono">
                    {formatNumberOnly(financials.suggestedPricePerLiter, currency)}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10 text-xs">
                    <span className="text-slate-300">Ganancia Proyectada:</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      +{formatNumberOnly(financials.projectedProfit, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Status Info Card (matching exact screenshot 2 bottom right card) */}
          <div className="bg-white rounded-2xl border border-[#c4c6cc]/70 p-5 shadow-xs flex items-start gap-3.5">
            <Info className="w-5 h-5 text-[#795900] mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xs font-bold text-[#031d34] uppercase tracking-wider">Estado del Costeo</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ffdfa0] text-[#5c4300] border border-[#f6be39]">
                  {recipe.status}
                </span>
              </div>
              <p className="text-xs text-[#44474c] leading-relaxed">
                Última modificación {recipe.lastModified.toLowerCase()}. Los precios de los ingredientes están sincronizados con el inventario actual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
