// // src/pages/settings/ReasonCategoriesPage.tsx
// import React, { useState, useMemo, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Plus, Edit, Trash2, Tag, Settings, Save } from 'lucide-react'; // Tag icon for category
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
// import Input from '../../components/ui/input';
// import Modal from '../../components/ui/modal';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
// import { ReasonCategory, ReasonCategoryFormData, initialReasonCategoryFormData } from '../../types/reason-category';

// const ReasonCategoriesPage: React.FC = () => {
//     const navigate = useNavigate(); // Not used directly for edit here
//     const [showFormModal, setShowFormModal] = useState<boolean>(false);
//     const [editingCategory, setEditingCategory] = useState<ReasonCategory | null>(null);
//     const [formData, setFormData] = useState<ReasonCategoryFormData>(initialReasonCategoryFormData);
//     const [showDeleteModal, setShowDeleteModal] = useState<ReasonCategory | null>(null);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [apiSuccess, setApiSuccess] = useState<string | null>(null);

//     // --- Data Fetching ---
//     const { data: categoriesResponse, isLoading, error, refetch } = useGetQuery<{ data: ReasonCategory[] }>({
//         queryKey: ['reasonCategories'],
//         url: 'reason-categories', // Your API endpoint
//     });
//     const categories = categoriesResponse?.data || [];

//     // --- Mutations ---
//     const { mutateAsync: saveCategory, isLoading: isSaving } = useMutationAction<ReasonCategory, Partial<ReasonCategoryFormData>>({
//         method: editingCategory ? 'PUT' : 'POST',
//         url: editingCategory ? `reason-categories/${editingCategory.id}` : 'reason-categories',
//         key: ['reasonCategories'],
//     });
//     const { mutateAsync: deleteCategory, isLoading: isDeleting } = useMutationAction({ method: 'DELETE' });

//     // --- Effects ---
//     useEffect(() => {
//         if (editingCategory) {
//             setFormData({ name: editingCategory.name });
//             setShowFormModal(true);
//         } else {
//             setFormData(initialReasonCategoryFormData);
//         }
//     }, [editingCategory]);

//     useEffect(() => {
//         if (!showFormModal && !showDeleteModal) {
//             setApiError(null); setApiSuccess(null);
//         }
//     }, [showFormModal, showDeleteModal]);

//     // --- Handlers ---
//     const handleOpenAddModal = () => { setEditingCategory(null); setFormData(initialReasonCategoryFormData); setShowFormModal(true); setApiError(null); setApiSuccess(null); };
//     const handleOpenEditModal = (category: ReasonCategory) => { setEditingCategory(category); setApiError(null); setApiSuccess(null); }; // useEffect opens modal
//     const handleCloseFormModal = () => { setShowFormModal(false); setEditingCategory(null); };
//     const openDeleteConfirm = (category: ReasonCategory) => setShowDeleteModal(category);
//     const closeDeleteConfirm = () => setShowDeleteModal(null);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, name: e.target.value });
//         if(apiError) setApiError(null);
//         if(apiSuccess) setApiSuccess(null);
//     };

//     const handleFormSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setApiError(null); setApiSuccess(null);
//         if (!formData.name.trim()) { setApiError("اسم التصنيف مطلوب."); return; }

//         try {
//             await saveCategory(formData, {
//                 url: editingCategory ? `reason-categories/${editingCategory.id}` : 'reason-categories', // Ensure URL is dynamic
//                 onSuccess: (response) => {
//                     const successMsg = editingCategory ? 'تم تحديث التصنيف' : 'تم إضافة التصنيف';
//                     setApiSuccess(`${successMsg} "${response.data.name}".`);
//                     refetch();
//                     setTimeout(() => { handleCloseFormModal(); setApiSuccess(null); }, 1500);
//                 },
//                 onError: (err: any) => setApiError(err.message || (editingCategory ? "فشل تحديث التصنيف." : "فشل إضافة التصنيف.")),
//             });
//         } catch (error) { setApiError("حدث خطأ غير متوقع."); }
//     };

//     const confirmDelete = async () => {
//         if (!showDeleteModal) return;
//         setApiError(null); setApiSuccess(null);
//         try {
//             await deleteCategory({}, {
//                 url: `reason-categories/${showDeleteModal.id}`,
//                 onSuccess: () => {
//                     setApiSuccess(`تم حذف التصنيف "${showDeleteModal.name}".`);
//                     refetch();
//                     closeDeleteConfirm();
//                     setTimeout(() => setApiSuccess(null), 3000);
//                 },
//                  onError: (err: any) => {
//                     setApiError(err.message || "فشل حذف التصنيف. قد يكون مرتبطاً بأسباب أخرى.");
//                     // Keep delete modal open on error to show message
//                  }
//             });
//         } catch (e: any) { setApiError(e.message || "خطأ غير متوقع."); }
//      };

//     // --- Table Columns ---
//     const columns = useMemo((): ColumnDefinition<ReasonCategory>[] => [
//         { key: 'name', header: 'اسم التصنيف', cellClassName: 'font-medium text-gray-800' },
//         // { key: 'reasons_count', header: 'عدد الأسباب', cellClassName: 'text-center', render: (rc) => rc.reasons_count ?? '-' }, // Add if API returns count
//         {
//             key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
//             render: (rc) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenEditModal(rc)} title="تعديل"> <Edit size={16} /> </Button>
//                     <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(rc)} title="حذف"> <Trash2 size={16} /> </Button>
//                 </div>
//             )
//         },
//     ], []);

//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "الإعدادات" }, { label: "تصنيفات الأسباب" }, ];
//     const toolbarActions = (<Button onClick={handleOpenAddModal} icon={Plus}>إضافة تصنيف</Button>);

//     return (
//         <div className="space-y-4">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {apiError && !showFormModal && !showDeleteModal && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} />}
//             {apiSuccess && !showFormModal && !showDeleteModal && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} />}

//             <DataTable<ReasonCategory>
//                 columns={columns}
//                 data={categories}
//                 isLoading={isLoading}
//                 error={error ? (error as any).message || "فشل تحميل تصنيفات الأسباب" : null}
//                 emptyStateMessage="لم يتم إضافة أي تصنيفات للأسباب بعد."
//                 rowKey="id"
//             />

//             {/* Add/Edit Modal */}
//             <Modal isOpen={showFormModal} onClose={handleCloseFormModal} title={editingCategory ? `تعديل التصنيف` : "إضافة تصنيف أسباب جديد"} size="sm"
//                  footer={<>
//                      <Button variant="secondary" onClick={handleCloseFormModal} disabled={isSaving}>إلغاء</Button>
//                      <Button type="submit" form="category-form" variant="primary" isLoading={isSaving} disabled={isSaving} icon={Save}> {editingCategory ? "حفظ التعديلات" : "إضافة"} </Button>
//                  </>}
//             >
//                 <form id="category-form" onSubmit={handleFormSubmit} className="space-y-4">
//                     {apiError && <Alert variant="error" message={apiError} className="mb-4"/>}
//                     <Input label="اسم التصنيف *" name="name" value={formData.name} onChange={handleChange} required placeholder="مثال: أسباب رفض الطلب، أسباب الإرجاع" disabled={isSaving} />
//                     <button type="submit" className="hidden"/>
//                 </form>
//              </Modal>

//             {/* Delete Modal */}
//              <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف التصنيف" size="sm"
//                 footer={<> /* ... delete modal footer ... */ </>} >
//                  <p className="text-sm text-gray-600"> هل أنت متأكد من حذف التصنيف "<strong>{showDeleteModal?.name}</strong>"؟ </p>
//                  {apiError && showDeleteModal && <Alert variant="error" message={apiError} className="mt-3"/>}
//              </Modal>
//         </div>
//     );
// };

// export default ReasonCategoriesPage;