import React, { ChangeEvent } from 'react';
import Input from './input';

interface ColorInputProps {
    label: string;
    name: string;
    value: string; // Hex color value (e.g., #RRGGBB)
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, name, value, onChange, disabled }) => {
    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value.toUpperCase();
        // Basic validation: ensure it starts with # and has valid hex chars
        if (!newValue.startsWith('#')) {
            newValue = '#' + newValue;
        }
        newValue = '#' + newValue.substring(1).replace(/[^0-9A-F]/gi, '');
        if (newValue.length > 7) {
            newValue = newValue.substring(0, 7);
        }
        // Create a synthetic event to pass to the original onChange
        const syntheticEvent = {
            ...e,
            target: { ...e.target, name, value: newValue },
        };
        onChange(syntheticEvent as ChangeEvent<HTMLInputElement>);
    };

    const handleColorPickerChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e); // Pass the event directly
    };


    return (
        <div>
            <label htmlFor={name + '-text'} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="flex items-center gap-2">
                {/* Color Picker Input */}
                <input
                    type="color"
                    id={name + '-color'}
                    name={name}
                    value={value || '#FFFFFF'} // Default to white if invalid
                    onChange={handleColorPickerChange}
                    disabled={disabled}
                    className="p-0 w-8 h-8 block  cursor-pointer rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    title="اختر لونًا"
                />
                 {/* Text Input for Hex */}
                 <Input
                    ref={null} // No ref needed typically here unless using form lib differently
                    id={name + '-text'}
                    name={name}
                    value={value?.toUpperCase() || ''}
                    onChange={handleTextChange}
                    disabled={disabled}
                    size="sm" // Use small size
                    maxLength={7}
                    placeholder="#RRGGBB"
                    containerClassName="flex-grow"
                    className="font-mono text-left" // LTR for hex code
                    dir="ltr"
                 />

            </div>
        </div>
    );
};

export default ColorInput;