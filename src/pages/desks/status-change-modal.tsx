// src/components/desks/StatusChangeModal.tsx
import React, { useState, useEffect } from 'react';
import { DeskStatus, type Desk } from '../../types/desk'; // Adjust path
import { CheckCircle, Clock, Lock, Save, HelpCircle } from 'lucide-react';
import Alert from '../../components/ui/alert';
import Button from '../../components/ui/button';
import Modal from '../../components/ui/modal';

interface StatusChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentDesk: Desk | null;
    onConfirm: (deskId: number, newStatus: Desk['status']) => void; // Callback with ID and new status
    isLoading: boolean; // Loading state from the parent mutation
    apiError?: string | null; // Pass error message from parent
}

// Define status options clearly
const statusOptions: { value: Desk['status']; label: string; icon: React.ElementType; colorClass: string }[] = [
    { value: DeskStatus.Free, label: 'فارغة', icon: CheckCircle, colorClass: 'text-green-600 border-green-500 ring-green-500 bg-green-50 hover:bg-green-100' },
    { value: DeskStatus.Occupied, label: 'مشغولة', icon: Clock, colorClass: 'text-yellow-700 border-yellow-500 ring-yellow-500 bg-yellow-50 hover:bg-yellow-100' },
    { value: DeskStatus.Reserved, label: 'محجوزة', icon: Lock, colorClass: 'text-blue-600 border-blue-500 ring-blue-500 bg-blue-50 hover:bg-blue-100' },
];

const formatStatus = (status: Desk['status']): { text: string; colorClass: string; icon: React.ElementType } => {
    switch (status) {
        case 'free': return { text: 'فارغة', colorClass: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
        case 'occupied': return { text: 'مشغولة', colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock };
        case 'reserved': return { text: 'محجوزة', colorClass: 'bg-blue-100 text-blue-800 border-blue-200', icon: Lock };
        default: return { text: String(status || 'غير معروف'), colorClass: 'bg-gray-100 text-gray-800 border-gray-200', icon: HelpCircle };
    }
};
const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
    isOpen,
    onClose,
    currentDesk,
    onConfirm,
    isLoading,
    apiError,
}) => {
    const [selectedStatus, setSelectedStatus] = useState<Desk['status'] | null>(null);

    // Set initial selected status when the modal opens with a desk
    useEffect(() => {
        if (currentDesk) {
            setSelectedStatus(currentDesk.status);
        } else {
            setSelectedStatus(null); // Reset if no desk
        }
    }, [currentDesk]); // Dependency on the desk object

    if (!isOpen || !currentDesk) return null; // Don't render if not open or no desk

    const handleConfirmClick = () => {
        if (selectedStatus && selectedStatus !== currentDesk.status) { // Only confirm if status changed
            onConfirm(currentDesk.id, selectedStatus);
        } else {
            onClose(); // Close if status is the same
        }
    };

    

    const currentStatusInfo = formatStatus(currentDesk.status); // Get current status info for display

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`تغيير حالة الطاولة ${currentDesk.desk_number}`}
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>إلغاء</Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirmClick}
                        isLoading={isLoading}
                        disabled={isLoading || selectedStatus === currentDesk.status} // Disable if no change or loading
                        icon={Save}
                    >
                        حفظ الحالة الجديدة
                    </Button>
                </>
            }
        >
            {/* Display error inside modal */}
            {apiError && <Alert variant="error" message={apiError} className="mb-4"/>}

            <p className="text-sm text-gray-600 mb-4">
                الطاولة: <strong className="font-medium">{currentDesk.desk_number}</strong>
                {currentDesk.name && ` (${currentDesk.name})`}.
                الحالة الحالية: <span className={`font-medium ${currentStatusInfo.colorClass.replace('bg-', 'text-')}`}>{currentStatusInfo.text}</span>.
            </p>
            <p className="text-sm font-medium text-gray-800 mb-2">اختر الحالة الجديدة:</p>
            <fieldset className="space-y-3">
                <legend className="sr-only">الحالة الجديدة للطاولة</legend>
                {statusOptions.map((option) => (
                    <label
                        key={option.value}
                        htmlFor={`status-${option.value}`}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-150 ${
                            selectedStatus === option.value
                                ? `ring-1 ${option.colorClass}` // Apply color classes on selection
                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                    >
                        <input
                            type="radio"
                            id={`status-${option.value}`}
                            name="desk-status"
                            value={option.value}
                            checked={selectedStatus === option.value}
                            onChange={() => setSelectedStatus(option.value)}
                            className="h-4 w-4 border-gray-300 focus:ring-primary text-primary" // Style radio button
                            disabled={isLoading}
                        />
                         <option.icon size={18} className={`mr-1 ${option.colorClass.replace('bg-','text-')}`} /> {/* Use color class for icon */}
                        <span className={`text-sm font-medium ${selectedStatus === option.value ? option.colorClass.replace('bg-','text-') : 'text-gray-800'}`}>
                            {option.label}
                        </span>
                    </label>
                ))}
            </fieldset>
        </Modal>
    );
};
// Re-export formatStatus if needed elsewhere or keep it local if only used here
export { formatStatus }; // Export if DesksPage still needs it for initial badge display
export default StatusChangeModal;