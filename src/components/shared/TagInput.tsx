import React from 'react';

interface TagInputProps<T> {
  label: string;
  options: T[];
  value: T | undefined;
  onChange: (value: T) => void;
  className?: string;
  getOptionLabel: (option: T) => string;
  renderOption?: (option: T) => React.ReactNode;
}

export function TagInput<T extends { id: string }>({
  label,
  options,
  value,
  onChange,
  className = '',
  getOptionLabel,
  renderOption,
}: TagInputProps<T>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-white">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs transition-colors duration-200 ${
              value?.id === option.id
                ? 'bg-[#A8E80E] text-black'
                : 'bg-white/10 text-[#9ca3af] hover:bg-white/20'
            }`}
            onClick={() => onChange(option)}
          >
            {renderOption ? renderOption(option) : getOptionLabel(option)}
          </button>
        ))}
      </div>
    </div>
  );
} 