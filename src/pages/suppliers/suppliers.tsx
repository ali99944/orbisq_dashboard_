// // src/pages/suppliers/SuppliersPage.tsx
// import React, { useState, useMemo } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import type { Supplier } from '../../types/supplier'; // Adjust path
// import { Plus, Edit, Trash2, User, Phone, Mail, MapPin, Code } from 'lucide-react'; // Icons
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
// import Modal from '../../components/ui/modal';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';

// const SuppliersPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [showDeleteModal, setShowDeleteModal] = useState<Supplier | null>(null);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [apiSuccess, setApiSuccess] = useState<string | null>(null);
//     // No status toggle needed for this schema

//     // --- Data Fetching ---
//     // TODO: Add shop_id filter if suppliers are shop-specific
//     const { data: suppliersResponse, isLoading, error, refetch } = useGetQuery<{ data: Supplier[] }>({
//         queryKey: ['suppliers'],
//         url: 'suppliers', // Your API endpoint for suppliers
//     });
//     const suppliers = suppliersResponse?.data || [];

//     // --- Mutations ---
//     const { mutateAsync: deleteSupplier, isLoading: isDeleting } = useMutationAction({
//         method: 'DELETE',
//         // URL set dynamically
//     });

//     // --- Handlers ---
//     const handleAdd = () => navigate('/suppliers/new');
//     const handleEdit = (id: number) => navigate(`/suppliers/${id}/edit`);
//     const openDeleteConfirm = (supplier: Supplier) => setShowDeleteModal(supplier);
//     const closeDeleteConfirm = () => setShowDeleteModal(null);

//     const confirmDelete = async () => {
//         if (!showDeleteModal) return;
//         setApiError(null);
//         setApiSuccess(null);
//         try {
//             await deleteSupplier({}, {
//                 url: `suppliers/${showDeleteModal.id}`,
//                 onSuccess: () => {
//                     setApiSuccess(`تم حذف المورد "${showDeleteModal.name}" بنجاح.`);
//                     refetch();
//                     closeDeleteConfirm();
//                     setTimeout(() => setApiSuccess(null), 3000);
//                 },
//                 onError: (err: any) => setApiError(err.message || "فشل حذف المورد."),
//             });
//         } catch (e: any) { setApiError(e.message || "خطأ غير متوقع."); }
//     };

//     // --- Table Columns ---
//     const columns = useMemo((): ColumnDefinition<Supplier>[] => [
//         { key: 'name', header: 'اسم المورد', cellClassName: 'font-medium text-gray-800' },
//         { key: 'code', header: 'الكود', cellClassName: 'text-xs font-mono text-gray-500', width: '100px' },
//         { key: 'contact_name', header: 'مسؤول التواصل', cellClassName: 'text-gray-700' },
//         {
//             key: 'phone_number', header: 'الهاتف', width: '150px',
//             render: (s) => s.phone_number ? <a href={`tel:${s.phone_number}`} className="text-primary hover:underline" dir="ltr">{s.phone_number}</a> : '-'
//         },
//         {
//             key: 'email', header: 'البريد الإلكتروني',
//             render: (s) => s.email ? <a href={`mailto:${s.email}`} className="text-primary hover:underline">{s.email}</a> : '-'
//         },
//         { key: 'address', header: 'العنوان', cellClassName: 'text-gray-600 text-xs max-w-xs truncate', render: (s) => s.address || '-' },
//         {
//             key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
//             render: (s) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(s.id)} title="تعديل"> <Edit size={16} /> </Button>
//                     <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(s)} title="حذف"> <Trash2 size={16} /> </Button>
//                 </div>
//             )
//         },
//     ], []); // No dynamic dependencies for columns here


//     // --- Toolbar Config ---
//     const breadcrumbItems = [
//         { label: "لوحة التحكم", href: "/" },
//         { label: "الموردين" }, // Assuming it's top-level or adjust parent
//     ];
//     const toolbarActions = (<Button onClick={handleAdd} icon={Plus}>إضافة مورد</Button>);

//     return (
//         <div className="space-y-4">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {apiError && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} className="mb-4"/>}
//             {apiSuccess && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} className="mb-4"/>}

//             <DataTable<Supplier>
//                 columns={columns}
//                 data={suppliers}
//                 isLoading={isLoading}
//                 error={error ? (error as any).message || "فشل تحميل الموردين" : null}
//                 emptyStateMessage="لم يتم إضافة أي موردين بعد."
//                 rowKey="id"
//                 // onRowClick={(s) => handleEdit(s.id)} // Optional
//             />

//             <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف المورد" size="sm"
//                 footer={<>
//                     <Button variant="secondary" onClick={closeDeleteConfirm} disabled={isDeleting}>إلغاء</Button>
//                     <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting} disabled={isDeleting}>نعم، حذف</Button>
//                 </>}
//             >
//                  <p className="text-sm text-gray-600"> هل أنت متأكد من حذف المورد "<strong>{showDeleteModal?.name}</strong>"؟ </p>
//                  {/* Show delete-specific error inside modal */}
//                  {apiError && showDeleteModal && <Alert variant="error" message={apiError} className="mt-3"/>}
//             </Modal>
//         </div>
//     );
// };

// export default SuppliersPage;