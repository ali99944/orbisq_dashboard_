// src/pages/products/ProductsPage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product'; // Adjust
import { Plus, Edit, Trash2, Eye, CheckCircle, XCircle, ImageIcon } from 'lucide-react'; // Package for product

import { useAppSelector } from '../../hooks/redux'; // For currency
import Alert from '../../components/ui/alert';
import Button from '../../components/ui/button';
import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
import Modal from '../../components/ui/modal';
import Toolbar from '../../components/ui/toolbar';
import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
import { getImageLink } from '../../lib/storage';
import { ApiErrorWithMessage } from '../../types/error';

const ProductsPage: React.FC = () => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState<Product | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);
    const [activeToggles] = useState<Record<number, boolean>>({});
    const currency_info = useAppSelector(state => state.auth_store.portal?.shop.currency_info);
    const currencyIcon = currency_info?.currency_code || 'ج.م';

    // --- Data Fetching ---
    const { data: products, isLoading, error } = useGetQuery<Product[]>({
        key: ['products'],
        url: 'products?include=product_category,tax,discount', // Eager load relations
    });

    console.log(products);
    

    // --- Mutations ---
    const { mutateAsync: deleteProduct, isPending: isDeleting } = useMutationAction({
        method: 'delete',
        url: ''
    });

    // --- Handlers ---
    const handleAdd = () => navigate('/products/create');
    const handleView = (id: number) => navigate(`/products/${id}`); // Navigate to details page
    const handleEdit = (id: number) => navigate(`/products/${id}/edit`); // Navigate to edit page
    const openDeleteConfirm = (product: Product) => setShowDeleteModal(product);
    const closeDeleteConfirm = () => setShowDeleteModal(null);

    const confirmDelete = async () => {
        await deleteProduct({}, {
            onSuccess() {

            },

            onError() {

            }
        })
    };
    const handleStatusToggle = async (product: Product, newStatus: boolean) => {
        console.log(product, newStatus);
        
    };


    // --- Table Columns ---
    const columns = useMemo((): ColumnDefinition<Product>[] => [
        {
            key: 'image', header: 'صورة', width: '80px',
            render: (p) => (
                <div className="w-10 h-10 rounded border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {p.image ? (
                        <img src={getImageLink(p.image)} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                        <ImageIcon size={20} className="text-gray-300" />
                    )}
                </div>
            )
        },
        { key: 'name', header: 'اسم المنتج', cellClassName: 'font-medium text-gray-800', render: (p) => p.name },
        { key: 'product_category', header: 'التصنيف', render: (p) => p.product_category?.name || '-' },
        {
            key: 'price', header: 'السعر', cellClassName: 'text-sm',
            render: (p) => p.price ? `${parseFloat(String(p.price)).toFixed(2)} ${currencyIcon}` : (p.pricing_type === 'dynamic' ? 'ديناميكي' : '-')
        },
        { key: 'stock', header: 'المخزون', cellClassName: 'text-center', render: (p) => p.stock ?? '-' }, // Display stock
        {
            key: 'is_active', header: 'الحالة', cellClassName: 'w-[100px]',
            render: (p) => (
                <div className="flex justify-center items-center gap-1">
                    <Button variant="ghost" size="sm" className="p-1 text-green-600 hover:bg-green-50" onClick={() => handleStatusToggle(p, !activeToggles[p.id])} title="تفعيل/تعطيل">
                        { activeToggles[p.id] ? <CheckCircle size={16} className="text-green-500 mx-auto"/> : <XCircle size={16} className="text-gray-400 mx-auto"/> }
                    </Button>
                </div>
            )
        },
        {
            key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[130px]', // Wider for 3 buttons
            render: (p) => (
                <div className="flex justify-center items-center gap-1">
                    <Button variant="ghost" size="sm" className="p-1 text-gray-600 hover:bg-gray-100" onClick={() => handleView(p.id)} title="عرض التفاصيل"> <Eye size={16} /> </Button>
                    <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(p.id)} title="تعديل"> <Edit size={16} /> </Button>
                    <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(p)} title="حذف"> <Trash2 size={16} /> </Button>
                </div>
            )
        },
    ], [activeToggles, currencyIcon, handleEdit, handleView]); // Add currency dependency


    // --- Toolbar Config ---
    const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "المنتجات" }, ];
    const toolbarActions = (<Button onClick={handleAdd} icon={Plus}>إضافة منتج</Button>);

    return (
        <div className="space-y-4">
            <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
            {/* ... Alerts ... */}
            {apiError && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} />}
            {apiSuccess && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} />}

            <DataTable<Product>
                columns={columns}
                data={products ?? []}
                isLoading={isLoading}
                error={error ? (error as ApiErrorWithMessage).message || "فشل تحميل المنتجات" : null}
                emptyStateMessage="لم يتم إضافة أي منتجات بعد."
                rowKey="id"
            />

            {/* ... Delete Modal ... */}
             <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف المنتج" size="sm"
                footer={<>
                    <Button variant="secondary" onClick={closeDeleteConfirm}>إلغاء</Button>
                    <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting}>نعم، حذف</Button>
                </>}
            >
                 <p className="text-sm text-gray-600"> هل أنت متأكد من حذف المنتج "<strong>{showDeleteModal?.name}</strong>"؟ </p>
            </Modal>
        </div>
    );
};

export default ProductsPage;