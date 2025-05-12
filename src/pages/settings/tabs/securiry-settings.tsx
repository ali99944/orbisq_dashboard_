// // src/pages/settings/tabs/SecuritySettingsTab.tsx
// import React, { useState, FormEvent, ChangeEvent } from 'react';
// import type { ShopSettings, ShopSettingsFormData } from '../../../types/settings'; // Adjust path if needed for props, though not directly used here
// import { Save, Lock, KeyRound } from 'lucide-react';
// import Alert from '../../../components/ui/alert';
// import Button from '../../../components/ui/button';
// import Card from '../../../components/ui/card';
// import Input from '../../../components/ui/input';
// import Spinner from '../../../components/ui/spinner';
// import Switch from '../../../components/ui/switch';
// import { useMutationAction } from '../../../hooks/queries-actions';

// // Interface specifically for password change payload
// interface ChangePasswordPayload {
//     current_password?: string; // Optional if backend doesn't require it for admin change
//     password: string;
//     password_confirmation: string;
// }
// // Interface for 2FA payload
// interface Toggle2FAPayload {
//      is_2fa_enabled: boolean;
// }

// interface SecuritySettingsProps {
//     // Need formData primarily for the 2FA switch's current state
//     formData: ShopSettingsFormData;
//     // Handler specifically for the 2FA switch in the main form data
//     handleSwitchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     onSaveSuccess: (message: string) => void; // Pass success message back
//     disabled?: boolean; // General disabled state from parent
// }

// const SecuritySettingsTab: React.FC<SecuritySettingsProps> = ({
//     formData,
//     handleSwitchChange, // Use this for the 2FA toggle
//     onSaveSuccess,
//     disabled
// }) => {
//     // Local state ONLY for the password change form
//     const [passwordData, setPasswordData] = useState({
//         current_password: '', // May not be needed depending on backend policy
//         password: '',
//         password_confirmation: '',
//     });
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null); // Local success for password change

//     // --- Mutations ---
//     // Mutation specifically for changing password
//     const { mutateAsync: changePassword, isLoading: isChangingPassword } = useMutationAction<{}, ChangePasswordPayload>({ // Response might be empty object or simple message
//         url: 'auth/password/change', // SPECIFIC endpoint for password change
//         method: 'POST', // Or PUT/PATCH
//         // No key needed here as it doesn't invalidate the main settings query typically
//     });

//      // Mutation specifically for toggling 2FA (if separate endpoint exists)
//      const { mutateAsync: toggle2FA, isLoading: isToggling2FA } = useMutationAction<ShopSettings, Toggle2FAPayload>({
//         url: 'shop/settings/security/2fa', // SPECIFIC endpoint for 2FA toggle
//         method: 'PATCH',
//         key: ['shopSettings'], // Refetch settings to confirm 2FA status change
//     });


//     // --- Handlers ---
//     const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
//         setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//         if (error) setError(null);
//         if (success) setSuccess(null);
//     };

//     const handlePasswordSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(null);

//         if (!passwordData.password || !passwordData.password_confirmation) {
//             setError("الرجاء إدخال كلمة المرور الجديدة وتأكيدها.");
//             return;
//         }
//         if (passwordData.password.length < 8) { // Example minimum length
//              setError("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.");
//              return;
//         }
//         if (passwordData.password !== passwordData.password_confirmation) {
//             setError("كلمة المرور وتأكيدها غير متطابقين.");
//             return;
//         }

//         const payload: ChangePasswordPayload = {
//             password: passwordData.password,
//             password_confirmation: passwordData.password_confirmation,
//         };
//          // Include current password only if backend requires it
//         if (passwordData.current_password) {
//              payload.current_password = passwordData.current_password;
//         }


//         try {
//             await changePassword(payload, {
//                 onSuccess: () => {
//                     setSuccess("تم تغيير كلمة المرور بنجاح.");
//                     setPasswordData({ current_password: '', password: '', password_confirmation: '' }); // Clear fields
//                     // No need to call onSaveSuccess for password change generally
//                     setTimeout(() => setSuccess(null), 4000);
//                 },
//                 onError: (err: any) => setError(err.message || "فشل تغيير كلمة المرور."),
//             });
//         } catch (e) { setError("حدث خطأ غير متوقع."); }
//     };

//      // Handler for the 2FA switch (calls a specific API)
//      const handle2FAToggle = async (e: ChangeEvent<HTMLInputElement>) => {
//          const isEnabled = e.target.checked;
//          setError(null);
//          setSuccess(null);
//           // Call the main handler to update the form state visually first
//          handleSwitchChange(e);

//          // Then call the API to persist the change
//          try {
//             await toggle2FA({ is_2fa_enabled: isEnabled }, {
//                 onSuccess: () => {
//                     onSaveSuccess(`تم ${isEnabled ? 'تفعيل' : 'تعطيل'} المصادقة الثنائية.`); // Use global success message
//                 },
//                  onError: (err: any) => {
//                     setError(err.message || "فشل تحديث حالة المصادقة الثنائية.");
//                      // Revert optimistic UI change (optional) - depends on handleSwitchChange behavior
//                      handleSwitchChange({ ...e, target: { ...e.target, checked: !isEnabled } }); // Simulate reverting
//                  },
//             });
//          } catch (error) {
//              setError("خطأ غير متوقع عند تحديث المصادقة الثنائية.");
//              handleSwitchChange({ ...e, target: { ...e.target, checked: !isEnabled } });
//          }
//      };

//     return (
//         <div className="space-y-6">
//             {/* --- Change Password Card --- */}
//             <Card title="تغيير كلمة المرور">
//                  {error && <Alert variant="error" message={error} onClose={() => setError(null)} className="mb-4"/>}
//                  {success && <Alert variant="success" message={success} onClose={() => setSuccess(null)} className="mb-4"/>}
//                 <form onSubmit={handlePasswordSubmit} className="space-y-5 mt-4">
//                     {/* Optional: Current Password */}
//                     {/* <Input label="كلمة المرور الحالية" name="current_password" type="password" value={passwordData.current_password} onChange={handlePasswordChange} disabled={isChangingPassword || disabled} icon={Lock}/> */}
//                     <Input label="كلمة المرور الجديدة *" name="password" type="password" value={passwordData.password} onChange={handlePasswordChange} required disabled={isChangingPassword || disabled} icon={KeyRound} />
//                     <Input label="تأكيد كلمة المرور الجديدة *" name="password_confirmation" type="password" value={passwordData.password_confirmation} onChange={handlePasswordChange} required disabled={isChangingPassword || disabled} icon={KeyRound} />
//                      <p className="text-xs text-gray-500">يفضل استخدام كلمة مرور قوية تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز.</p>
//                     <div className="flex justify-end pt-3">
//                         <Button type="submit" isLoading={isChangingPassword} disabled={isChangingPassword || disabled} icon={Save}>
//                             تغيير كلمة المرور
//                         </Button>
//                     </div>
//                 </form>
//             </Card>

//             {/* --- Two-Factor Authentication Card --- */}
//              <Card title="المصادقة الثنائية (2FA)">
//                  <Switch
//                     label="تفعيل المصادقة الثنائية"
//                     description="زيادة أمان الحساب بطلب رمز تحقق إضافي عند تسجيل الدخول."
//                     name="is-2fa-enabled" // Match key from ShopSettingsFormData
//                     // Read initial state from main formData passed down
//                     checked={formData['is-2fa-enabled'] ?? false}
//                     // Use specific handler that also calls API
//                     onChange={handle2FAToggle}
//                     disabled={isToggling2FA || disabled} // Disable while toggling or if parent is disabled
//                  />
//                   {isToggling2FA && <Spinner size="sm" message="جاري تحديث الحالة..." className="mt-2"/>}
//                  {/* Add setup instructions or status display here once 2FA is enabled */}
//                  {formData['is-2fa-enabled'] && (
//                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
//                          المصادقة الثنائية مفعلة. قد تحتاج إلى إعداد تطبيق المصادقة (Authenticator App) إذا لم تكن قد فعلت ذلك.
//                      </div>
//                  )}
//              </Card>

//               {/* --- Login Options Card (Read-only or select) --- */}
//              <Card title="خيارات تسجيل الدخول للعملاء">
//                   <p className="text-sm text-gray-600 mb-4">تحديد الطرق التي يمكن للعملاء استخدامها لتسجيل الدخول إلى بوابة الطلب.</p>
//                   {/* These might be better as read-only displays or simple selects if changeable */}
//                   <div className="space-y-3 text-sm">
//                       <div className="flex justify-between items-center p-2 bg-gray-50 rounded border">
//                          <span className="text-gray-600">خيار الدخول الأساسي:</span>
//                          <span className="font-medium text-gray-800">{formData['login-option'] === 'mobile-number' ? 'رقم الهاتف' : formData['login-option'] === 'email' ? 'البريد الإلكتروني' : 'غير محدد'}</span>
//                       </div>
//                       <div className="flex justify-between items-center p-2 bg-gray-50 rounded border">
//                           <span className="text-gray-600">خيارات الدخول الاجتماعي:</span>
//                           <span className="font-medium text-gray-800">{formData['social-login-option']?.split(',').join(', ') || 'لا يوجد'}</span>
//                       </div>
//                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded border">
//                           <span className="text-gray-600">طول رمز OTP:</span>
//                           <span className="font-medium text-gray-800">{formData['otp-length'] || '6'}</span>
//                        </div>
//                   </div>
//                    {/* Add save button if these become editable selects */}
//                    {/* <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end">
//                        <Button onClick={handleSaveLoginOptions} isLoading={...} disabled={...} icon={Save}>حفظ خيارات الدخول</Button>
//                    </div> */}
//              </Card>
//         </div>
//     );
// };

// export default SecuritySettingsTab;