// import React, { useState } from 'react';
// import { ModifierGroup } from '../../types/product';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
// import { useAppSelector } from '../../hooks/redux';
// import { AxiosError } from 'axios';
// import { ApiErrorWithMessage } from '../../types/error';

// // Icons
// import { Plus, Edit2, Trash2, Save } from 'lucide-react';

// // Components
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import Card from '../../components/ui/card';
// import Input from '../../components/ui/input';
// import Modal from '../../components/ui/modal';
// import Select from '../../components/ui/select';
// import Switch from '../../components/ui/switch';
// import TextArea from '../../components/ui/textarea';
// import Toolbar from '../../components/ui/toolbar';

// interface ModifierGroupFormData {
//     name: string;
//     description?: string;
//     display_type: 'radio' | 'checkbox' | 'dropdown' | 'quantity';
//     is_active?: boolean;
// }

// const initialFormData: ModifierGroupFormData = {
//     name: '',
//     description: '',
//     display_type: 'radio',
//     is_active: true,
// };

// const ModifierGroupsPage: React.FC = () => {
//     const shop = useAppSelector(state => state.auth_store.portal?.shop);
//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState<ModifierGroup | null>(null);
//     const [formData, setFormData] = useState<ModifierGroupFormData>(initialFormData);
//     const [formError, setFormError] = useState<string | null>(null);
//     const [formSuccess, setFormSuccess] = useState<string | null>(null);

//     // Fetch modifier groups
//     const { data: modifierGroups, refetch } = useGetQuery<ModifierGroup[]>({
//         key: ['modifierGroups'],
//         url: `shops/${shop?.id}/modifier-groups`,
//     });

//     // Create mutation
//     const { mutateAsync: createModifierGroup, isPending: isCreating } = useMutationAction<ModifierGroup, ModifierGroupFormData>({
//         url: 'modifier-groups',
//         method: 'post',
//         key: ['modifierGroups'],
//     });

//     // Update mutation
//     const { mutateAsync: updateModifierGroup, isPending: isUpdating } = useMutationAction<ModifierGroup, ModifierGroupFormData>({
//         method: 'put',
//         key: ['modifierGroups'],
//     });

//     // Delete mutation
//     const { mutateAsync: deleteModifierGroup, isPending: isDeleting } = useMutationAction<void, void>({
//         method: 'delete',
//         key: ['modifierGroups'],
//     });

//     const handleCreate = async () => {
//         try {
//             if (!formData.name) {
//                 setFormError('اسم المجموعة مطلوب');
//                 return;
//             }

//             await createModifierGroup({
//                 ...formData,
//                 shop_id: shop?.id,
//             }, {
//                 onSuccess: () => {
//                     setFormSuccess('تم إنشاء مجموعة التعديل بنجاح');
//                     setShowCreateModal(false);
//                     setFormData(initialFormData);
//                     refetch();
//                 },
//                 onError: (err: AxiosError) => {
//                     const message = (err.response?.data as ApiErrorWithMessage)?.message || 'فشل إنشاء مجموعة التعديل';
//                     setFormError(message);
//                 },
//             });
//         } catch (error) {
//             setFormError('حدث خطأ غير متوقع');
//         }
//     };

//     const handleUpdate = async () => {
//         if (!showEditModal) return;

//         try {
//             if (!showEditModal.name) {
//                 setFormError('اسم المجموعة مطلوب');
//                 return;
//             }

//             await updateModifierGroup({
//                 ...showEditModal,
//                 shop_id: shop?.id,
//             }, {
//                 url: `modifier-groups/${showEditModal.id}`,
//                 onSuccess: () => {
//                     setFormSuccess('تم تحديث مجموعة التعديل بنجاح');
//                     setShowEditModal(null);
//                     refetch();
//                 },
//                 onError: (err: AxiosError) => {
//                     const message = (err.response?.data as ApiErrorWithMessage)?.message || 'فشل تحديث مجموعة التعديل';
//                     setFormError(message);
//                 },
//             });
//         } catch (error) {
//             setFormError('حدث خطأ غير متوقع');
//         }
//     };

//     const handleDelete = async (id: number) => {
//         if (!confirm('هل أنت متأكد من حذف مجموعة التعديل هذه؟')) return;

//         try {
//             await deleteModifierGroup(undefined, {
//                 url: `modifier-groups/${id}`,
//                 onSuccess: () => {
//                     setFormSuccess('تم حذف مجموعة التعديل بنجاح');
//                     refetch();
//                 },
//                 onError: (err: AxiosError) => {
//                     const message = (err.response?.data as ApiErrorWithMessage)?.message || 'فشل حذف مجموعة التعديل';
//                     setFormError(message);
//                 },
//             });
//         } catch (error) {
//             setFormError('حدث خطأ غير متوقع');
//         }
//     };

//     const displayTypeOptions = [
//         { value: 'radio', label: 'اختيار واحد' },
//         { value: 'checkbox', label: 'اختيار متعدد' },
//         { value: 'dropdown', label: 'قائمة منسدلة' },
//         { value: 'quantity', label: 'كمية' },
//     ];

//     // Toolbar setup
//     const breadcrumbItems = [
//         { label: 'لوحة التحكم', href: '/' },
//         { label: 'مجموعات التعديل' },
//     ];

//     const toolbarActions = (
//         <Button
//             variant="primary"
//             size="sm"
//             icon={Plus}
//             onClick={() => setShowCreateModal(true)}
//         >
//             إضافة مجموعة
//         </Button>
//     );

//     return (
//         <div className="space-y-6 pb-10">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />

//             {formError && (
//                 <Alert
//                     variant="error"
//                     message={formError}
//                     onClose={() => setFormError(null)}
//                 />
//             )}

//             {formSuccess && (
//                 <Alert
//                     variant="success"
//                     message={formSuccess}
//                     onClose={() => setFormSuccess(null)}
//                 />
//             )}

//             <div className="grid grid-cols-1 gap-6">
//                 {modifierGroups?.map((group) => (
//                     <Card key={group.id}>
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h3 className="text-lg font-medium">{group.name}</h3>
//                                 <p className="text-sm text-gray-500">{group.description}</p>
//                                 <p className="text-sm text-gray-500">
//                                     نوع العرض: {displayTypeOptions.find(opt => opt.value === group.display_type)?.label}
//                                 </p>
//                             </div>
//                             <div className="flex items-center space-x-2 space-x-reverse">
//                                 <Button
//                                     variant="secondary"
//                                     size="sm"
//                                     icon={Edit2}
//                                     onClick={() => setShowEditModal(group)}
//                                 >
//                                     تعديل
//                                 </Button>
//                                 <Button
//                                     variant="danger"
//                                     size="sm"
//                                     icon={Trash2}
//                                     onClick={() => handleDelete(group.id)}
//                                     isLoading={isDeleting}
//                                 >
//                                     حذف
//                                 </Button>
//                             </div>
//                         </div>
//                     </Card>
//                 ))}
//             </div>

//             {/* Create Modal */}
//             <Modal
//                 title="إضافة مجموعة تعديل جديدة"
//                 isOpen={showCreateModal}
//                 onClose={() => {
//                     setShowCreateModal(false);
//                     setFormData(initialFormData);
//                     setFormError(null);
//                 }}
//             >
//                 <div className="space-y-4">
//                     <Input
//                         label="اسم المجموعة *"
//                         value={formData.name}
//                         onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                     />
//                     <TextArea
//                         label="الوصف"
//                         value={formData.description}
//                         onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                         rows={3}
//                     />
//                     <Select
//                         label="نوع العرض *"
//                         value={formData.display_type}
//                         onChange={(value) => setFormData(prev => ({ ...prev, display_type: value as typeof formData.display_type }))}
//                         options={displayTypeOptions}
//                     />
//                     <Switch
//                         label="الحالة (فعال)"
//                         checked={formData.is_active}
//                         onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
//                     />
//                     <div className="flex justify-end space-x-2 space-x-reverse">
//                         <Button
//                             variant="primary"
//                             onClick={handleCreate}
//                             isLoading={isCreating}
//                             icon={Save}
//                         >
//                             حفظ
//                         </Button>
//                         <Button
//                             variant="secondary"
//                             onClick={() => {
//                                 setShowCreateModal(false);
//                                 setFormData(initialFormData);
//                                 setFormError(null);
//                             }}
//                         >
//                             إلغاء
//                         </Button>
//                     </div>
//                 </div>
//             </Modal>

//             {/* Edit Modal */}
//             <Modal
//                 title="تعديل مجموعة التعديل"
//                 isOpen={!!showEditModal}
//                 onClose={() => {
//                     setShowEditModal(null);
//                     setFormError(null);
//                 }}
//             >
//                 {showEditModal && (
//                     <div className="space-y-4">
//                         <Input
//                             label="اسم المجموعة *"
//                             value={showEditModal.name}
//                             onChange={(e) => setShowEditModal(prev => prev ? { ...prev, name: e.target.value } : null)}
//                         />
//                         <TextArea
//                             label="الوصف"
//                             value={showEditModal.description}
//                             onChange={(e) => setShowEditModal(prev => prev ? { ...prev, description: e.target.value } : null)}
//                             rows={3}
//                         />
//                         <Select
//                             label="نوع العرض *"
//                             value={showEditModal.display_type}
//                             onChange={(value) => setShowEditModal(prev => prev ? { ...prev, display_type: value as typeof showEditModal.display_type } : null)}
//                             options={displayTypeOptions}
//                         />
//                         <Switch
//                             label="الحالة (فعال)"
//                             checked={showEditModal.is_active}
//                             onChange={(e) => setShowEditModal(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
//                         />
//                         <div className="flex justify-end space-x-2 space-x-reverse">
//                             <Button
//                                 variant="primary"
//                                 onClick={handleUpdate}
//                                 isLoading={isUpdating}
//                                 icon={Save}
//                             >
//                                 حفظ
//                             </Button>
//                             <Button
//                                 variant="secondary"
//                                 onClick={() => {
//                                     setShowEditModal(null);
//                                     setFormError(null);
//                                 }}
//                             >
//                                 إلغاء
//                             </Button>
//                         </div>
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default ModifierGroupsPage;