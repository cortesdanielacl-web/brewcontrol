import React from 'react';

interface RecipeKegPackagingResultSectionProps {
  volumeL: number;
  capacityL: number;
  fullBarrels: number;
  remainingLiters: number;
  costPerBarrel?: React.ReactNode;
  showTitle?: boolean;
}

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-[#F8FAFC] rounded-lg px-4 py-3 border border-[rgba(15,27,42,0.06)]">
      <p className="text-xs font-bold text-[#475569] tracking-wider uppercase mb-1">{label}</p>
      <p className="text-sm font-mono font-bold text-[#0D1B2A]">{value}</p>
    </div>
  );
}

export const RecipeKegPackagingResultSection: React.FC<RecipeKegPackagingResultSectionProps> = ({
  volumeL,
  capacityL,
  fullBarrels,
  remainingLiters,
  costPerBarrel,
  showTitle = true,
}) => {
  const barrelWord = fullBarrels === 1 ? 'barril' : 'barriles';

  return (
    <div className="bg-[#F8FAFC]/60 rounded-3xl border border-[rgba(15,27,42,0.06)] p-4">
      {showTitle && (
        <p className="text-sm font-bold text-[#0D1B2A] mb-4">🍺 Resultado del envasado</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <InfoCard
          label="Volumen de la receta"
          value={`${volumeL.toLocaleString('es-CL')} litros`}
        />
        <InfoCard
          label="Capacidad del barril"
          value={`${capacityL.toLocaleString('es-CL')} litros`}
        />
        <InfoCard
          label="Barriles completos"
          value={`${fullBarrels.toLocaleString('es-CL')} ${barrelWord} de ${capacityL.toLocaleString('es-CL')} litros`}
        />
        <InfoCard
          label="Barril adicional"
          value={
            remainingLiters > 0
              ? `${remainingLiters.toLocaleString('es-CL')} litros`
              : 'Sin barril adicional'
          }
        />
        {costPerBarrel != null && (
          <InfoCard label="Costo por barril" value={costPerBarrel} />
        )}
      </div>
    </div>
  );
};
