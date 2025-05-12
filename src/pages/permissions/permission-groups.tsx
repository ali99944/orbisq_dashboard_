// // src/pages/hr/PermissionGroupsPage.tsx
// import React, { useState, useMemo, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// import { Plus, Edit, Trash2, LayerGrid, Settings, Users, Save } from 'lucide-react'; // Use LayerGrid for groups
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
// import Input from '../../components/ui/input';
// import Modal from '../../components/ui/modal';
// import TextArea from '../../components/ui/textarea';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
// import { PermissionGroupManaged, PermissionGroupFormData, initialPermissionGroupFormData } from '../../types/permission';


// // --- Dummy Data ---
// const dummyPermissionGroups: PermissionGroupManaged[] = [
//     { id: 1, name: "Dashboard", description: "الوصول للوحة التحكم الرئيسية" },
//     { id: 2, name: "Orders", description: "إدارة الطلبات وتحديث حالتها" },
//     { id: 3, name: "Products", description: "إدارة المنتجات والتصنيفات" },
//     { id: 4, name: "Tables", description: "إدارة الطاولات ورموز QR" },
//     { id: 5, name: "Marketing", description: "إدارة الكوبونات والخصومات" },
//     { id: 6, name: "HR", description: "إدارة الموظفين والأدوار (لهذا القسم)" },
//     { id: 7, name: "Settings", description: "إدارة إعدادات المطعم العامة" },
// ];
// // --- End Dummy Data ---


// const PermissionGroupsPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [showFormModal, setShowFormModal] = useState<boolean>(false);
//     const [editingGroup, setEditingGroup] = useState<PermissionGroupManaged | null>(null);
//     const [formData, setFormData] = useState<PermissionGroupFormData>(initialPermissionGroupFormData);
//     const [showDeleteModal, setShowDeleteModal] = useState<PermissionGroupManaged | null>(null);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [apiSuccess, setApiSuccess] = useState<string | null>(null);

//     // --- Data Fetching ---
//     const { data: groupsResponse, isLoading, error, refetch } = useGetQuery<{ data: PermissionGroupManaged[] }>({
//         queryKey: ['permissionGroups'],
//         url: 'permission-groups', // Your API endpoint
//         options: { // Dummy data for now
//              initialData: { data: dummyPermissionGroups, total: 0, page: 0, limit: 0, qr_code_image: null },
//              enabled: false
//          }
//     });
//     const groups = groupsResponse?.data || [];

//     // --- Mutations ---
//     const { mutateAsync: saveGroup, isLoading: isSaving } = useMutationAction<PermissionGroupManaged, Partial<PermissionGroupFormData>>({
//         method: editingGroup ? 'PUT' : 'POST',
//         url: editingGroup ? `permission-groups/${editingGroup.id}` : 'permission-groups',
//         key: ['permissionGroups'],
//     });
//     const { mutateAsync: deleteGroup, isLoading: isDeleting } = useMutationAction({ method: 'DELETE' });

//     // --- Effects & Handlers (similar to RolesPage) ---
//      useEffect(() => {
//         if (editingGroup) {
//             setFormData({ name: editingGroup.name, description: editingGroup.description || '' });
//             setShowFormModal(true);
//         } else {
//             setFormData(initialPermissionGroupFormData);
//         }
//     }, [editingGroup]);

//     useEffect(() => { /* ... clear errors on modal close ... */ }, [showFormModal, showDeleteModal]);

//     const handleOpenAddModal = () => { /* ... set states to add ... */ };
//     const handleOpenEditModal = (group: PermissionGroupManaged) => { /* ... set states to edit ... */ };
//     const handleCloseFormModal = () => { /* ... close form modal ... */ };
//     const openDeleteConfirm = (group: PermissionGroupManaged) => setShowDeleteModal(group);
//     const closeDeleteConfirm = () => setShowDeleteModal(null);
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { /* ... update formData ... */ };

//     const handleFormSubmit = async (e: React.FormEvent) => {
//          e.preventDefault();
//          setApiError(null); setApiSuccess(null);
//          if (!formData.name.trim()) { setApiError("اسم المجموعة مطلوب."); return; }

//         try {
//             await saveGroup(formData, { // Send form data
//                  url: editingGroup ? `permission-groups/${editingGroup.id}` : 'permission-groups',
//                 onSuccess: (response) => {
//                     const successMsg = editingGroup ? 'تم تحديث المجموعة' : 'تمت إضافة المجموعة';
//                     setApiSuccess(`${successMsg} "${response.data.name}".`);
//                     refetch();
//                     setTimeout(() => { handleCloseFormModal(); setApiSuccess(null); }, 1500);
//                 },
//                  onError: (err: any) => setApiError(err.message || (editingGroup ? "فشل تحديث المجموعة." : "فشل إضافة المجموعة.")),
//             });
//         } catch (error) { setApiError("حدث خطأ غير متوقع."); }
//      };

//     const confirmDelete = async () => {
//          if (!showDeleteModal) return;
//          // ... delete logic calling deleteGroup ...
//          console.log(`TODO: Delete group ${showDeleteModal.id}`);
//          alert(`Simulating delete for ${showDeleteModal.name}`);
//          closeDeleteConfirm();
//          refetch();
//      };


//     // --- Table Columns ---
//     const columns = useMemo((): ColumnDefinition<PermissionGroupManaged>[] => [
//         { key: 'name', header: 'اسم المجموعة', cellClassName: 'font-medium text-gray-800' },
//         { key: 'description', header: 'الوصف', cellClassName: 'text-gray-600 text-sm max-w-md truncate', render: g => g.description || '-' },
//         // { key: 'permissions_count', header: 'عدد الصلاحيات', cellClassName: 'text-center', render: (g) => g.permissions_count ?? '-' }, // If count is available
//         {
//             key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
//             render: (g) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenEditModal(g)} title="تعديل"> <Edit size={16} /> </Button>
//                     {/* Consider preventing deletion if group is in use */}
//                     <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(g)} title="حذف"> <Trash2 size={16} /> </Button>
//                 </div>
//             )
//         },
//     ], []);

//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "الموظفين" }, { label: "مجموعات الصلاحيات" }, ];
//     const toolbarActions = (<Button onClick={handleOpenAddModal} icon={Plus}>إضافة مجموعة</Button>);

//     return (
//         <div className="space-y-4">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {/* ... Alerts ... */}
//             {apiError && !showFormModal && !showDeleteModal && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} />}
//             {apiSuccess && !showFormModal && !showDeleteModal && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} />}

//             <DataTable<PermissionGroupManaged>
//                 columns={columns}
//                 data={groups}
//                 isLoading={isLoading}
//                 error={error ? (error as any).message || "فشل تحميل المجموعات" : null}
//                 emptyStateMessage="لم يتم تعريف أي مجموعات صلاحيات بعد."
//                 rowKey="id"
//             />

//             {/* Add/Edit Modal */}
//              <Modal isOpen={showFormModal} onClose={handleCloseFormModal} title={editingGroup ? `تعديل مجموعة` : "إضافة مجموعة صلاحيات"} size="md"
//                  footer={<>
//                      <Button variant="secondary" onClick={handleCloseFormModal} disabled={isSaving}>إلغاء</Button>
//                      <Button type="submit" form="group-form" variant="primary" isLoading={isSaving} disabled={isSaving} icon={Save}> {editingGroup ? "حفظ التعديلات" : "إضافة"} </Button>
//                  </>}
//             >
//                 <form id="group-form" onSubmit={handleFormSubmit} className="space-y-4">
//                     {apiError && <Alert variant="error" message={apiError} className="mb-4"/>}
//                     <Input label="اسم المجموعة *" name="name" value={formData.name} onChange={handleChange} required placeholder="مثال: إدارة الطلبات، إعدادات الحساب" disabled={isSaving} />
//                     <TextArea label="الوصف (اختياري)" name="description" value={formData.description || ''} onChange={handleChange} rows={3} placeholder="وصف موجز للغرض من هذه المجموعة..." disabled={isSaving}/>
//                     <button type="submit" className="hidden"/>
//                 </form>
//              </Modal>

//             {/* Delete Modal */}
//              <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف المجموعة" size="sm" /* ... footer ... */ >
//                   <p className="text-sm text-gray-600"> هل أنت متأكد من حذف المجموعة "<strong>{showDeleteModal?.name}</strong>"؟ قد يؤثر هذا على تنظيم الصلاحيات. </p>
//                   {apiError && showDeleteModal && <Alert variant="error" message={apiError} className="mt-3"/>}
//              </Modal>
//         </div>
//     );
// };

// export default PermissionGroupsPage;