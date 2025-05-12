// // src/pages/hr/AddEmployeePage.tsx
// import React, { useState, FormEvent, ChangeEvent, useMemo } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import type { Employee, EmployeeFormData } from '../../types/employee';
// import { initialEmployeeFormData } from '../../types/employee';
// import type { Role } from '../../types/role';

// import { ArrowRight, Save, User, Mail, Phone, Briefcase, Calendar, KeyRound, ShieldCheck, Info } from 'lucide-react';
// import { format as formatDateISO } from 'date-fns';
// import Button from '../../components/ui/button';
// import Card from '../../components/ui/card';
// import FileUpload from '../../components/ui/file-upload';
// import Input from '../../components/ui/input';
// import Select, { SelectOption } from '../../components/ui/select';
// import Switch from '../../components/ui/switch';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';

// const AddEmployeePage: React.FC = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState<EmployeeFormData>(initialEmployeeFormData);
//     const [avatarFile, setAvatarFile] = useState<File | null>(null);
//     const [formError, setFormError] = useState<string | null>(null);
//     const [formSuccess, setFormSuccess] = useState<string | null>(null);

//     // --- Fetch Roles ---
//     const { data: rolesData, isLoading: isLoadingRoles } = useGetQuery<{ data: Role[] }>({
//         queryKey: ['roles'], url: 'roles' // Fetch available roles
//     });
//     const roleOptions: SelectOption[] = useMemo(() =>
//         rolesData?.data.map(r => ({ value: r.id, label: r.name })) || [],
//         [rolesData]
//     );

//     // --- Mutation ---
//     const { mutateAsync: createEmployee, isLoading: isSaving } = useMutationAction<Employee, FormData>({ // Send FormData
//         url: 'employees',
//         method: 'POST',
//         key: ['employees'],
//         isFormData: true,
//     });

//     // --- Handlers ---
//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { /* ... standard ... */ };
//     const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => { /* ... standard ... */ };
//     const handleDateChange = (date: Date | null) => { /* ... handle DatePickerInput ... */ };
//     const handleFileSelect = (file: File | null) => { setAvatarFile(file); /*...*/ };
//     const handleUrlSelect = (url: string | null) => { /* ... */ }; // Less likely for avatar

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setFormError(null); setFormSuccess(null);

//         if (!formData.first_name || !formData.last_name || !formData.email || !formData.role_id || !formData.password) {
//              setFormError("الاسم الأول، الأخير، البريد الإلكتروني، الدور، وكلمة المرور الأولية حقول مطلوبة."); return;
//         }
//          if (formData.password !== formData.password_confirmation) {
//              setFormError("كلمة المرور وتأكيدها غير متطابقين."); return;
//          }
//          // More validation...

//         const submissionData = new FormData();

//         // Append form fields (convert boolean, format date)
//          Object.keys(formData).forEach(key => {
//             const formKey = key as keyof EmployeeFormData;
//             // Skip password confirmation for submission
//             if (formKey === 'password_confirmation') return;

//             const value = formData[formKey];
//             if (value !== null && value !== undefined && value !== '') {
//                 const processedValue = typeof value === 'boolean' ? (value ? '1' : '0')
//                                       : (key === 'hire_date' && value instanceof Date ? formatDateISO(value, "yyyy-MM-dd") // Format date only
//                                       : String(value));
//                 submissionData.append(key, processedValue);
//             }
//          });

//         if (avatarFile) { submissionData.append('avatar', avatarFile); }
//          // TODO: Add shop_id

//         try {
//             await createEmployee(submissionData, {
//                 onSuccess: (response) => {
//                     setFormSuccess(`تمت إضافة الموظف "${response.data.first_name}" بنجاح.`);
//                     setFormData(initialEmployeeFormData); // Reset form
//                     setAvatarFile(null);
//                     setTimeout(() => navigate('/employees'), 1500);
//                 },
//                 onError: (err: any) => setFormError(err.response?.data?.message || "فشل إضافة الموظف."),
//             });
//         } catch (error) { setFormError("حدث خطأ غير متوقع."); }
//     };


//     // --- Toolbar ---
//     const breadcrumbItems = [
//         { name: 'الموظفين', onClick: () => navigate('/employees') },
//         { name: 'اضافة موظف جديد' },
//     ];
//     const toolbarActions = (
//         <Button variant="primary" type="submit" loading={isSaving}>
//             <span>حفظ</span>
//         </Button>
//     );

//     return (
//         <div className="space-y-6 pb-10">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {/* ... Alerts ... */}

//             <form onSubmit={handleSubmit}>
//                  {/* Use multiple cards or sections */}
//                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                      {/* Left Column: Main Info */}
//                      <div className="lg:col-span-2 space-y-6">
//                          <Card title="المعلومات الشخصية والوظيفية">
//                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-4">
//                                 <Input label="الاسم الأول *" name="first_name" value={formData.first_name} onChange={handleChange} required icon={User}/>
//                                 <Input label="الاسم الأخير *" name="last_name" value={formData.last_name} onChange={handleChange} required icon={User}/>
//                                 <Input label="البريد الإلكتروني (للدخول) *" name="email" type="email" value={formData.email} onChange={handleChange} required icon={Mail} dir="ltr"/>
//                                 <Input label="رقم الهاتف" name="phone_number" type="tel" value={formData.phone_number || ''} onChange={handleChange} icon={Phone} dir="ltr"/>
//                                 <Input label="المسمى الوظيفي" name="job_title" value={formData.job_title || ''} onChange={handleChange} placeholder="مثال: كاشير، شيف" icon={Briefcase}/>
//                                  {/* Using simple text input for date, replace with DatePickerInput if available */}
//                                 <Input label="تاريخ التعيين" name="hire_date" type="date" value={formData.hire_date || ''} onChange={handleChange} icon={Calendar} />
//                                 <Input label="رقم الموظف (اختياري)" name="employee_id" value={formData.employee_id || ''} onChange={handleChange} icon={Info}/>
//                             </div>
//                          </Card>
//                          <Card title="الدور وكلمة المرور">
//                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-4">
//                                 <Select label="الدور الوظيفي *" name="role_id" value={formData.role_id || ''} onChange={handleChange} required options={[{value: '', label: '-- اختر دور --'}, ...roleOptions]} placeholder="-- اختر دور --" disabled={isLoadingRoles} icon={ShieldCheck}/>
//                                 <div> {/* Spacer */} </div>
//                                  <Input label="كلمة المرور الأولية *" name="password" type="password" value={formData.password || ''} onChange={handleChange} required icon={KeyRound}/>
//                                  <Input label="تأكيد كلمة المرور *" name="password_confirmation" type="password" value={formData.password_confirmation || ''} onChange={handleChange} required icon={KeyRound}/>
//                              </div>
//                          </Card>
//                      </div>
//                      {/* Right Column: Avatar & Status */}
//                      <div className="lg:col-span-1 space-y-6">
//                          <Card title="الصورة الشخصية والحالة">
//                             <div className="space-y-5 mt-4">
//                                 <FileUpload label="الصورة الرمزية (اختياري)" id="avatar-upload" onFileSelect={handleFileSelect} onUrlSelect={handleUrlSelect} accept="image/*" maxSizeMB={1} />
//                                 <Switch label="الحالة (نشط)" name="is_active" checked={formData.is_active} onChange={handleSwitchChange} />
//                              </div>
//                          </Card>
//                           {/* Submit Buttons (also here for better flow) */}
//                          <div className="flex flex-col gap-3">
//                              <Button type="submit" variant="primary" isLoading={isSaving} disabled={isSaving} icon={Save} size="lg" className="w-full">إنشاء الموظف</Button>
//                              <Button type="button" variant="secondary" onClick={() => navigate('/employees')} disabled={isSaving} className="w-full">إلغاء</Button>
//                          </div>
//                      </div>
//                  </div>
//             </form>
//         </div>
//     );
// };

// export default AddEmployeePage;