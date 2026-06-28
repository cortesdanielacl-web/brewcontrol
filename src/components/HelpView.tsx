import React from 'react';
import { HelpCircle, BookOpen, Calculator, Droplet, Flame, Percent, ArrowRight } from 'lucide-react';

export const HelpView: React.FC = () => {
  const formulas = [
    {
      title: 'Cálculo de Alcohol (ABV)',
      formula: 'ABV % = (Densidad Inicial - Densidad Final) × 131.25',
      desc: 'Fórmula estándar utilizada para estimar el porcentaje de alcohol por volumen tras la fermentación.',
      icon: <Percent className="w-5 h-5 text-purple-600" />
    },
    {
      title: 'Costo por Botella / Lata',
      formula: 'Costo Botella = (Costo Total Lote / Volumen Lts) × (Capacidad Envase ml / 1000)',
      desc: 'Permite distribuir los gastos fijos e indirectos proporcionalmente según el formato comercial (Ej: 330ml).',
      icon: <Droplet className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'Simulación de Margen Bruto',
      formula: 'Precio Venta Sugerido = Costo Unitario / (1 - % Margen Deseado / 100)',
      desc: 'Diferente al recargo simple. Garantiza que el porcentaje de rentabilidad se calcule sobre el precio final de venta.',
      icon: <Calculator className="w-5 h-5 text-amber-600" />
    },
    {
      title: 'Prorrateo de Gastos Indirectos',
      formula: 'Gasto por Litro = (Agua + Gas + Arriendo + Luz + Mano de Obra) / Cocción Total Lts',
      desc: 'Asignación directa de costos de servicios públicos y remuneraciones operacionales por cada batch.',
      icon: <Flame className="w-5 h-5 text-red-600" />
    }
  ];

  return (
    <div className="max-w-[1000px] mx-auto p-4 md:p-8 flex flex-col gap-8 animate-in fade-in duration-200 select-none pb-16">
      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#031d34]">Ayuda y Fórmulas</h1>
        <p className="text-base text-[#44474c] mt-1.5">Documentación técnica de los modelos matemáticos y financieros de BrewControl.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formulas.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#c4c6cc]/70 p-6 shadow-xs flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#031d34]">{item.title}</h3>
              </div>
              <div className="bg-[#f8f9ff] p-3.5 rounded-xl border border-[#d1e4ff] font-mono text-xs font-bold text-[#0f1c2c] my-2 select-text">
                {item.formula}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                {item.desc}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#795900]">
              <span>Modelo Verificado por Maestros Cerveceros</span>
              <HelpCircle className="w-3.5 h-3.5 opacity-60" />
            </div>
          </div>
        ))}
      </div>

      {/* Guide Banner */}
      <section className="bg-[#0D1B2A] text-white rounded-2xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#ffc641]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">¿Necesitas importar masivamente tu inventario?</h2>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Puedes conectar tu sistema ERP o planillas Excel en la sección de Configuración para sincronizar los precios por kilogramo de lúpulos y maltas automáticamente.
          </p>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-[#ffc641] text-[#0D1B2A] hover:bg-[#ffdfa0] active:scale-95 transition-all px-6 py-3 rounded-xl font-bold text-sm shrink-0 flex items-center gap-2 cursor-pointer relative z-10"
        >
          <span>Volver al inicio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
