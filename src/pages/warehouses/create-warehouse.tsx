// // src/pages/locations/AddWarehousePage.tsx
// import React, { useState, FormEvent, ChangeEvent } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import type { Warehouse, WarehouseFormData } from '../../types/warehouse';
// import { initialWarehouseFormData } from '../../types/warehouse';

// import { ArrowRight, Save, MapPin, Phone, User } from 'lucide-react';
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import Card from '../../components/ui/card';
// import Input from '../../components/ui/input';
// import Switch from '../../components/ui/switch';
// import TextArea from '../../components/ui/textarea';
// import Toolbar from '../../components/ui/toolbar';
// import { useMutationAction } from '../../hooks/queries-actions';
// // import { useAuth } from '../../hooks/useAuth';

// const AddWarehousePage: React.FC = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState<WarehouseFormData>(initialWarehouseFormData);
//     const [formError, setFormError] = useState<string | null>(null);
//     // const { shopId } = useAuth();

//     // --- API Mutation ---
//     const { mutateAsync: createWarehouse, isLoading } = useMutationAction<Warehouse, Partial<WarehouseFormData>>({
//         url: 'warehouses',
//         method: 'POST',
//         key: ['warehouses'],
//     });

//     // --- Handlers ---
//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { /* ... (same as branch) ... */ };
//     const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => { /* ... (same as branch) ... */ };

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setFormError(null);
//         if (!formData.name) { setFormError("اسم المستودع مطلوب."); return; }

//         const payload: Partial<WarehouseFormData> = {
//             ...formData,
//             is_active: formData.is_active ? 1 : 0,
//             is_primary: formData.is_primary ? 1 : 0,
//             // TODO: shop_id: shopId
//         };

//         try {
//             await createWarehouse(payload, {
//                 onSuccess: () => {
//                     alert("تم إنشاء المستودع بنجاح!");
//                     navigate('/warehouses');
//                 },
//                 onError: (err: any) => setFormError(err.response?.data?.message || "فشل إنشاء المستودع."),
//             });
//         } catch (error) { setFormError("حدث خطأ غير متوقع."); }
//     };

//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "المواقع" }, { label: "المستودعات", href: "/warehouses" }, { label: "إضافة جديد" }, ];
//     const toolbarActions = ( <Link to="/warehouses"><Button variant="secondary" size="sm">العودة للمستودعات</Button></Link> );

//     return (
//         <div className="space-y-6 pb-10">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {formError && <Alert variant="error" message={formError} onClose={() => setFormError(null)} />}

//             <form onSubmit={handleSubmit}>
//                 <Card title="إضافة مستودع جديد" description="أدخل تفاصيل المستودع وموقعه ومعلومات التواصل.">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-4">
//                          <Input label="اسم المستودع *" name="name" value={formData.name} onChange={handleChange} required placeholder="مثال: المستودع الرئيسي، مخزن المواد الجافة" disabled={isLoading} />
//                          <Input label="مسؤول التواصل" name="contact_person" value={formData.contact_person || ''} onChange={handleChange} icon={User} disabled={isLoading}/>
//                          <Input label="هاتف التواصل" name="contact_phone" type="tel" value={formData.contact_phone || ''} onChange={handleChange} icon={Phone} dir="ltr" disabled={isLoading}/>

//                          {/* Address Fields */}
//                          <div className="md:col-span-2"><h4 className="text-sm font-medium text-gray-600 border-b pb-1 mb-3 mt-3">عنوان المستودع</h4></div>
//                          <Input label="العنوان (سطر 1)" name="address_line1" value={formData.address_line1 || ''} onChange={handleChange} disabled={isLoading} />
//                          <Input label="العنوان (سطر 2)" name="address_line2" value={formData.address_line2 || ''} onChange={handleChange} disabled={isLoading}/>
//                          <Input label="المدينة" name="city" value={formData.city || ''} onChange={handleChange} disabled={isLoading}/>
//                          <Input label="المنطقة/المقاطعة" name="state_province" value={formData.state_province || ''} onChange={handleChange} disabled={isLoading}/>
//                          <Input label="الرمز البريدي" name="postal_code" value={formData.postal_code || ''} onChange={handleChange} disabled={isLoading} dir="ltr" />
//                          <Input label="رمز الدولة" name="country_code" value={formData.country_code || 'SA'} onChange={handleChange} maxLength={2} placeholder="SA" className="ltr uppercase" dir="ltr" disabled={isLoading}/>

//                          <div className="md:col-span-2"><h4 className="text-sm font-medium text-gray-600 border-b pb-1 mb-3 mt-3">إعدادات وملاحظات</h4></div>
//                          <TextArea label="ملاحظات داخلية" name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} placeholder="أي تفاصيل إضافية حول المستودع (سعة، درجة حرارة...)" disabled={isLoading}/>

//                         <div className="flex flex-col gap-4">
//                              <Switch label="الحالة (نشط)" name="is_active" checked={formData.is_active} onChange={handleSwitchChange} disabled={isLoading}/>
//                              <Switch label="هل هو المستودع الرئيسي؟" name="is_primary" checked={formData.is_primary} onChange={handleSwitchChange} disabled={isLoading} description="المستودع الافتراضي للعمليات."/>
//                         </div>
//                     </div>

//                     {/* Form Actions */}
//                      <div className="mt-8 pt-5 border-t border-gray-200 flex justify-start gap-3">
//                         <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading} icon={Save} size="lg">حفظ المستودع</Button>
//                         <Button type="button" variant="secondary" onClick={() => navigate('/warehouses')} disabled={isLoading}>إلغاء</Button>
//                     </div>
//                 </Card>
//             </form>
//         </div>
//     );
// };

// export default AddWarehousePage;