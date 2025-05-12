// // src/pages/settings/tabs/OperationsSettingsTab.tsx
// import React, { useState, ChangeEvent } from 'react';
// import type { ShopSettingsFormData, OpeningHourRule, ShopSettings } from '../../../types/settings'; // Adjust path
// import { Save, Clock, CalendarCheck2, Ban, ListOrdered, StickyNote, Settings } from 'lucide-react';
// import Alert from '../../../components/ui/alert';
// import Button from '../../../components/ui/button';
// import Card from '../../../components/ui/card';
// import Input from '../../../components/ui/input';
// import Select from '../../../components/ui/select';
// import Switch from '../../../components/ui/switch';
// import { useMutationAction } from '../../../hooks/queries-actions';

// interface OperationsSettingsProps {
//     formData: ShopSettingsFormData;
//     handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
//     handleSwitchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     handleMultiSelectChange: (e: React.ChangeEvent<HTMLSelectElement>, fieldName: keyof ShopSettingsFormData) => void;
//     parseOpeningHours: (jsonString?: string) => OpeningHourRule[]; // Pass parser
//     onSaveSuccess: () => void;
//     disabled?: boolean;
// }

// const OperationsSettingsTab: React.FC<OperationsSettingsProps> = ({
//     formData,
//     handleChange,
//     handleSwitchChange,
//     handleMultiSelectChange,
//     parseOpeningHours, // Receive parser
//     onSaveSuccess,
//     disabled
// }) => {
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);
//     // Local state for structured opening hours if needed by editor component
//     // const [structuredHours, setStructuredHours] = useState<OpeningHourRule[]>(parseOpeningHours(formData['default-opening-hours']));

//     const { mutateAsync: saveOperationSettings, isLoading } = useMutationAction<ShopSettings, Partial<ShopSettingsFormData>>({
//         url: 'shop/settings/operations', // Specific endpoint
//         method: 'PATCH',
//         key: ['shopSettings'],
//     });

//     const handleSave = async () => {
//         setError(null); setSuccess(null);
//         // TODO: Add specific validation for operations settings

//         // Prepare payload - potentially stringify structured hours if editor modifies it
//         // const openingHoursJson = JSON.stringify(structuredHours); // If using state for editor

//         const payload = {
//             "default-opening-hours": formData['default-opening-hours'], // Send original JSON or updated stringified version
//             "supported-order-types": formData['supported-order-types'],
//             "supported-payment-types": formData['supported-payment-types'],
//             "default-order-status-cash": formData['default-order-status-cash'],
//             "default-order-status-card": formData['default-order-status-card'],
//             "order-cancellation-time": formData['order-cancellation-time'] ? parseInt(String(formData['order-cancellation-time']), 10) : 0,
//             "cart-expiry-minutes": formData['cart-expiry-minutes'] ? parseInt(String(formData['cart-expiry-minutes']), 10) : null,
//             "order-display-id-config": formData['order-display-id-config'],
//             "allow-advance-order": formData['allow-advance-order'],
//             "max-days-allowed-in-advance-order": formData['allow-advance-order'] && formData['max-days-allowed-in-advance-order'] ? parseInt(String(formData['max-days-allowed-in-advance-order']), 10) : null,
//             "is-cart-notes-enabled": formData['is-cart-notes-enabled'],
//             "is-cart-items-notes-enabled": formData['is-cart-items-notes-enabled'],
//             "is-auto-close-orders-daily": formData['is-auto-close-orders-daily'],
//         };

//         try {
//             await saveOperationSettings(payload, {
//                 onSuccess: () => { setSuccess("تم حفظ إعدادات التشغيل."); onSaveSuccess(); setTimeout(() => setSuccess(null), 3000); },
//                 onError: (err: any) => setError(err.message || "فشل حفظ إعدادات التشغيل."),
//             });
//         } catch (e) { setError("حدث خطأ غير متوقع."); }
//     };


//     // Options for order/payment types (can be moved to constants)
//     const orderTypeOptions = [ { value: "deliver", label: "توصيل" }, { value: "pickup", label: "استلام" }, { value: "dine_in", label: "محلي (طاولة)" }];
//     const paymentTypeOptions = [ { value: "cash", label: "نقداً" }, { value: "card", label: "بطاقة (في المتجر)" }, { value: "card-on-delivery", label: "بطاقة عند التوصيل" }, { value: "online", label: "دفع إلكتروني" } ];
//     const orderStatusOptions = [ { value: "pending", label: "Pending (معلق)" }, { value: "posted", label: "Posted (مؤكد)" }, { value: "paid", label: "Paid (مدفوع)" }, /* Add more statuses */ ];


//     return (
//         <Card title="إعدادات التشغيل والطلبات">
//             {error && <Alert variant="error" message={error} onClose={() => setError(null)} className="mb-4" />}
//             {success && <Alert variant="success" message={success} onClose={() => setSuccess(null)} className="mb-4" />}

//             {/* Opening Hours Section */}
//             <div className="mb-6 pb-5 border-b border-gray-100">
//                 <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2"><Clock size={18} className="text-primary" /> ساعات العمل الافتراضية</h4>
//                  {/* Placeholder for OpeningHoursEditor component */}
//                 <div className="md:col-span-2 p-4 border rounded-md bg-gray-50 text-center text-sm text-gray-500">
//                     (مكون تعديل ساعات العمل التفصيلي سيوضع هنا) <br />
//                      <i className="text-xs">(JSON الحالي للعرض فقط): {formData['default-opening-hours']}</i>
//                 </div>
//                  {/* <OpeningHoursEditor
//                      value={structuredHours}
//                      onChange={setStructuredHours} // Update local state for editor
//                      disabled={disabled || isLoading}
//                  /> */}
//             </div>

//             {/* Order & Payment Types */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-5 border-b border-gray-100">
//                  <h4 className="text-md font-semibold text-gray-800 md:col-span-2 flex items-center gap-2"><ListOrdered size={18} className="text-primary" /> أنواع الطلبات والدفع</h4>
//                  {/* Use a proper multi-select component here */}
//                  <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">أنواع الطلبات المدعومة</label>
//                     <select multiple name="supported-order-types" value={formData['supported-order-types'] || []} onChange={(e) => handleMultiSelectChange(e, 'supported-order-types')} className="input-style !p-2 h-24" disabled={disabled || isLoading}>
//                          {orderTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//                     </select>
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">أنواع الدفع المدعومة</label>
//                      <select multiple name="supported-payment-types" value={formData['supported-payment-types'] || []} onChange={(e) => handleMultiSelectChange(e, 'supported-payment-types')} className="input-style !p-2 h-24" disabled={disabled || isLoading}>
//                          {paymentTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//                      </select>
//                 </div>
//                  {/* Add selects for pickup-payment-types and deliver-payment-types if needed */}
//             </div>

//             {/* Order Settings */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 pb-5 border-b border-gray-100">
//                  <h4 className="text-md font-semibold text-gray-800 md:col-span-2 lg:col-span-3 flex items-center gap-2"><Settings size={18} className="text-primary" /> إعدادات الطلبات</h4>

//                 <Select label="حالة الطلب الافتراضية (نقداً)" name="default-order-status-cash" value={formData['default-order-status-cash'] || ''} onChange={handleChange} options={orderStatusOptions} disabled={disabled || isLoading}/>
//                 <Select label="حالة الطلب الافتراضية (بطاقة)" name="default-order-status-card" value={formData['default-order-status-card'] || ''} onChange={handleChange} options={orderStatusOptions} disabled={disabled || isLoading}/>
//                 <Input label="وقت إلغاء الطلب (دقائق)" name="order-cancellation-time" type="number" min="0" value={formData['order-cancellation-time'] || '5'} onChange={handleChange} icon={Ban} size="sm" disabled={disabled || isLoading}/>
//                 <Input label="وقت صلاحية السلة (دقائق)" name="cart-expiry-minutes" type="number" min="1" value={formData['cart-expiry-minutes'] || ''} onChange={handleChange} placeholder="لا يوجد انتهاء تلقائي" icon={Clock} size="sm" disabled={disabled || isLoading}/>
//                 <Input label="صيغة عرض رقم الطلب" name="order-display-id-config" value={formData['order-display-id-config'] || ''} onChange={handleChange} placeholder="{id} أو INV-{id}" className="ltr" dir="ltr" size="sm" disabled={disabled || isLoading}/>

//                 <Switch label="السماح بالطلب المسبق" name="allow-advance-order" checked={formData['allow-advance-order'] || false} onChange={handleSwitchChange} disabled={disabled || isLoading}/>
//                  {formData['allow-advance-order'] && <Input label="أقصى أيام للطلب المسبق" name="max-days-allowed-in-advance-order" type="number" min="1" value={formData['max-days-allowed-in-advance-order'] || ''} onChange={handleChange} icon={CalendarCheck2} size="sm" disabled={disabled || isLoading}/>}
//                 <Switch label="تفعيل ملاحظات السلة" name="is-cart-notes-enabled" checked={Boolean(Number(formData['is-cart-notes-enabled']))} onChange={handleSwitchChange} disabled={disabled || isLoading}/>
//                 <Switch label="تفعيل ملاحظات الأصناف" name="is-cart-items-notes-enabled" checked={Boolean(Number(formData['is-cart-items-notes-enabled']))} onChange={handleSwitchChange} disabled={disabled || isLoading}/>
//                  <Switch label="إغلاق الطلبات يومياً" description="إغلاق آلي للطلبات المفتوحة في نهاية اليوم" name="is-auto-close-orders-daily" checked={Boolean(Number(formData['is-auto-close-orders-daily']))} onChange={handleSwitchChange} disabled={disabled || isLoading}/>

//              </div>

//             {/* Save Button */}
//             <div className="flex justify-end">
//                 <Button onClick={handleSave} isLoading={isLoading} disabled={disabled || isLoading} icon={Save}>حفظ إعدادات التشغيل</Button>
//             </div>
//         </Card>
//     );
// };
// export default OperationsSettingsTab;