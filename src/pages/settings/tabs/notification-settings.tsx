// // src/pages/settings/tabs/NotificationsSettingsTab.tsx
// import React, { useState, ChangeEvent } from 'react';
// import type { ShopSettingsFormData, MailSettings, ShopSettings } from '../../../types/settings';

// import { Save, Mail as MailIcon, Bell } from 'lucide-react';
// import Alert from '../../../components/ui/alert';
// import Button from '../../../components/ui/button';
// import Card from '../../../components/ui/card';
// import Input from '../../../components/ui/input';
// import Select from '../../../components/ui/select';
// import Switch from '../../../components/ui/switch';
// import { useMutationAction } from '../../../hooks/queries-actions';

// interface NotificationsSettingsProps {
//     formData: ShopSettingsFormData;
//     handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//     handleSwitchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     onSaveSuccess: () => void;
//     disabled?: boolean;
// }

// const NotificationsSettingsTab: React.FC<NotificationsSettingsProps> = ({
//     formData,
//     handleChange,
//     handleSwitchChange,
//     onSaveSuccess,
//     disabled
// }) => {
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);

//     // Use optional chaining for potentially missing nested objects
//     const mailSettings = formData.mail_settings || {};
//     const notificationsEnabled = formData.notifications_enabled ?? true; // Default to true if not set

//     const { mutateAsync: saveNotificationSettings, isLoading } = useMutationAction<ShopSettings, Partial<ShopSettingsFormData>>({
//         url: 'shop/settings/notifications', // Specific endpoint
//         method: 'PATCH',
//         key: ['shopSettings'],
//     });

//     const handleSave = async () => {
//         setError(null); setSuccess(null);
//         // Add specific validation for mail settings if driver is SMTP etc.
//         if (mailSettings.driver === 'smtp' && (!mailSettings.host || !mailSettings.port || !mailSettings.username || !mailSettings.password)) {
//             setError("لم يتم تعبئة جميع حقول SMTP المطلوبة.");
//             return;
//         }

//         const payload = {
//             notifications_enabled: notificationsEnabled,
//             mail_settings: { // Send nested object
//                 driver: mailSettings.driver,
//                 host: mailSettings.host || null, // Send null if empty
//                 port: mailSettings.port ? parseInt(String(mailSettings.port), 10) : null,
//                 username: mailSettings.username || null,
//                 password: mailSettings.password || null, // Consider security implications of sending password
//                 encryption: mailSettings.encryption || null,
//                 from_address: mailSettings.from_address,
//                 from_name: mailSettings.from_name,
//             },
//             "feedback-email": formData['feedback-email'] || null,
//             "alert-email": formData['alert-email'] || null,
//             "prompt-rating-seconds": formData['prompt-rating-seconds'] ? parseInt(String(formData['prompt-rating-seconds']), 10) : null,
//             "is-notification-center-enabled": formData['is-notification-center-enabled'] ?? false,
//         };

//         try {
//             await saveNotificationSettings(payload, {
//                 onSuccess: () => { setSuccess("تم حفظ إعدادات الإشعارات."); onSaveSuccess(); setTimeout(()=>setSuccess(null), 3000); },
//                 onError: (err: any) => setError(err.message || "فشل حفظ الإعدادات."),
//             });
//         } catch (e) { setError("حدث خطأ غير متوقع."); }
//     };

//     // Test Email Handler (Placeholder)
//     const handleTestEmail = async () => {
//         alert("TODO: Implement Test Email API Call using current settings");
//         // const testMutation = useMutationAction(...) - Point to a test email endpoint
//         // await testMutation.mutateAsync({ email_to: 'test@example.com' });
//     }

//     return (
//         <Card title="الإشعارات والتنبيهات">
//             {error && <Alert variant="error" message={error} onClose={() => setError(null)} className="mb-4"/>}
//             {success && <Alert variant="success" message={success} onClose={() => setSuccess(null)} className="mb-4"/>}

//             <div className="space-y-6 mt-4">
//                 {/* Master Email Toggle */}
//                  <Switch
//                     label="تفعيل إرسال رسائل البريد الإلكتروني"
//                     name="notifications_enabled" // Top level key
//                     checked={notificationsEnabled}
//                     onChange={handleSwitchChange} // Use the main handler
//                     description="التحكم الرئيسي في إرسال أي بريد إلكتروني من النظام (للعملاء أو للمطعم)."
//                     className="pb-4 border-b border-gray-100"
//                     disabled={disabled || isLoading}
//                  />

//                  {/* Email Configuration */}
//                  <div className={`space-y-5 ${!notificationsEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
//                      <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2"><MailIcon size={18} className="text-primary" /> إعدادات البريد الصادر</h4>
//                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <Input label="اسم المرسل *" name="mail_settings.from_name" value={mailSettings.from_name || ''} onChange={handleChange} required disabled={disabled || isLoading}/>
//                         <Input label="عنوان البريد المرسل *" name="mail_settings.from_address" type="email" value={mailSettings.from_address || ''} onChange={handleChange} required disabled={disabled || isLoading}/>
//                          <Select label="مزود الخدمة (Driver) *" name="mail_settings.driver" value={mailSettings.driver || 'log'} onChange={handleChange} required disabled={disabled || isLoading}
//                              options={[
//                                  { value: 'log', label: 'Log (للتجربة - لا يرسل)' },
//                                  { value: 'smtp', label: 'SMTP (يتطلب تعبئة الحقول أدناه)' },
//                                  // Add mailgun, ses etc. later if supported
//                              ]}
//                          />
//                      </div>

//                      {/* SMTP Settings (Conditional) */}
//                       {mailSettings.driver === 'smtp' && (
//                           <div className="border rounded-md p-4 mt-4 bg-gray-50/50 border-gray-200 space-y-5">
//                              <h5 className="text-sm font-medium text-gray-600 mb-1">إعدادات SMTP</h5>
//                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
//                                 <Input label="Host *" name="mail_settings.host" value={mailSettings.host || ''} onChange={handleChange} placeholder="e.g., smtp.mailgun.org" required disabled={disabled || isLoading}/>
//                                 <Input label="Port *" name="mail_settings.port" type="number" value={String(mailSettings.port || '')} onChange={handleChange} placeholder="e.g., 587" required disabled={disabled || isLoading}/>
//                                 <Input label="Username *" name="mail_settings.username" value={mailSettings.username || ''} onChange={handleChange} required disabled={disabled || isLoading}/>
//                                 <Input label="Password *" name="mail_settings.password" type="password" value={mailSettings.password || ''} onChange={handleChange} required disabled={disabled || isLoading}/>
//                                 <Select label="التشفير" name="mail_settings.encryption" value={mailSettings.encryption || ''} onChange={handleChange} disabled={disabled || isLoading}
//                                      options={[ { value: '', label: 'None' }, { value: 'tls', label: 'TLS' }, { value: 'ssl', label: 'SSL' }, ]}
//                                      placeholder="-- اختر --"
//                                  />
//                                 <div className="md:col-span-2 flex justify-end">
//                                      <Button variant="secondary" size="sm" type="button" onClick={handleTestEmail} disabled={disabled || isLoading}>
//                                           <MailIcon size={14} className="ml-1"/> إرسال بريد تجريبي
//                                      </Button>
//                                  </div>
//                              </div>
//                          </div>
//                      )}
//                  </div>

//                  {/* Other Notification Settings */}
//                  <div className="space-y-5 pt-5 border-t border-gray-100">
//                      <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2"><Bell size={18} className="text-primary" /> إعدادات تنبيهات أخرى</h4>
//                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <Input label="بريد استلام تقييمات العملاء" name="feedback-email" type="email" value={formData['feedback-email'] || ''} onChange={handleChange} disabled={disabled || isLoading}/>
//                         <Input label="بريد استلام تنبيهات النظام الهامة" name="alert-email" type="email" value={formData['alert-email'] || ''} onChange={handleChange} disabled={disabled || isLoading}/>
//                          <Input label="مهلة طلب التقييم (ثواني)" name="prompt-rating-seconds" type="number" min="0" value={formData['prompt-rating-seconds'] || ''} onChange={handleChange} placeholder="3600 (ساعة)" disabled={disabled || isLoading}/>
//                          <Switch label="تفعيل مركز الإشعارات الداخلي" name="is-notification-center-enabled" checked={formData['is-notification-center-enabled'] ?? false} onChange={handleSwitchChange} disabled={disabled || isLoading}/>
//                      </div>
//                  </div>

//             </div>

//             {/* Save Button */}
//             <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end">
//                 <Button onClick={handleSave} isLoading={isLoading} disabled={disabled || isLoading} icon={Save}>حفظ إعدادات الإشعارات</Button>
//             </div>
//         </Card>
//     );
// };
// export default NotificationsSettingsTab;