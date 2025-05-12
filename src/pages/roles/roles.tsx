// // src/pages/hr/RolesPage.tsx
// import React, { useState, useMemo } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import type { Role } from '../../types/role'; // Adjust

// import { Plus, Edit, Trash2, ShieldCheck, KeyRound, Users } from 'lucide-react';
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
// import Modal from '../../components/ui/modal';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';

// // --- Dummy Data ---
// const dummyRoles: Role[] = [
//     { id: 1, name: "مدير المطعم", description: "صلاحيات كاملة على النظام", permissions: [], is_system_role: true, created_at: "2024-01-01" },
//     { id: 2, name: "كاشير", description: "صلاحيات إدارة الطلبات ونقاط البيع", permissions: [], is_system_role: false, created_at: "2024-01-10" },
//     { id: 3, name: "شيف / المطبخ", description: "عرض الطلبات وتحديث حالة التحضير", permissions: [], is_system_role: false, created_at: "2024-01-15" },
//     { id: 4, name: "عامل توصيل", description: "عرض وتحديث حالة طلبات التوصيل المعينة", permissions: [], is_system_role: false, created_at: "2024-02-01" },
// ];
// // --- End Dummy Data ---

// const RolesPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [showDeleteModal, setShowDeleteModal] = useState<Role | null>(null);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [apiSuccess, setApiSuccess] = useState<string | null>(null);

//     // --- Data Fetching (Using Dummy Data for now) ---
//     const { data: rolesResponse, isLoading, error, refetch } = useGetQuery<Role[]>({
//         key: ['roles'],
//         url: 'roles',
//     });
//     const roles = rolesResponse || [];

//     // --- Mutations (Placeholders) ---
//     const { mutateAsync: deleteRole, isPending: isDeleting } = useMutationAction({ method: 'delete', url: '' });

//     // --- Handlers ---
//     const handleAdd = () => navigate('/roles/new'); // Navigate to add/edit page
//     const handleEdit = (id: number) => navigate(`/roles/${id}/edit`); // Navigate to add/edit page
//     const openDeleteConfirm = (role: Role) => setShowDeleteModal(role);
//     const closeDeleteConfirm = () => setShowDeleteModal(null);

//     const confirmDelete = async () => {
//         if (!showDeleteModal || showDeleteModal.is_system_role) return; // Prevent deleting system role
//         setApiError(null); setApiSuccess(null);
//         console.log(`TODO: Call delete mutation for role ${showDeleteModal.id}`);
//         // try {
//         //     await deleteRole({}, { url: `roles/${showDeleteModal.id}`, onSuccess: () => { /*...*/ }, onError: (err: any) => { /*...*/ } });
//         // } catch (e: any) { setApiError(e.message || "خطأ غير متوقع."); }
//         alert(`Simulating delete for ${showDeleteModal.name}`); // Placeholder action
//         closeDeleteConfirm();
//         refetch(); // Simulate refetch
//     };

//     // --- Table Columns ---
//     const columns = useMemo((): ColumnDefinition<Role>[] => [
//         {
//             key: 'name', header: 'اسم الدور', cellClassName: 'font-medium text-gray-800',
//             render: (r) => (
//                 <div className='flex items-center gap-2'>
//                     {r.is_system_role && <KeyRound size={14} className="text-amber-600" title="دور نظام أساسي" />}
//                     <span>{r.name}</span>
//                 </div>
//             )
//         },
//         { key: 'description', header: 'الوصف', cellClassName: 'text-gray-600 text-sm max-w-sm truncate', render: r => r.description || '-' },
//         { key: 'permissions_count', header: 'عدد الصلاحيات', cellClassName: 'text-center', render: r => r.permissions?.length ?? 0 }, // Display permission count
//         {
//             key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
//             render: (r) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(r.id)} title="تعديل"> <Edit size={16} /> </Button>
//                     {/* Disable delete for system roles */}
//                     <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(r)} title="حذف" disabled={r.is_system_role}> <Trash2 size={16} /> </Button>
//                 </div>
//             )
//         },
//     ], []);

//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "الموظفين" }, { label: "الأدوار والصلاحيات" }, ];
//     const toolbarActions = (<Button onClick={handleAdd} icon={Plus}>إضافة دور جديد</Button>);

//     return (
//         <div className="space-y-4">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {/* ... Alerts ... */}

//             <DataTable<Role>
//                 columns={columns}
//                 data={roles}
//                 isLoading={isLoading}
//                 error={error ? (error as any).message : null}
//                 emptyStateMessage="لم يتم تعريف أي أدوار بعد."
//                 rowKey="id"
//             />

//             {/* ... Delete Modal ... */}
//              <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف الدور" size="sm"
//                 footer={<>
//                     <Button variant="secondary" onClick={closeDeleteConfirm} disabled={isDeleting}>إلغاء</Button>
//                     <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting} disabled={isDeleting}>نعم، حذف</Button>
//                 </>}
//             >
//                  <p className="text-sm text-gray-600"> هل أنت متأكد من حذف الدور "<strong>{showDeleteModal?.name}</strong>"؟ سيؤثر هذا على الموظفين المرتبطين به. </p>
//                  {apiError && showDeleteModal && <Alert variant="error" message={apiError} className="mt-3"/>}
//              </Modal>
//         </div>
//     );
// };

// export default RolesPage;