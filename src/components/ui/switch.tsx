import React, { useId } from 'react';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
    description?: string;
}

const Switch: React.FC<SwitchProps> = ({
    label,
    description,
    id,
    name,
    checked,
    onChange,
    disabled,
    ...props
}) => {
    const generatedId = useId();
    const switchId = id || generatedId;

    return (
        <div className="flex items-center justify-between py-2 w-full">
            <span className="flex flex-col flex-grow mr-4"> {/* Allow text to grow and push switch */}
                <label htmlFor={switchId} className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-800'} cursor-pointer`}>
                    {label}
                </label>
                {description && <p className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>{description}</p>}
            </span>
             <label htmlFor={switchId} className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                    type="checkbox"
                    id={switchId}
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="sr-only peer"
                    disabled={disabled}
                    {...props}
                />
                 {/* Ensure RTL compatibility with translate */}
                <div className={`w-11 h-6 bg-gray-200 rounded-full peer transition-colors duration-200 ease-in-out ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                    } peer-focus:outline-none  ${
                    !disabled ? 'peer-checked:bg-[#A70000]' : 'peer-checked:bg-gray-400'
                    } after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-200 ease-in-out peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:shadow-sm`}>
                </div>
            </label>
        </div>
    );
};

export default Switch;