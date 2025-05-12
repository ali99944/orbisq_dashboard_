// // src/pages/settings/tabs/LocalizationSettingsTab.tsx
// import React, { useState } from 'react';
// import type { ShopSettings, ShopSettingsFormData } from '../../../types/settings';
// import { Save } from 'lucide-react';
// import Alert from '../../../components/ui/alert';
// import Button from '../../../components/ui/button';
// import Card from '../../../components/ui/card';
// import Input from '../../../components/ui/input';
// import Select from '../../../components/ui/select';
// import { useMutationAction } from '../../../hooks/queries-actions';


// interface LocalizationSettingsProps {
//     formData: ShopSettingsFormData;
//     handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//     onSaveSuccess: () => void;
//     disabled?: boolean;
// }

// const LocalizationSettingsTab: React.FC<LocalizationSettingsProps> = ({ formData, handleChange, onSaveSuccess, disabled }) => {
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);

//     const { mutateAsync: saveLocalization, isLoading } = useMutationAction<ShopSettings, Partial<ShopSettingsFormData>>({
//         url: 'shop/settings/localization', // Specific endpoint
//         method: 'PATCH',
//         key: ['shopSettings'],
//     });

//     const handleSave = async () => {
//         setError(null); setSuccess(null);
//          const payload = {
//              country: formData.country,
//              "primary-language": formData['primary-language'],
//              "secondary-language": formData['secondary-language'] || null,
//              "currency-code": formData['currency-code'],
//              "currency-symbol": formData['currency-symbol'],
//              "currency-format": formData['currency-format'],
//              "rounding-mode": formData['rounding-mode'],
//              "decimal-places": formData['decimal-places'] ? parseInt(String(formData['decimal-places']), 10) : 0,
//              "default-timezone": formData['default-timezone'],
//          };
//         try {
//             await saveLocalization(payload, {
//                 onSuccess: () => { setSuccess("تم حفظ إعدادات اللغة والعملة."); onSaveSuccess(); setTimeout(()=>setSuccess(null), 3000); },
//                 onError: (err: any) => setError(err.message || "فشل حفظ الإعدادات."),
//             });
//         } catch (e) { setError("حدث خطأ غير متوقع."); }
//     };

//     return (
//         <Card title="اللغة، العملة، والتنسيق">
//              {error && <Alert variant="error" message={error} onClose={() => setError(null)} className="mb-4"/>}
//              {success && <Alert variant="success" message={success} onClose={() => setSuccess(null)} className="mb-4"/>}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//                 <Input label="الدولة (Code)" name="country" value={formData.country || ''} onChange={handleChange} maxLength={2} className="uppercase ltr" dir="ltr" disabled={disabled || isLoading} />
//                 <Input label="اللغة الأساسية" name="primary-language" value={formData['primary-language'] || ''} onChange={handleChange} placeholder="ar-sa" disabled={disabled || isLoading}/>
//                 <Input label="اللغة الثانوية" name="secondary-language" value={formData['secondary-language'] || ''} onChange={handleChange} placeholder="en-us" disabled={disabled || isLoading}/>
//                 <Input label="رمز العملة (Code)" name="currency-code" value={formData['currency-code'] || ''} onChange={handleChange} maxLength={3} className="uppercase ltr" dir="ltr" disabled={disabled || isLoading}/>
//                 <Input label="رمز العملة (Symbol)" name="currency-symbol" value={formData['currency-symbol'] || ''} onChange={handleChange} disabled={disabled || isLoading}/>
//                 <Input label="صيغة عرض العملة" name="currency-format" value={formData['currency-format'] || ''} onChange={handleChange} placeholder="currency_symbol_amount" disabled={disabled || isLoading}/>
//                 <Select label="وضع التقريب" name="rounding-mode" value={formData['rounding-mode'] || 'none'} onChange={handleChange} disabled={disabled || isLoading}
//                     options={[ {value: 'none', label: 'بدون تقريب'}, {value: 'half_up', label: 'تقريب لأعلى (0.5+)'}, {value: 'half_down', label: 'تقريب لأسفل (0.5-)'} /* ... */ ]}
//                  />
//                 <Input label="عدد الخانات العشرية" name="decimal-places" type="number" min="0" max="4" value={formData['decimal-places'] || '0'} onChange={handleChange} disabled={disabled || isLoading}/>
//                  <Input label="المنطقة الزمنية" name="default-timezone" value={formData['default-timezone'] || ''} onChange={handleChange} placeholder="Asia/Riyadh أو Africa/Cairo" disabled={disabled || isLoading}/>
//                 {/* Display Currency Translations Read Only? */}
//             </div>
//              <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end">
//                  <Button onClick={handleSave} isLoading={isLoading} disabled={disabled || isLoading} icon={Save}>حفظ</Button>
//              </div>
//         </Card>
//     );
// };
// export default LocalizationSettingsTab;