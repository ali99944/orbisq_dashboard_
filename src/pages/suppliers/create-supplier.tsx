// // src/pages/suppliers/AddSupplierPage.tsx
// import React, { useState, FormEvent, ChangeEvent } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import type { Supplier, SupplierFormData } from '../../types/supplier'; // Adjust path
// import { initialSupplierFormData } from '../../types/supplier'; // Adjust path

// import { ArrowRight, Save, User, Phone, Mail, MapPin, Code, Building } from 'lucide-react';
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import Card from '../../components/ui/card';
// import Input from '../../components/ui/input';
// import TextArea from '../../components/ui/textarea';
// import Toolbar from '../../components/ui/toolbar';
// import { useMutationAction } from '../../hooks/queries-actions';

// const AddSupplierPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState<SupplierFormData>(initialSupplierFormData);
//     const [formError, setFormError] = useState<string | null>(null);
//     const [formSuccess, setFormSuccess] = useState<string | null>(null);
//     // const { shopId } = useAuth(); // Get shopId if suppliers are shop-specific

//     // --- API Mutation ---
//     const { mutateAsync: createSupplier, isLoading } = useMutationAction<Supplier, SupplierFormData>({ // Specify types
//         url: 'suppliers',
//         method: 'POST',
//         key: ['suppliers'], // Invalidate list on success
//     });

//     // --- Handlers ---
//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//          let processedValue = value;
//          if (name === 'code') {
//              // Optional: Allow only specific chars for code
//              processedValue = value.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
//          }
//         setFormData(prev => ({ ...prev, [name]: processedValue }));
//         if (formError) setFormError(null);
//         if (formSuccess) setFormSuccess(null);
//     };

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setFormError(null);
//         setFormSuccess(null);

//         // Basic Validation
//         if (!formData.name || !formData.code || !formData.contact_name || !formData.phone_number || !formData.email || !formData.address) {
//             setFormError("الرجاء تعبئة جميع الحقول المطلوبة.");
//             return;
//         }
//         // Add more specific validation (e.g., email format)

//         // --- Prepare Payload ---
//         const payload: SupplierFormData = {
//             ...formData,
//             // TODO: Add shop_id if needed
//             // shop_id: shopId
//         };

//         // --- API Call ---
//         try {
//             await createSupplier(payload, {
//                 onSuccess: (response) => {
//                     setFormSuccess(`تمت إضافة المورد "${response.data.name}" بنجاح!`);
//                     setFormData(initialSupplierFormData); // Reset form
//                     setTimeout(() => navigate('/suppliers'), 1500);
//                 },
//                 onError: (err: any) => {
//                     const message = err.response?.data?.message || err.response?.data?.errors?.[Object.keys(err.response.data.errors)[0]]?.[0] || "فشل إضافة المورد.";
//                     setFormError(message);
//                 },
//             });
//         } catch (error) {
//             setFormError("حدث خطأ غير متوقع.");
//         }
//     };

//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "الموردين", href: "/suppliers" }, { label: "إضافة جديد" }, ];
//     const toolbarActions = ( <Link to="/suppliers"><Button variant="secondary" size="sm">العودة للموردين</Button></Link> );

//     return (
//         <div className="space-y-6 pb-10">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />

//             {formError && <Alert variant="error" message={formError} onClose={() => setFormError(null)} />}
//             {formSuccess && <Alert variant="success" message={formSuccess} onClose={() => setFormSuccess(null)} />}

//             <form onSubmit={handleSubmit}>
//                 <Card title="إضافة مورد جديد" description="أدخل بيانات المورد ومعلومات التواصل الخاصة به.">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-4">
//                          <Input label="اسم المورد (الشركة) *" name="name" value={formData.name} onChange={handleChange} required placeholder="مثال: شركة الأغذية المتحدة" icon={Building} disabled={isLoading} />
//                          <Input label="كود المورد *" name="code" value={formData.code} onChange={handleChange} required placeholder="مثال: FOODCO-001" icon={Code} className="ltr font-mono" dir="ltr" disabled={isLoading} />
//                          <Input label="اسم مسؤول التواصل *" name="contact_name" value={formData.contact_name} onChange={handleChange} required placeholder="مثال: محمد علي" icon={User} disabled={isLoading} />
//                          <Input label="رقم الهاتف *" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} required icon={Phone} dir="ltr" disabled={isLoading}/>
//                          <Input label="البريد الإلكتروني *" name="email" type="email" value={formData.email} onChange={handleChange} required icon={Mail} dir="ltr" disabled={isLoading}/>
//                          {/* Address as TextArea */}
//                          <div className="md:col-span-2">
//                              <TextArea label="العنوان بالكامل *" name="address" value={formData.address} onChange={handleChange} required rows={3} placeholder="مثال: المنطقة الصناعية، شارع 5، مستودع رقم 10، جدة" icon={MapPin} disabled={isLoading}/>
//                          </div>
//                          {/* Add other fields like VAT number if needed */}
//                     </div>

//                      {/* Form Actions */}
//                     <div className="mt-8 pt-5 border-t border-gray-200 flex justify-start gap-2">
//                         <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading} icon={Save}>حفظ المورد</Button>
//                         <Button type="button" variant="secondary" onClick={() => navigate('/suppliers')} disabled={isLoading}>إلغاء</Button>
//                     </div>
//                 </Card>
//             </form>
//         </div>
//     );
// };

// export default AddSupplierPage;