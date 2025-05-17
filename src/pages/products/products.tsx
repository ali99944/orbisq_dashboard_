// src/pages/products/ProductsPage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import type { Category } from '../../types/category';
import { Plus, Trash2, ImageIcon, DollarSign, PackagePlus, TrashIcon } from 'lucide-react';

import { useAppSelector } from '../../hooks/redux';
import Alert from '../../components/ui/alert';
import Button from '../../components/ui/button';
import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
import Modal from '../../components/ui/modal';
import Toolbar from '../../components/ui/toolbar';
import Switch from '../../components/ui/switch';
import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
import { getImageLink } from '../../lib/storage';
import { ApiErrorWithMessage } from '../../types/error';
import Input from '../../components/ui/input';
import Select from '../../components/ui/select';
import TextArea from '../../components/ui/textarea';
import FileUpload from '../../components/ui/file-upload';

const ProductsPage: React.FC = () => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState<Product | null>(null);
    const [showEditModal, setShowEditModal] = useState<Product | null>(null);
    const [showStatusModal, setShowStatusModal] = useState<{product: Product, newStatus: boolean} | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);
    const currency_info = useAppSelector(state => state.auth_store.portal?.shop.currency_info);
    const shop = useAppSelector(state => state.auth_store.portal?.shop);

    // Fetch categories for the select input
    const { data: categories } = useGetQuery<Category[]>({
        key: ['categories'],
        url: `shops/${shop?.id}/categories`,
    });
    const currencyIcon = currency_info?.currency_code || 'ج.م';

    // --- Data Fetching ---
    const { data: products, isLoading, error, refetch } = useGetQuery<Product[]>({
        key: ['products'],
        url: 'products?include=product_category,tax,discount',
    });

    // --- Mutations ---
    const { mutateAsync: updateProduct, isPending: isUpdating } = useMutationAction({
        method: 'put',
        url: `products/${showEditModal?.id}`,
        key: ['products'],
        contentType: 'multipart/form-data'
    });

    const { mutateAsync: deleteProduct, isPending: isDeleting } = useMutationAction({
        method: 'delete',
        url: 'products'
    });

    const { mutateAsync: updateProductStatus, isPending: isUpdatingStatus } = useMutationAction({
        method: 'patch',
        url: 'products'
    });

    // --- Handlers ---
    const handleAdd = () => navigate('/products/create');

    
    const openDeleteConfirm = (product: Product) => setShowDeleteModal(product);
    const openEditModal = (product: Product) => setShowEditModal(product);
    const closeEditModal = () => setShowEditModal(null);
    const closeDeleteConfirm = () => setShowDeleteModal(null);

    const openStatusModal = (product: Product, newStatus: boolean) => {
        setShowStatusModal({ product, newStatus });
    };
    const closeStatusModal = () => setShowStatusModal(null);

    const confirmDelete = async () => {
        if (!showDeleteModal) return;
        
        try {
            await deleteProduct({
                url: `products/${showDeleteModal.id}`
            });
            setApiSuccess(`تم حذف المنتج "${showDeleteModal.name}" بنجاح`);
            refetch();
            closeDeleteConfirm();
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "فشل حذف المنتج";
            setApiError(errorMsg);
        }
    };

    const confirmStatusUpdate = async () => {
        if (!showStatusModal) return;
        
        try {
            await updateProductStatus({
                url: `products/${showStatusModal.product.id}/status`,
                data: { is_active: showStatusModal.newStatus }
            });
            
            setApiSuccess(`تم ${showStatusModal.newStatus ? 'تفعيل' : 'تعطيل'} المنتج "${showStatusModal.product.name}" بنجاح`);
            refetch();
            closeStatusModal();
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "فشل تحديث حالة المنتج";
            setApiError(errorMsg);
        }
    };

    // --- Table Columns ---
    const columns = useMemo((): ColumnDefinition<Product>[] => [
        {
            key: 'image', header: 'صورة', width: '80px',
            render: (p) => (
                <div className="w-10 h-10 rounded border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {p.image ? (
                        <img src={getImageLink(p.image as string)} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                        <ImageIcon size={20} className="text-gray-300" />
                    )}
                </div>
            )
        },
        { 
            key: 'name', 
            header: 'اسم المنتج', 
            cellClassName: 'font-medium text-gray-800 cursor-pointer hover:text-primary', 
            render: (p) => (
                <div onClick={() => openEditModal(p)}>{p.name}</div>
            )
        },
        { 
            key: 'product_category', 
            header: 'التصنيف', 
            render: (p) => p.product_category?.name || '-' 
        },
        {
            key: 'price', 
            header: 'السعر', 
            cellClassName: 'text-sm',
            render: (p) => p.price ? `${parseFloat(String(p.price)).toFixed(2)} ${currencyIcon}` : (p.pricing_type === 'dynamic' ? 'ديناميكي' : '-')
        },
        {
            key: 'is_active', 
            header: 'الحالة', 
            cellClassName: 'w-[100px] text-center',
            render: (p) => (
                <div className="flex justify-center items-center">
                    <Switch 
                        checked={p.is_active || false}
                        onChange={() => openStatusModal(p, !p.is_active)}
                        disabled={isUpdatingStatus}
                        label=''
                    />
                </div>
            )
        },
        {
            key: 'actions', 
            header: 'إجراءات', 
            cellClassName: 'text-center w-[100px]',
            render: (p) => (
                <div className="flex justify-center items-center gap-1">
                    <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(p)} title="حذف">
                        <Trash2 size={16} />
                    </Button>
                </div>
            )
        },
    ], [currencyIcon, isUpdatingStatus]);

    // --- Toolbar Config ---
    const breadcrumbItems = [
        { label: "لوحة التحكم", href: "/" },
        { label: "المنتجات" }
    ];
    
    const toolbarActions = (
        <Button onClick={handleAdd} icon={Plus}>إضافة منتج</Button>
    );

    return (
        <div className="space-y-4">
            <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
            
            {apiError && (
                <Alert 
                    variant="error" 
                    message={apiError} 
                    onClose={() => setApiError(null)} 
                />
            )}
            
            {apiSuccess && (
                <Alert 
                    variant="success" 
                    message={apiSuccess} 
                    onClose={() => setApiSuccess(null)} 
                />
            )}

            <DataTable<Product>
                columns={columns}
                data={products ?? []}
                isLoading={isLoading}
                error={error ? (error as ApiErrorWithMessage).message || "فشل تحميل المنتجات" : null}
                emptyStateMessage="لم يتم إضافة أي منتجات بعد."
                rowKey="id"
            />

            {/* Edit Product Modal */}
            <Modal
                isOpen={!!showEditModal}
                onClose={closeEditModal}
                title="تعديل المنتج"
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={closeEditModal}>إلغاء</Button>
                        <Button
                            variant="primary"
                            onClick={async () => {
                                if (!showEditModal) return;
                                try {
                                    const formData = new FormData();
                                    formData.append('name', showEditModal.name);
                                    formData.append('description', showEditModal.description || '');
                                    formData.append('price', String(showEditModal.price));
                                    formData.append('product_category_id', String(showEditModal.product_category_id));
                                    formData.append('is_active', String(showEditModal.is_active));
                                    formData.append('modifiers', JSON.stringify(showEditModal.modifiers));
                                    
                                    if (showEditModal.image) {
                                        formData.append('image', showEditModal.image);
                                    }

                                    await updateProduct(formData);
                                    setApiSuccess(`تم تحديث المنتج "${showEditModal.name}" بنجاح`);
                                    refetch();
                                    closeEditModal();
                                } catch (error) {
                                    const errorMsg = error instanceof Error ? error.message : "فشل تحديث المنتج";
                                    setApiError(errorMsg);
                                }
                            }}
                            isLoading={isUpdating}
                        >
                            حفظ التغييرات
                        </Button>
                    </>
                }
            >
                {showEditModal && (
                    <div className="space-y-4">
                        <Input
                            label="اسم المنتج *"
                            value={showEditModal.name}
                            onChange={(e) => setShowEditModal(prev => prev ? {...prev, name: e.target.value} : null)}
                            required
                        />
                        <Select
                            label="التصنيف *"
                            value={String(showEditModal.product_category_id)}
                            onChange={(val) => setShowEditModal(prev => prev ? {...prev, product_category_id: +val} : null)}
                            options={categories?.map(cat => ({ value: String(cat.id), label: cat.name })) || []}
                        />
                        <TextArea
                            label="الوصف"
                            value={showEditModal.description || ''}
                            onChange={(e) => setShowEditModal(prev => prev ? {...prev, description: e.target.value} : null)}
                            rows={3}
                        />
                        <Input
                            label="السعر"
                            type="number"
                            value={showEditModal.price || ''}
                            onChange={(e) => setShowEditModal(prev => prev ? {...prev, price: e.target.value} : null)}
                            min="0"
                            step="0.01"
                            icon={DollarSign}
                            suffix={currencyIcon}
                        />
                        <Switch
                            label="الحالة (فعال)"
                            checked={showEditModal.is_active}
                            onChange={(e) => setShowEditModal(prev => prev ? {...prev, is_active: e.target.checked} : null)}
                        />

                        <FileUpload 
                            id='image-upload'
                            label="الصورة"
                            currentImageUrl={
                                getImageLink(showEditModal.image as string)
                            }
                            maxSizeMB={5 * 1024 * 1024} // 5 MB
                            onFileSelect={(file) => {
                                // Handle file selection
                                if (file) {
                                    setShowEditModal(prev => prev ? {...prev, image: file} : null);
                                }
                            }}
                            onFileRemove={() => {
                                setShowEditModal(prev => prev ? {...prev, image: null} : null);
                            }}
                            onUrlSelect={(url) => {
                                // Handle URL selection if needed
                                if (url) {
                                    setShowEditModal(prev => prev ? {...prev, image: url} : null);
                                }
                            }}
                        />

<fieldset className="border border-gray-200 px-4 pt-3 pb-4 rounded-md bg-gray-50/50">
                    <legend className="text-sm font-medium text-gray-600 px-1">الإضافات (اختياري)</legend>
                    <div className="space-y-3 mt-2">
                        {showEditModal.modifiers.map((extra, index) => (
                            <div key={index} className="flex items-center gap-x-2">
                                <input
                                    type="text" 
                                    placeholder="اسم الإضافة (مثل: جبنة إضافية)" 
                                    aria-label={`Extra ${index + 1} name`}
                                    value={extra.name} 
                                    onChange={(e) => {
                                        const updatedModifiers = [...showEditModal.modifiers];
                                        updatedModifiers[index] = {
                                            ...updatedModifiers[index],
                                            name: e.target.value
                                        };
                                        setShowEditModal(prev => prev ? {...prev, modifiers: updatedModifiers} : null);
                                    }}
                                    className="flex-grow border-gray-300 border px-3 py-2 rounded-md text-sm focus:border-[#A70000] focus:ring-1 focus:ring-[#A70000]"
                                />
                                <input
                                    type="number" 
                                    placeholder="السعر" 
                                    step="0.01" 
                                    min="0" 
                                    aria-label={`Extra ${index + 1} price`}
                                    value={extra.price_adjustment ?? 0}
                                    onChange={(e) => {
                                        const updatedModifiers = [...showEditModal.modifiers];
                                        updatedModifiers[index] = {
                                            ...updatedModifiers[index],
                                            price_adjustment: parseFloat(e.target.value)
                                        };
                                        setShowEditModal(prev => prev ? {...prev, modifiers: updatedModifiers} : null);
                                    }}
                                    className="w-28 border-gray-300 border px-3 py-2 rounded-md text-sm focus:border-[#A70000] focus:ring-1 focus:ring-[#A70000]"
                                />
                                <button
                                    type="button" 
                                    onClick={() => {
                                        const updatedModifiers = showEditModal.modifiers.filter((_, i) => i !== index);
                                        setShowEditModal(prev => prev ? {...prev, modifiers: updatedModifiers} : null);
                                    }}
                                    title="إزالة الإضافة"
                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button 
                        type="button" 
                        onClick={() => {
                            const updatedModifiers = [...showEditModal.modifiers, {
                                name: '',
                                price_adjustment: null
                            }];
                            setShowEditModal(prev => prev ? {...prev, modifiers: updatedModifiers} : null);
                        }}
                        className="text-sm text-[#A70000] hover:text-[#13425a] font-medium flex items-center mt-3 transition-colors"
                    >
                        <PackagePlus className="w-4 h-4 mr-1" /> إضافة اختيار إضافي
                    </button>
                </fieldset>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal 
                isOpen={!!showDeleteModal} 
                onClose={closeDeleteConfirm} 
                title="تأكيد حذف المنتج" 
                size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={closeDeleteConfirm}>إلغاء</Button>
                        <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting}>نعم، حذف</Button>
                    </>
                }
            >
                <p className="text-sm text-gray-600">
                    هل أنت متأكد من حذف المنتج "<strong>{showDeleteModal?.name}</strong>"؟
                </p>
            </Modal>

            {/* Status Update Modal */}
            <Modal
                isOpen={!!showStatusModal}
                onClose={closeStatusModal}
                title={`تأكيد ${showStatusModal?.newStatus ? 'تفعيل' : 'تعطيل'} المنتج`}
                size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={closeStatusModal}>إلغاء</Button>
                        <Button 
                            variant={showStatusModal?.newStatus ? "primary" : "warning"}
                            onClick={confirmStatusUpdate} 
                            isLoading={isUpdatingStatus}
                        >
                            {showStatusModal?.newStatus ? 'تفعيل' : 'تعطيل'}
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-gray-600">
                    هل أنت متأكد من {showStatusModal?.newStatus ? 'تفعيل' : 'تعطيل'} المنتج "
                    <strong>{showStatusModal?.product.name}</strong>"؟
                </p>
            </Modal>
        </div>
    );
};

export default ProductsPage;