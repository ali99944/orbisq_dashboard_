// // src/pages/inventory/AddInventoryItemPage.tsx
// import React, { useState, FormEvent, ChangeEvent, useMemo } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import type { Supplier } from '../../types/supplier'; // Import supplier type
// import { ArrowRight, Save, Package, Barcode, FileCode, Scale, Tag, DollarSign, User, Box, Truck, Info, ScanLine } from 'lucide-react'; // Added Truck for supplier
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import Card from '../../components/ui/card';
// import Input from '../../components/ui/input';
// import Select, { SelectOption } from '../../components/ui/select';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
// import { useAppSelector } from '../../hooks/redux';
// import { InventoryItemFormData, initialInventoryItemFormData, InventoryItem } from '../../types/inventory-item';

// const AddInventoryItemPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState<InventoryItemFormData>(initialInventoryItemFormData);
//     const [formError, setFormError] = useState<string | null>(null);
//     const [formSuccess, setFormSuccess] = useState<string | null>(null);
//     const { restaurant } = useAppSelector(state => state.auth_store);
//     const currencyIcon = restaurant?.currency_icon || 'ر.س';

//     // --- Fetch Suppliers for Select ---
//     const { data: suppliersData } = useGetQuery<{ data: Supplier[] }>({ queryKey: ['suppliers'], url: 'suppliers' });
//     const supplierOptions: SelectOption[] = useMemo(() =>
//         suppliersData?.data.map(s => ({ value: s.id, label: s.name })) || [],
//         [suppliersData]
//     );
//     // --- Fetch Inventory Categories if needed ---
//     // const { data: invCategoriesData } = useGetQuery...
//     // const invCategoryOptions: SelectOption[] = useMemo(...)

//     // --- Mutation ---
//     const { mutateAsync: createItem, isLoading } = useMutationAction<InventoryItem, Partial<InventoryItemFormData>>({
//         url: 'inventory-items',
//         method: 'POST',
//         key: ['inventoryItems'],
//     });

//     // --- Handlers ---
//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value, type } = e.target;
//         let processedValue: any = value;
//         if (type === 'number') { processedValue = value === '' ? '' : value; }
//         setFormData(prev => ({ ...prev, [name]: processedValue }));
//         if(formError) setFormError(null);
//         if(formSuccess) setFormSuccess(null);
//     };

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setFormError(null);
//         setFormSuccess(null);

//         // --- Validation ---
//          if (!formData.name || !formData.sku_number || !formData.storage_unit || !formData.recipe_unit || !formData.conversion_factor || !formData.price) {
//             setFormError("الرجاء تعبئة جميع الحقول الأساسية (الاسم، SKU، الوحدات، سعر التخزين، عامل التحويل).");
//             return;
//          }
//          const conversion = parseFloat(String(formData.conversion_factor));
//          if (isNaN(conversion) || conversion <= 0) {
//             setFormError("عامل التحويل يجب أن يكون رقماً موجباً."); return;
//          }
//          const price = parseFloat(String(formData.price));
//           if (isNaN(price) || price < 0) {
//              setFormError("سعر وحدة التخزين يجب أن يكون رقماً صالحاً."); return;
//           }
//           const stock = parseInt(String(formData.stock) || '0', 10);
//           const minStock = parseInt(String(formData.minimum_stock) || '0', 10);
//            if (isNaN(stock) || isNaN(minStock) || stock < 0 || minStock < 0) {
//               setFormError("قيم المخزون يجب أن تكون أرقاماً صحيحة غير سالبة."); return;
//            }
//         // --- End Validation ---

//         const payload = {
//             ...formData,
//             price: price,
//             conversion_factor: conversion,
//             stock: stock,
//             minimum_stock: formData.minimum_stock ? parseInt(String(formData.minimum_stock), 10) : 0,
//             maximum_stock: formData.maximum_stock ? parseInt(String(formData.maximum_stock), 10) : 0,
//             refill_level: formData.refill_level ? parseInt(String(formData.refill_level), 10) : 0,
//             supplier_id: formData.supplier_id || null,
//             inventory_category_id: formData.inventory_category_id || null,
//             // TODO: shop_id
//         };

//         try {
//             await createItem(payload, {
//                 onSuccess: (response) => {
//                     setFormSuccess(`تمت إضافة المكون "${response.data.name}" بنجاح!`);
//                     setFormData(initialInventoryItemFormData);
//                     setTimeout(() => navigate('/inventory/items'), 1500);
//                 },
//                  onError: (err: any) => setFormError(err.response?.data?.message || "فشل إضافة المكون."),
//             });
//         } catch (error) { setFormError("حدث خطأ غير متوقع."); }
//     };

//     // --- Toolbar ---
//      const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "المخزون" }, { label: "المكونات والمواد", href: "/inventory/items" }, { label: "إضافة جديد" }, ];
//      const toolbarActions = ( <Link to="/inventory/items"><Button variant="secondary" icon={ArrowRight} iconPosition="right" size="sm">العودة للمكونات</Button></Link> );


//     return (
//         <div className="space-y-6 pb-10">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {formError && <Alert variant="error" message={formError} onClose={() => setFormError(null)} />}
//             {formSuccess && <Alert variant="success" message={formSuccess} onClose={() => setFormSuccess(null)} />}

//             <form onSubmit={handleSubmit}>
//                 <Card title="إضافة مكون/مادة خام جديدة" description="أدخل تفاصيل العنصر، وحدات القياس، ومعلومات التوريد والمخزون.">
//                     {/* Grid for layout */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 mt-4">
//                          {/* Column 1 */}
//                          <div className="space-y-5">
//                              <Input label="اسم المكون/المادة *" name="name" value={formData.name} onChange={handleChange} required placeholder="مثال: طماطم، دقيق، صندوق تغليف" icon={Package} />
//                              <Input label="SKU (رقم تعريف المخزون) *" name="sku_number" value={formData.sku_number} onChange={handleChange} required placeholder="يجب أن يكون فريداً" icon={Barcode} />
//                              <Input label="الرمز المرجعي (اختياري)" name="reference_code" value={formData.reference_code || ''} onChange={handleChange} placeholder="كود داخلي أو من المورد" icon={FileCode} />
//                              <Input label="الباركود (اختياري)" name="barcode" value={formData.barcode || ''} onChange={handleChange} placeholder="امسح أو أدخل الباركود" icon={ScanLine}/>
//                          </div>

//                         {/* Column 2 */}
//                          <div className="space-y-5">
//                              <Input label="وحدة التخزين *" name="storage_unit" value={formData.storage_unit} onChange={handleChange} required placeholder="الوحدة التي تشتري بها (كيلو، صندوق، لتر)" icon={Scale} />
//                              <Input label="وحدة الوصفة *" name="recipe_unit" value={formData.recipe_unit} onChange={handleChange} required placeholder="الوحدة المستخدمة في الوصفات (جرام، مل، حبة)" icon={Scale} />
//                              <Input label="عامل التحويل *" name="conversion_factor" type="number" value={formData.conversion_factor} onChange={handleChange} required placeholder="كم وحدة وصفة في وحدة تخزين؟ (مثال: 1000)" min="0.001" step="any" icon={Info} />
//                             <Select label="المورد (اختياري)" name="supplier_id" value={formData.supplier_id || ''} onChange={handleChange} options={[{ value: '', label: '-- اختر المورد --' }, ...supplierOptions]} placeholder="-- اختر المورد --" disabled={!suppliersData} icon={Truck}/>
//                             {/* <Select label="تصنيف المخزون (اختياري)" name="inventory_category_id" ... /> */}
//                          </div>

//                         {/* Column 3 */}
//                          <div className="space-y-5">
//                              <Select label="نوع التسعير" name="pricing_type" value={formData.pricing_type} onChange={handleChange} required options={[{value: 'fixed', label: 'سعر ثابت'}, {value: 'dynamic', label: 'سعر ديناميكي'}]} />
//                              <Input label="سعر وحدة التخزين *" name="price" type="number" value={formData.price} onChange={handleChange} required placeholder="سعر الشراء لوحدة التخزين" min="0" step="0.01" icon={DollarSign} suffix={currencyIcon}/>
//                              <Input label="الرصيد الافتتاحي *" name="stock" type="number" value={formData.stock} onChange={handleChange} required placeholder="الكمية الحالية بالمخزن (بوحدة التخزين)" min="0" step="1" icon={Package} />
//                              <Input label="الحد الأدنى للمخزون" name="minimum_stock" type="number" value={formData.minimum_stock} onChange={handleChange} min="0" step="1" placeholder="0" icon={Info}/>
//                              <Input label="الحد الأقصى (اختياري)" name="maximum_stock" type="number" value={formData.maximum_stock} onChange={handleChange} min="0" step="1" placeholder="0" icon={Info}/>
//                              <Input label="نقطة إعادة الطلب" name="refill_level" type="number" value={formData.refill_level} onChange={handleChange} min="0" step="1" placeholder="0" icon={Info}/>
//                          </div>
//                     </div>
//                      {/* Form Actions */}
//                      <div className="mt-8 pt-5 border-t border-gray-200 flex justify-start gap-3">
//                          <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading} icon={Save} size="lg"> حفظ المكون </Button>
//                          <Button type="button" variant="secondary" onClick={() => navigate('/inventory/items')} disabled={isLoading}> إلغاء </Button>
//                      </div>
//                 </Card>
//             </form>
//         </div>
//     );
// };

// export default AddInventoryItemPage;