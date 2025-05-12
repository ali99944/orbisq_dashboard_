// // src/pages/inventory/InventoryItemsPage.tsx
// import React, { useState, useMemo } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Plus, Edit, Trash2, Package, Barcode, FileCode, Scale, User, Box } from 'lucide-react'; // Box for category
// import { useAppSelector } from '../../hooks/redux'; // For currency
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
// import Modal from '../../components/ui/modal';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
// import { InventoryItem } from '../../types/inventory-item';

// const InventoryItemsPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [showDeleteModal, setShowDeleteModal] = useState<InventoryItem | null>(null);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [apiSuccess, setApiSuccess] = useState<string | null>(null);
//     const { restaurant } = useAppSelector(state => state.auth_store);
//     const currencyIcon = restaurant?.currency_icon || 'ر.س';

//     // --- Data Fetching ---
//     const { data: itemsResponse, isLoading, error, refetch } = useGetQuery<{ data: InventoryItem[] }>({
//         key: ['inventoryItems'],
//         url: 'inventory-items?include=supplier,category', // Example include
//     });
//     const inventoryItems = itemsResponse?.data || [];

//     // --- Mutations ---
//     const { mutateAsync: deleteItem, isLoading: isDeleting } = useMutationAction({ method: 'DELETE' });

//     // --- Handlers ---
//     const handleAdd = () => navigate('/inventory/items/new');
//     const handleEdit = (id: number) => navigate(`/inventory/items/${id}/edit`);
//     const openDeleteConfirm = (item: InventoryItem) => setShowDeleteModal(item);
//     const closeDeleteConfirm = () => setShowDeleteModal(null);
//     const confirmDelete = async () => { /* ... */ }; // Similar delete logic

//     // --- Table Columns ---
//     const columns = useMemo((): ColumnDefinition<InventoryItem>[] => [
//         { key: 'name', header: 'اسم المكون', cellClassName: 'font-medium text-gray-800' },
//         { key: 'sku_number', header: 'SKU', cellClassName: 'text-xs font-mono text-gray-500', width: '120px' },
//         { key: 'storage_unit', header: 'وحدة التخزين', width: '100px'},
//         { key: 'recipe_unit', header: 'وحدة الوصفة', width: '100px' },
//         { key: 'stock', header: 'الرصيد الحالي', cellClassName: 'text-center font-medium', render: (i) => `${i.stock} ${i.storage_unit}`},
//         { key: 'price', header: 'سعر الوحدة (تخزين)', cellClassName: 'text-sm text-left', render: (i) => `${parseFloat(String(i.price)).toFixed(2)} ${currencyIcon}`},
//         { key: 'supplier', header: 'المورد', render: (i) => i.supplier?.name || '-' },
//         // { key: 'category', header: 'تصنيف المخزون', render: (i) => i.category?.name || '-' }, // Add if you have inventory categories
//         {
//             key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
//             render: (i) => (
//                 <div className="flex justify-center items-center gap-1">
//                     <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(i.id)} title="تعديل"> <Edit size={16} /> </Button>
//                     <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(i)} title="حذف"> <Trash2 size={16} /> </Button>
//                 </div>
//             )
//         },
//     ], [currencyIcon]);


//     // --- Toolbar ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "المخزون" }, { label: "المكونات والمواد" }, ];
//     const toolbarActions = (<Button onClick={handleAdd} icon={Plus}>إضافة مكون جديد</Button>);

//     return (
//         <div className="space-y-4">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {apiError && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} />}
//             {apiSuccess && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} />}

//              <DataTable<InventoryItem>
//                 columns={columns}
//                 data={inventoryItems}
//                 isLoading={isLoading}
//                 error={error ? (error as any).message || "فشل تحميل بيانات المخزون" : null}
//                 emptyStateMessage="لم يتم إضافة أي مكونات مخزون بعد."
//                 rowKey="id"
//             />

//             <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف المكون" size="sm"
//                 footer={<> /* Delete modal footer */ </>}
//             >
//                  <p className="text-sm text-gray-600"> هل أنت متأكد من حذف "<strong>{showDeleteModal?.name}</strong>"؟ </p>
//             </Modal>
//         </div>
//     );
// };

// export default InventoryItemsPage;