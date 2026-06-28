import React from 'react';
import { Currency } from '../../types';

interface CurrencySegmentedControlProps {
  currency: Currency;
  onChange: (c: Currency) => void;
  className?: string;
}

export const CurrencySegmentedControl: React.FC<CurrencySegmentedControlProps> = ({
  currency,
  onChange,
  className = '',
}) => {
  const currencies: Currency[] = ['CLP', 'USD', 'EUR'];

  return (
    <div className={`flex bg-[#eef4ff] rounded-lg p-1 border border-[#c4c6cc] h-fit shrink-0 ${className}`}>
      {currencies.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
            currency === c ? 'bg-white text-[#031d34] shadow-xs' : 'text-[#74777d] hover:text-[#031d34]'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
};
