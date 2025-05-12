// // src/pages/settings/tabs/DeliverySettingsTab.tsx
// import React, { ChangeEvent, useState } from 'react';
// import type { ShopSettings, ShopSettingsFormData } from '../../../types/settings';
// import { Clock, Save } from 'lucide-react';
// import Alert from '../../../components/ui/alert';
// import Button from '../../../components/ui/button';
// import Card from '../../../components/ui/card';
// import Input from '../../../components/ui/input';
// import { useMutationAction } from '../../../hooks/queries-actions';


// interface DeliverySettingsProps {
//     formData: ShopSettingsFormData;
//     handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
//     onSaveSuccess: () => void;
//     disabled: boolean;
//     currencyIcon: string;
// }

// const DeliverySettingsTab: React.FC<DeliverySettingsProps> = ({ formData, handleChange, onSaveSuccess, disabled, currencyIcon }) => {
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);
//     const { mutateAsync: saveDeliverySettings, isLoading } = useMutationAction<ShopSettings, Partial<ShopSettingsFormData>>({
//         url: 'shop/settings/delivery', method: 'PATCH', key: ['shopSettings']
//     });

//     const handleSave = async () => {
//         setError(null); setSuccess(null);
//         const payload = { // Extract only delivery fields
//             "default-delivery-charge": formData['default-delivery-charge'] ? parseFloat(String(formData['default-delivery-charge'])) : null,
//              "default-promised-time-delta-delivery": formData['default-promised-time-delta-delivery'] ? parseInt(String(formData['default-promised-time-delta-delivery']), 10) : null,
//              // ... other delivery fields ...
//              "delivery-maximum-distance": formData['delivery-maximum-distance'] ? parseFloat(String(formData['delivery-maximum-distance'])) : null,
//         };
//         try {
//             await saveDeliverySettings(payload, {
//                 onSuccess: () => {
//                     setSuccess('تم حفظ التغيرات بنجاح');
//                     onSaveSuccess();
//                 },
//                 onError: (err) => { setError(err.message); }
//             });
//         } catch (e) { setError("..."); }
//     };

//     return (
//         <Card title="إعدادات التوصيل">
//              {error && <Alert variant="error" message={error} onClose={() => setError(null)} className="mb-4"/>}
//              {success && <Alert variant="success" message={success} onClose={() => setSuccess(null)} className="mb-4"/>}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//                 {/* --- Delivery Fields using Input --- */}
//                 <Input label="رسوم التوصيل الافتراضية" name="default-delivery-charge" type="number" min="0" step="any" value={formData['default-delivery-charge'] || ''} onChange={handleChange} suffix={currencyIcon} disabled={disabled || isLoading}/>
//                 <Input label="الوقت المتوقع (دقائق)" name="default-promised-time-delta-delivery" type="number" min="0" value={formData['default-promised-time-delta-delivery'] || ''} onChange={handleChange} icon={Clock} disabled={disabled || isLoading}/>
//                  {/* ... other inputs for min/max order, free delivery, per km, max distance, driver TTL ... */}
//                  <Input label="الحد الأدنى للطلب (توصيل)" name="minimum-order-amount-delivery" /* ...props... */ />
//                  <Input label="حد الطلب للتوصيل المجاني" name="minimum-order-amount-free-delivery" /* ...props... */ placeholder="اتركه فارغاً لعدم التفعيل"/>
//                  <Input label="رسوم التوصيل لكل كم" name="delivery-charge-per-km" /* ...props... */ placeholder="0 لتعطيل"/>
//                  <Input label="أقصى مسافة (كم)" name="delivery-maximum-distance" /* ...props... */ />
//                  <Input label="وقت تحديث موقع السائق (ث)" name="default-driver-location-ttl" /* ...props... */ />
//             </div>
//             <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end">
//                 <Button onClick={handleSave} isLoading={isLoading} disabled={disabled || isLoading} icon={Save}>حفظ إعدادات التوصيل</Button>
//             </div>
//         </Card>
//     );
// };
// export default DeliverySettingsTab;