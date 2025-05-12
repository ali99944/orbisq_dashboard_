// import React, { forwardRef } from 'react';
// import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
// import { arSA } from 'date-fns/locale'; // Import Arabic locale
// import { Calendar, X } from 'lucide-react';

// // Register Arabic locale globally (or where appropriate)
// registerLocale('ar-SA', arSA);
// // setDefaultLocale('ar-SA'); // Optional: set as default for all pickers

// import "react-datepicker/dist/react-datepicker.css"; // Base styles

// // Custom styling (add to your global CSS or a dedicated file)
// /*
//  You'll need to add CSS to style react-datepicker elements.
//  See example styles below this component code.
// */

// interface DatePickerInputProps {
//     label?: string;
//     id?: string;
//     selectedDate: Date | null | undefined;
//     onChange: (date: Date | null) => void; // Callback for date change
//     placeholder?: string;
//     dateFormat?: string;
//     showTimeSelect?: boolean;
//     timeFormat?: string; // e.g., "HH:mm" (24hr) or "hh:mm aa" (12hr)
//     timeIntervals?: number; // e.g., 15, 30
//     minDate?: Date | null;
//     maxDate?: Date | null;
//     disabled?: boolean;
//     error?: string;
//     required?: boolean;
//     containerClassName?: string;
// }

// // Custom Input Component for the Date Picker
// // eslint-disable-next-line react/display-name
// const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void; placeholder?: string, id?: string, disabled?: boolean, error?: boolean }>(
//     ({ value, onClick, placeholder, id, disabled, error }, ref) => (
//     <button
//         type="button"
//         id={id}
//         className={`w-full flex items-center justify-between border rounded-md text-sm px-3 py-1.5 bg-white text-left focus:outline-none focus:ring-1 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${
//             error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'
//         } ${!value ? 'text-gray-400' : 'text-gray-900'}`} // Placeholder color
//         onClick={onClick}
//         ref={ref}
//         disabled={disabled}
//     >
//         <span className="truncate">{value || placeholder || 'اختر تاريخ...'}</span>
//         <Calendar className={`h-4 w-4 ${error ? 'text-red-500' : 'text-gray-400'}`} />
//     </button>
// ));

// // Main Date Picker Wrapper
// const DatePickerInput: React.FC<DatePickerInputProps> = ({
//     label,
//     id,
//     selectedDate,
//     onChange,
//     placeholder = "YYYY/MM/DD",
//     dateFormat = "yyyy/MM/dd", // Default display format
//     showTimeSelect = false,
//     timeFormat = "hh:mm aa",
//     timeIntervals = 30,
//     minDate,
//     maxDate,
//     disabled = false,
//     error,
//     required = false,
//     containerClassName = '',
// }) => {
//     const generatedId = React.useId();
//     const pickerId = id || generatedId;

//      // Button to clear the date
//      const ClearButton = ({ onClick }: { onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) => (
//         <button
//           type="button"
//           onClick={onClick}
//           className="absolute left-8 top-1/2 transform -translate-y-1/2 p-0.5 text-gray-400 hover:text-red-600 focus:outline-none rounded-full hover:bg-gray-100"
//           aria-label="Clear date"
//         >
//           <X size={14} />
//         </button>
//       );

//     return (
//         <div className={`w-full ${containerClassName}`}>
//             {label && (
//                 <label htmlFor={pickerId} className="block text-sm font-medium text-gray-700 mb-1.5">
//                     {label} {required && <span className="text-red-500">*</span>}
//                 </label>
//             )}
//              <div className="relative custom-datepicker-wrapper"> {/* Wrapper for potential clear button */}
//                 <DatePicker
//                     id={pickerId}
//                     selected={selectedDate}
//                     onChange={onChange}
//                     locale="ar-SA" // Use Arabic locale
//                     dateFormat={showTimeSelect ? `${dateFormat} ${timeFormat}` : dateFormat}
//                     placeholderText={placeholder}
//                     showTimeSelect={showTimeSelect}
//                     timeFormat={timeFormat}
//                     timeIntervals={timeIntervals}
//                     // minDate={minDate}
//                     // maxDate={maxDate}
//                     disabled={disabled}
//                     required={required}
//                     className="w-full hidden" // Hide the default input, use customInput
//                     customInput={<CustomInput id={pickerId} error={!!error} disabled={disabled} />} // Use our styled button
//                     popperPlacement="bottom-end" // Adjust as needed for RTL
//                     calendarClassName="orbis-datepicker-theme" // Class for custom styling
//                     wrapperClassName="w-full" // Ensure wrapper takes full width
//                     showPopperArrow={false} // Hide default arrow
//                     clearButton={selectedDate ? <ClearButton onClick={(e) => { e.stopPropagation(); onChange(null); }} /> : undefined}
//                     // Add more react-datepicker props as needed
//                 />
//             </div>
//              {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
//         </div>
//     );
// };

// export default DatePickerInput;