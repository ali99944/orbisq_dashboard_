// src/pages/marketing/CouponsPage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Coupon } from '../../types/coupon'; // Adjust path

import { Plus, Edit, Trash2, Percent, Tag, CalendarDays } from 'lucide-react';
import { format } from 'date-fns'; // For date formatting
import { arSA } from 'date-fns/locale';
import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
import Alert from '../../components/ui/alert';
import Button from '../../components/ui/button';
import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
import Modal from '../../components/ui/modal';
import Spinner from '../../components/ui/spinner';
import Switch from '../../components/ui/switch';
import Toolbar from '../../components/ui/toolbar';

// Helper function to format dates or show placeholder
const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    try {
        return format(new Date(dateString), 'yyyy/MM/dd', { locale: arSA });
    } catch (e) {
        console.log(e);
        
        return '-';
    }
};

const formatValue = (type: Coupon['type'], value: Coupon['value'], currency: string = 'ر.س'): string => {
    if (value === null || value === undefined) return '-';
    const numValue = parseFloat(String(value));
    if (isNaN(numValue)) return '-';

    if (type === 'percentage') {
        return `${numValue}%`;
    }
    if (type === 'fixed_amount') {
        return `${numValue.toFixed(2)} ${currency}`;
    }
    return String(value); // Fallback
};

const CouponsPage: React.FC = () => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState<Coupon | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [activeToggles, setActiveToggles] = useState<Record<number, boolean>>({});

    // --- Data Fetching ---
    // TODO: Add shop_id filter if this is per-restaurant dashboard
    const { data: couponsResponse, isLoading, error, refetch } = useGetQuery<{ data: Coupon[] }>({
        key: ['coupons'],
        url: 'coupons', // Your API endpoint
    });
    const coupons = couponsResponse?.data || [];

    // --- Mutations ---
    const { mutateAsync: deleteCoupon, isPending: isDeleting } = useMutationAction({
        method: 'delete',
        url: `coupons/{id}`,
    });
    const { mutateAsync: updateCouponStatus } = useMutationAction({
        method: 'patch',
        url: `coupons/{id}/status`,
        // URL set dynamically
    });

    // --- Handlers ---
    const handleAdd = () => navigate('/coupons/new');
    const handleEdit = (id: number) => navigate(`/coupons/${id}/edit`);
    const openDeleteConfirm = (coupon: Coupon) => setShowDeleteModal(coupon);
    const closeDeleteConfirm = () => setShowDeleteModal(null);

    const confirmDelete = async () => {
        if (!showDeleteModal) return;
        setApiError(null);
        try {
            await deleteCoupon({}, {
                onSuccess: () => {
                    refetch();
                    closeDeleteConfirm();
                },
                onError: (err: Error) => setApiError(err.message || "فشل حذف الكوبون."),
            });
        } catch (e) {
            setApiError((e as Error).message || "خطأ غير متوقع.");
        }
    };

     const handleStatusToggle = async (coupon: Coupon, newStatus: boolean) => {
        setApiError(null);
        setActiveToggles(prev => ({ ...prev, [coupon.id]: true }));
         try {
             await updateCouponStatus({ is_active: newStatus }, {
                 onSuccess: () => refetch(), // Refresh data
                 onError: (err: Error) => setApiError(err.message || "فشل تحديث الحالة."),
                 onSettled: () => {
                     setActiveToggles(prev => {
                         const newState = { ...prev };
                         delete newState[coupon.id];
                         return newState;
                     });
                 }
             });
         } catch (e) {
            setApiError((e as Error).message || "خطأ غير متوقع.");
            setActiveToggles(prev => { // Ensure removal on error
                const newState = { ...prev };
                delete newState[coupon.id];
                return newState;
             });
         }
     };

    // --- Table Columns ---
    const columns = useMemo((): ColumnDefinition<Coupon>[] => [
        { key: 'code', header: 'الكود', cellClassName: 'font-medium text-primary font-mono', render: (c) => c.code.toUpperCase() },
        {
            key: 'value', header: 'القيمة/النوع', width: '120px',
            render: (c) => (
                <span className="flex items-center gap-1 text-sm">
                    {c.type === 'percentage' ? <Percent size={14} className="text-blue-500"/> : <Tag size={14} className="text-green-500"/>}
                    {formatValue(c.type, c.value)}
                </span>
            )
        },
        { key: 'description', header: 'الوصف', cellClassName: 'text-gray-600 text-xs max-w-xs truncate', render: (c) => c.description || '-' },
        {
             key: 'validity', header: 'الصلاحية', width: '180px',
             render: (c) => (
                 <div className="text-xs text-gray-500 flex items-center gap-1">
                    <CalendarDays size={14}/>
                    <span>{formatDate(c.start_date)}</span>
                    <span>-</span>
                    <span>{formatDate(c.end_date)}</span>
                 </div>
             )
        },
        {
            key: 'usage', header: 'الاستخدام (مرات/إجمالي)', width: '140px',
            render: (c) => (
                 <span className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    {c.times_used}
                     <span className="text-gray-400">/</span>
                    {c.usage_limit_total ?? <span className="text-xl font-bold">∞</span>}
                 </span>
            )
        },
        {
            key: 'is_active', header: 'الحالة', cellClassName: 'w-[100px]',
            render: (c) => (
                 <div className="flex items-center justify-center">
                     {activeToggles[c.id] ? (<Spinner size="sm"/>) : (
                        <Switch label="" checked={c.is_active} onChange={(e) => handleStatusToggle(c, e.target.checked)}/>
                     )}
                 </div>
            )
        },
        {
            key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
            render: (c) => (
                <div className="flex justify-center items-center gap-1">
                    <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(c.id)} title="تعديل"> <Edit size={16} /> </Button>
                    <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(c)} title="حذف"> <Trash2 size={16} /> </Button>
                </div>
            )
        },
    ], [activeToggles]); // Include activeToggles dependency

    // --- Toolbar Config ---
    const breadcrumbItems = [
        { label: "لوحة التحكم", href: "/" },
        { label: "التسويق" }, // Parent category (example)
        { label: "الكوبونات" },
    ];
    const toolbarActions = (<Button onClick={handleAdd} icon={Plus}>إضافة كوبون</Button>);

    return (
        <div className="space-y-4">
            <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
            {apiError && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} className="mb-4"/>}

            <DataTable<Coupon>
                columns={columns}
                data={coupons}
                isLoading={isLoading}
                error={error ? (error as Error).message || "فشل تحميل الكوبونات" : null}
                emptyStateMessage="لم يتم إنشاء أي كوبونات بعد."
                rowKey="id"
            />

            <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف الكوبون" size="sm"
                footer={<>
                    <Button variant="secondary" onClick={closeDeleteConfirm} disabled={isDeleting}>إلغاء</Button>
                    <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting} disabled={isDeleting}>نعم، حذف</Button>
                </>}
            >
                <p className="text-sm text-gray-600">
                     هل أنت متأكد من حذف الكوبون "<strong>{showDeleteModal?.code}</strong>"؟
                 </p>
            </Modal>
        </div>
    );
};

export default CouponsPage;