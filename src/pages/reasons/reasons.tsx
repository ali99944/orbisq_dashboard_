// // src/pages/settings/ReasonsPage.tsx
// import React, { useState, useMemo, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import type { Reason, ReasonFormData } from '../../types/reason'; // Adjust
// import { initialReasonFormData } from '../../types/reason';
// // import Select from '../../components/ui/Select'; // Import if linking
// import { Plus, Edit, Trash2, MessageSquareWarning, Settings, Save } from 'lucide-react'; // Reason icon
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
// import Input from '../../components/ui/input';
// import Modal from '../../components/ui/modal';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';

// const ReasonsPage: React.FC = () => {
//     const navigate = useNavigate(); // Not used directly for edit here
//     const [showFormModal, setShowFormModal] = useState<boolean>(false);
//     const [editingReason, setEditingReason] = useState<Reason | null>(null);
//     const [formData, setFormData] = useState<ReasonFormData>(initialReasonFormData);
//     const [showDeleteModal, setShowDeleteModal] = useState<Reason | null>(null);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [apiSuccess, setApiSuccess] = useState<string | null>(null);

//     // --- Data Fetching ---
//     const { data: reasonsResponse, isLoading, error, refetch } = useGetQuery<{ data: Reason[] }>({
//         queryKey: ['reasons'],
//         url: 'reasons', // Your API endpoint for reasons
//         // url: 'reasons?include=category' // If linking and eager loading
//     });
//     const reasons = reasonsResponse?.data || [];

//     // --- Fetch Categories for Select (if linking) ---
//     // const { data: categoriesData } = useGetQuery<{ data: ReasonCategory[] }>({ queryKey: ['reasonCategories'], url: 'reason-categories?is_active=1'});
//     // const categoryOptions: SelectOption[] = useMemo(() => categoriesData?.data.map(c => ({ value: c.id, label: c.name })) || [], [categoriesData]);


//     // --- Mutations ---
//     const { mutateAsync: saveReason, isLoading: isSaving } = useMutationAction<Reason, Partial<ReasonFormData>>({
//         method: editingReason ? 'PUT' : 'POST',
//         url: editingReason ? `reasons/${editingReason.id}` : 'reasons',
//         key: ['reasons'],
//     });
//     const { mutateAsync: deleteReason, isLoading: isDeleting } = useMutationAction({ method: 'DELETE' });

//     // --- Effects ---
//     useEffect(() => {
//         if (editingReason) {
//             setFormData({
//                 name: editingReason.name,
//                 // reason_category_id: editingReason.reason_category_id ? String(editingReason.reason_category_id) : null, // If linking
//             });
//             setShowFormModal(true);
//         } else {
//             setFormData(initialReasonFormData);
//         }
//     }, [editingReason]);

//      useEffect(() => { // Clear messages on modal close
//          if (!showFormModal && !showDeleteModal) {
//             setApiError(null); setApiSuccess(null);
//          }
//      }, [showFormModal, showDeleteModal]);

//     // --- Handlers ---
//     const handleOpenAddModal = () => { setEditingReason(null); setFormData(initialReasonFormData); setShowFormModal(true); setApiError(null); setApiSuccess(null); };
//     const handleOpenEditModal = (reason: Reason) => { setEditingReason(reason); setApiError(null); setApiSuccess(null); };
//     const handleCloseFormModal = () => { setShowFormModal(false); setEditingReason(null); };
//     const openDeleteConfirm = (reason: Reason) => setShowDeleteModal(reason);
//     const closeDeleteConfirm = () => setShowDeleteModal(null);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { // Added Select
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//         if(apiError) setApiError(null);
//         if(apiSuccess) setApiSuccess(null);
//     };

//     const handleFormSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setApiError(null); setApiSuccess(null);
//         if (!formData.name.trim()) { setApiError("اسم السبب مطلوب."); return; }

//          const payload: Partial<ReasonFormData> = {
//             ...formData,
//             // reason_category_id: formData.reason_category_id ? parseInt(formData.reason_category_id, 10) : null, // If linking
//          };

//         try {
//             await saveReason(payload, {
//                 url: editingReason ? `reasons/${editingReason.id}` : 'reasons',
//                 onSuccess: (response) => {
//                     const successMsg = editingReason ? 'تم تحديث السبب' : 'تمت إضافة السبب';
//                     setApiSuccess(`${successMsg} "${response.data.name}".`);
//                     refetch();
//                     setTimeout(() => { handleCloseFormModal(); setApiSuccess(null); }, 1500);
//                 },
//                 onError: (err: any) => setApiError(err.message || (editingReason ? "فشل تحديث السبب." : "فشل إضافة السبب.")),
//             });
//         } catch (error) { setApiError("حدث خطأ غير متوقع."); }
//     };

//     const confirmDelete = async () => {
//         if (!showDeleteModal) return;
//         setApiError(null); setApiSuccess(null);
//         try {
//             await deleteReason({}, {
//                 url: `reasons/${showDeleteModal.id}`,
//                 onSuccess: () => {
//                     setApiSuccess(`تم حذف السبب "${showDeleteModal.name}".`);
//                     refetch();
//                     closeDeleteConfirm();
//                     setTimeout(() => setApiSuccess(null), 3000);
//                 },
//                  onError: (err: any) => { setApiError(err.message || "فشل حذف السبب."); },
//             });
//         } catch (e: any) { setApiError(e.message || "خطأ غير متوقع."); }
//      };

//     // --- Table Columns ---
//     const columns = useMemo((): ColumnDefinition<Reason>[] => [
//         { key: 'name', header: 'نص السبب', cellClassName: 'font-medium text-gray-800' },
//         // { key: 'category', header: 'التصنيف', render: (r) => r.reason_category?.name || '-' }, // Uncomment if linking
//         {
//             key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
//             render: (r) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenEditModal(r)} title="تعديل"> <Edit size={16} /> </Button>
//                     <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(r)} title="حذف"> <Trash2 size={16} /> </Button>
//                 </div>
//             )
//         },
//     ], []);

//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "الإعدادات" }, { label: "الأسباب المعرفة مسبقًا" }, ];
//     const toolbarActions = (<Button onClick={handleOpenAddModal} icon={Plus}>إضافة سبب</Button>);

//     return (
//         <div className="space-y-4">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             <p className="text-sm text-gray-500 -mt-2">
//                 هذه الأسباب ستظهر للموظفين عند القيام بإجراءات معينة مثل رفض طلب أو إرجاعه لتحديد سبب الإجراء.
//             </p>
//              {apiError && !showFormModal && !showDeleteModal && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} />}
//              {apiSuccess && !showFormModal && !showDeleteModal && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} />}

//             <DataTable<Reason>
//                 columns={columns}
//                 data={reasons}
//                 isLoading={isLoading}
//                 error={error ? (error as any).message || "فشل تحميل الأسباب" : null}
//                 emptyStateMessage="لم يتم إضافة أي أسباب بعد."
//                 rowKey="id"
//             />

//             {/* Add/Edit Modal */}
//             <Modal isOpen={showFormModal} onClose={handleCloseFormModal} title={editingReason ? `تعديل السبب` : "إضافة سبب جديد"} size="md"
//                  footer={<>
//                      <Button variant="secondary" onClick={handleCloseFormModal} disabled={isSaving}>إلغاء</Button>
//                      <Button type="submit" form="reason-form" variant="primary" isLoading={isSaving} disabled={isSaving} icon={Save}> {editingReason ? "حفظ التعديلات" : "إضافة"} </Button>
//                  </>}
//             >
//                 <form id="reason-form" onSubmit={handleFormSubmit} className="space-y-4">
//                     {apiError && <Alert variant="error" message={apiError} className="mb-4"/>}
//                     <Input label="نص السبب *" name="name" value={formData.name} onChange={handleChange} required placeholder="مثال: المكونات غير متوفرة، خطأ في التحضير، طلب العميل" disabled={isSaving} />
//                      {/* Uncomment if linking categories
//                      <Select
//                          label="التصنيف (اختياري)"
//                          name="reason_category_id"
//                          value={formData.reason_category_id || ''}
//                          onChange={handleChange}
//                          options={[{value: '', label: '-- بدون تصنيف --'}, ...categoryOptions]}
//                          placeholder="-- اختر تصنيف --"
//                          disabled={isSaving}
//                       />
//                       */}
//                     <button type="submit" className="hidden"/>
//                 </form>
//              </Modal>

//              {/* Delete Modal */}
//              <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف السبب" size="sm"
//                  footer={<> /* ... delete modal footer ... */ </>} >
//                   <p className="text-sm text-gray-600"> هل أنت متأكد من حذف السبب "<strong>{showDeleteModal?.name}</strong>"؟ </p>
//                  {apiError && showDeleteModal && <Alert variant="error" message={apiError} className="mt-3"/>}
//              </Modal>
//         </div>
//     );
// };

// export default ReasonsPage;