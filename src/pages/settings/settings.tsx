// // src/pages/settings/ShopSettingsPage.tsx (Main Page - Updated)

// import React, { useState, useEffect, useMemo, FormEvent, ChangeEvent } from 'react';
// import { useNavigate } from 'react-router-dom';
// import type { ShopSettings, ShopSettingsFormData, OpeningHourRule } from '../../types/settings'; // Adjust path
// import { initialShopSettingsFormData } from '../../types/settings'; // Adjust path

// // Import Icons
// import { Settings, Save, Globe, Clock, Percent, Truck, CreditCard, Bell, Lock, PaletteIcon, Building, SlidersHorizontal } from 'lucide-react';
// import Alert from '../../components/ui/alert';
// import Card from '../../components/ui/card';
// import Spinner from '../../components/ui/spinner';
// import TabNavigation from '../../components/ui/tab-navigation';
// import { useGetQuery } from '../../hooks/queries-actions';
// import GeneralSettingsTab from './tabs/general-settings';
// import LocalizationSettingsTab from './tabs/localiztion-settings';
// import OperationsSettingsTab from './tabs/operation-settings';
// import DeliverySettingsTab from './tabs/delivery-settings';
// import BrandingSettingsTab from './tabs/branding-settings';
// import NotificationsSettingsTab from './tabs/notification-settings';
// import SecuritySettingsTab from './tabs/securiry-settings';


// type ActiveSettingsTab = 'general' | 'localization' | 'operations' | 'delivery' | 'payments' | 'notifications' | 'branding' | 'security'; // Removed integrations for now


// const ShopSettingsPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState<ShopSettingsFormData>(initialShopSettingsFormData);
//     const [activeTab, setActiveTab] = useState<ActiveSettingsTab>('general');
//     const [formError, setFormError] = useState<string | null>(null); // Maybe manage errors per tab?
//     const [formSuccess, setFormSuccess] = useState<string | null>(null); // Global success message state

//     // --- API Hook to fetch ALL settings ---
//     // const { data: settingsResponse, isLoading: isLoadingSettings, error, refetch } = useGetQuery<{ data: ShopSettings }>({
//     //     key: ['shopSettings'],
//     //     url: 'shop/settings',
//     // });

//     const settingsResponse = {}

//     // --- Effect to populate form data ---
//     useEffect(() => {
//         if (settingsResponse?.data) {
//             // ... (same population logic as before, including parseOpeningHours) ...
//              const fetched = settingsResponse.data;
//              const formDataCompatible: ShopSettingsFormData = { /* ... mapping logic ... */ };
//              setFormData(formDataCompatible);
//         }
//     }, [settingsResponse]);

//     const parseOpeningHours = (jsonString?: string): OpeningHourRule[] => { /* ... same parsing logic ... */ };


//     // --- Handlers Passed to Tabs ---
//     // Generic handler - tabs can decide which fields they use
//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value, type } = e.target;
//         let processedValue: any = value;
//         // ... (logic to handle empty numbers/dates, code formatting if needed in specific tabs) ...
//         if (type === 'number' || type === 'datetime-local' || type === 'date') { processedValue = value === '' ? null : value; }
//         if (name === 'code' && 'code' in formData) { processedValue = value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''); } // Example

//          // Handle nested state if tabs need it (or flatten in payload)
//         if (name.includes('.')) {
//              const [parentKey, childKey] = name.split('.');
//              setFormData(prev => ({
//                  ...prev,
//                  [parentKey as keyof ShopSettingsFormData]: {
//                      ...(prev[parentKey as keyof ShopSettingsFormData] as object), // Type assertion needed carefully
//                      [childKey]: processedValue
//                  }
//              }));
//         } else {
//              setFormData(prev => ({ ...prev, [name]: processedValue }));
//         }

//         if(formError) setFormError(null);
//         if(formSuccess) setFormSuccess(null);
//     };
//      const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, checked } = e.target;
//           if (name.includes('.')) {
//              const [parentKey, childKey] = name.split('.');
//              setFormData(prev => ({
//                  ...prev,
//                  [parentKey as keyof ShopSettingsFormData]: {
//                      ...(prev[parentKey as keyof ShopSettingsFormData] as object),
//                      [childKey]: checked
//                  }
//              }));
//           } else {
//             setFormData(prev => ({ ...prev, [name as keyof ShopSettingsFormData]: checked }));
//           }
//         if(formError) setFormError(null);
//         if(formSuccess) setFormSuccess(null);
//     };
//      // Pass file handlers specifically to Branding tab if needed
//      const handleFileChange = (file: File | null, type: 'logo' | 'appLogo') => {
//          // Store file in separate state, pass to Branding tab
//          console.log(`File selected for ${type}:`, file);
//           if(formError) setFormError(null);
//           if(formSuccess) setFormSuccess(null);
//      }


//     // Callback for tabs to signal success and trigger refetch/global message
//     const handleSaveSuccess = () => {
//         // refetch(); // Refetch all settings after a section is saved
//         setFormSuccess("تم حفظ التغييرات بنجاح.");
//         setTimeout(() => setFormSuccess(null), 3000); // Clear message after delay
//     };


//     // --- Tab Definitions ---
//     const tabs = [
//         { key: 'general', label: 'عام', icon: Building },
//         { key: 'localization', label: 'اللغة والعملة', icon: Globe },
//         { key: 'operations', label: 'التشغيل', icon: Settings },
//         { key: 'delivery', label: 'التوصيل', icon: Truck },
//         { key: 'payments', label: 'الدفع', icon: CreditCard },
//         { key: 'notifications', label: 'الإشعارات', icon: Bell },
//         { key: 'branding', label: 'العلامة التجارية', icon: PaletteIcon },
//         { key: 'security', label: 'الأمان', icon: Lock },
//     ];

//     const renderTabContent = () => {
//         // Pass relevant props to each tab component
//         const commonProps = {
//             formData,
//             handleChange,
//             handleSwitchChange, // Pass if switches are used directly
//             onSaveSuccess: handleSaveSuccess,
//             // disabled: isLoadingSettings || isSaving, // Disable form elements while loading/saving
//         };

//         switch(activeTab) {
//             case 'general': return <GeneralSettingsTab {...commonProps} />;
//             case 'localization': return <LocalizationSettingsTab {...commonProps} />;
//             case 'operations': return <OperationsSettingsTab {...commonProps} handleMultiSelectChange={() => {}} parseOpeningHours={parseOpeningHours} />; // Needs specific handlers/props
//             case 'delivery': return <DeliverySettingsTab disabled={false} {...commonProps} currencyIcon={formData.currency_icon || 'ر.س'}/>;
//             // case 'payments': return <PaymentsSettingsTab {...commonProps} handleMultiSelectChange={handleMultiSelectChange} />;
//             case 'notifications': return <NotificationsSettingsTab {...commonProps} />;
//             case 'branding': return <BrandingSettingsTab {...commonProps} onFileSelect={handleFileChange} />; // Pass file handler
//             case 'security': return <SecuritySettingsTab {...commonProps} />;
//             default: return <Card><p>محتوى غير متوفر لهذا التبويب.</p></Card>;
//         }
//     };

//     // --- Render ---
//     // if (isLoadingSettings && !formData.label) {
//     //     return <div className="flex justify-center py-10"><Spinner message="تحميل الإعدادات..." /></div>;
//     // }
//     //  if (error && !isLoadingSettings) {
//     //     return <Alert variant="error" title="خطأ" message={(error as any)?.message || "فشل تحميل إعدادات المطعم."} />;
//     // }


//     return (
//         <div className="space-y-6 pb-10">
//             {/* No Toolbar needed if save is per tab */}
//             {/* Global Success/Error for feedback after save */}
//             {formError && <Alert variant="error" message={formError} onClose={() => setFormError(null)} className="mb-4"/>}
//             {formSuccess && <Alert variant="success" message={formSuccess} onClose={() => setFormSuccess(null)} className="mb-4"/>}


//              {/* Page Title */}
//              <div className="flex justify-between items-center mb-4">
//                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                      <SlidersHorizontal size={22} /> إعدادات المطعم العامة
//                  </h1>
//              </div>

//             {/* Tab Navigation */}
//             <div className="mb-6">
//                 <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={(key) => setActiveTab(key as ActiveSettingsTab)} />
//             </div>

//             {/* Active Tab Content */}
//             <div className="mt-1"> {/* Reduced top margin */}
//                 {renderTabContent()}
//             </div>
//         </div>
//     );
// };

// export default ShopSettingsPage;