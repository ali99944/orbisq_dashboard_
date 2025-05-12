// // src/pages/hr/EmployeesPage.tsx
// import React, { useState, useMemo } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import type { Employee } from '../../types/employee';
// import { Plus, Edit, Trash2, Eye, User, KeyRound, UserCircle } from 'lucide-react'; // User icon
// import Button from '../../components/ui/button';
// import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
// import Modal from '../../components/ui/modal';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
// import { getImageLink } from '../../lib/storage';
// import Switch from '../../components/ui/switch';

// // --- Dummy Data ---
// const dummyEmployees: Employee[] = [
//     { id: 1, first_name: "أحمد", last_name: "علي", email: "ahmed@restaurant.com", phone_number: "050111222", job_title: "مدير فرع", role: { id: 1, name: "مدير المطعم", permissions: [] }, is_active: true, avatar: null },
//     { id: 2, first_name: "فاطمة", last_name: "محمد", email: "fatima@restaurant.com", phone_number: "050333444", job_title: "كاشير", role: { id: 2, name: "كاشير", permissions: [] }, is_active: true, avatar: null },
//     { id: 3, first_name: "خالد", last_name: "حسن", email: "khaled@restaurant.com", phone_number: "050555666", job_title: "شيف", role: { id: 3, name: "شيف / المطبخ", permissions: [] }, is_active: true, avatar: null },
//     { id: 4, first_name: "سارة", last_name: "عبدالله", email: "sara@restaurant.com", phone_number: "050777888", job_title: "عامل توصيل", role: { id: 4, name: "عامل توصيل", permissions: [] }, is_active: false, avatar: null }, // Inactive example
// ];
// // --- End Dummy Data ---


// const EmployeesPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [showDeleteModal, setShowDeleteModal] = useState<Employee | null>(null);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [apiSuccess, setApiSuccess] = useState<string | null>(null);
//     const [activeToggles, setActiveToggles] = useState<Record<number, boolean>>({});

//     // --- Data Fetching (Dummy) ---
//     const { data: employeesResponse, isLoading, error, refetch } = useGetQuery<{ data: Employee[] }>({
//         queryKey: ['employees'],
//         url: 'employees?include=role', // Include role info
//         options: {
//             initialData: { data: dummyEmployees, total: 0, page: 0, limit: 0, qr_code_image: null },
//             enabled: false
//         }
//     });
//     const employees = employeesResponse?.data || [];

//     // --- Mutations ---
//     const { mutateAsync: deleteEmployee, isLoading: isDeleting } = useMutationAction({ method: 'DELETE' });
//     const { mutateAsync: updateEmployeeStatus, isLoading: isUpdatingStatus } = useMutationAction({ method: 'PATCH' });

//     // --- Handlers ---
//     const handleAdd = () => navigate('/employees/new');
//     const handleView = (id: number) => navigate(`/employees/${id}/details`); // Navigate to details
//     const handleEdit = (id: number) => navigate(`/employees/${id}/edit`);    // Navigate to edit
//     const openDeleteConfirm = (emp: Employee) => setShowDeleteModal(emp);
//     const closeDeleteConfirm = () => setShowDeleteModal(null);

//     // const confirmDelete = async () => { /* ... delete logic ... */ };
//     // const handleStatusToggle = async (emp: Employee, newStatus: boolean) => { /* ... status toggle logic ... */ };

//     // --- Table Columns ---
//     const columns = useMemo((): ColumnDefinition<Employee>[] => [
//         {
//             key: 'name', header: 'اسم الموظف', cellClassName: 'font-medium text-gray-800',
//             render: (emp) => (
//                 <div className="flex items-center gap-2">
//                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400 border">
//                          {emp.avatar ? <img src={getImageLink(emp.avatar)} alt="Avatar" className="w-full h-full object-cover"/> : <UserCircle size={20}/>}
//                      </div>
//                      <span>{emp.first_name} {emp.last_name}</span>
//                 </div>
//             )
//         },
//         { key: 'email', header: 'البريد الإلكتروني', render: emp => emp.email },
//         { key: 'phone_number', header: 'الهاتف', render: emp => emp.phone_number || '-' },
//         { key: 'job_title', header: 'المسمى الوظيفي', render: emp => emp.job_title || '-' },
//         { key: 'role', header: 'الدور', render: emp => emp.role?.name || <span className="text-xs italic text-gray-400">لم يحدد</span> },
//         {
//             key: 'is_active', header: 'الحالة', cellClassName: 'w-[100px]',
//             render: (emp) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Switch checked={emp.is_active} onChange={() => { } } disabled={isUpdatingStatus} label={''} />
//                 </div>
//             )
//         },
//         {
//             key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[130px]',
//             render: (emp) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Button variant="ghost" size="sm" className="p-1 text-gray-600 hover:bg-gray-100" onClick={() => handleView(emp.id)} title="عرض التفاصيل"> <Eye size={16} /> </Button>
//                     <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(emp.id)} title="تعديل"> <Edit size={16} /> </Button>
//                     <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(emp)} title="حذف"> <Trash2 size={16} /> </Button>
//                 </div>
//             )
//         },
//     ], [activeToggles]); // Dependency

//     // --- Toolbar ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "الموظفين" }, { label: "قائمة الموظفين" }, ];
//     const toolbarActions = (<Button onClick={handleAdd} icon={Plus}>إضافة موظف</Button>);

//     return (
//         <div className="space-y-4">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {/* ... Alerts ... */}

//             <DataTable<Employee>
//                 columns={columns}
//                 data={employees}
//                 isLoading={isLoading}
//                 error={error ? (error as any).message : null}
//                 emptyStateMessage="لم يتم إضافة أي موظفين بعد."
//                 rowKey="id"
//             />

//             {/* ... Delete Modal ... */}
//              <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف الموظف" size="sm" /* ... footer ... */ >
//                  <p className="text-sm text-gray-600"> هل أنت متأكد من حذف الموظف "<strong>{showDeleteModal?.first_name} {showDeleteModal?.last_name}</strong>"؟ </p>
//              </Modal>
//         </div>
//     );
// };

// export default EmployeesPage;