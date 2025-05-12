// // src/pages/locations/AddBranchPage.tsx
// import React, { useState, FormEvent, ChangeEvent } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import type { Branch, BranchFormData } from '../../types/branch';
// import { initialBranchFormData } from '../../types/branch';

// import { ArrowRight, Save, MapPin, Phone, Mail } from 'lucide-react';
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import Card from '../../components/ui/card';
// import Input from '../../components/ui/input';
// import Switch from '../../components/ui/switch';
// import TextArea from '../../components/ui/textarea';
// import Toolbar from '../../components/ui/toolbar';
// import { useMutationAction } from '../../hooks/queries-actions';
// // Import useAuth hook or similar to get shop_id
// // import { useAuth } from '../../hooks/useAuth';

// const AddBranchPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState<BranchFormData>(initialBranchFormData);
//     const [formError, setFormError] = useState<string | null>(null);
//     // const { shopId } = useAuth(); // Get shopId

//     // --- API Mutation ---
//     const { mutateAsync: createBranch, isLoading } = useMutationAction<Branch, Partial<BranchFormData>>({ // Specify types
//         url: 'branches',
//         method: 'POST',
//         key: ['branches'], // Invalidate list on success
//     });

//     // --- Handlers ---
//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//         if (formError) setFormError(null);
//     };

//     const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, checked } = e.target;
//         setFormData(prev => ({ ...prev, [name as keyof BranchFormData]: checked }));
//         if (formError) setFormError(null);
//     };

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setFormError(null);

//         if (!formData.name) {
//             setFormError("اسم الفرع مطلوب.");
//             return;
//         }
//         // Add more validation...

//         // --- Prepare Payload ---
//         const payload: Partial<BranchFormData> = {
//             ...formData,
//             is_active: formData.is_active ? 1 : 0, // Send as 1/0 if needed
//             is_primary: formData.is_primary ? 1 : 0,
//             latitude: formData.latitude || null, // Send null if empty
//             longitude: formData.longitude || null,
//             // TODO: Add shop_id
//             // shop_id: shopId
//             // TODO: Handle operating_hours JSON serialization if needed
//         };

//         // --- API Call ---
//         try {
//             await createBranch(payload, {
//                 onSuccess: (response) => {
//                     alert("تم إنشاء الفرع بنجاح!"); // Replace with Alert/Toast
//                     navigate('/branches');
//                 },
//                 onError: (err: any) => {
//                      const message = err.response?.data?.message || "فشل إنشاء الفرع.";
//                     setFormError(message);
//                 },
//             });
//         } catch (error) {
//             setFormError("حدث خطأ غير متوقع.");
//         }
//     };

//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "المواقع" }, { label: "الفروع", href: "/branches" }, { label: "إضافة جديد" }, ];
//     const toolbarActions = ( <Link to="/branches"><Button variant="secondary" size="sm">العودة للفروع</Button></Link> );

//     return (
//         <div className="space-y-6 pb-10">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {formError && <Alert variant="error" message={formError} onClose={() => setFormError(null)} />}

//             <form onSubmit={handleSubmit}>
//                 <Card title="إضافة فرع جديد" description="أدخل تفاصيل الفرع والموقع ومعلومات الاتصال الخاصة به.">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-4">
//                         <Input label="اسم الفرع *" name="name" value={formData.name} onChange={handleChange} required placeholder="مثال: فرع العليا، الفرع الرئيسي" disabled={isLoading} />
//                          <Input label="الهاتف" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} icon={Phone} dir="ltr" disabled={isLoading}/>
//                          <Input label="البريد الإلكتروني" name="email" type="email" value={formData.email || ''} onChange={handleChange} icon={Mail} dir="ltr" disabled={isLoading}/>

//                          {/* Address Fields */}
//                          <div className="md:col-span-2"><h4 className="text-sm font-medium text-gray-600 border-b pb-1 mb-3">العنوان</h4></div>
//                          <Input label="العنوان (سطر 1)" name="address_line1" value={formData.address_line1 || ''} onChange={handleChange} placeholder="مثال: 123 شارع الأمير محمد" disabled={isLoading} />
//                          <Input label="العنوان (سطر 2)" name="address_line2" value={formData.address_line2 || ''} onChange={handleChange} placeholder="مثال: الدور 2، مكتب 5" disabled={isLoading}/>
//                          <Input label="المدينة" name="city" value={formData.city || ''} onChange={handleChange} placeholder="مثال: الرياض" disabled={isLoading}/>
//                          <Input label="المنطقة/المقاطعة" name="state_province" value={formData.state_province || ''} onChange={handleChange} placeholder="مثال: منطقة الرياض" disabled={isLoading}/>
//                          <Input label="الرمز البريدي" name="postal_code" value={formData.postal_code || ''} onChange={handleChange} disabled={isLoading} dir="ltr" />
//                          <Input label="رمز الدولة" name="country_code" value={formData.country_code || 'SA'} onChange={handleChange} maxLength={2} placeholder="SA" className="ltr uppercase" dir="ltr" disabled={isLoading}/>


//                          {/* Location & Settings */}
//                           <div className="md:col-span-2"><h4 className="text-sm font-medium text-gray-600 border-b pb-1 mb-3 mt-3">إعدادات إضافية</h4></div>
//                           <Input label="خط العرض (Latitude)" name="latitude" type="number" step="any" value={formData.latitude || ''} onChange={handleChange} icon={MapPin} placeholder="e.g., 24.7136" disabled={isLoading} dir="ltr"/>
//                           <Input label="خط الطول (Longitude)" name="longitude" type="number" step="any" value={formData.longitude || ''} onChange={handleChange} icon={MapPin} placeholder="e.g., 46.6753" disabled={isLoading} dir="ltr"/>

//                          <TextArea label="ملاحظات داخلية" name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} placeholder="أي تفاصيل إضافية حول الفرع..." disabled={isLoading}/>

//                         {/* Operating Hours - Placeholder - Requires a dedicated component */}
//                         <div className="p-4 bg-gray-50 rounded-md border text-center text-sm text-gray-500">
//                             سيتم إضافة مكون مخصص لإدارة ساعات العمل هنا لاحقاً.
//                         </div>

//                          <div className="flex flex-col gap-4 md:col-span-2">
//                             <Switch label="الحالة (فعال)" name="is_active" checked={formData.is_active} onChange={handleSwitchChange} disabled={isLoading}/>
//                             <Switch label="هل هو الفرع الرئيسي؟" name="is_primary" checked={formData.is_primary} onChange={handleSwitchChange} disabled={isLoading} description="عادة يوجد فرع رئيسي واحد فقط للمطعم."/>
//                          </div>
//                     </div>

//                      {/* Form Actions */}
//                     <div className="mt-8 pt-5 border-t border-gray-200 flex justify-start gap-3">
//                         <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading} icon={Save}>حفظ الفرع</Button>
//                         <Button type="button" variant="secondary" onClick={() => navigate('/branches')} disabled={isLoading}>إلغاء</Button>
//                     </div>
//                 </Card>
//             </form>
//         </div>
//     );
// };

// export default AddBranchPage;