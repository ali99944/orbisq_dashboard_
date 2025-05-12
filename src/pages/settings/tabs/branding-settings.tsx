// // src/pages/settings/tabs/BrandingSettingsTab.tsx
// import React, { useState } from 'react';
// import type { ShopSettings, ShopSettingsFormData } from '../../../types/settings';
// import { Save, Link as LinkIcon, Facebook, Twitter, Instagram } from 'lucide-react'; // Example social icons
// import Alert from '../../../components/ui/alert';
// import Button from '../../../components/ui/button';
// import Card from '../../../components/ui/card';
// import FileUpload from '../../../components/ui/file-upload';
// import Input from '../../../components/ui/input';
// import Switch from '../../../components/ui/switch';
// import TextArea from '../../../components/ui/textarea';
// import { useMutationAction } from '../../../hooks/queries-actions';
// import { getImageLink } from '../../../lib/storage';

// interface BrandingSettingsProps {
//     formData: ShopSettingsFormData;
//     handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Only Input needed here typically
//     handleSwitchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     onSaveSuccess: () => void;
//     disabled?: boolean;
// }

// const BrandingSettingsTab: React.FC<BrandingSettingsProps> = ({ formData, handleChange, handleSwitchChange, onSaveSuccess, disabled }) => {
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);
//     const [logoFile, setLogoFile] = useState<File | null>(null); // Local file state
//     const [appLogoFile, setAppLogoFile] = useState<File | null>(null);

//      // Need to get the existing image URLs for the FileUpload component's initial preview
//     const currentLogoUrl = formData['logo-uri'] ? getImageLink(formData['logo-uri']) : null;
//     const currentAppLogoUrl = formData['app-brand-logo'] ? getImageLink(formData['app-brand-logo']) : null;


//     const { mutateAsync: saveBranding, isLoading } = useMutationAction<ShopSettings, FormData>({ // Expect FormData
//         url: 'shop/settings/branding', // Specific endpoint
//         method: 'POST', // Use POST with _method=PATCH maybe? Or PATCH if server supports FormData with PATCH
//         isFormData: true, // Signal FormData
//         key: ['shopSettings'],
//     });

//     const handleSave = async () => {
//         setError(null); setSuccess(null);
//         const submissionData = new FormData();
//         submissionData.append('_method', 'PATCH'); // If using POST override

//         // Append text/switch fields
//         submissionData.append('remove-branding', formData['remove-branding'] ? '1' : '0');
//         if (formData['website-link']) submissionData.append('website-link', formData['website-link']);
//         if (formData['facebook-link']) submissionData.append('facebook-link', formData['facebook-link']);
//         if (formData['twitter-link']) submissionData.append('twitter-link', formData['twitter-link']);
//         if (formData['instagram-link']) submissionData.append('instagram-link', formData['instagram-link']);
//         // ... append other social links ...

//         // Append files ONLY if they are selected (have a new file)
//         if (logoFile) submissionData.append('logo', logoFile); // Key 'logo' must match backend
//         if (appLogoFile) submissionData.append('app_brand_logo_file', appLogoFile); // Key 'app_brand_logo_file'

//         // Signal removal if file state is null but original existed (handle 'null' in preview?)
//         if (formData['logo-uri'] && !logoFile && !currentLogoUrl) { // If original existed, but preview is now null (removed)
//              submissionData.append('remove_logo', '1'); // Or send logo: null
//         }
//         if (formData['app-brand-logo'] && !appLogoFile && !currentAppLogoUrl) {
//              submissionData.append('remove_app_logo', '1');
//         }


//         try {
//             await saveBranding(submissionData, {
//                 onSuccess: (response) => {
//                     setSuccess("تم حفظ إعدادات العلامة التجارية.");
//                     setLogoFile(null); // Clear file state on success
//                     setAppLogoFile(null);
//                     onSaveSuccess(); // Trigger refetch on parent
//                     setTimeout(() => setSuccess(null), 3000);
//                  },
//                 onError: (err: any) => setError(err.message || "فشل حفظ الإعدادات."),
//             });
//         } catch (e) { setError("حدث خطأ غير متوقع."); }
//     };

//     return (
//         <Card title="العلامة التجارية والمظهر">
//              {error && <Alert variant="error" message={error} onClose={() => setError(null)} className="mb-4"/>}
//              {success && <Alert variant="success" message={success} onClose={() => setSuccess(null)} className="mb-4"/>}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mt-4">
//                  {/* File Uploads */}
//                  <FileUpload
//                      label="شعار المطعم الرئيسي (للفاتورة/البوابة)"
//                      id="shop-logo"
//                      currentImageUrl={currentLogoUrl} // Pass current URL for initial preview
//                      onFileSelect={setLogoFile}
//                      onUrlSelect={() => console.warn("URL select not implemented for logo in this save method")} // Disable or implement URL handling
//                      onFileRemove={() => setFormData(prev => ({...prev, 'logo-uri': null}))} // Signal removal intent maybe?
//                      accept="image/png, image/jpeg, image/svg+xml, image/webp"
//                      maxSizeMB={2}
//                      disabled={disabled || isLoading}
//                   />
//                   <FileUpload
//                      label="شعار أيقونة التطبيق (إن وجد)"
//                      id="app-logo"
//                      currentImageUrl={currentAppLogoUrl}
//                      onFileSelect={setAppLogoFile}
//                       onUrlSelect={() => console.warn("URL select not implemented")}
//                      onFileRemove={() => setFormData(prev => ({...prev, 'app-brand-logo': null}))}
//                      accept="image/png, image/jpeg"
//                      maxSizeMB={1}
//                      disabled={disabled || isLoading}
//                   />

//                  {/* Social Links */}
//                  <div className="md:col-span-2"><h4 className="text-sm font-medium text-gray-600 border-b pb-1 mb-3 mt-3">روابط التواصل الاجتماعي</h4></div>
//                   <Input label="رابط الموقع الإلكتروني" name="website-link" value={formData['website-link'] || ''} onChange={handleChange} icon={LinkIcon} dir="ltr" disabled={disabled || isLoading}/>
//                   <Input label="رابط فيسبوك" name="facebook-link" value={formData['facebook-link'] || ''} onChange={handleChange} icon={Facebook} dir="ltr" disabled={disabled || isLoading}/>
//                   <Input label="رابط تويتر (X)" name="twitter-link" value={formData['twitter-link'] || ''} onChange={handleChange} icon={Twitter} dir="ltr" disabled={disabled || isLoading}/>
//                   <Input label="رابط انستجرام" name="instagram-link" value={formData['instagram-link'] || ''} onChange={handleChange} icon={Instagram} dir="ltr" disabled={disabled || isLoading}/>
//                    {/* Add other social inputs: youtube, snapchat, tiktok */}

//                  {/* Other Branding */}
//                   <div className="md:col-span-2"><h4 className="text-sm font-medium text-gray-600 border-b pb-1 mb-3 mt-3">إعدادات أخرى</h4></div>
//                   <Switch label="إزالة علامة Orbis Q التجارية" description="إخفاء عبارة 'مدعوم بواسطة Orbis Q' من الفواتير والبوابة." name="remove-branding" checked={formData['remove-branding'] || false} onChange={handleSwitchChange} disabled={disabled || isLoading}/>
//                   {/* Receipt Footer */}
//                   <TextArea label="تذييل الفاتورة (اختياري)" name="receipt-footer" value={formData['receipt-footer'] || ''} onChange={handleChange} rows={2} placeholder="رسالة شكر، معلومات إضافية..." disabled={disabled || isLoading}/>

//             </div>
//              <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end">
//                  <Button onClick={handleSave} isLoading={isLoading} disabled={disabled || isLoading} icon={Save}>حفظ المظهر</Button>
//              </div>
//         </Card>
//     );
// };
// export default BrandingSettingsTab;