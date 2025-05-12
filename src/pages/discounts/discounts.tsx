// // src/pages/marketing/DiscountsPage.tsx
// import React, { useState, useMemo } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// import { Plus, Edit, Trash2, Percent, Tag, CalendarDays, Gift } from 'lucide-react'; // Gift icon for discounts
// import { format } from 'date-fns';
// import { arSA } from 'date-fns/locale';
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
// import Modal from '../../components/ui/modal';
// import Spinner from '../../components/ui/spinner';
// import Switch from '../../components/ui/switch';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
// import { useAppSelector } from '../../hooks/redux';
// import { Discount } from '../../types/discount';

// // Helper Functions
// const formatDate = (dateString: string | null | undefined): string => {
//     if (!dateString) return '-';
//     try {
//         return format(new Date(dateString), 'yyyy/MM/dd', { locale: arSA });
//     } catch (e) { return '-'; }
// };

// const formatDiscountValue = (type: Discount['type'], value: Discount['value'], currency: string = 'ر.س'): string => {
//     if (value === null || value === undefined || value === '') return '-';
//     const numValue = parseFloat(String(value));
//     if (isNaN(numValue)) return '-';

//     switch (type) {
//         case 'percentage': return `${numValue}%`;
//         case 'fixed_amount_off': return `خصم ${numValue.toFixed(2)} ${currency}`;
//         case 'fixed_price': return `السعر الثابت ${numValue.toFixed(2)} ${currency}`;
//         default: return String(value);
//     }
// };

// const DiscountsPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [showDeleteModal, setShowDeleteModal] = useState<Discount | null>(null);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [activeToggles, setActiveToggles] = useState<Record<number, boolean>>({});
//      const { restaurant } = useAppSelector(state => state.auth_store); // Get currency from store
//      const currencyIcon = restaurant?.currency_icon || 'ر.س';


//     // --- Data Fetching ---
//     // TODO: Filter by shop_id if necessary
//     const { data: discountsResponse, isLoading, error, refetch } = useGetQuery<{ data: Discount[] }>({
//         queryKey: ['discounts'],
//         url: 'discounts', // API endpoint for discounts
//     });
//     const discounts = discountsResponse?.data || [];

//     // --- Mutations ---
//     const { mutateAsync: deleteDiscount, isLoading: isDeleting } = useMutationAction({ method: 'DELETE' });
//     const { mutateAsync: updateDiscountStatus, isLoading: isUpdatingStatus } = useMutationAction({ method: 'PATCH' });

//     // --- Handlers ---
//     const handleAdd = () => navigate('/discounts/new');
//     const handleEdit = (id: number) => navigate(`/discounts/${id}/edit`);
//     const openDeleteConfirm = (discount: Discount) => setShowDeleteModal(discount);
//     const closeDeleteConfirm = () => setShowDeleteModal(null);

//     const confirmDelete = async () => {
//         if (!showDeleteModal) return;
//         setApiError(null);
//         try {
//             await deleteDiscount({}, {
//                 url: `discounts/${showDeleteModal.id}`,
//                 onSuccess: () => { refetch(); closeDeleteConfirm(); },
//                 onError: (err: any) => setApiError(err.message || "فشل حذف الخصم."),
//             });
//         } catch (e: any) { setApiError(e.message || "خطأ غير متوقع."); }
//     };

//     const handleStatusToggle = async (discount: Discount, newStatus: boolean) => {
//         setApiError(null);
//         setActiveToggles(prev => ({ ...prev, [discount.id]: true }));
//         try {
//             await updateDiscountStatus({ is_active: newStatus }, {
//                 url: `discounts/${discount.id}/status`, // Example status endpoint
//                 onSuccess: () => refetch(),
//                 onError: (err: any) => setApiError(err.message || "فشل تحديث الحالة."),
//                 onSettled: () => setActiveToggles(prev => { const n = { ...prev }; delete n[discount.id]; return n; }),
//             });
//         } catch (e: any) {
//             setApiError(e.message || "خطأ غير متوقع.");
//             setActiveToggles(prev => { const n = { ...prev }; delete n[discount.id]; return n; });
//         }
//     };

//     // --- Table Columns ---
//     const columns = useMemo((): ColumnDefinition<Discount>[] => [
//         { key: 'name', header: 'اسم الخصم', cellClassName: 'font-medium text-gray-800' },
//         {
//             key: 'value', header: 'القيمة/النوع', width: '160px',
//             render: (d) => (
//                 <span className="flex items-center gap-1.5 text-sm font-medium">
//                     {d.type === 'percentage' && <Percent size={14} className="text-blue-500"/>}
//                     {d.type === 'fixed_amount_off' && <Tag size={14} className="text-green-500"/>}
//                     {d.type === 'fixed_price' && <Tag size={14} className="text-purple-500"/>}
//                     {formatDiscountValue(d.type, d.value, currencyIcon)}
//                 </span>
//             )
//         },
//         { key: 'description', header: 'الوصف', cellClassName: 'text-gray-600 text-xs max-w-xs truncate', render: (d) => d.description || '-' },
//         {
//              key: 'validity', header: 'الصلاحية', width: '180px',
//              render: (d) => (
//                  <div className="text-xs text-gray-500 flex items-center gap-1">
//                     <CalendarDays size={14}/>
//                     <span>{formatDate(d.start_date)}</span>
//                     <span>-</span>
//                     <span>{formatDate(d.end_date)}</span>
//                  </div>
//              )
//         },
//         {
//             key: 'is_active', header: 'الحالة', cellClassName: 'w-[100px]',
//             render: (d) => (
//                  <div className="flex items-center justify-center">
//                      {activeToggles[d.id] ? (<Spinner size="sm"/>) : (
//                         <Switch label="" checked={d.is_active} onChange={(e) => handleStatusToggle(d, e.target.checked)}/>
//                      )}
//                  </div>
//             )
//         },
//         {
//             key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
//             render: (d) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(d.id)} title="تعديل"> <Edit size={16} /> </Button>
//                     <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(d)} title="حذف"> <Trash2 size={16} /> </Button>
//                 </div>
//             )
//         },
//     ], [activeToggles, currencyIcon]); // Add currencyIcon dependency

//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "التسويق" }, { label: "الخصومات" }, ];
//     const toolbarActions = (<Button onClick={handleAdd} icon={Plus}>إضافة خصم</Button>);

//     return (
//         <div className="space-y-4">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {apiError && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} className="mb-4"/>}

//             <DataTable<Discount>
//                 columns={columns}
//                 data={discounts}
//                 isLoading={isLoading}
//                 error={error ? (error as any).message || "فشل تحميل الخصومات" : null}
//                 emptyStateMessage="لم يتم إنشاء أي خصومات بعد."
//                 rowKey="id"
//             />

//             <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف الخصم" size="sm"
//                 footer={<>
//                     <Button variant="secondary" onClick={closeDeleteConfirm} disabled={isDeleting}>إلغاء</Button>
//                     <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting} disabled={isDeleting}>نعم، حذف</Button>
//                 </>}
//             >
//                  <p className="text-sm text-gray-600"> هل أنت متأكد من حذف الخصم "<strong>{showDeleteModal?.name}</strong>"؟ </p>
//             </Modal>
//         </div>
//     );
// };

// export default DiscountsPage;