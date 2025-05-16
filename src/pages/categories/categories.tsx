"use client"; // Keep if using Next.js App Router features directly in this file

import React, { useState, useMemo, useEffect, ChangeEvent, FormEvent } from 'react';
import { useGetQuery, useMutationAction } from '../../hooks/queries-actions'; // Adjust path
import type { Category } from '../../types/category';
import type { ColumnDefinition } from '../../components/ui/data-table';
import Toolbar from '../../components/ui/toolbar';
import DataTable from '../../components/ui/data-table';
import Button from '../../components/ui/button';
import Modal from '../../components/ui/modal';
import Alert from '../../components/ui/alert';
import Spinner from '../../components/ui/spinner';
import Switch from '../../components/ui/switch';
import Input from '../../components/ui/input';
import TextArea from '../../components/ui/textarea';
import { Plus, Edit, Trash2, Image as ImageIcon, Save, X } from 'lucide-react'; // Added X for close
import { getImageLink } from '../../lib/storage'; // Adjust path
import FileUpload from '../../components/ui/file-upload';
import { useAppSelector } from '../../hooks/redux';

interface CreateCategoryFormData {
    name: string;
    description: string;
    image: File | null; // Only for new image file
    is_active: boolean;
}

interface EditCategoryFormData {
    id: number; // Keep track of the ID being edited
    name: string;
    description: string;
    image: File | null; // For new image file to replace existing
    is_active: boolean;
    current_image_url?: string | null; // To display current image
}

const CategoriesPage: React.FC = () => {
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false); // NEW: For create modal
    const [showEditModal, setShowEditModal] = useState<boolean>(false); // NEW: For edit modal
    
    const [editingCategory, setEditingCategory] = useState<Category | null>(null); // Used to populate edit form

    // Form data for CREATE modal
    const [createFormData, setCreateFormData] = useState<CreateCategoryFormData>({
        name: '',
        description: '',
        image: null,
        is_active: true
    });
    const [createImageFile, setCreateImageFile] = useState<File | null>(null); // File for CREATE modal

    // Form data for EDIT modal
    const [editFormData, setEditFormData] = useState<EditCategoryFormData>({
        id: 0,
        name: '',
        description: '',
        image: null, // This will hold the new file if user uploads one
        is_active: true,
        current_image_url: null,
    });
    const [editImageFile, setEditImageFile] = useState<File | null>(null); // File for EDIT modal

    const [showDeleteModal, setShowDeleteModal] = useState<Category | null>(null);
    const [apiError, setApiError] = useState<string | null>(null); // General API error
    const [createApiError, setCreateApiError] = useState<string | null>(null); // NEW: Error for create modal
    const [editApiError, setEditApiError] = useState<string | null>(null); // NEW: Error for edit modal
    const [deleteApiError, setDeleteApiError] = useState<string | null>(null); // NEW: Error for delete modal
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);
    const [activeToggles, setActiveToggles] = useState<Record<number, boolean>>({});

    const shop = useAppSelector(state => state.auth_store.portal?.shop);

    // --- Data Fetching ---
    const { data: categories, isLoading, error: queryError, refetch } = useGetQuery<Category[]>({
        key: ['categories'],
        url: `shops/${shop?.id}/categories`,
    });

    // --- Mutations ---
    const { mutateAsync: createCategoryAction, isPending: isCreating } = useMutationAction<Category, FormData>({
        method: 'post',
        url: `categories`,
        key: ['categories'],
        contentType: 'multipart/form-data'
    });

    const { mutateAsync: updateCategoryAction, isPending: isUpdating } = useMutationAction<Category, FormData>({
        method: 'put', // Using POST with _method="PUT" for FormData
        url: `categories/${editFormData.id}`, // URL will use editFormData.id
        key: ['categories'],
        contentType: 'multipart/form-data',
    });

    const { mutateAsync: deleteCategoryAction, isPending: isDeleting } = useMutationAction({
        method: 'delete',
        key: ['categories'],
        url: `categories/${showDeleteModal?.id}`, // URL uses showDeleteModal.id
    });
    const [selectedSwitchCategory, setSelectedSwitchCategory] = useState<Category | null>(null);

    const { mutateAsync: updateCategoryStatusAction, isPending: isUpdatingStatus } = useMutationAction({
        method: 'post', // Assuming POST for toggle status
        key: ['categories'],
        url: `categories/${selectedSwitchCategory?.id}/toggle-status`,
        // URL will be dynamic in handleStatusToggle
    });


    // --- Effects ---
    // Populate EDIT form when editingCategory changes
    useEffect(() => {
        if (editingCategory) {
            setEditFormData({
                id: editingCategory.id,
                name: editingCategory.name,
                description: editingCategory.description || '',
                image: null, // Reset file input, user must re-select if changing
                is_active: editingCategory.is_active,
                current_image_url: editingCategory.image // Store current image URL
            });
            setEditImageFile(null); // Clear any previously selected file for edit modal
            setShowEditModal(true);
        } else {
             // This else block is not strictly necessary if edit modal is closed properly
            setShowEditModal(false);
        }
    }, [editingCategory]);

     // Clear messages when modals close
     useEffect(() => {
         if (!showCreateModal && !showEditModal && !showDeleteModal) {
             setApiError(null);
             setApiSuccess(null);
             setCreateApiError(null);
             setEditApiError(null);
             setDeleteApiError(null);
         }
     }, [showCreateModal, showEditModal, showDeleteModal]);


    // --- Handlers ---
    const handleOpenAddModal = () => {
        setEditingCategory(null); // Ensure no category is being edited
        setCreateFormData({ name: '', description: '', image: null, is_active: true }); // Reset create form
        setCreateImageFile(null);
        setCreateApiError(null);
        setApiSuccess(null);
        setShowCreateModal(true);
    };
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setCreateApiError(null); // Clear specific error on close
    };

    const handleOpenEditModal = (category: Category) => {
        setEditingCategory(category); // useEffect will populate editFormData and open modal
        setEditApiError(null);
        setApiSuccess(null);
    };
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingCategory(null); // Clear the category being edited
        setEditApiError(null); // Clear specific error on close
    };

    const openDeleteConfirm = (category: Category) => { setShowDeleteModal(category); setDeleteApiError(null); setApiSuccess(null); };
    const closeDeleteConfirm = () => { setShowDeleteModal(null); setDeleteApiError(null); };

    // --- CREATE Modal Handlers ---
    const handleCreateChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCreateFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (createApiError) setCreateApiError(null);
        if (apiSuccess) setApiSuccess(null);
    };
    const handleCreateSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCreateFormData(prev => ({ ...prev, [e.target.name as keyof CreateCategoryFormData]: e.target.checked }));
        if (createApiError) setCreateApiError(null);
        if (apiSuccess) setApiSuccess(null);
    };
    const handleCreateFileSelect = (file: File | null) => {
        setCreateImageFile(file); // Store the file for create form
        setCreateFormData(prev => ({ ...prev, image: file })); // Also update formData if needed for display/validation
        if (createApiError) setCreateApiError(null);
        if (apiSuccess) setApiSuccess(null);
    };

    // --- EDIT Modal Handlers ---
    const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (editApiError) setEditApiError(null);
        if (apiSuccess) setApiSuccess(null);
    };
    const handleEditSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditFormData(prev => ({ ...prev, [e.target.name as keyof EditCategoryFormData]: e.target.checked }));
        if (editApiError) setEditApiError(null);
        if (apiSuccess) setApiSuccess(null);
    };
    const handleEditFileSelect = (file: File | null) => {
        setEditImageFile(file); // Store the new file for edit form
        setEditFormData(prev => ({ ...prev, image: file })); // Also update formData if needed
        if (editApiError) setEditApiError(null);
        if (apiSuccess) setApiSuccess(null);
    };
     const handleEditFileRemove = () => {
        setEditImageFile(null);
        setEditFormData(prev => ({...prev, image: null, current_image_url: null})); // Signal removal of image
         // Backend needs to handle image removal if current_image_url becomes null and no new imageFile
     };


    const handleCreateFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setCreateApiError(null); setApiSuccess(null);
        if (!createFormData.name.trim()) { setCreateApiError("اسم التصنيف مطلوب."); return; }

        const submissionData = new FormData();
        submissionData.append('name', createFormData.name);
        if (createFormData.description) submissionData.append('description', createFormData.description);
        submissionData.append('is_active', createFormData.is_active ? '1' : '0');
        submissionData.append('shop_id', '1'); // Hardcoded shop_id, adjust as needed

        if (createImageFile) { // Use the separate state for the file
            submissionData.append('image', createImageFile);
        }

        try {
            await createCategoryAction(submissionData, {
                onSuccess: (response) => {
                     setApiSuccess(`تم إضافة التصنيف "${response.name}" بنجاح.`);
                     refetch();
                     setTimeout(() => { handleCloseCreateModal(); setApiSuccess(null); }, 1500);
                 },
                 onError: (err: Error) => setCreateApiError(err.message || "فشل إضافة التصنيف."),
            });
        } catch (error) {
            console.error("Create Category Error:", (error as Error));
            setCreateApiError((error as Error).message || "حدث خطأ غير متوقع أثناء إنشاء التصنيف.");
        }
    };

    const handleEditFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // setEditApi(error as Error)(null); setApiSuccess(null);
        if (!editFormData.name.trim()) { setEditApiError("اسم التصنيف مطلوب."); return; }
        if (!editFormData.id) { setEditApiError("معرف التصنيف غير موجود للتحرير."); return; }


        const submissionData = new FormData();
        submissionData.append('_method', 'PUT'); // For Laravel/Rails to treat as PUT
        submissionData.append('name', editFormData.name);
        if (editFormData.description) submissionData.append('description', editFormData.description);
        submissionData.append('is_active', editFormData.is_active ? '1' : '0');
        submissionData.append('shop_id', '1'); // Assuming shop_id might be needed for context or auth

        if (editImageFile) { // If a new file is selected for edit
            submissionData.append('image', editImageFile);
        } else if (editFormData.image === null && editFormData.current_image_url === null) {
            // This condition means user explicitly removed the image via FileUpload's remove button
            submissionData.append('remove_image', '1'); // Signal to backend to remove the image
        }
        // If editImageFile is null AND editFormData.current_image_url is NOT null,
        // it means the user didn't touch the image, so don't send any image field.
        // Backend should preserve the existing image in this case.

        try {
            await updateCategoryAction(submissionData, {
                 onSuccess: (response) => {
                     setApiSuccess(`تم تحديث التصنيف "${response.name}" بنجاح.`);
                     refetch();
                     setTimeout(() => { handleCloseEditModal(); setApiSuccess(null); }, 1500);
                 },
                 onError: (err: Error) => setEditApiError(err.message || "فشل تحديث التصنيف."),
            });
        } catch (error) {
            console.error("Update Category Error:", error);
            setEditApiError((error as Error).message || "حدث خطأ غير متوقع أثناء تحديث التصنيف.");
        }
    };


    const confirmDelete = async () => {
         if (!showDeleteModal) return;
         setDeleteApiError(null); setApiSuccess(null);
         try {
             await deleteCategoryAction({}, { // Pass empty object if no body needed for DELETE
                 onSuccess: () => {
                     setApiSuccess(`تم حذف التصنيف "${showDeleteModal.name}".`);
                     refetch();
                     closeDeleteConfirm();
                     setTimeout(() => setApiSuccess(null), 3000);
                 },
                 onError: (err: Error) => {
                     setDeleteApiError(err.message || "فشل حذف التصنيف. قد يكون مرتبطاً بمنتجات.");
                 }
             });
         } catch (e) {
            console.error("Delete Category Error:", e);
            setDeleteApiError((e as Error).message || "خطأ غير متوقع أثناء الحذف.");
         }
     };

    const handleStatusToggle = async (category: Category, newStatus: boolean) => {
         setApiError(null); setApiSuccess(null); // Clear general API error
         setSelectedSwitchCategory(category);
         setActiveToggles(prev => ({ ...prev, [category.id]: true }));
         try {
             // Dynamic URL for status toggle
             await updateCategoryStatusAction({ is_active: newStatus }, {
                 onSuccess: () => {
                    setApiSuccess(`تم تحديث حالة "${category.name}".`);
                    refetch();
                    setTimeout(() => setApiSuccess(null), 2000);
                 },
                 onError: (err: Error) => setApiError(err.message || "فشل تحديث الحالة."), // Use general apiError here or a specific one
                 onSettled: () => setActiveToggles(prev => { const n={...prev}; delete n[category.id]; return n; }),
             });
         } catch (e) {
            console.error("Toggle Status Error:", e);
             setApiError((e as Error).message || "خطأ غير متوقع عند تحديث الحالة.");
             setActiveToggles(prev => { const n={...prev}; delete n[category.id]; return n; });
         }
     };


    // --- Table Columns ---
    const columns = useMemo((): ColumnDefinition<Category>[] => [
        {
            key: 'image', header: 'الصورة', width: '80px',
            render: (cat) => (
                <div className="w-10 h-10 rounded border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {cat.image ? (
                        <img src={getImageLink(cat.image)} alt={cat.name} className="h-full w-full object-cover" />
                    ) : (
                        <ImageIcon size={20} className="text-gray-300" />
                    )}
                </div>
            )
        },
        { key: 'name', header: 'اسم التصنيف', cellClassName: 'font-medium text-gray-800' },
        { key: 'description', header: 'الوصف', cellClassName: 'text-gray-500 text-xs max-w-xs truncate', render: (cat) => cat.description || '-' },
        { key: 'products_count', header: 'عدد المنتجات', cellClassName: 'text-center', render: (cat) => cat.products_count ?? 0 },
        {
            key: 'is_active', header: 'الحالة', cellClassName: 'w-[100px]',
            render: (cat) => (
                 <div className="flex items-center justify-center">
                    {isUpdatingStatus && activeToggles[cat.id] ? ( // Check general isUpdatingStatus and specific toggle
                         <Spinner size="sm"/>
                     ) : (
                        <Switch
                            label=""
                            checked={cat.is_active}
                            onChange={(e) => handleStatusToggle(cat, e.target.checked)}
                            id={`switch-status-${cat.id}`} // Unique ID
                        />
                     )}
                 </div>
            )
        },
        {
            key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
            render: (cat) => (
                <div className="flex justify-center items-center gap-1">
                    <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenEditModal(cat)} title="تعديل"> <Edit size={16} /> </Button>
                    <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(cat)} title="حذف"> <Trash2 size={16} /> </Button>
                </div>
            )
        },
    ], [activeToggles, isUpdatingStatus]); // Added isUpdatingStatus to deps


    // --- Toolbar ---
    const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "إدارة القائمة" }, { label: "التصنيفات" }, ];
    const toolbarActions = (<Button onClick={handleOpenAddModal} icon={Plus}>إضافة تصنيف</Button>);

    return (
        <div className="space-y-4">
            <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
            {/* Global Alerts - Display general apiError and apiSuccess */}
            {apiError && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} />}
            {apiSuccess && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} />}


            <DataTable<Category>
                columns={columns}
                data={categories || []} // Ensure data is an array
                isLoading={isLoading}
                error={queryError ? (queryError as Error).message || "فشل تحميل التصنيفات" : null}
                emptyStateMessage="لم يتم إضافة أي تصنيفات بعد."
                rowKey="id"
            />

            {/* CREATE Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={handleCloseCreateModal}
                title="إضافة تصنيف جديد"
                size="lg"
                 footer={<>
                     <Button variant="secondary" onClick={handleCloseCreateModal} disabled={isCreating} icon={X}>إلغاء</Button>
                     <Button type="submit" form="category-create-form" variant="primary" isLoading={isCreating} disabled={isCreating} icon={Save}>إضافة التصنيف</Button>
                 </>}
            >
                 <form id="category-create-form" onSubmit={handleCreateFormSubmit} className="space-y-5">
                     {createApiError && <Alert variant="error" message={createApiError} className="mb-4" onClose={() => setCreateApiError(null)}/>}
                     <Input label="اسم التصنيف *" name="name" value={createFormData.name} onChange={handleCreateChange} required placeholder="مثال: مقبلات، مشروبات..." disabled={isCreating} />
                     <TextArea label="الوصف (اختياري)" name="description" value={createFormData.description || ''} onChange={handleCreateChange} rows={3} placeholder="وصف موجز يظهر للعميل أحياناً..." disabled={isCreating}/>
                      <FileUpload
                         label="صورة التصنيف (اختياري)"
                         id="category-image-create"
                         accept="image/png, image/jpeg, image/webp"
                         maxSizeMB={2}
                         currentImageUrl={null} // No current image for create
                         onFileSelect={handleCreateFileSelect}
                         onFileRemove={() => { setCreateImageFile(null); setCreateFormData(prev => ({...prev, image: null})); }}
                         disabled={isCreating}
                         onUrlSelect={() => {}}
                     />
                      <Switch
                         label="الحالة (فعال)"
                         name="is_active"
                         id="create-category-active"
                         checked={createFormData.is_active}
                         onChange={handleCreateSwitchChange}
                         disabled={isCreating}
                      />
                     <button type="submit" className="hidden"/> {/* For form submission via footer button */}
                 </form>
             </Modal>

            {/* EDIT Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                title={editingCategory ? `تعديل التصنيف: ${editingCategory.name}` : "تعديل التصنيف"}
                size="lg"
                 footer={<>
                     <Button variant="secondary" onClick={handleCloseEditModal} disabled={isUpdating} icon={X}>إلغاء</Button>
                     <Button type="submit" form="category-edit-form" variant="primary" isLoading={isUpdating} disabled={isUpdating} icon={Save}>حفظ التعديلات</Button>
                 </>}
            >
                 <form id="category-edit-form" onSubmit={handleEditFormSubmit} className="space-y-5">
                     {editApiError && <Alert variant="error" message={editApiError} className="mb-4" onClose={() => setEditApiError(null)} />}
                     <Input label="اسم التصنيف *" name="name" value={editFormData.name} onChange={handleEditChange} required placeholder="مثال: مقبلات، مشروبات..." disabled={isUpdating} />
                     <TextArea label="الوصف (اختياري)" name="description" value={editFormData.description || ''} onChange={handleEditChange} rows={3} placeholder="وصف موجز يظهر للعميل أحياناً..." disabled={isUpdating}/>
                      <FileUpload
                         label="صورة التصنيف (اختياري)"
                         id="category-image-edit"
                         accept="image/png, image/jpeg, image/webp"
                         maxSizeMB={2}
                         currentImageUrl={editFormData.current_image_url} // Pass current image URL for edit
                         onFileSelect={handleEditFileSelect}
                         onFileRemove={handleEditFileRemove} // Handles clearing current image and new file
                         disabled={isUpdating}
                         onUrlSelect={() => {}}
                     />
                      <Switch
                         label="الحالة (فعال)"
                         name="is_active"
                         id="edit-category-active"
                         checked={editFormData.is_active}
                         onChange={handleEditSwitchChange}
                         disabled={isUpdating}
                      />
                     <button type="submit" className="hidden"/> {/* For form submission via footer button */}
                 </form>
             </Modal>


            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف التصنيف" size="sm"
                 footer={<>
                     <Button variant="secondary" onClick={closeDeleteConfirm} disabled={isDeleting} icon={X}>إغلاق</Button>
                     <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting} disabled={isDeleting} icon={Trash2}>حذف</Button>
                 </>} >
                 <p className="text-sm text-gray-600"> هل أنت متأكد من حذف التصنيف "<strong>{showDeleteModal?.name}</strong>"؟ سيتم أيضاً إلغاء ربطه من جميع الأطباق المرتبطة به. </p>
                 {deleteApiError && <Alert variant="error" message={deleteApiError} className="mt-3" onClose={()=>setDeleteApiError(null)}/>}
            </Modal>
        </div>
    );
};

export default CategoriesPage;