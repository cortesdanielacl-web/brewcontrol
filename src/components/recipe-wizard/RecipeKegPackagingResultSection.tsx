import React from 'react';

interface RecipeKegPackagingResultSectionProps {
  volumeL: number;
  capacityL: number;
  fullBarrels: number;
  remainingLiters: number;
}

export const RecipeKegPackagingResultSection: React.FC<RecipeKegPackagingResultSectionProps> = ({
  volumeL,
  capacityL,
  fullBarrels,
  remainingLiters,
}) => {
  const barrelWord = fullBarrels === 1 ? 'barril' : 'barriles';

  return (
    <div className="bg-[#F8FAFC]/60 rounded-3xl border border-[rgba(15,27,42,0.06)] p-4">
      <p className="text-sm font-bold text-[#0D1B2A] mb-4">🍺 Resultado del envasado</p>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-bold text-[#475569] tracking-wider uppercase mb-1">Lote elaborado</p>
          <p className="text-lg font-mono font-bold text-[#0D1B2A]">
            {volumeL.toLocaleString('es-CL')} litros
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-[#475569] tracking-wider uppercase mb-1">Capacidad del barril</p>
          <p className="text-lg font-mono font-bold text-[#0D1B2A]">
            {capacityL.toLocaleString('es-CL')} litros
          </p>
        </div>
      </div>

      <hr className="my-4 bc-divider" />

      <div>
        <p className="text-xs font-bold text-[#475569] tracking-wider uppercase mb-1">Barriles completos</p>
        <p className="text-lg font-mono font-bold text-[#0D1B2A]">
          {fullBarrels.toLocaleString('es-CL')} {barrelWord} de {capacityL.toLocaleString('es-CL')} litros
        </p>
      </div>

      <hr className="my-4 bc-divider" />

      {remainingLiters > 0 ? (
        <div>
          <p className="text-xs font-bold text-[#475569] tracking-wider uppercase mb-1">Barril adicional</p>
          <p className="text-lg font-mono font-bold text-[#0D1B2A]">
            {remainingLiters.toLocaleString('es-CL')} litros
          </p>
        </div>
      ) : (
        <p className="text-sm font-medium text-slate-500">Sin barril adicional</p>
      )}
    </div>
  );
};
