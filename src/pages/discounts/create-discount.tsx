// // src/pages/marketing/AddDiscountPage.tsx
// import React, { useState, FormEvent, ChangeEvent } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { ArrowRight, Save, Percent, Tag, CalendarDays, Info } from 'lucide-react';
// import { format as formatDateISO } from 'date-fns'; // Use format for ISO string
// import Alert from '../../components/ui/alert';
// import Button from '../../components/ui/button';
// import Card from '../../components/ui/card';
// import DatePickerInput from '../../components/ui/datepicker-input';
// import Input from '../../components/ui/input';
// import Select from '../../components/ui/select';
// import Switch from '../../components/ui/switch';
// import TextArea from '../../components/ui/textarea';
// import Toolbar from '../../components/ui/toolbar';
// import { useMutationAction } from '../../hooks/queries-actions';
// import { useAppSelector } from '../../hooks/redux';
// import { DiscountFormData, initialDiscountState, Discount } from '../../types/discount';

// const AddDiscountPage: React.FC = () => {
//     const navigate = useNavigate();
//     // Use DiscountFormData type which includes Date objects for pickers
//     const [formData, setFormData] = useState<DiscountFormData>(initialDiscountState);
//     const [formError, setFormError] = useState<string | null>(null);
//     const [formSuccess, setFormSuccess] = useState<string | null>(null);
//      const { restaurant } = useAppSelector(state => state.auth_store); // Get currency
//      const currencyIcon = restaurant?.currency_icon || 'ر.س';

//     // --- API Mutation ---
//     const { mutateAsync: createDiscount, isLoading } = useMutationAction<Discount, Partial<Discount>>({ // Correct types
//         url: 'discounts',
//         method: 'POST',
//         key: ['discounts'], // Invalidate discounts list on success
//     });

//     // --- Handlers ---
//     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value, type } = e.target;
//         let processedValue: any = value;

//         if (type === 'number') {
//             processedValue = value === '' ? '' : value; // Keep empty string for number input, parse on submit
//         }

//         // Clear value if type changes
//         if (name === 'type') {
//             setFormData(prev => ({ ...prev, value: '', [name]: value })); // Clear value string
//         } else {
//             setFormData(prev => ({ ...prev, [name]: processedValue }));
//         }
//         if (formError) setFormError(null);
//         if (formSuccess) setFormSuccess(null);
//     };

//      // Handler specifically for DatePickerInput
//      const handleDateChange = (date: Date | null, fieldName: 'start_date_obj' | 'end_date_obj') => {
//          setFormData(prev => ({ ...prev, [fieldName]: date }));
//          if (formError) setFormError(null);
//          if (formSuccess) setFormSuccess(null);
//      };

//     const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, checked } = e.target;
//         setFormData(prev => ({ ...prev, [name as keyof DiscountFormData]: checked }));
//         if (formError) setFormError(null);
//         if (formSuccess) setFormSuccess(null);
//     };

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setFormError(null);
//         setFormSuccess(null);

//         // --- Validation ---
//         if (!formData.name || !formData.type || formData.value === null || formData.value === '') {
//             setFormError("الرجاء تعبئة الحقول المطلوبة: الاسم، النوع، والقيمة.");
//             return;
//         }
//          const numericValue = parseFloat(String(formData.value));
//          if (isNaN(numericValue) || numericValue <= 0) {
//              setFormError("قيمة الخصم يجب أن تكون رقمًا موجبًا.");
//              return;
//          }
//          if (formData.type === 'percentage' && (numericValue > 100)) {
//              setFormError("قيمة النسبة المئوية لا يمكن أن تتجاوز 100.");
//              return;
//          }
//          if (formData.start_date_obj && formData.end_date_obj && formData.end_date_obj < formData.start_date_obj) {
//              setFormError("تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.");
//              return;
//          }
//         // --- End Validation ---

//         // --- Prepare Payload ---
//         const payload: Partial<Discount> = {
//             name: formData.name,
//             description: formData.description || null,
//             type: formData.type,
//             value: numericValue, // Send parsed number
//             is_active: formData.is_active,
//             // Format Date objects to ISO string or desired format for backend
//             start_date: formData.start_date_obj ? formatDateISO(formData.start_date_obj, "yyyy-MM-dd HH:mm:ss") : null,
//             end_date: formData.end_date_obj ? formatDateISO(formData.end_date_obj, "yyyy-MM-dd HH:mm:ss") : null,
//              // TODO: shop_id
//         };

//         // --- API Call ---
//         try {
//             await createDiscount(payload, {
//                 onSuccess: (response) => {
//                     setFormSuccess(`تم إنشاء الخصم "${response.data.name}" بنجاح!`);
//                     setFormData(initialDiscountState); // Reset form
//                     setTimeout(() => navigate('/discounts'), 1500);
//                 },
//                 onError: (error) => {
//                      const message = (error.response?.data as any)?.message || "فشل إنشاء الخصم.";
//                      setFormError(message);
//                      setFormSuccess(null);
//                 },
//             });
//         } catch (error) {
//             setFormError("حدث خطأ غير متوقع.");
//             setFormSuccess(null);
//         }
//     };

//     // --- Toolbar Config ---
//     const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "التسويق" }, { label: "الخصومات", href: "/discounts" }, { label: "إضافة جديد" }, ];
//     const toolbarActions = ( <Link to="/discounts"><Button variant="secondary"  size="sm">العودة للخصومات</Button></Link> );

//     return (
//         <div className="space-y-6 pb-10">
//             <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />

//             {formError && <Alert variant="error" message={formError} onClose={() => setFormError(null)} />}
//             {formSuccess && <Alert variant="success" message={formSuccess} onClose={() => setFormSuccess(null)} />}

//             <form onSubmit={handleSubmit}>
//                 <Card title="إنشاء خصم جديد" description="إضافة خصومات يمكن تطبيقها على المنتجات أو ربطها بالكوبونات لاحقاً.">
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6 mt-4">

//                         {/* Left Column (Details) */}
//                         <div className="lg:col-span-2 space-y-5">
//                             <Input label="اسم الخصم *" name="name" value={formData.name} onChange={handleChange} required placeholder="مثال: خصم اليوم الوطني، خصم الافتتاح" disabled={isLoading} />
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                                 <Select label="نوع الخصم *" name="type" value={formData.type} onChange={handleChange} required size="md" disabled={isLoading}
//                                     options={[
//                                         { value: 'percentage', label: 'نسبة مئوية (%)' },
//                                         { value: 'fixed_amount_off', label: 'مبلغ ثابت (خصم من الإجمالي)' },
//                                         { value: 'fixed_price', label: 'سعر ثابت للمنتج (يتطلب ربط)' }, // Requires linking logic later
//                                     ]}
//                                     placeholder="-- اختر النوع --"
//                                 />
//                                 <Input label="القيمة *" name="value" type="number" value={String(formData.value ?? '')} onChange={handleChange} required placeholder={formData.type === 'percentage' ? '10' : '25'} min="0.01" step="0.01" disabled={isLoading}
//                                     suffix={formData.type === 'percentage' ? '%' : currencyIcon}
//                                 />
//                             </div>
//                             <TextArea label="الوصف (اختياري)" name="description" value={formData.description || ''} onChange={handleChange} rows={3} placeholder="وصف موجز للخصم والغرض منه..." disabled={isLoading}/>
//                         </div>

//                         {/* Right Column (Activation & Dates) */}
//                         <div className="lg:col-span-1 space-y-5 lg:border-r lg:pr-8 lg:border-gray-200">
//                              <h4 className="text-sm font-semibold text-gray-600 border-b pb-2 mb-1">التفعيل والصلاحية</h4>
//                             <Switch label="تفعيل الخصم" name="is_active" checked={formData.is_active} onChange={handleSwitchChange} disabled={isLoading}/>
//                              <DatePickerInput
//                                 label="تاريخ البدء (اختياري)"
//                                 selectedDate={formData.start_date_obj}
//                                 onChange={(date) => handleDateChange(date, 'start_date_obj')}
//                                 showTimeSelect // Enable time selection
//                                 dateFormat="yyyy/MM/dd hh:mm aa" // Format with time
//                                 placeholder="اتركه فارغاً ليبدأ فوراً"
//                                 disabled={isLoading}
//                              />
//                              <DatePickerInput
//                                 label="تاريخ الانتهاء (اختياري)"
//                                 selectedDate={formData.end_date_obj}
//                                 onChange={(date) => handleDateChange(date, 'end_date_obj')}
//                                 showTimeSelect
//                                 dateFormat="yyyy/MM/dd hh:mm aa"
//                                 placeholder="اتركه فارغاً بلا نهاية"
//                                 minDate={formData.start_date_obj} // Prevent end before start
//                                 disabled={isLoading}
//                              />
//                              <p className="text-xs text-gray-500 flex items-center gap-1 pt-2"><Info size={14}/> سيتم تطبيق الخصم ضمن التواريخ المحددة إذا تم إدخالها.</p>
//                         </div>
//                     </div>

//                     {/* Form Actions */}
//                      <div className="mt-8 pt-5 border-t border-gray-200 flex justify-start gap-2">
//                          <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading} icon={Save}>
//                              إنشاء الخصم
//                          </Button>
//                          <Button type="button" variant="secondary" onClick={() => navigate('/discounts')} disabled={isLoading}>
//                              إلغاء
//                          </Button>
//                      </div>
//                 </Card>
//             </form>
//         </div>
//     );
// };

// export default AddDiscountPage;