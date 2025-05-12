// // src/pages/customers/CustomersPage.tsx
// import React, { useState, useMemo, useEffect, ChangeEvent, FormEvent } from 'react';
// import { useNavigate } from 'react-router-dom';
// import type { Customer, CustomerFormData } from '../../types/customer'; // Adjust
// import { initialCustomerFormData } from '../../types/customer';
// import { Plus, Edit, Trash2, Phone, Mail, Save, User } from 'lucide-react';
// import { format } from 'date-fns';
// import { arSA } from 'date-fns/locale';
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
// import Input from '../../components/ui/input';
// import Modal from '../../components/ui/modal';
// import TextArea from '../../components/ui/textarea';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';

// // Helper Function
// const formatDate = (dateString: string | null | undefined): string => {
//     if (!dateString) return '-';
//     try {
//         return format(new Date(dateString), 'yyyy/MM/dd', { locale: arSA });
//     } catch (e) { return '-'; }
// };
// const CustomersPage: React.FC = () => {
//     const [showFormModal, setShowFormModal] = useState<boolean>(false);
//     const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
//     const [formData, setFormData] = useState<CustomerFormData>(initialCustomerFormData);
//     const [showDeleteModal, setShowDeleteModal] = useState<Customer | null>(null);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [apiSuccess, setApiSuccess] = useState<string | null>(null);

//     // --- Data Fetching ---
//     // TODO: Add shop_id filter if needed
//     const { data: customersResponse, isLoading, error, refetch } = useGetQuery<{ data: Customer[] }>({
//         key: ['customers'],
//         url: 'customers?include_counts=true', // Example: Request order counts
//     });
//     const customers = customersResponse?.data || [];

//     // --- Mutations ---
//     const { mutateAsync: saveCustomer, isLoading: isSaving } = useMutationAction<Customer, Partial<CustomerFormData>>({
//         method: editingCustomer ? 'PUT' : 'POST',
//         url: editingCustomer ? `customers/${editingCustomer.id}` : 'customers',
//         key: ['customers'],
//     });
//     const { mutateAsync: deleteCustomer, isLoading: isDeleting } = useMutationAction({ method: 'DELETE' });

//     // --- Effects ---
//     // Populate form when editing
//     useEffect(() => {
//         if (editingCustomer) {
//             setFormData({
//                 name: editingCustomer.name,
//                 phone_number: editingCustomer.phone_number,
//                 email: editingCustomer.email || '',
//                 address: editingCustomer.address || '',
//             });
//             setShowFormModal(true);
//         } else {
//             setFormData(initialCustomerFormData);
//         }
//     }, [editingCustomer]);

//      // Clear messages on modal close
//      useEffect(() => {
//          if (!showFormModal && !showDeleteModal) {
//              setApiError(null); setApiSuccess(null);
//          }
//      }, [showFormModal, showDeleteModal]);

//     // --- Handlers ---
//     const handleOpenAddModal = () => { setEditingCustomer(null); setFormData(initialCustomerFormData); setShowFormModal(true); setApiError(null); setApiSuccess(null); };
//     const handleOpenEditModal = (customer: Customer) => { setEditingCustomer(customer); setApiError(null); setApiSuccess(null); }; // useEffect opens modal
//     const handleCloseFormModal = () => { setShowFormModal(false); setEditingCustomer(null); };
//     const openDeleteConfirm = (customer: Customer) => setShowDeleteModal(customer);
//     const closeDeleteConfirm = () => setShowDeleteModal(null);

//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//         if(apiError) setApiError(null);
//         if(apiSuccess) setApiSuccess(null);
//     };

//     const handleFormSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setApiError(null); setApiSuccess(null);

//         if (!formData.name || !formData.phone_number) {
//             setApiError("اسم العميل ورقم الهاتف حقول مطلوبة."); return;
//         }
//         // Add phone number validation if needed

//         const payload: Partial<CustomerFormData> = { ...formData };
//         // TODO: Add shop_id

//         try {
//             await saveCustomer(payload, {
//                 url: editingCustomer ? `customers/${editingCustomer.id}` : 'customers',
//                 onSuccess: (response) => {
//                     const successMsg = editingCustomer ? `تم تحديث بيانات العميل "${response.data.name}"` : `تمت إضافة العميل "${response.data.name}"`;
//                     setApiSuccess(successMsg);
//                     refetch();
//                     setTimeout(() => { handleCloseFormModal(); setApiSuccess(null); }, 1500);
//                 },
//                 onError: (err: any) => setApiError(err.message || (editingCustomer ? "فشل تحديث البيانات." : "فشل إضافة العميل.")),
//             });
//         } catch (error) { setApiError("حدث خطأ غير متوقع."); }
//     };

//     const confirmDelete = async () => {
//         if (!showDeleteModal) return;
//         setApiError(null); setApiSuccess(null);
//         try {
//             await deleteCustomer({}, {
//                 url: `customers/${showDeleteModal.id}`,
//                 onSuccess: () => {
//                      setApiSuccess(`تم حذف العميل "${showDeleteModal.name}".`);
//                      refetch();
//                      closeDeleteConfirm();
//                      setTimeout(() => setApiSuccess(null), 3000);
//                 },
//                 onError: (err: any) => setApiError(err.message || "فشل حذف العميل."),
//             });
//         } catch (e: any) { setApiError(e.message || "خطأ غير متوقع."); }
//      };


//     // --- Table Columns ---
//     const columns = useMemo((): ColumnDefinition<Customer>[] => [
//         { key: 'name', header: 'اسم العميل', cellClassName: 'font-medium text-gray-800' },
//         { key: 'phone_number', header: 'رقم الهاتف', cellClassName: 'text-left font-mono text-sm', width: '150px' }, // LTR for phone
//         { key: 'email', header: 'البريد الإلكتروني', render: (c) => c.email || '-' },
//         { key: 'orders_count', header: 'عدد الطلبات', cellClassName: 'text-center', render: (c) => c.orders_count ?? '-' },
//         { key: 'last_order_date', header: 'آخر طلب', render: (c) => formatDate(c.last_order_date) },
//         {
//             key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
//             render: (c) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenEditModal(c)} title="تعديل"> <Edit size={16} /> </Button>
//                     {/* Consider implications before enabling delete */}
//                     <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(c)} title="حذف"> <Trash2 size={16} /> </Button>
//                 </div>
//             )
//         },
//     ], []);


//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "العملاء" }, ];
//     const toolbarActions = (<Button onClick={handleOpenAddModal} icon={Plus}>إضافة عميل يدويًا</Button>);

//     return (
//         <div className="space-y-4">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {apiError && !showFormModal && !showDeleteModal && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} />}
//             {apiSuccess && !showFormModal && !showDeleteModal && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} />}

//             <DataTable<Customer>
//                 columns={columns}
//                 data={customers}
//                 isLoading={isLoading}
//                 error={error ? (error as any).message || "فشل تحميل العملاء" : null}
//                 emptyStateMessage="لم يتم العثور على أي عملاء. يتم إضافتهم عادةً عند إنشاء الطلبات."
//                 rowKey="id"
//             />

//             {/* --- Modals --- */}
//             {/* Add/Edit Form Modal */}
//             <Modal isOpen={showFormModal} onClose={handleCloseFormModal} title={editingCustomer ? `تعديل بيانات العميل` : "إضافة عميل جديد"} size="lg"
//                  footer={<>
//                      <Button variant="secondary" onClick={handleCloseFormModal} disabled={isSaving}>إلغاء</Button>
//                      <Button type="submit" form="customer-form" variant="primary" isLoading={isSaving} disabled={isSaving} icon={Save}> {editingCustomer ? "حفظ التعديلات" : "إضافة العميل"} </Button>
//                  </>}
//             >
//                  <form id="customer-form" onSubmit={handleFormSubmit} className="space-y-4">
//                      {apiError && <Alert variant="error" message={apiError} className="mb-4"/>}
//                       <Input label="اسم العميل *" name="name" value={formData.name} onChange={handleChange} required disabled={isSaving} icon={User}/>
//                      <Input label="رقم الهاتف *" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} required disabled={isSaving} icon={Phone} dir="ltr"/>
//                      <Input label="البريد الإلكتروني (اختياري)" name="email" type="email" value={formData.email || ''} onChange={handleChange} disabled={isSaving} icon={Mail} dir="ltr"/>
//                      <TextArea label="العنوان (اختياري)" name="address" value={formData.address || ''} onChange={handleChange} rows={3} disabled={isSaving}/>
//                      <button type="submit" className="hidden" /> {/* Hidden submit for footer button */}
//                  </form>
//             </Modal>

//              {/* Delete Confirmation Modal */}
//              <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف العميل" size="sm"
//                 footer={<>
//                     <Button variant="secondary" onClick={closeDeleteConfirm} disabled={isDeleting}>إلغاء</Button>
//                     <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting} disabled={isDeleting}>نعم، حذف</Button>
//                 </>}
//             >
//                  <p className="text-sm text-gray-600"> هل أنت متأكد من حذف العميل "<strong>{showDeleteModal?.name}</strong>"؟ قد يؤثر هذا على سجل الطلبات المرتبطة به. </p>
//                  {apiError && showDeleteModal && <Alert variant="error" message={apiError} className="mt-3"/>}
//             </Modal>
//         </div>
//     );
// };

// export default CustomersPage;