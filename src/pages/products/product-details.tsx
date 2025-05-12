// src/pages/products/ProductDetailsPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';

import { Edit, Barcode, FileCode, Package, Tag } from 'lucide-react';
import { useAppSelector } from '../../hooks/redux';
import Alert from '../../components/ui/alert';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import Spinner from '../../components/ui/spinner';
import Toolbar from '../../components/ui/toolbar';
import { useGetQuery } from '../../hooks/queries-actions';
import { getImageLink } from '../../lib/storage';

// --- Helper Function to Format Price/Value ---
const formatDisplayValue = (value: number | string | null | undefined, type: 'currency' | 'percent' | 'number' | 'minutes' = 'number', currencyIcon = 'ر.س') => {
     if (value === null || value === undefined || value === '') return <span className="text-gray-400">-</span>;
     const num = parseFloat(String(value));
     if (isNaN(num)) return <span className="text-gray-400">-</span>;
     switch(type){
         case 'currency': return `${num.toFixed(2)} ${currencyIcon}`;
         case 'percent': return `${num.toFixed(2)}%`;
         case 'minutes': return `${num} دقيقة`;
         default: return String(num);
     }
 };


const ProductDetailsPage: React.FC = () => {
    const { id: productId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const currency_info = useAppSelector(state => state.auth_store.portal?.shop.currency_info);
    const currencyIcon = currency_info?.currency_code || 'ج.م';

    // State for modals

    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);

    // --- Fetch Product Data ---
    const { data: productResponse, isLoading, error } = useGetQuery<Product>({
        key: ['productDetails', productId],
        url: `products/${productId}?include=product_category,tax,discount,recipe_items.inventory_item`, // Eager load everything needed
        options: {
            enabled: !!productId
        }
    });
    const product = productResponse as unknown as Product;
    console.log(product);
    
    // --- Render ---
    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" message="جاري تحميل تفاصيل المنتج..." /></div>;
    if (error || !product) return <Alert variant="error" title="خطأ" message={(error as Error)?.message || "لم يتم العثور على المنتج."} />;

    // --- Toolbar ---
     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "المنتجات", href: "/products" }, { label: product.name }, ];
     const toolbarActions = (<></>);

    return (
        <div className="space-y-6 pb-10">
            <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />

            {/* Display Alerts */}
            {apiError && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} />}
            {apiSuccess && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} />}


             {/* --- Product Header Card --- */}
             <Card className="!p-0 overflow-visible"> {/* Remove padding, allow overflow for image */}
                <div className="flex flex-col md:flex-row gap-6 p-4 items-start">
                    {/* Image */}
                    <div className="flex-shrink-0 w-full md:w-40 h-40 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                         {product.image ? (
                            <img src={getImageLink(product.image)} alt={product.name} className="w-full h-full object-cover"/>
                         ) : (
                             <Package size={48} className="text-gray-300" />
                         )}
                     </div>
                     {/* Details */}
                     <div className="flex-grow space-y-2">
                         <div className="flex justify-between items-center">
                             <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                                 {product.is_active ? 'فعال' : 'غير فعال'}
                             </span>
                         </div>
                         <p className="text-sm text-gray-600">{product.description || <span className="italic">لا يوجد وصف.</span>}</p>
                         <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 pt-2">
                             <span className="flex items-center gap-1"><Tag size={14}/> <strong>التصنيف:</strong> {product.product_category?.name || '-'}</span>
                             <span className="flex items-center gap-1"><FileCode size={14}/> <strong>الرمز المرجعي:</strong> {product.reference_code || '-'}</span>
                              <span className="flex items-center gap-1"><Barcode size={14}/> <strong>SKU:</strong> {product.sku_number || '-'}</span>
                         </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><Package size={14}/> <strong>المخزون:</strong> {formatDisplayValue(product.stock)}</span>
                         </div>
                     </div>
                </div>
             </Card>


             {/* --- Cards for Pricing, Tax, Discount, Recipe --- */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                 {/* Pricing Card */}
                 <Card title="التسعير">
                 <div className="flex justify-between"> <span className="text-gray-500">السعر:</span> <span className="font-medium">{formatDisplayValue(product.price, 'currency', currencyIcon)}</span> </div>

                     {/* Edit button could link to the main edit page or a specific pricing modal */}
                     <div className="mt-4 pt-3 border-t flex justify-end"> <Button variant="secondary" size="sm" icon={Edit} onClick={() => navigate(`/products/${productId}/edit#pricing`)}>تعديل</Button> </div>
                 </Card>

             </div>
        </div> // End Page Container
    );
};

export default ProductDetailsPage;