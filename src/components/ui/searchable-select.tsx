import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export interface SelectOption {
    value: string | number;
    label: string;
}

interface SearchableSelectProps {
    options: SelectOption[];
    value: string | number | null;
    onChange: (value: string | number | null) => void;
    placeholder?: string;
    label?: string;
    id?: string;
    disabled?: boolean;
    isLoading?: boolean; // Add loading state if needed for async options
    containerClassName?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "اختر...",
    label,
    id,
    disabled,
    isLoading,
    containerClassName = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const generatedId = useId();
    const selectId = id || generatedId;

    const selectedOption = options.find(option => option.value === value);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm(''); // Reset search on close
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: SelectOption) => {
        onChange(option.value);
        setIsOpen(false);
        setSearchTerm('');
    };

    const toggleOpen = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
        if (!isOpen && inputRef.current) {
             // Focus input when opening for search
             setTimeout(() => inputRef.current?.focus(), 0);
        } else {
             setSearchTerm(''); // Reset search term when closing manually
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent toggleOpen from firing
        onChange(null);
        setIsOpen(false);
        setSearchTerm('');
    }

    return (
        <div className={`relative ${containerClassName}`} ref={selectRef} dir="rtl">
            {label && (
                <label htmlFor={selectId + '-button'} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    id={selectId + '-button'}
                    onClick={toggleOpen}
                    disabled={disabled || isLoading}
                    className={`w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-left cursor-default focus:outline-none focus:ring-1 focus:ring-[#A70000] focus:border-[#A70000] transition duration-150 ease-in-out ${disabled ? 'bg-gray-50 opacity-60 cursor-not-allowed' : ''}`}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className={`truncate ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <div className="flex items-center">
                        {/* Clear Button */}
                        {value && !disabled && (
                             <button type="button" onClick={handleClear} className="mr-1 p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none" aria-label="Clear selection">
                                 <X size={14} />
                             </button>
                        )}
                         <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                    </div>
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md max-h-60 overflow-y-auto focus:outline-none text-sm">
                        {/* Search Input */}
                        <div className="p-2 border-b border-gray-200">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="بحث..."
                                    className="w-full border-gray-300 border rounded-md py-1 pl-8 pr-2 text-sm focus:border-[#A70000] focus:ring-1 focus:ring-[#A70000]/50"
                                />
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        {/* Options List */}
                        <ul role="listbox">
                            {isLoading && <li className="text-gray-500 text-center py-2">جاري التحميل...</li>}
                            {!isLoading && filteredOptions.length === 0 && (
                                <li className="text-gray-500 text-center py-2 px-3">لا توجد نتائج.</li>
                            )}
                            {!isLoading && filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    className={`cursor-pointer select-none relative py-2 pr-3 pl-9 hover:bg-[#FDECEC] hover:text-[#8B0000] ${option.value === value ? 'font-semibold text-[#A70000]' : 'text-gray-900'}`}
                                    role="option"
                                    aria-selected={option.value === value}
                                >
                                    <span className="block truncate">{option.label}</span>
                                    {/* Optional Checkmark for selected */}
                                    {/* {option.value === value && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#A70000]">
                                            <Check className="h-4 w-4" />
                                        </span>
                                    )} */}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchableSelect;