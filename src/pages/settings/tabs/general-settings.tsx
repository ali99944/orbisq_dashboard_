// // src/pages/settings/tabs/GeneralSettingsTab.tsx
// import React, { useState } from 'react';
// import type { ShopSettings, ShopSettingsFormData } from '../../../types/settings'; // Adjust path
// import { Save } from 'lucide-react';
// import Alert from '../../../components/ui/alert';
// import Button from '../../../components/ui/button';
// import Card from '../../../components/ui/card';
// import Input from '../../../components/ui/input';
// import { useMutationAction } from '../../../hooks/queries-actions';


// interface GeneralSettingsProps {
//     formData: ShopSettingsFormData;
//     handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
//     onSaveSuccess: () => void; // Callback to refetch or show global message
//     disabled?: boolean;
// }

// const GeneralSettingsTab: React.FC<GeneralSettingsProps> = ({ formData, handleChange, onSaveSuccess, disabled }) => {
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);

//     const { mutateAsync: saveGeneralSettings, isLoading } = useMutationAction<ShopSettings, Partial<ShopSettingsFormData>>({
//         url: 'shop/settings/general', // SPECIFIC endpoint for this section
//         method: 'PATCH', // Use PATCH for partial updates
//         key: ['shopSettings'], // Invalidate main settings query
//     });

//     const handleSave = async () => {
//         setError(null); setSuccess(null);
//         // Add specific validation if needed
//         const payload = {
//             label: formData.label, // Maybe not editable?
//             "web-uri": formData['web-uri'] || null,
//             "vat-number": formData['vat-number'] || null,
//             "call-center-number": formData['call-center-number'] || null,
//             "whatsapp-number": formData['whatsapp-number'] || null,
//             "vat-certificate-url": formData['vat-certificate-url'] || null,
//         };
//         try {
//             await saveGeneralSettings(payload, {
//                 onSuccess: () => { setSuccess("تم حفظ المعلومات العامة."); onSaveSuccess(); setTimeout(()=>setSuccess(null), 3000); },
//                 onError: (err: any) => setError(err.message || "فشل حفظ المعلومات العامة."),
//             });
//         } catch (e) { setError("حدث خطأ غير متوقع."); }
//     };

//     return (
//         <Card title="المعلومات العامة">
//             {error && <Alert variant="error" message={error} onClose={() => setError(null)} className="mb-4"/>}
//             {success && <Alert variant="success" message={success} onClose={() => setSuccess(null)} className="mb-4"/>}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                  <Input label="اسم المطعم المعروض" name="label_display" value={formData.label || ''} disabled />
//                  <Input label="الموقع الإلكتروني" name="web-uri" value={formData['web-uri'] || ''} onChange={handleChange} dir="ltr" disabled={disabled || isLoading}/>
//                  <Input label="الرقم الضريبي (VAT)" name="vat-number" value={formData['vat-number'] || ''} onChange={handleChange} dir="ltr" disabled={disabled || isLoading}/>
//                  <Input label="رقم مركز الاتصال" name="call-center-number" type="tel" value={formData['call-center-number'] || ''} onChange={handleChange} dir="ltr" disabled={disabled || isLoading}/>
//                  <Input label="رقم واتساب" name="whatsapp-number" type="tel" value={formData['whatsapp-number'] || ''} onChange={handleChange} dir="ltr" placeholder="+966..." disabled={disabled || isLoading}/>
//                  <Input label="رابط شهادة الضريبة (URL)" name="vat-certificate-url" type="url" value={formData['vat-certificate-url'] || ''} onChange={handleChange} dir="ltr" disabled={disabled || isLoading}/>
//             </div>
//              <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end">
//                  <Button onClick={handleSave} isLoading={isLoading} disabled={disabled || isLoading} icon={Save}>حفظ المعلومات العامة</Button>
//              </div>
//         </Card>
//     );
// };

// export default GeneralSettingsTab;