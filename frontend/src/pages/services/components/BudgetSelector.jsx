import React from 'react';
import { BUDGET_OPTIONS } from '../data/servicesData';

export default function BudgetSelector({ selectedBudget, onSelectBudget }) {
  return (
    <div className="w-full">
      <label className="block font-mono text-xs font-semibold tracking-[0.2em] text-[#1E1B18] uppercase mb-3.5">
        What's Your Approximate Budget?
      </label>

      <div className="flex flex-wrap gap-2.5">
        {BUDGET_OPTIONS.map((tier) => {
          const isSelected = selectedBudget === tier;

          return (
            <button
              key={tier}
              type="button"
              onClick={() => onSelectBudget(tier)}
              className={`px-4 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-[#685444] text-[#FAF8F5] border-[#685444] shadow-xs'
                  : 'bg-transparent text-[#38332C] border-[#C7BDAE] hover:border-[#8E8373]'
              }`}
            >
              {tier}
            </button>
          );
        })}
      </div>
    </div>
  );
}
