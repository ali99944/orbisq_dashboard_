// src/pages/products/AddProductPage.tsx
import React, { useState, FormEvent, ChangeEvent, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Product, ProductFormData } from '../../types/product';
import { initialProductFormData } from '../../types/product';

import { Save, DollarSign } from 'lucide-react'; // More icons
import Alert from '../../components/ui/alert';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import FileUpload from '../../components/ui/file-upload';
import Input from '../../components/ui/input';
import Select, { SelectOption } from '../../components/ui/select';
import Switch from '../../components/ui/switch';
import TextArea from '../../components/ui/textarea';
import Toolbar from '../../components/ui/toolbar';
import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
import { Category } from '../../types/category';
import { AxiosError } from 'axios';
import { ApiErrorWithMessage } from '../../types/error';

const AddProductPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ProductFormData>(initialProductFormData);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    // --- Fetch related data for Selects ---
    const { data: categoriesData } = useGetQuery<Category[]>({ key: ['productCategories'], url: 'shops/1/categories' }); // Fetch only active
    // --- Prepare options for Select components ---
    const categoryOptions: SelectOption[] = useMemo(() =>
        categoriesData?.map(cat => ({ value: cat.id.toString(), label: cat.name })) || [],
        [categoriesData]
    );


    // --- Mutation ---
    const { mutateAsync: createProduct, isPending: isLoading } = useMutationAction<Product, FormData>({ // Send FormData
        url: 'products',
        method: 'post',
        key: ['products'],
        contentType: 'multipart/form-data'
    });

    // --- Handlers ---
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let processedValue: unknown = value;
        if (type === 'number') { processedValue = value === '' ? '' : value; }
        setFormData(prev => ({ ...prev, [name]: processedValue }));
        if(formError) setFormError(null);
        if(formSuccess) setFormSuccess(null);
    };
    const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
         const { name, checked } = e.target;
         // Handle nested vs direct boolean
        setFormData(prev => ({ ...prev, [name as keyof ProductFormData]: checked }));
         if(formError) setFormError(null);
         if(formSuccess) setFormSuccess(null);
    };
    const handleFileSelect = (file: File | null) => { setImageFile(file); if(formError) setFormError(null); };
    const handleUrlSelect = (url: string | null) => {
        console.log(url);
        
        console.warn("URL select not directly supported for product creation via FormData, use file upload.");
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        if (!formData.name || !formData.product_category_id) {
             setFormError("اسم المنتج والتصنيف حقول مطلوبة.");
             return;
        }
         if (formData.pricing_type === 'fixed' && (formData.price === '' || formData.price === null)) {
             setFormError("السعر مطلوب عندما يكون نوع التسعير 'ثابت'.");
             return;
         }
          // Add more validation...

        const submissionData = new FormData();

        // Append all form data fields
        Object.keys(formData).forEach(key => {
             const formKey = key as keyof ProductFormData;
             const value = formData[formKey];

             if (value !== null && value !== undefined && value !== '') {
                  // Convert boolean to 1/0 for FormData
                 const processedValue = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
                 submissionData.append(key, processedValue);
             }
        });

         // Append the image file if selected
        if (imageFile) {
            submissionData.append('image', imageFile);
        }

        try {
            await createProduct(submissionData, { // Pass FormData
                onSuccess: (response) => {
                    setFormSuccess(`تمت إضافة المنتج "${response.name}" بنجاح!`);
                    setFormData(initialProductFormData);
                    setImageFile(null); // Clear file state
                     setTimeout(() => navigate('/products'), 1500);
                },
                onError: (err: AxiosError) => {
                     const message = (err.response?.data as ApiErrorWithMessage)?.message || "فشل إضافة المنتج.";
                     setFormError(message);
                 },
            });
        } catch (error) {
            console.log(error);
            
            setFormError("حدث خطأ غير متوقع.");
        }
    };

    // --- Toolbar ---
    const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "المنتجات", href: "/products" }, { label: "إضافة جديد" }, ];
    const toolbarActions = ( <Link to="/products"><Button variant="secondary" size="sm">العودة للمنتجات</Button></Link> );

    return (
        <div className="space-y-6 pb-10">
            <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
            {formError && <Alert variant="error" message={formError} onClose={() => setFormError(null)} />}
            {formSuccess && <Alert variant="success" message={formSuccess} onClose={() => setFormSuccess(null)} />}

            <form onSubmit={handleSubmit}>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     {/* Main Details Column */}
                     <div className="lg:col-span-2 space-y-6">
                         <Card title="المعلومات الأساسية للمنتج">
                            <div className="space-y-5 mt-4">
                                <Input label="اسم المنتج *" name="name" value={formData.name} onChange={handleChange} required disabled={isLoading} />
                                <Select label="التصنيف *" value={(formData.product_category_id ?? 0).toString()} onChange={() => {
                                    // setFormData(prev => ({ ...prev, product_category_id: val }));
                                }} options={categoryOptions} placeholder="-- اختر التصنيف --" />
                                <TextArea label="الوصف" name="description" value={formData.description || ''} onChange={handleChange} rows={3} disabled={isLoading}/>
                                <Input  label="السعر" name="price" type="number" value={formData.price || ''} onChange={handleChange} min="0" step="0.01" disabled={isLoading || formData.pricing_type === 'dynamic'} icon={DollarSign} size="sm" required={formData.pricing_type === 'fixed'} suffix={'ر.س'} />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                </div>
                            </div>
                         </Card>


                     </div>

                     {/* Right Column */}
                     <div className="lg:col-span-1 space-y-6">
                         <Card title="الصورة والحالة">
                             <div className="space-y-5 mt-4">
                                 <FileUpload label="صورة المنتج" id="product-image" onFileSelect={handleFileSelect} onUrlSelect={handleUrlSelect} accept="image/*" maxSizeMB={2} disabled={isLoading}/>
                                 <Switch label="الحالة (فعال)" name="is_active" checked={formData.is_active} onChange={handleSwitchChange} disabled={isLoading}/>
                                 {/* <Switch label="منتج تجزئة؟" name="is_retail" checked={formData.is_retail} onChange={handleSwitchChange} disabled={isLoading} description="هل هذا المنتج يباع كوحدة مستقلة (مثل علبة مشروب) وليس طبق يتم تحضيره؟"/> */}
                             </div>
                         </Card>
                         {/* <Card title="المعرفات (اختياري)">
                             <div className="space-y-5 mt-4">
                                 <Input label="رقم SKU" name="sku_number" value={formData.sku_number || ''} onChange={handleChange} icon={ScanLine} disabled={isLoading} size="sm"/>
                                 <Input label="الرمز المرجعي" name="reference_code" value={formData.reference_code || ''} onChange={handleChange} icon={FileCode} disabled={isLoading} size="sm"/>
                             </div>
                         </Card> */}
                     </div>
                 </div>

                 {/* Submit Actions */}
                 <div className="mt-8 pt-5 border-t border-gray-200 flex justify-start gap-3">
                    <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading} icon={Save} size="sm">حفظ المنتج</Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/products')} disabled={isLoading}>إلغاء</Button>
                </div>
            </form>
        </div>
    );
};

export default AddProductPage;