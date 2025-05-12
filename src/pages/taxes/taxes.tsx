// // src/pages/settings/TaxesPage.tsx
// import React, { useState, useMemo, useEffect, ChangeEvent, FormEvent } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import type { Tax, TaxFormData } from '../../types/tax'; // Adjust path
// import { initialTaxFormData } from '../../types/tax'; // Adjust path
// // Adjust path
// import { Plus, Edit, Trash2, Percent, Save, Settings } from 'lucide-react';
// import { formatDate } from 'date-fns';
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
// import Input from '../../components/ui/input';
// import Modal from '../../components/ui/modal';
// import Spinner from '../../components/ui/spinner';
// import Switch from '../../components/ui/switch';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';

// const TaxesPage: React.FC = () => {
//     const navigate = useNavigate(); // Not used for edit here, but kept for consistency
//     const [showFormModal, setShowFormModal] = useState<boolean>(false);
//     const [editingTax, setEditingTax] = useState<Tax | null>(null); // Track which tax is being edited
//     const [formData, setFormData] = useState<TaxFormData>(initialTaxFormData);
//     const [showDeleteModal, setShowDeleteModal] = useState<Tax | null>(null);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [apiSuccess, setApiSuccess] = useState<string | null>(null); // For success messages
//     const [activeToggles, setActiveToggles] = useState<Record<number, boolean>>({});

//     // --- Data Fetching ---
//     const { data: taxesResponse, isLoading, error, refetch } = useGetQuery<{ data: Tax[] }>({
//         queryKey: ['taxes'],
//         url: 'taxes', // Your API endpoint for taxes
//     });
//     const taxes = taxesResponse?.data || [];

//     // --- Mutations ---
//     const { mutateAsync: saveTax, isLoading: isSaving } = useMutationAction<Tax, Partial<TaxFormData>>({ // Response is Tax, Input is Partial<TaxFormData>
//         method: editingTax ? 'PUT' : 'POST', // Dynamic method
//         url: editingTax ? `taxes/${editingTax.id}` : 'taxes', // Dynamic URL
//         key: ['taxes'], // Invalidate cache on success
//     });

//     const { mutateAsync: deleteTax, isLoading: isDeleting } = useMutationAction({
//         method: 'DELETE', url: `taxes/{id}` // Placeholder, set dynamically
//     });
//     const { mutateAsync: updateTaxStatus, isLoading: isUpdatingStatus } = useMutationAction({
//         method: 'PATCH', url: `taxes/{id}/status` // Placeholder, set dynamically
//     });

//     // --- Effects ---
//     // Populate form when editingTax changes
//     useEffect(() => {
//         if (editingTax) {
//             setFormData({
//                 name: editingTax.name,
//                 tax_rate: String(editingTax.tax_rate), // Convert number back to string for input
//                 is_active: editingTax.is_active,
//             });
//             setShowFormModal(true); // Open modal when editingTax is set
//         } else {
//             setFormData(initialTaxFormData); // Reset form if not editing
//         }
//     }, [editingTax]);

//      // Clear messages when modal opens or closes
//      useEffect(() => {
//          if (!showFormModal && !showDeleteModal) {
//              setApiError(null);
//              setApiSuccess(null);
//          }
//      }, [showFormModal, showDeleteModal]);


//     // --- Handlers ---
//     const handleOpenAddModal = () => {
//         setEditingTax(null); // Ensure not editing
//         setFormData(initialTaxFormData); // Reset form
//         setShowFormModal(true);
//         setApiError(null); // Clear previous errors
//         setApiSuccess(null);
//     };

//     const handleOpenEditModal = (tax: Tax) => {
//         setEditingTax(tax); // Set the tax to edit, useEffect will populate form and open modal
//         setApiError(null);
//         setApiSuccess(null);
//     };

//     const handleCloseFormModal = () => {
//         setShowFormModal(false);
//         setEditingTax(null); // Clear editing state
//          // No need to reset formData here, useEffect handles it based on editingTax
//     };

//     const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, value, type } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//         if(apiError) setApiError(null);
//         if(apiSuccess) setApiSuccess(null);
//     };

//     const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, checked } = e.target;
//         setFormData(prev => ({ ...prev, [name as keyof TaxFormData]: checked }));
//          if(apiError) setApiError(null);
//          if(apiSuccess) setApiSuccess(null);
//     };

//     const handleFormSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setApiError(null);
//         setApiSuccess(null);

//         if (!formData.name || formData.tax_rate === '') {
//             setApiError("اسم الضريبة ومعدلها حقول مطلوبة.");
//             return;
//         }
//         const rate = parseFloat(String(formData.tax_rate));
//         if (isNaN(rate) || rate < 0 || rate > 100) { // Basic validation for percentage
//             setApiError("معدل الضريبة يجب أن يكون رقمًا صالحًا بين 0 و 100.");
//             return;
//         }

//         const payload: Partial<TaxFormData> = {
//             ...formData,
//             tax_rate: rate, // Send as number
//             is_active: formData.is_active ? 1 : 0, // Send as 1/0 if needed by backend
//         };

//         try {
//             await saveTax(payload, {
//                  // Override URL and method if necessary (though hook setup handles it)
//                  url: editingTax ? `taxes/${editingTax.id}` : 'taxes',
//                  method: editingTax ? 'PUT' : 'POST',

//                 onSuccess: (response) => {
//                     const successMsg = editingTax ? `تم تحديث الضريبة "${response.data.name}"` : `تم إضافة الضريبة "${response.data.name}"`;
//                     setApiSuccess(successMsg); // Show success message
//                     refetch(); // Refresh the list
//                     // Optionally close modal after a delay or keep it open
//                     setTimeout(() => {
//                         handleCloseFormModal();
//                         setApiSuccess(null); // Clear message after closing
//                     }, 1500);
//                 },
//                 onError: (err: any) => {
//                      const message = err.response?.data?.message || (editingTax ? "فشل تحديث الضريبة." : "فشل إضافة الضريبة.");
//                     setApiError(message);
//                 },
//             });
//         } catch (error) {
//             setApiError("حدث خطأ غير متوقع.");
//         }
//     };


//     // --- Delete Handlers ---
//     const openDeleteConfirm = (tax: Tax) => setShowDeleteModal(tax);
//     const closeDeleteConfirm = () => setShowDeleteModal(null);

//     const confirmDelete = async () => {
//         if (!showDeleteModal) return;
//         setApiError(null);
//         try {
//             await deleteTax({}, {
//                 url: `taxes/${showDeleteModal.id}`,
//                 onSuccess: () => {
//                     refetch();
//                     closeDeleteConfirm();
//                     setApiSuccess(`تم حذف الضريبة "${showDeleteModal.name}".`); // Show success
//                     setTimeout(() => setApiSuccess(null), 3000);
//                 },
//                 onError: (err: any) => setApiError(err.message || "فشل حذف الضريبة."),
//             });
//         } catch (e: any) { setApiError(e.message || "خطأ غير متوقع."); }
//     };

//      // --- Status Toggle Handler ---
//     const handleStatusToggle = async (tax: Tax, newStatus: boolean) => {
//         setApiError(null);
//         setApiSuccess(null);
//         setActiveToggles(prev => ({ ...prev, [tax.id]: true }));
//         try {
//             await updateTaxStatus({ is_active: newStatus }, {
//                 url: `taxes/${tax.id}/status`,
//                 onSuccess: () => refetch(),
//                 onError: (err: any) => setApiError(err.message || "فشل تحديث الحالة."),
//                 onSettled: () => setActiveToggles(prev => { const n = { ...prev }; delete n[tax.id]; return n; }),
//             });
//         } catch (e: any) {
//             setApiError(e.message || "خطأ غير متوقع.");
//             setActiveToggles(prev => { const n = { ...prev }; delete n[tax.id]; return n; });
//         }
//     };

//     // --- Table Columns ---
//     const columns = useMemo((): ColumnDefinition<Tax>[] => [
//         { key: 'name', header: 'اسم الضريبة', cellClassName: 'font-medium text-gray-800' },
//         {
//             key: 'tax_rate', header: 'المعدل (%)', width: '120px', cellClassName: 'text-center',
//             render: (t) => `${parseFloat(String(t.tax_rate)).toFixed(2)}%` // Format as percentage
//         },
//         {
//             key: 'is_active', header: 'الحالة', cellClassName: 'w-[100px]',
//             render: (t) => (
//                  <div className="flex items-center justify-center">
//                      {activeToggles[t.id] ? (<Spinner size="sm"/>) : (
//                         <Switch label="" checked={t.is_active} onChange={(e) => handleStatusToggle(t, e.target.checked)}/>
//                      )}
//                  </div>
//             )
//         },
//         {
//             key: 'created_at', header: 'تاريخ الإنشاء', width: '150px',
//             render: (t) => formatDate(t.created_at)
//         },
//         {
//             key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
//             render: (t) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenEditModal(t)} title="تعديل"> <Edit size={16} /> </Button>
//                     <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(t)} title="حذف"> <Trash2 size={16} /> </Button>
//                 </div>
//             )
//         },
//     ], [activeToggles, handleStatusToggle]); // Dependency for status spinner


//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "الإعدادات" }, { label: "الضرائب" }, ];
//     const toolbarActions = (<Button onClick={handleOpenAddModal} icon={Plus}>إضافة ضريبة</Button>);

//     // --- Render ---
//     return (
//         <div className="space-y-4">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />

//             {/* Display general API errors here if not shown in modal */}
//             {apiError && !showFormModal && !showDeleteModal && (
//                 <Alert variant="error" message={apiError} onClose={() => setApiError(null)} className="mb-4"/>
//             )}
//             {/* Display general success messages here */}
//              {apiSuccess && !showFormModal && !showDeleteModal && (
//                 <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} className="mb-4"/>
//             )}


//             <DataTable<Tax>
//                 columns={columns}
//                 data={taxes}
//                 isLoading={isLoading}
//                 error={error ? (error as any).message || "فشل تحميل الضرائب" : null}
//                 emptyStateMessage="لم يتم إضافة أي ضرائب بعد."
//                 rowKey="id"
//             />

//             {/* Add/Edit Form Modal */}
//             <Modal
//                 isOpen={showFormModal}
//                 onClose={handleCloseFormModal}
//                 title={editingTax ? `تعديل الضريبة: ${editingTax.name}` : "إضافة ضريبة جديدة"}
//                 size="md"
//                 footer={
//                     <>
//                         <Button variant="secondary" onClick={handleCloseFormModal} disabled={isSaving}>إلغاء</Button>
//                         {/* Connect the submit action to the form's submit handler */}
//                         <Button type="submit" form="tax-form" variant="primary" isLoading={isSaving} disabled={isSaving} icon={Save}>
//                            {editingTax ? "حفظ التعديلات" : "إضافة الضريبة"}
//                         </Button>
//                     </>
//                 }
//             >
//                 {/* Form inside the modal */}
//                 <form id="tax-form" onSubmit={handleFormSubmit} className="space-y-4">
//                     {/* Display modal-specific errors */}
//                     {apiError && <Alert variant="error" message={apiError} className="mb-4"/>}

//                      <Input
//                          label="اسم الضريبة *"
//                          id="name"
//                          name="name"
//                          value={formData.name}
//                          onChange={handleChange}
//                          required
//                          placeholder="مثال: ضريبة القيمة المضافة"
//                          disabled={isSaving}
//                       />
//                        <Input
//                          label="معدل الضريبة (%) *"
//                          id="tax_rate"
//                          name="tax_rate"
//                          type="number"
//                          value={formData.tax_rate}
//                          onChange={handleChange}
//                          required
//                          placeholder="مثال: 15"
//                          min="0"
//                          max="100"
//                          step="0.01"
//                          suffix="%"
//                          disabled={isSaving}
//                         />
//                         <Switch
//                             label="الحالة (مفعلة)"
//                             name="is_active"
//                             checked={formData.is_active}
//                             onChange={handleSwitchChange}
//                             disabled={isSaving}
//                          />
//                      {/* Add a hidden submit button inside the form to allow footer button to trigger submit */}
//                       <button type="submit" className="hidden" />
//                  </form>
//             </Modal>

//             {/* Delete Confirmation Modal */}
//             <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف الضريبة" size="sm"
//                 footer={<>
//                     <Button variant="secondary" onClick={closeDeleteConfirm} disabled={isDeleting}>إلغاء</Button>
//                     <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting} disabled={isDeleting}>نعم، حذف</Button>
//                 </>}
//             >
//                 <p className="text-sm text-gray-600"> هل أنت متأكد من حذف الضريبة "<strong>{showDeleteModal?.name}</strong>"؟ </p>
//                  {apiError && <Alert variant="error" message={apiError} className="mt-3"/>}
//             </Modal>
//         </div>
//     );
// };

// export default TaxesPage;