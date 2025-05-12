import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // For animation
import Button from './button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl'; // Modal sizes
    footer?: React.ReactNode; // Optional footer slot for buttons
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    footer,
}) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={onClose} // Close on backdrop click
                    dir="rtl"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? 'modal-title' : undefined}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} overflow-hidden flex flex-col max-h-[90vh]`}
                        onClick={(e) => e.stopPropagation()} // Prevent close on modal click
                    >
                        {/* Header */}
                        {(title) && (
                            <div className="flex justify-between items-center p-2 border-b border-gray-200 flex-shrink-0">
                                {title && <h2 id="modal-title" className="text-lg font-semibold text-gray-800">{title}</h2>}
                                <Button variant="ghost" size="sm" className="p-1 -mr-2" onClick={onClose} aria-label="إغلاق"> <X size={18} /> </Button>
                            </div>
                        )}

                        {/* Body */}
                        <div className="p-4 md:p-4 overflow-y-auto flex-grow">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="flex justify-end gap-3 p-2 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;