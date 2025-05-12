// // src/pages/hr/RoleFormPage.tsx
// import React, { useState, useEffect, FormEvent, ChangeEvent, useMemo } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import type { Role, RoleFormData } from '../../types/role'; // Adjust
// import { initialRoleFormData } from '../../types/role';
// import type { Permission } from '../../types/permission'; // Adjust

// import { ArrowRight, PlusIcon, Save, ShieldCheck } from 'lucide-react';
// import _groupBy from 'lodash/groupBy'; // For grouping permissions
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import Card from '../../components/ui/card';
// import Input from '../../components/ui/input';
// import Spinner from '../../components/ui/spinner';
// import TextArea from '../../components/ui/textarea';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';

// // --- Dummy Permissions Data ---
// const dummyPermissions: Permission[] = [
//     // Dashboard
//     { id: 'dashboard.view', name: 'عرض لوحة التحكم الرئيسية', group: 'Dashboard' },
//     // Orders
//     { id: 'orders.view', name: 'عرض قائمة الطلبات', group: 'Orders' },
//     { id: 'orders.view_details', name: 'عرض تفاصيل الطلب', group: 'Orders' },
//     { id: 'orders.update_status', name: 'تحديث حالة الطلب', group: 'Orders' },
//     { id: 'orders.assign_delivery', name: 'تعيين عامل توصيل للطلب', group: 'Orders' },
//     { id: 'orders.delete', name: 'حذف الطلب', group: 'Orders' },
//     // Products & Categories
//     { id: 'products.manage', name: 'إدارة المنتجات (إضافة/تعديل/حذف)', group: 'Products' },
//     { id: 'categories.manage', name: 'إدارة التصنيفات (إضافة/تعديل/حذف)', group: 'Products' },
//     // Tables
//     { id: 'tables.manage', name: 'إدارة الطاولات و QR', group: 'Tables' },
//     { id: 'tables.update_status', name: 'تحديث حالة الطاولة', group: 'Tables' },
//     // Marketing
//     { id: 'coupons.manage', name: 'إدارة الكوبونات', group: 'Marketing' },
//     { id: 'discounts.manage', name: 'إدارة الخصومات', group: 'Marketing' },
//     // Employees (Future)
//     { id: 'employees.manage', name: 'إدارة الموظفين', group: 'HR' },
//     { id: 'roles.manage', name: 'إدارة الأدوار والصلاحيات', group: 'HR' },
//     // Settings
//     { id: 'settings.restaurant', name: 'تعديل إعدادات المطعم الأساسية', group: 'Settings' },
//     { id: 'settings.theme', name: 'تعديل مظهر القائمة', group: 'Settings' },
//     { id: 'settings.features', name: 'تفعيل/تعطيل ميزات النظام', group: 'Settings' },
// ];
// // --- End Dummy Permissions ---


// const RoleFormPage: React.FC = () => {
//     const { roleId } = useParams<{ roleId?: string }>(); // Optional roleId for editing
//     const navigate = useNavigate();
//     const isEditMode = !!roleId;
//     const [formData, setFormData] = useState<RoleFormData>(initialRoleFormData);
//     const [formError, setFormError] = useState<string | null>(null);
//     const [formSuccess, setFormSuccess] = useState<string | null>(null);

//     // --- Fetch Data (Permissions list and Role data if editing) ---
//     // Permissions (Using Dummy Data)
//     const { data: permissionsResponse, isLoading: isLoadingPermissions } = useGetQuery<{ data: Permission[] }>({
//         queryKey: ['permissions'], url: 'permissions', // API endpoint
//         options: {
//             initialData: { data: dummyPermissions, total: 0, page: 0, limit: 0, qr_code_image: null },
//             enabled: false // Disable actual fetch for now
//         }
//     });
//     const allPermissions = permissionsResponse?.data || [];

//     // Fetch Role data if editing
//     const { data: roleResponse, isLoading: isLoadingRole, error: roleError } = useGetQuery<{ data: Role }>({
//         queryKey: ['roleDetails', roleId],
//         url: `roles/${roleId}?include=permissions`, // Fetch role with its permissions
//         options: { enabled: isEditMode } // Only fetch if in edit mode
//     });

//     // --- Mutations ---
//     const { mutateAsync: saveRole, isLoading: isSaving } = useMutationAction<Role, RoleFormData>({ // Send RoleFormData
//         method: isEditMode ? 'PUT' : 'POST',
//         url: isEditMode ? `roles/${roleId}` : 'roles',
//         key: ['roles', ['roleDetails', roleId]], // Invalidate list and specific role detail
//     });

//     // --- Effects ---
//     // Populate form on edit mode when data loads
//     useEffect(() => {
//         if (isEditMode && roleResponse?.data) {
//             setFormData({
//                 name: roleResponse.data.name,
//                 description: roleResponse.data.description || '',
//                 permission_ids: roleResponse.data.permissions?.map(p => p.id) || [] // Extract permission IDs
//             });
//         } else if (!isEditMode) {
//             setFormData(initialRoleFormData); // Reset for add mode
//         }
//     }, [roleResponse, isEditMode]);

//     // --- Handlers ---
//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { /* ... standard ... */ };
//     const handlePermissionToggle = (permissionId: number | string) => {
//         setFormData(prev => {
//             const currentPermissions = prev.permission_ids;
//             const isSelected = currentPermissions.includes(permissionId);
//             return {
//                 ...prev,
//                 permission_ids: isSelected
//                     ? currentPermissions.filter(id => id !== permissionId) // Remove
//                     : [...currentPermissions, permissionId] // Add
//             };
//         });
//         if(formError) setFormError(null);
//         if(formSuccess) setFormSuccess(null);
//     };

//     const handleSelectAllGroup = (groupIds: (string|number)[], groupSelected: boolean) => {
//          setFormData(prev => {
//             let currentPermissions = [...prev.permission_ids];
//             if (groupSelected) {
//                  // Add all from group, avoid duplicates
//                  currentPermissions = [...new Set([...currentPermissions, ...groupIds])];
//             } else {
//                  // Remove all from group
//                  currentPermissions = currentPermissions.filter(id => !groupIds.includes(id));
//             }
//              return { ...prev, permission_ids: currentPermissions };
//          });
//           if(formError) setFormError(null);
//           if(formSuccess) setFormSuccess(null);
//     };


//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setFormError(null); setFormSuccess(null);
//         if (!formData.name.trim()) { setFormError("اسم الدور مطلوب."); return; }

//         try {
//             await saveRole(formData, { // Send form data directly
//                  url: isEditMode ? `roles/${roleId}` : 'roles', // Confirm URL again
//                 onSuccess: (response) => {
//                     const successMsg = isEditMode ? `تم تحديث الدور "${response.data.name}"` : `تم إضافة الدور "${response.data.name}"`;
//                     setFormSuccess(successMsg);
//                     setTimeout(() => navigate('/roles'), 1500);
//                 },
//                 onError: (err: any) => setFormError(err.message || (isEditMode ? "فشل تحديث الدور." : "فشل إضافة الدور.")),
//             });
//         } catch (error) { setFormError("حدث خطأ غير متوقع."); }
//     };

//     // --- Group Permissions for Display ---
//     const groupedPermissions = useMemo(() => _groupBy(allPermissions, 'group'), [allPermissions]);

//     // --- Loading/Error State ---
//     if (isEditMode && isLoadingRole) return <div className="flex justify-center py-10"><Spinner message="جاري تحميل بيانات الدور..." /></div>;
//     if (isEditMode && roleError) return <Alert variant="error" title="خطأ" message={(roleError as any).message || "فشل تحميل بيانات الدور."} />;

//     const handleAdd = () => navigate('/roles/new');

//     // --- Toolbar ---
//     const breadcrumbItems = [
//         { title: 'الدورات', href: '/roles' },
//     ];
//     const toolbarActions = (
//         <Button onClick={handleAdd} isLoading={isSaving}>
//             <PlusIcon className="w-4 h-4 mr-2" /> اضافة دور جديد
//         </Button>
//     );

//     return (
//         <div className="space-y-6 pb-10">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {formError && <Alert variant="error" message={formError} onClose={() => setFormError(null)} />}
//             {formSuccess && <Alert variant="success" message={formSuccess} onClose={() => setFormSuccess(null)} />}

//             <form onSubmit={handleSubmit}>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Role Details */}
//                     <div className="lg:col-span-1 space-y-6">
//                          <Card title="معلومات الدور الأساسية">
//                             <div className="space-y-5 mt-4">
//                                  <Input label="اسم الدور *" name="name" value={formData.name} onChange={handleChange} required placeholder="مثال: مدير، كاشير" disabled={isSaving || (isEditMode && roleResponse?.data.is_system_role)} />
//                                  <TextArea label="الوصف (اختياري)" name="description" value={formData.description || ''} onChange={handleChange} rows={3} disabled={isSaving}/>
//                             </div>
//                          </Card>
//                          {/* Submit Button (Mobile/Small Screens) */}
//                          <div className="lg:hidden">
//                              <Button type="submit" variant="primary" isLoading={isSaving} disabled={isSaving} icon={Save} className="w-full"> {isEditMode ? "حفظ التعديلات" : "إنشاء الدور"} </Button>
//                          </div>
//                     </div>

//                     {/* Permissions Selection */}
//                     <div className="lg:col-span-2">
//                          <Card title="الصلاحيات الممنوحة" description="حدد الصلاحيات التي سيحصل عليها الموظفون بهذا الدور.">
//                             {isLoadingPermissions ? <Spinner message="تحميل الصلاحيات..." /> : (
//                                 <div className="space-y-5 mt-4 max-h-[60vh] overflow-y-auto pr-2">
//                                     {Object.entries(groupedPermissions).map(([groupName, permissionsInGroup]) => {
//                                           const groupIds = permissionsInGroup.map(p => p.id);
//                                           const allSelectedInGroup = groupIds.every(id => formData.permission_ids.includes(id));
//                                           return (
//                                             <div key={groupName} className="border-b border-gray-100 pb-4 last:border-b-0">
//                                                  <div className="flex justify-between items-center mb-2">
//                                                     <h4 className="text-sm font-semibold text-gray-700">{groupName || 'صلاحيات عامة'}</h4>
//                                                      {/* Select/Deselect All for Group */}
//                                                      <button type="button" onClick={() => handleSelectAllGroup(groupIds, !allSelectedInGroup)} className="text-xs text-primary hover:underline disabled:opacity-50" disabled={isSaving}>
//                                                          {allSelectedInGroup ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
//                                                      </button>
//                                                  </div>
//                                                 <div className="space-y-2">
//                                                      {permissionsInGroup.map(permission => (
//                                                         <label key={permission.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
//                                                              <input
//                                                                 type="checkbox"
//                                                                 className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
//                                                                 checked={formData.permission_ids.includes(permission.id)}
//                                                                 onChange={() => handlePermissionToggle(permission.id)}
//                                                                 disabled={isSaving}
//                                                              />
//                                                              <span className="text-sm text-gray-800">{permission.name}</span>
//                                                               {permission.description && <span className="text-xs text-gray-500"> - {permission.description}</span>}
//                                                          </label>
//                                                      ))}
//                                                 </div>
//                                             </div>
//                                           );
//                                     })}
//                                 </div>
//                             )}
//                          </Card>
//                     </div>
//                 </div>

//                  {/* Form Submit Actions (Desktop) */}
//                 <div className="mt-8 pt-5 border-t border-gray-200 flex justify-start gap-3">
//                     <Button type="submit" variant="primary" isLoading={isSaving} disabled={isSaving} icon={Save} size="lg"> {isEditMode ? "حفظ التعديلات" : "إنشاء الدور"} </Button>
//                     <Button type="button" variant="secondary" onClick={() => navigate('/roles')} disabled={isSaving}> إلغاء </Button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default RoleFormPage;