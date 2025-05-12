// // src/pages/hr/EmployeeDetailsPage.tsx
// import React, { useState, useMemo, useEffect, ChangeEvent } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { dummyEmployees, type Employee } from '../../types/employee';
// import type { Role } from '../../types/role';
// import type { Permission } from '../../types/permission';
// import { formatDate } from 'date-fns';
// import { Edit, UserCircle, Mail, Phone, Info, Calendar, ShieldCheck, Save } from 'lucide-react';
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import Card from '../../components/ui/card';
// import Modal from '../../components/ui/modal';
// import Select, { SelectOption } from '../../components/ui/select';
// import Spinner from '../../components/ui/spinner';
// import Toolbar from '../../components/ui/toolbar';
// import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
// import { getImageLink } from '../../lib/storage';


// // --- Dummy Data ---
// // Reuse dummyRoles and dummyPermissions from RoleFormPage or fetch them
// const dummyPermissions: Permission[] = [ /* ... from RoleFormPage ... */ ];
// const dummyRoles: Role[] = [ /* ... from RolesPage ... */ ];
// // Find dummy employee based on ID for initialData (example)
// const findDummyEmployee = (id?: string): Employee | undefined => {
//     if (!id) return undefined;
//     const empId = parseInt(id, 10);
//     const emp = dummyEmployees.find(e => e.id === empId);
//     // Simulate assigning some permissions if role exists
//     if (emp?.role) {
//          emp.permissions = dummyPermissions.slice(0, Math.floor(Math.random() * 5) + 2); // Assign random permissions for demo
//          emp.role.permissions = emp.permissions; // Assign to role too for demo
//     }
//     return emp;
// }
// // --- End Dummy ---


// const EmployeeDetailsPage: React.FC = () => {
//     const { employeeId } = useParams<{ employeeId: string }>();
//     const navigate = useNavigate();
//     const [showPermissionModal, setShowPermissionModal] = useState(false);
//     const [apiError, setApiError] = useState<string | null>(null);
//     const [apiSuccess, setApiSuccess] = useState<string | null>(null);
//     const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
//     const [selectedPermissionIds, setSelectedPermissionIds] = useState<(string | number)[]>([]);

//     // --- Data Fetching ---
//     // Fetch Employee Details (Dummy)
//     const { data: employeeResponse, isLoading: isLoadingEmployee, error: employeeError, refetch: refetchEmployee } = useGetQuery<{ data: Employee }>({
//         queryKey: ['employeeDetails', employeeId],
//         url: `employees/${employeeId}?include=role.permissions,permissions`, // Eager load role with its permissions AND direct permissions
//         options: {
//             enabled: false, // !!employeeId, // Disable for dummy data
//             initialData: { data: findDummyEmployee(employeeId) }
//         }
//     });
//     const employee = employeeResponse?.data;

//     // Fetch Roles for Dropdown (Dummy)
//     const { data: rolesData, isLoading: isLoadingRoles } = useGetQuery<{ data: Role[] }>({
//         queryKey: ['roles'], url: 'roles',
//         options: { initialData: { data: dummyRoles }, enabled: false }
//     });
//     const roleOptions: SelectOption[] = useMemo(() =>
//         rolesData?.data?.map(r => ({ value: r.id, label: r.name })) || [],
//         [rolesData]
//     );

//      // Fetch All Permissions for Modal (Dummy)
//      const { data: permissionsResponse, isLoading: isLoadingPermissions } = useGetQuery<{ data: Permission[] }>({
//         queryKey: ['permissions'], url: 'permissions',
//         options: { initialData: { data: dummyPermissions }, enabled: false }
//     });
//      const allPermissions = permissionsResponse?.data || [];
//     //  const groupedPermissions = useMemo(() => _groupBy(allPermissions, 'group'), [allPermissions]);
//      const groupedPermissions = useMemo(() => allPermissions, [allPermissions]);


//     // --- Mutations ---
//      const { mutateAsync: updateEmployeeRole, isLoading: isUpdatingRole } = useMutationAction<Employee, { role_id: number | null }>({
//         method: 'PATCH', url: `employees/${employeeId}/role`, // Example endpoint
//         key: ['employeeDetails', employeeId], // Refetch details on success
//     });
//     const { mutateAsync: updateEmployeePermissions, isLoading: isUpdatingPerms } = useMutationAction<Employee, { permission_ids: (string|number)[] }>({
//         method: 'PUT', // Use PUT to replace all direct permissions
//         url: `employees/${employeeId}/permissions`, // Example endpoint
//         key: ['employeeDetails', employeeId],
//     });

//     // --- Effects ---
//     // Set initial selected role/permissions when employee data loads
//     useEffect(() => {
//         if (employee) {
//             setSelectedRoleId(employee.role_id ? String(employee.role_id) : null);
//             // Initialize modal permissions with employee's DIRECT permissions
//             setSelectedPermissionIds(employee.permissions?.map(p => p.id) || []);
//         }
//     }, [employee]);

//     // --- Handlers ---
//     const handleRoleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
//         const newRoleId = e.target.value ? parseInt(e.target.value, 10) : null;
//         setSelectedRoleId(e.target.value || null); // Update local state immediately for select
//         setApiError(null); setApiSuccess(null);

//         try {
//             await updateEmployeeRole({ role_id: newRoleId }, {
//                 onSuccess: () => { setApiSuccess("تم تحديث دور الموظف بنجاح."); setTimeout(()=>setApiSuccess(null), 3000); refetchEmployee(); }, // Refetch needed to update displayed role
//                 onError: (err: any) => setApiError(err.message || "فشل تحديث الدور."),
//             });
//         } catch (error) { setApiError("خطأ غير متوقع."); }
//     };

//      const handlePermissionToggle = (permissionId: number | string) => {
//         setSelectedPermissionIds(prev =>
//              prev.includes(permissionId)
//                  ? prev.filter(id => id !== permissionId)
//                  : [...prev, permissionId]
//          );
//      };

//     const handleSavePermissions = async () => {
//          setApiError(null); setApiSuccess(null);
//         try {
//             await updateEmployeePermissions({ permission_ids: selectedPermissionIds }, {
//                 onSuccess: () => {
//                     setApiSuccess("تم تحديث الصلاحيات المباشرة للموظف.");
//                     setShowPermissionModal(false);
//                     setTimeout(()=>setApiSuccess(null), 3000);
//                 },
//                 onError: (err: any) => setApiError(err.message || "فشل حفظ الصلاحيات."), // Keep modal open on error
//             });
//         } catch (error) { setApiError("خطأ غير متوقع."); }
//      };

//     // --- Render ---
//     if (isLoadingEmployee) return <div className="flex justify-center py-10"><Spinner message="تحميل بيانات الموظف..." /></div>;
//     if (employeeError || !employee) return <Alert variant="error" title="خطأ" message={(employeeError as any)?.message || "لم يتم العثور على الموظف."} />;

//     // --- Toolbar ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "الموظفين", href: "/employees" }, { label: `${employee.first_name} ${employee.last_name}` }, ];
//     const toolbarActions = ( <Button onClick={() => navigate(`/employees/${employeeId}/edit`)} icon={Edit} size="sm">تعديل بيانات الموظف</Button> );


//     // Permissions derived from role (display only)
//     const rolePermissions = employee.role?.permissions || [];
//     // Direct permissions assigned to employee
//     const directPermissions = employee.permissions || [];
//     // Combine for display in modal (or potentially show separately)
//     // const allActivePermissionIds = new Set([...rolePermissions.map(p=>p.id), ...directPermissions.map(p=>p.id)]);
//     const allActivePermissionIds = new Set(selectedPermissionIds); // Use state for modal checkboxes


//     return (
//         <div className="space-y-6 pb-10">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
//             {apiError && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} />}
//             {apiSuccess && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} />}

//              {/* Employee Header Card */}
//              <Card className="!p-0 overflow-visible">
//                  <div className="flex flex-col md:flex-row gap-6 p-6 items-start">
//                     <div className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-md flex items-center justify-center text-gray-400 mx-auto md:mx-0">
//                         {employee.avatar ? <img src={getImageLink(employee.avatar)} alt="Avatar" className="w-full h-full object-cover"/> : <UserCircle size={60}/>}
//                     </div>
//                     <div className="flex-grow space-y-1 text-center md:text-right">
//                         <h1 className="text-2xl font-bold text-gray-900">{employee.first_name} {employee.last_name}</h1>
//                         <p className="text-sm text-gray-600">{employee.job_title || 'غير محدد'}</p>
//                         <p className="text-sm text-primary font-medium">{employee.role?.name || 'بدون دور'}</p>
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${employee.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
//                              {employee.is_active ? 'فعال' : 'غير فعال'}
//                          </span>
//                         <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-gray-500 pt-2">
//                              <span className="flex items-center gap-1"><Mail size={14}/> {employee.email}</span>
//                              {employee.phone_number && <span className="flex items-center gap-1"><Phone size={14}/> {employee.phone_number}</span>}
//                              {employee.employee_id && <span className="flex items-center gap-1"><Info size={14}/> رقم الموظف: {employee.employee_id}</span>}
//                              {employee.hire_date && <span className="flex items-center gap-1"><Calendar size={14}/> تاريخ التعيين: {formatDate(employee.hire_date)}</span>}
//                          </div>
//                      </div>
//                  </div>
//              </Card>

//              {/* Role & Permissions Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                    {/* Assign Role Card */}
//                     <Card title="الدور الوظيفي" description="تحديد الدور الرئيسي للموظف وصلاحياته الأساسية.">
//                         <div className="mt-4 space-y-3">
//                              <Select
//                                  label="الدور الحالي"
//                                  name="role_id"
//                                  value={selectedRoleId || ''}
//                                  onChange={handleRoleChange} // Use specific handler
//                                  options={[{value: '', label: '-- بدون دور --'}, ...roleOptions]}
//                                  placeholder="-- اختر دور --"
//                                  disabled={isLoadingRoles || isUpdatingRole}
//                                  size="md"
//                                  icon={ShieldCheck}
//                              />
//                              {isUpdatingRole && <Spinner size="sm" message="جاري تحديث الدور..." />}
//                              {employee.role && (
//                                  <div className="text-xs text-gray-500 border-t pt-3 mt-3">
//                                      <p className="font-medium mb-1 text-gray-600">صلاحيات الدور المحدد:</p>
//                                      {rolePermissions.length > 0 ? (
//                                          <ul className="list-disc pr-4 space-y-0.5 max-h-20 overflow-y-auto">
//                                              {rolePermissions.map(p => <li key={`role-p-${p.id}`}>{p.name}</li>)}
//                                          </ul>
//                                      ) : (
//                                          <p>هذا الدور لا يمتلك صلاحيات محددة حالياً.</p>
//                                      )}
//                                  </div>
//                              )}
//                          </div>
//                      </Card>

//                    {/* Direct Permissions Card */}
//                      <Card title="صلاحيات إضافية/متجاوزة" description="منح صلاحيات إضافية أو تحديد صلاحيات خاصة تتجاوز صلاحيات الدور المحدد." actions={
//                          <Button variant="secondary" size="xs" icon={Edit} onClick={() => setShowPermissionModal(true)}>تعديل الصلاحيات</Button>
//                      }>
//                          <div className="mt-4">
//                               {directPermissions.length > 0 ? (
//                                  <>
//                                     <p className="text-xs text-gray-500 mb-2">يمتلك الموظف الصلاحيات المباشرة التالية:</p>
//                                     <ul className="list-disc list-outside pr-4 space-y-1 text-sm text-gray-700 max-h-24 overflow-y-auto">
//                                          {directPermissions.map(p => <li key={`direct-p-${p.id}`}>{p.name}</li>)}
//                                      </ul>
//                                  </>
//                              ) : (
//                                   <div className="text-center text-sm text-gray-400 py-5">
//                                       <p>لا توجد صلاحيات مباشرة مخصصة لهذا الموظف.</p>
//                                       <p className="text-xs mt-1">يعتمد على صلاحيات الدور المحدد فقط.</p>
//                                   </div>
//                              )}
//                          </div>
//                      </Card>
//               </div>


//              {/* --- Permissions Modal --- */}
//               <Modal isOpen={showPermissionModal} onClose={() => setShowPermissionModal(false)} title="تعديل الصلاحيات المباشرة" size="xl"
//                  footer={<>
//                      <Button variant="secondary" onClick={() => setShowPermissionModal(false)} disabled={isUpdatingPerms}>إلغاء</Button>
//                      <Button variant="primary" onClick={handleSavePermissions} isLoading={isUpdatingPerms} disabled={isUpdatingPerms} icon={Save}>حفظ الصلاحيات</Button>
//                  </>}
//               >
//                  <p className="text-sm text-gray-600 mb-4">حدد الصلاحيات الإضافية أو الخاصة التي تريد منحها لهذا الموظف بشكل مباشر. هذه الصلاحيات ستعمل بالإضافة إلى (أو قد تتجاوز) صلاحيات دوره المحدد.</p>
//                  {apiError && <Alert variant="error" message={apiError} className="mb-4"/>}
//                  {isLoadingPermissions ? <Spinner message="تحميل قائمة الصلاحيات..." /> : (
//                       <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 -mr-2">
//                           {Object.entries(groupedPermissions).map(([groupName, permissionsInGroup]) => (
//                              <div key={groupName} className="border-b border-gray-100 pb-3 last:border-b-0">
//                                  <h4 className="text-sm font-semibold text-gray-700 mb-2">{groupName || 'عام'}</h4>
//                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
//                                       {permissionsInGroup.map(permission => (
//                                          <label key={permission.id} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-50 cursor-pointer">
//                                               <input
//                                                  type="checkbox"
//                                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
//                                                  checked={selectedPermissionIds.includes(permission.id)}
//                                                  onChange={() => handlePermissionToggle(permission.id)}
//                                                  disabled={isUpdatingPerms}
//                                               />
//                                               <span className="text-sm text-gray-800">{permission.name}</span>
//                                           </label>
//                                       ))}
//                                  </div>
//                              </div>
//                            ))}
//                       </div>
//                  )}
//               </Modal>

//         </div> // End Page Container
//     );
// };

// export default EmployeeDetailsPage;