// // src/pages/hr/PermissionsPage.tsx
// import React, { useState, useMemo, useEffect, ChangeEvent, FormEvent } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import type { Permission, PermissionFormData, PermissionGroup } from '../../types/permission'; // Adjust

// import { Plus, Edit, Trash2, ShieldCheck, Save, Tag, Layers } from 'lucide-react'; // Updated Icons
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
// import Input from '../../components/ui/input';
// import Modal from '../../components/ui/modal';
// import Select, { SelectOption } from '../../components/ui/select';
// import TextArea from '../../components/ui/textarea';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';

// const dummyPermissionGroups: PermissionGroup[] = [];

// const initialPermissionFormData = {
//     name: '',
//     description: '',
//     permission_group_id: null
// }

// const PermissionsPage: React.FC = () => {
//     const navigate = useNavigate(); // Keep for navigation if needed elsewhere
//     const [showFormModal, setShowFormModal] = useState<boolean>(false);
//     const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
//     const [formData, setFormData] = useState<PermissionFormData>(initialPermissionFormData);
//     const [showDeleteModal, setShowDeleteModal] = useState<Permission | null>(null);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [apiSuccess, setApiSuccess] = useState<string | null>(null);

//     // --- Data Fetching ---
//     // Permissions (Dummy)
//     const { data: permissionsResponse, isLoading, error, refetch } = useGetQuery<Permission[]>({
//         key: ['permissions'], url: 'permissions?include=permissionGroup'
//     });
//     const allPermissions = permissionsResponse || [];

//     // Permission Groups for Select (Dummy)
//     const { data: groupsResponse, isLoading: isLoadingGroups } = useGetQuery<{ data: PermissionGroup[] }>({
//         key: ['permissionGroupsList'], url: 'permission-groups', // Endpoint for groups list
//         options: { initialData: { data: dummyPermissionGroups }, enabled: false }
//     });
//     const groupOptions: SelectOption[] = useMemo(() =>
//         groupsResponse?.data.map(g => ({ value: g.id, label: g.name })) || [],
//         [groupsResponse]
//     );

//     // --- Mutations ---
//     const { mutateAsync: savePermission, isPending: isSaving } = useMutationAction<Permission, Partial<PermissionFormData>>({
//         method: editingPermission ? 'put' : 'post',
//         key: ['permissions'],
//         url: `permissions${editingPermission ? `/${editingPermission.id}` : ''}`,
//     });
//     const { mutateAsync: deletePermission, isPending: isDeleting } = useMutationAction({
//         method: 'delete', 
//         key: ['permissions'],
//         url: `permissions/${showDeleteModal?.id}`,
//     });

//     // --- Effects ---
//     useEffect(() => { // Populate Form for Edit
//         if (editingPermission) {
//             setFormData({
//                 name: editingPermission.name,
//                 description: editingPermission.description || '',
//                 permission_group_id: editingPermission.permission_group_id ? String(editingPermission.permission_group_id) : null,
//             });
//             setShowFormModal(true);
//         } else {
//             setFormData(initialPermissionFormData);
//         }
//     }, [editingPermission]);

//     useEffect(() => { /* Clear messages on modal close */ }, [showFormModal, showDeleteModal]);

//     // --- Handlers ---
//     const handleOpenAddModal = () => { setEditingPermission(null); setFormData(initialPermissionFormData); setShowFormModal(true); setApiError(null); setApiSuccess(null); };
//     const handleOpenEditModal = (permission: Permission) => { setEditingPermission(permission); setApiError(null); setApiSuccess(null); }; // useEffect opens modal
//     const handleCloseFormModal = () => { setShowFormModal(false); setEditingPermission(null); };
//     const openDeleteConfirm = (permission: Permission) => setShowDeleteModal(permission);
//     const closeDeleteConfirm = () => setShowDeleteModal(null);

//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         let processedValue = value;
//         // Enforce permission name format (lowercase, dots, underscores)
//         if (name === 'name') {
//             processedValue = value.toLowerCase().replace(/[^a-z0-9._-]+/g, '');
//         }
//         setFormData(prev => ({ ...prev, [name]: processedValue }));
//         if(apiError) setApiError(null);
//         if(apiSuccess) setApiSuccess(null);
//     };

//     const handleFormSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setApiError(null); setApiSuccess(null);

//         if (!formData.name.trim() || !formData.permission_group_id) {
//             setApiError("اسم الصلاحية ومجموعة الصلاحيات حقول مطلوبة."); return;
//         }
//         // Add regex validation check?
//         if (!/^[a-z0-9._-]+$/.test(formData.name)) {
//             setApiError("تنسيق اسم الصلاحية غير صحيح (استخدم حروف إنجليزية صغيرة، أرقام، نقطة، شرطة سفلية أو علوية)."); return;
//         }


//         const payload: Partial<PermissionFormData> = {
//             ...formData,
//             permission_group_id: formData.permission_group_id ? parseInt(formData.permission_group_id, 10) : null,
//         };

//         try {
//             await savePermission(payload, {
//                 url: editingPermission ? `permissions/${editingPermission.id}` : 'permissions', // Dynamic URL
//                 onSuccess: (response) => {
//                     const successMsg = editingPermission ? 'تم تحديث الصلاحية' : 'تمت إضافة الصلاحية';
//                     setApiSuccess(`${successMsg} "${response.data.name}".`);
//                     refetch();
//                     setTimeout(() => { handleCloseFormModal(); setApiSuccess(null); }, 1500);
//                 },
//                  onError: (err: any) => setApiError(err.message || (editingPermission ? "فشل تحديث الصلاحية." : "فشل إضافة الصلاحية.")),
//             });
//         } catch (error) { setApiError("حدث خطأ غير متوقع."); }
//     };

//     const confirmDelete = async () => {
//         if (!showDeleteModal) return;
//         setApiError(null); setApiSuccess(null);
//         try {
//             await deletePermission({}, {
//                 onSuccess: () => {
//                     setApiSuccess(`تم حذف الصلاحية "${showDeleteModal.name}".`);
//                     refetch();
//                     closeDeleteConfirm();
//                     setTimeout(() => setApiSuccess(null), 3000);
//                 },
//                 onError: (err: any) => { setApiError(err.message || "فشل حذف الصلاحية. قد تكون مستخدمة في أحد الأدوار."); }
//             });
//         } catch (e: any) { setApiError(e.message || "خطأ غير متوقع."); }
//     };

//     // --- Table Columns ---
//     const columns = useMemo((): ColumnDefinition<Permission>[] => [
//         {
//             key: 'name', header: 'معرف الصلاحية (Name)', cellClassName: 'font-medium text-gray-800 font-mono text-sm ltr', dir: 'ltr', // LTR for code-like names
//             render: (p) => (
//                  <span className="flex items-center gap-1.5">
//                     <ShieldCheck size={15} className="text-primary opacity-70"/>
//                     {p.name}
//                  </span>
//              )
//         },
//         { key: 'description', header: 'الوصف', cellClassName: 'text-gray-600 text-xs', render: p => p.description || '-' },
//         { key: 'permission_group', header: 'المجموعة', render: p => p.permission_group?.name || <span className="text-gray-400 text-xs italic">بدون مجموعة</span> },
//         {
//             key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
//             render: (p) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenEditModal(p)} title="تعديل"> <Edit size={16} /> </Button>
//                     {/* Be very careful enabling delete for permissions defined in code */}
//                     {/* <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(p)} title="حذف"> <Trash2 size={16} /> </Button> */}
//                 </div>
//             )
//         },
//     ], []);

//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "الموظفين" }, { label: "الصلاحيات" }, ];
//     // Adding permissions is often a developer task, but enabled here via modal
//     const toolbarActions = (<Button onClick={handleOpenAddModal} icon={Plus}>إضافة صلاحية</Button>);

//     return (
//         <div className="space-y-4">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//              <p className="text-sm text-gray-500 -mt-2">
//                 إدارة الصلاحيات التفصيلية للنظام. يتم تجميعها في أدوار وتعيين الأدوار للموظفين.
//              </p>
//             {apiError && !showFormModal && !showDeleteModal && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} />}
//             {apiSuccess && !showFormModal && !showDeleteModal && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} />}

//             <DataTable<Permission>
//                 columns={columns}
//                 data={allPermissions}
//                 isLoading={isLoading}
//                 error={error ? (error as any).message || "فشل تحميل الصلاحيات" : null}
//                 emptyStateMessage="لم يتم تعريف أي صلاحيات بعد."
//                 rowKey="id"
//             />

//             {/* Add/Edit Modal */}
//             <Modal isOpen={showFormModal} onClose={handleCloseFormModal} title={editingPermission ? `تعديل الصلاحية` : "إضافة صلاحية جديدة"} size="lg"
//                  footer={<>
//                      <Button variant="secondary" onClick={handleCloseFormModal} disabled={isSaving}>إلغاء</Button>
//                      <Button type="submit" form="permission-form" variant="primary" isLoading={isSaving} disabled={isSaving} icon={Save}> {editingPermission ? "حفظ التعديلات" : "إضافة"} </Button>
//                  </>}
//             >
//                  <form id="permission-form" onSubmit={handleFormSubmit} className="space-y-4">
//                      {apiError && <Alert variant="error" message={apiError} className="mb-4"/>}
//                      <Input label="معرف الصلاحية (Name) *" name="name" value={formData.name} onChange={handleChange} required placeholder="orders.view أو products.delete" className="ltr font-mono" dir="ltr" disabled={isSaving}
//                          error={formData.name && !/^[a-z0-9._-]+$/.test(formData.name) ? 'التنسيق غير صحيح' : undefined}
//                      />
//                       <p className="text-xs text-gray-500 -mt-3">استخدم حروف إنجليزية صغيرة، أرقام، نقطة (.), شرطة سفلية (_), أو شرطة (-).</p>
//                      <Select label="مجموعة الصلاحيات *" name="permission_group_id" value={formData.permission_group_id || ''} onChange={handleChange} required options={[{value: '', label: '-- اختر مجموعة --'}, ...groupOptions]} placeholder="-- اختر مجموعة --" disabled={isSaving || isLoadingGroups} icon={Layers} />
//                       <TextArea label="الوصف (اختياري)" name="description" value={formData.description || ''} onChange={handleChange} rows={2} placeholder="شرح موجز لما تسمح به هذه الصلاحية..." disabled={isSaving}/>
//                      <button type="submit" className="hidden"/>
//                  </form>
//             </Modal>

//             {/* Delete Modal */}
//              <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف الصلاحية" size="sm"
//                  footer={<>/* ... */</>} >
//                   <p className="text-sm text-gray-600"> هل أنت متأكد من حذف الصلاحية "<strong>{showDeleteModal?.name}</strong>"؟ تأكد من أنها غير مستخدمة في أي دور. </p>
//                   {apiError && showDeleteModal && <Alert variant="error" message={apiError} className="mt-3"/>}
//              </Modal>
//         </div>
//     );
// };

// export default PermissionsPage;