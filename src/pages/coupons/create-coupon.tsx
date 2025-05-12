// src/pages/marketing/AddCouponPage.tsx (Example Path)

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutationAction } from '../../hooks/queries-actions'; // Adjust path
import type { Coupon } from '../../types/coupon'; // Adjust path
import { Save, CalendarDays, Info, Users, Repeat } from 'lucide-react';
import Alert from '../../components/ui/alert';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import Input from '../../components/ui/input';
import Select from '../../components/ui/select';
import Switch from '../../components/ui/switch';
import TextArea from '../../components/ui/textarea';
import Toolbar from '../../components/ui/toolbar';

// Initial state for a new coupon
// Omit fields managed by backend/context. Add optional currency_icon for suffix logic.
const initialCouponState: Omit<Coupon, 'id' | 'shop_id' | 'created_at' | 'updated_at' | 'times_used' | 'discount_id'> & {currency_icon?: string} = {
    code: '',
    description: '',
    type: 'percentage', // Default type
    value: null,
    is_active: true,
    start_date: null,
    end_date: null,
    usage_limit_per_customer: null,
    usage_limit_total: null,
    minimum_order_amount: null,
    currency_icon: 'ج.م', // Example default, fetch from restaurant context ideally
};


// --- Main Component ---
const AddCouponPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialCouponState);
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null); // Add success state

    // --- API Mutation Hook Usage ---
    // Specify TData as Coupon (expected successful response data)
    // Specify TVariables as Partial<Coupon> (data sent to API)
    const { isPending: is_creating_coupon } = useMutationAction<Coupon, Partial<Coupon>>({
        url: 'coupons', // Your API endpoint for creating coupons
        method: 'post',
        key: ['coupons'], // Query key to invalidate on success (refresh coupon list)
    });

    // --- Handlers ---
    const handleChange = () => {
        // const { name, value, type } = e.target;
        // let processedValue: string = value;

        // Convert empty string to null for optional number/date fields
        // if (type === 'number' || type === 'datetime-local' || type === 'date') {
        //     processedValue = value === '' ? null : value;
        // }
        //  // Handle coupon code specifically - uppercase and no spaces/special chars
        //  if (name === 'code') {
        //      processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        //  }

        // Clear messages on interaction
        if (formError) setFormError(null);
        if (formSuccess) setFormSuccess(null);
    };

    const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        // Ensure name matches a key in the initial state type for safety
        setFormData(prev => ({ ...prev, [name as keyof typeof initialCouponState]: checked }));
        if (formError) setFormError(null);
        if (formSuccess) setFormSuccess(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        // --- Client-side Validation ---
        if (!formData.code || !formData.type || formData.value === null || formData.value === '') {
            setFormError("الرجاء تعبئة الحقول المطلوبة: الكود، النوع، وقيمة الخصم.");
            return;
        }
        if (formData.type === 'percentage' && (parseFloat(String(formData.value)) <= 0 || parseFloat(String(formData.value)) > 100)) {
             setFormError("يجب أن تكون قيمة النسبة المئوية بين 0.01 و 100."); // Allow decimals below 1
             return;
         }
         if (formData.type === 'fixed_amount' && parseFloat(String(formData.value)) <= 0) {
            setFormError("يجب أن يكون مبلغ الخصم أكبر من صفر.");
            return;
         }
          if (formData.start_date && formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
             setFormError("تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.");
             return;
         }
          if (formData.minimum_order_amount && parseFloat(String(formData.minimum_order_amount)) < 0) {
             setFormError("الحد الأدنى للطلب لا يمكن أن يكون سالباً.");
             return;
          }
           if (formData.usage_limit_per_customer && parseInt(String(formData.usage_limit_per_customer), 10) < 1) {
              setFormError("حد الاستخدام للعميل يجب أن يكون 1 أو أكثر.");
              return;
           }
            if (formData.usage_limit_total && parseInt(String(formData.usage_limit_total), 10) < 1) {
               setFormError("حد الاستخدام الإجمالي يجب أن يكون 1 أو أكثر.");
               return;
            }
        // --- End Validation ---


        // --- Prepare Payload for API ---
        // const payload = {
        //     ...formData,
        //     value: formData.value ? parseFloat(String(formData.value)) : null,
        //     usage_limit_per_customer: formData.usage_limit_per_customer ? parseInt(String(formData.usage_limit_per_customer), 10) : null,
        //     usage_limit_total: formData.usage_limit_total ? parseInt(String(formData.usage_limit_total), 10) : null,
        //     minimum_order_amount: formData.minimum_order_amount ? parseFloat(String(formData.minimum_order_amount)) : null,
        //     // Ensure dates are formatted consistently for the backend
        //     start_date: formData.start_date ? format(new Date(formData.start_date), "yyyy-MM-dd HH:mm:ss") : null,
        //     end_date: formData.end_date ? format(new Date(formData.end_date), "yyyy-MM-dd HH:mm:ss") : null,
        //     is_active: formData.is_active ? 1 : 0, // Send as 1 or 0 if backend expects integer boolean
        // };
        // Remove helper currency icon before sending payload
        // delete (payload as any).currency_icon;


        // --- API Call ---
        try {
            // await createCoupon(payload, {
            //     onSuccess: (response) => { // Access TApiSuccess<Coupon>
            //         setFormSuccess(`تم إنشاء الكوبون "${response.code}" بنجاح!`);
            //         setFormData(initialCouponState); // Reset form on success
            //         // Optional: Redirect after a short delay
            //          setTimeout(() => navigate('/coupons'), 1500);
            //     },
            //     onError: (error) => { // Access AxiosError
            //         // Extract error message from backend response if available
            //         const backendError = (error.response?.data as {errors: Record<string, string[]>})?.errors;
            //         let message = (error.response?.data as {message: string})?.message || "فشل إنشاء الكوبون.";
            //         if (backendError && typeof backendError === 'object') {
            //             // Get the first validation error message
            //             const firstErrorKey = Object.keys(backendError)[0];
            //             if (firstErrorKey && Array.isArray(backendError[firstErrorKey])) {
            //                 message = backendError[firstErrorKey][0];
            //             }
            //         }
            //         setFormError(message);
            //         setFormSuccess(null); // Clear success message on new error
            //     },
            // });
        } catch (error) {
            console.error("Submit Error:", error);
            setFormError("حدث خطأ غير متوقع أثناء عملية الحفظ.");
            setFormSuccess(null);
        }
    };

    // --- Toolbar Config ---
    const breadcrumbItems = [
        { label: "لوحة التحكم", href: "/" },
        // { label: "التسويق", href: "/marketing" }, // Optional parent link
        { label: "الكوبونات", href: "/coupons" },
        { label: "إضافة كوبون جديد" },
    ];
    const toolbarActions = (
        <Link to="/coupons">
            <Button variant="secondary" size="sm">
                العودة لقائمة الكوبونات
            </Button>
        </Link>
    );

    // --- Render ---
    return (
        <div className="space-y-6 pb-10">
            <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />

            {/* --- Alert Messages --- */}
            {formError && <Alert variant="error" message={formError} onClose={() => setFormError(null)} />}
            {formSuccess && <Alert variant="success" message={formSuccess} onClose={() => setFormSuccess(null)} />}

            {/* --- Form --- */}
            <form onSubmit={handleSubmit}>
                 {/* Use Card component for grouping */}
                <Card title="تفاصيل الكوبون الأساسية" description="أدخل معلومات الكوبون الرئيسية وقيمة الخصم.">
                    {/* --- Main Details Section --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 mt-4">
                        {/* Coupon Code */}
                        <Input
                            label="كود الكوبون *"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            placeholder="EID24 أو WELCOME15"
                            className="ltr font-mono tracking-wider text-sm" // LTR & Mono for code
                            dir="ltr"
                            disabled={is_creating_coupon}
                            maxLength={30} // Example max length
                            error={formError && formData.code === '' ? 'الكود مطلوب' : undefined} // Example inline error
                         />

                         {/* Coupon Type */}
                         <Select
                         onChange={() => {}}
                            label="نوع الخصم *"
                            value={String(formData.type)}
                            // onChange={(e) => setFormData({ ...formData, type: e.target?.value as 'percentage' | 'fixed_amount' })}
                            options={[
                                { value: 'percentage', label: 'نسبة مئوية (%)' },
                                { value: 'fixed_amount', label: 'مبلغ ثابت' },
                            ]}
                             placeholder="-- اختر النوع --"
                             error={formError && !formData.type ? 'النوع مطلوب' : undefined}
                         />

                         {/* Coupon Value */}
                         <Input
                            label="قيمة الخصم *"
                            name="value"
                            type="number"
                            value={String(formData.value ?? '')}
                            onChange={handleChange}
                            required
                            placeholder={formData.type === 'percentage' ? 'مثال: 15' : 'مثال: 50'}
                            min="0.01"
                            step="0.01"
                            disabled={is_creating_coupon}
                            suffix={ // Dynamic suffix
                                <span className="text-gray-500 text-xs">
                                    {formData.type === 'percentage' ? '%' : (formData.currency_icon || 'ر.س')}
                                </span>
                            }
                            error={formError && !formData.value ? 'القيمة مطلوبة' : undefined}
                         />
                    </div>
                     {/* Description */}
                     <div className="mt-5">
                         <TextArea
                            label="الوصف (ملاحظات داخلية لك)"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            rows={5}
                            placeholder="مثال: كوبون خاص بحملة العيد، خصم للعملاء الجدد..."
                            disabled={is_creating_coupon}
                            maxLength={255}
                          />
                     </div>
                </Card>

                 <Card title="شروط الاستخدام والقيود" className="mt-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                         {/* Dates */}
                         <Input label="تاريخ بدء الصلاحية" name="start_date" type="datetime-local" value={formData.start_date || ''} onChange={handleChange} icon={CalendarDays} size="sm" disabled={is_creating_coupon}/>
                         <Input label="تاريخ انتهاء الصلاحية" name="end_date" type="datetime-local" value={formData.end_date || ''} onChange={handleChange} icon={CalendarDays} size="sm" disabled={is_creating_coupon}/>

                        {/* Minimum Order */}
                        <Input label="الحد الأدنى لقيمة الطلب" name="minimum_order_amount" type="number" value={String(formData.minimum_order_amount ?? '')} onChange={handleChange} min="0" step="0.01" placeholder="اتركه فارغاً لعدم التحديد" size="sm" suffix={formData.currency_icon || 'ر.س'} disabled={is_creating_coupon} icon={Info} />

                        {/* Usage Limits */}
                         <Input label="حد الاستخدام لكل عميل" name="usage_limit_per_customer" type="number" value={String(formData.usage_limit_per_customer ?? '')} onChange={handleChange} min="1" step="1" placeholder="اتركه فارغاً لغير محدود" icon={Users} size="sm" disabled={is_creating_coupon}/>
                         <Input label="حد الاستخدام الإجمالي للكوبون" name="usage_limit_total" type="number" value={String(formData.usage_limit_total ?? '')} onChange={handleChange} min="1" step="1" placeholder="اتركه فارغاً لغير محدود" icon={Repeat} size="sm" disabled={is_creating_coupon}/>

                         {/* Status */}
                         <div className="flex items-center pt-5"> {/* Align vertically */}
                              <Switch
                                 label="تفعيل الكوبون"
                                 description="هل الكوبون فعال ويمكن استخدامه؟"
                                 name="is_active"
                                 checked={formData.is_active}
                                 onChange={handleSwitchChange}
                                 disabled={is_creating_coupon}
                               />
                         </div>
                     </div>
                 </Card>

                 {/* Form Submit Actions */}
                <div className="mt-8 flex justify-start gap-3"> {/* Align actions to start (right in RTL) */}
                    <Button type="submit" variant="primary" isLoading={is_creating_coupon} disabled={is_creating_coupon} icon={Save} >
                        إنشاء الكوبون
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/coupons')} disabled={is_creating_coupon}>
                        إلغاء
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddCouponPage;