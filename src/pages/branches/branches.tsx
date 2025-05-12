// // src/pages/locations/BranchesPage.tsx
// import React, { useState, useMemo } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import type { Branch } from '../../types/branch'; // Adjust path

// import { Plus, Edit, Trash2, MapPin, Phone, Mail, Star, CheckCircle, XCircle } from 'lucide-react';
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
// import Modal from '../../components/ui/modal';
// import Spinner from '../../components/ui/spinner';
// import Switch from '../../components/ui/switch';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
// // Import useAuth hook or similar to get shop_id
// // import { useAuth } from '../../hooks/useAuth';

// const BranchesPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [showDeleteModal, setShowDeleteModal] = useState<Branch | null>(null);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [apiSuccess, setApiSuccess] = useState<string | null>(null);
//     const [activeToggles, setActiveToggles] = useState<Record<number, boolean>>({});
//     // const { shopId } = useAuth(); // Get shopId from auth context/hook

//     // --- Data Fetching (Assumes fetching branches for the logged-in user's shop) ---
//     const { data: branchesResponse, isLoading, error, refetch } = useGetQuery<{ data: Branch[] }>({
//         queryKey: ['branches'],
//         url: 'branches', // Endpoint likely filters by authenticated user's shop on backend
//         // enabled: !!shopId, // Enable only if shopId is available
//     });
//     const branches = branchesResponse?.data || [];

//     // --- Mutations ---
//     const { mutateAsync: deleteBranch, isLoading: isDeleting } = useMutationAction({ method: 'DELETE' });
//     const { mutateAsync: updateBranchStatus, isLoading: isUpdatingStatus } = useMutationAction({ method: 'PATCH' });

//     // --- Handlers ---
//     const handleAdd = () => navigate('/branches/new');
//     const handleEdit = (id: number) => navigate(`/branches/${id}/edit`);
//     const openDeleteConfirm = (branch: Branch) => setShowDeleteModal(branch)
//     const closeDeleteConfirm = () => setShowDeleteModal(null);

//     const confirmDelete = async () => { /* ... (same as delete logic in Taxes/Coupons pages) ... */ };
//     const handleStatusToggle = async (branch: Branch, newStatus: boolean) => { /* ... (same as status toggle logic) ... */ };


//     // --- Table Columns ---
//     const columns = useMemo((): ColumnDefinition<Branch>[] => [
//         {
//             key: 'name', header: 'اسم الفرع', cellClassName: 'font-medium text-gray-800',
//             render: (b) => (
//                 <div className="flex items-center">
//                     {b.name}
//                     {b.is_primary && <Star size={14} className="mr-2 text-yellow-500 fill-yellow-400" title="الفرع الرئيسي" />}
//                 </div>
//             )
//         },
//         { key: 'city', header: 'المدينة', render: (b) => b.city || '-' },
//         { key: 'phone', header: 'الهاتف', render: (b) => b.phone ? <a href={`tel:${b.phone}`} className="text-primary hover:underline" dir="ltr">{b.phone}</a> : '-' },
//         { key: 'email', header: 'البريد', render: (b) => b.email ? <a href={`mailto:${b.email}`} className="text-primary hover:underline">{b.email}</a> : '-' },
//         {
//             key: 'is_active', header: 'الحالة', cellClassName: 'w-[100px]',
//             render: (b) => (
//                 <div className="flex items-center justify-center">
//                     {activeToggles[b.id] ? (<Spinner size="sm"/>) : (
//                        <Switch label="" checked={b.is_active} onChange={(e) => handleStatusToggle(b, e.target.checked)}/>
//                     )}
//                 </div>
//             )
//         },
//         {
//             key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
//             render: (b) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(b.id)} title="تعديل"> <Edit size={16} /> </Button>
//                     {/* Prevent deleting primary branch maybe? Add logic here or backend */}
//                     <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(b)} title="حذف" disabled={b.is_primary}> <Trash2 size={16} /> </Button>
//                 </div>
//             )
//         },
//     ], [activeToggles]); // Include dependency


//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "المواقع" }, { label: "الفروع" }, ];
//     const toolbarActions = (<Button onClick={handleAdd} icon={Plus}>إضافة فرع</Button>);

//     return (
//         <div className="space-y-4">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {apiError && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} className="mb-4"/>}
//             {apiSuccess && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} className="mb-4"/>}

//             <DataTable<Branch>
//                 columns={columns}
//                 data={branches}
//                 isLoading={isLoading}
//                 error={error ? (error as any).message || "فشل تحميل الفروع" : null}
//                 emptyStateMessage="لم يتم إضافة أي فروع بعد."
//                 rowKey="id"
//             />

//             <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف الفرع" size="sm"
//                 footer={<>
//                     <Button variant="secondary" onClick={closeDeleteConfirm} disabled={isDeleting}>إلغاء</Button>
//                     <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting} disabled={isDeleting}>نعم، حذف</Button>
//                 </>}
//             >
//                  <p className="text-sm text-gray-600"> هل أنت متأكد من حذف الفرع "<strong>{showDeleteModal?.name}</strong>"؟ </p>
//             </Modal>
//         </div>
//     );
// };

// export default BranchesPage;