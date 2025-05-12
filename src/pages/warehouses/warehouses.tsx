// // src/pages/locations/WarehousesPage.tsx
// import React, { useState, useMemo } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import type { Warehouse } from '../../types/warehouse'; // Adjust

// import { Plus, Edit, Trash2, Home, Phone, User, Star } from 'lucide-react'; // Use Home icon for warehouse
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
// import Modal from '../../components/ui/modal';
// import Spinner from '../../components/ui/spinner';
// import Switch from '../../components/ui/switch';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';

// const WarehousesPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [showDeleteModal, setShowDeleteModal] = useState<Warehouse | null>(null);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [apiSuccess, setApiSuccess] = useState<string | null>(null);
//     const [activeToggles, setActiveToggles] = useState<Record<number, boolean>>({});
//     // const { shopId } = useAuth(); // Get shopId

//     // --- Data Fetching ---
//     const { data: warehousesResponse, isLoading, error, refetch } = useGetQuery<{ data: Warehouse[] }>({
//         queryKey: ['warehouses'],
//         url: 'warehouses', // API endpoint
//         // enabled: !!shopId,
//     });
//     const warehouses = warehousesResponse?.data || [];

//     // --- Mutations ---
//     const { mutateAsync: deleteWarehouse, isLoading: isDeleting } = useMutationAction({ method: 'DELETE' });
//     const { mutateAsync: updateWarehouseStatus, isLoading: isUpdatingStatus } = useMutationAction({ method: 'PATCH' });

//     // --- Handlers ---
//     const handleAdd = () => navigate('/warehouses/new');
//     const handleEdit = (id: number) => navigate(`/warehouses/${id}/edit`);
//     const openDeleteConfirm = (wh: Warehouse) => setShowDeleteModal(wh);
//     const closeDeleteConfirm = () => setShowDeleteModal(null);

//     const confirmDelete = async () => { /* ... (similar delete logic) ... */ };
//     const handleStatusToggle = async (wh: Warehouse, newStatus: boolean) => { /* ... (similar status toggle logic) ... */ };

//     // --- Table Columns ---
//     const columns = useMemo((): ColumnDefinition<Warehouse>[] => [
//          {
//             key: 'name', header: 'اسم المستودع', cellClassName: 'font-medium text-gray-800',
//             render: (w) => (
//                 <div className="flex items-center">
//                     {w.name}
//                     {w.is_primary && <Star size={14} className="mr-2 text-yellow-500 fill-yellow-400" title="المستودع الرئيسي" />}
//                 </div>
//             )
//         },
//         { key: 'city', header: 'المدينة', render: (w) => w.city || '-' },
//         { key: 'contact_person', header: 'مسؤول التواصل', render: (w) => w.contact_person || '-' },
//         { key: 'contact_phone', header: 'هاتف التواصل', render: (w) => w.contact_phone ? <a href={`tel:${w.contact_phone}`} className="text-primary hover:underline" dir="ltr">{w.contact_phone}</a> : '-' },
//          {
//             key: 'is_active', header: 'الحالة', cellClassName: 'w-[100px]',
//             render: (w) => (
//                  <div className="flex items-center justify-center">
//                      {activeToggles[w.id] ? (<Spinner size="sm"/>) : (
//                         <Switch label="" checked={w.is_active} onChange={(e) => handleStatusToggle(w, e.target.checked)}/>
//                      )}
//                  </div>
//             )
//         },
//         {
//             key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
//             render: (w) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(w.id)} title="تعديل"> <Edit size={16} /> </Button>
//                     {/* Prevent deleting primary warehouse maybe? */}
//                     <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(w)} title="حذف" disabled={w.is_primary}> <Trash2 size={16} /> </Button>
//                 </div>
//             )
//         },
//     ], [activeToggles]);

//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "المواقع" }, { label: "المستودعات" }, ];
//     const toolbarActions = (<Button onClick={handleAdd} icon={Plus}>إضافة مستودع</Button>);

//     return (
//         <div className="space-y-4">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {apiError && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} className="mb-4"/>}
//             {apiSuccess && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} className="mb-4"/>}

//              <DataTable<Warehouse>
//                 columns={columns}
//                 data={warehouses}
//                 isLoading={isLoading}
//                 error={error ? (error as any).message || "فشل تحميل المستودعات" : null}
//                 emptyStateMessage="لم يتم إضافة أي مستودعات بعد."
//                 rowKey="id"
//             />

//              <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف المستودع" size="sm"
//                 footer={<>
//                     <Button variant="secondary" onClick={closeDeleteConfirm} disabled={isDeleting}>إلغاء</Button>
//                     <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting} disabled={isDeleting}>نعم، حذف</Button>
//                 </>}
//             >
//                  <p className="text-sm text-gray-600"> هل أنت متأكد من حذف المستودع "<strong>{showDeleteModal?.name}</strong>"؟ </p>
//             </Modal>
//         </div>
//     );
// };

// export default WarehousesPage;