import React, { useState, useEffect } from 'react';
import { useGetQuery } from '../../hooks/queries-actions';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import { Coupon, DiscountType } from '../../types/coupon';
import Select from '../../components/ui/select';

interface CouponFormProps {
  coupon?: Coupon;
  onSubmit: (data: Partial<Coupon>) => void;
  onCancel: () => void;
}

const CouponForm: React.FC<CouponFormProps> = ({ coupon, onSubmit, onCancel }) => {
  // Fetch coupon data if editing
  const { data: fetchedCoupon } = useGetQuery<Coupon>({
    key: ['coupon', coupon?.id],
    url: `coupons/${coupon?.id}`,
    options: {
      enabled: !!coupon?.id,
    }
  });

  // Initialize form state with coupon data or defaults
  const [formData, setFormData] = useState<Partial<Coupon>>({    code: coupon?.code || '',
    description: coupon?.description || '',
    discount_type: coupon?.discount_type || 'percentage',
    discount_value: coupon?.discount_value || 0,
    is_active: coupon?.is_active ?? true,
    expires_at: coupon?.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : '',
    per_user_limit: coupon?.per_user_limit || 1,
    usage_limit: coupon?.usage_limit || 0,
    min_order_amount: coupon?.min_order_amount || 0,
    max_discount: coupon?.max_discount || 0,
  });

  const DISCOUNT_TYPE_ENUM_COUPON = {
    PERCENTAGE: 'PERCENTAGE',
    FIXED: 'FIXED'
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.code) {
      newErrors.code = 'كود الكوبون مطلوب';
    }

    if (!formData.discount_type) {
      newErrors.discount_type = 'نوع الخصم مطلوب';
    } else if (!Object.values(DISCOUNT_TYPE_ENUM_COUPON).includes(formData.discount_type)) {
      newErrors.discount_type = 'نوع الخصم غير صالح';
    }

    if (!formData.discount_value) {
      newErrors.discount_value = 'قيمة الخصم مطلوبة';
    } else if (isNaN(Number(formData.discount_value))) {
      newErrors.discount_value = 'قيمة الخصم يجب أن تكون رقماً';
    } else if (Number(formData.discount_value) <= 0) {
      newErrors.discount_value = 'قيمة الخصم يجب أن تكون أكبر من 0';
    }
    
    // Date validation
    if (!formData.expires_at) {
      newErrors.expires_at = 'تاريخ الانتهاء مطلوب';
    } else {
      const expiryDate = new Date(formData.expires_at);
      if (expiryDate <= new Date()) {
        newErrors.expires_at = 'يجب أن يكون تاريخ الانتهاء في المستقبل';
      }
    }

    // Numeric validations
    if (formData.min_order_amount && isNaN(Number(formData.min_order_amount))) {
      newErrors.min_order_amount = 'يجب أن يكون الحد الأدنى للطلب رقماً';
    }

    if (formData.max_discount && isNaN(Number(formData.max_discount))) {
      newErrors.max_discount = 'يجب أن يكون الحد الأقصى للخصم رقماً';
    }

    if (formData.usage_limit && isNaN(Number(formData.usage_limit))) {
      newErrors.usage_limit = 'يجب أن يكون حد الاستخدام رقماً';
    }

    if (formData.per_user_limit && isNaN(Number(formData.per_user_limit))) {
      newErrors.per_user_limit = 'يجب أن يكون حد الاستخدام لكل مستخدم رقماً';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update form data when fetched coupon changes
  useEffect(() => {
    if (fetchedCoupon) {
      setFormData({
        code: fetchedCoupon.code,
        description: fetchedCoupon.description || '',
        discount_type: fetchedCoupon.discount_type,
        discount_value: fetchedCoupon.discount_value,
        is_active: fetchedCoupon.is_active,
        expires_at: fetchedCoupon.expires_at ? new Date(fetchedCoupon.expires_at).toISOString().split('T')[0] : '',
        per_user_limit: fetchedCoupon.per_user_limit || 1,
      });
    }
  }, [fetchedCoupon]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format data for API
      const formattedData = {
        ...formData,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        discount_value: formData.discount_value ? Number(formData.discount_value) : null,
        per_user_limit: formData.per_user_limit ? Number(formData.per_user_limit) : 1,
        usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
        min_order_amount: formData.min_order_amount ? Number(formData.min_order_amount) : null,
        max_discount: formData.max_discount ? Number(formData.max_discount) : null,
      };
      
      onSubmit(formattedData as Partial<Coupon>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coupon Code */}
        <div>
          <Input
            label="كود الكوبون *"
            name="code"
            value={formData.code}
            onChange={handleChange}
            error={errors.code}
            placeholder="مثال: SUMMER2023"
            className="uppercase"
            required
          />
        </div>
        
        {/* Discount Type */}
        <div>
          <Select
            label="نوع الخصم *"
            value={formData.discount_type}
            onChange={(e) => {
                setFormData({...formData, discount_type: e as DiscountType});
            }}
            error={errors.discount_type}
            options={[
              { value: DISCOUNT_TYPE_ENUM_COUPON.PERCENTAGE, label: 'نسبة مئوية (%)' },
              { value: DISCOUNT_TYPE_ENUM_COUPON.FIXED, label: 'مبلغ ثابت' }
            ]}
          />
        </div>
        
        {/* Discount Value */}
        <div>
          <Input
            label="قيمة الخصم *"
            name="discount_value"
            type="number"
            value={formData.discount_value as number}
            onChange={handleChange}
            error={errors.discount_value}
            suffix={formData.discount_type === DISCOUNT_TYPE_ENUM_COUPON.PERCENTAGE ? '%' : 'ر.س'}
            min={1}
            max={formData.discount_type === DISCOUNT_TYPE_ENUM_COUPON.PERCENTAGE ? 100 : undefined}
            step="0.01"
            required
          />
        </div>
        
        {/* Description */}
        <div>
          <Input
            label="الوصف"
            name="description"
            value={formData.description as string}
            onChange={handleChange}
            error={errors.description}
            placeholder="وصف مختصر للكوبون"
          />
        </div>
        
        {/* Minimum Order Amount */}
        <div>
          <Input
            label="الحد الأدنى للطلب"
            name="min_order_amount"
            type="number"
            value={formData.min_order_amount as number}
            onChange={handleChange}
            error={errors.min_order_amount}
            suffix="ر.س"
            min="0"
            step="0.01"
          />
        </div>
        
        {/* Maximum Discount Amount (for percentage) */}
        <div>
          <Input
            label="الحد الأقصى للخصم"
            name="max_discount"
            type="number"
            value={formData.max_discount as number}
            onChange={handleChange}
            error={errors.max_discount}
            suffix="ر.س"
            min="0"
            step="0.01"
            placeholder="بدون حد أقصى"
          />
        </div>
        
        {/* Start Date */}
        <div>
          <Input
            label="تاريخ الانتهاء *"
            name="expires_at"
            type="date"
            value={formData.expires_at as string}
            onChange={handleChange}
            error={errors.expires_at}
            required
          />
        </div>
        
        {/* Usage Limit Per Customer */}
        <div>
          <Input
            label="الحد الأقصى للاستخدام لكل عميل"
            name="per_user_limit"
            type="number"
            value={formData.per_user_limit as number}
            onChange={handleChange}
            error={errors.per_user_limit}
            min="1"
            step="1"
          />
        </div>
        
        {/* Total Usage Limit */}
        <div>
          <Input
            label="الحد الأقصى للاستخدام الكلي"
            name="usage_limit"
            type="number"
            value={formData.usage_limit as number}
            onChange={handleChange}
            error={errors.usage_limit}
            min="1"
            step="1"
            placeholder="بدون حد"
          />
        </div>
      </div>
      
      {/* Active Status */}
      <div className="mt-4">
        {/* <Checkbox
          label="نشط"
          name="is_active"
          checked={formData.is_active ?? true}
          onChange={handleChange}
        /> */}
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit">
          {coupon ? 'تحديث الكوبون' : 'إضافة كوبون'}
        </Button>
      </div>
    </form>
  );
};

export default CouponForm;