import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useMutationAction } from '../../hooks/queries-actions';
import { toast } from 'react-hot-toast';
import Card from '../../components/ui/card';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';

interface ChangePasswordFormData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordFormData, string>>>({});

  const changePasswordMutation = useMutationAction<void, ChangePasswordFormData>({
    method: 'post',
    url: '/auth/change-password',
    onSuccessCallback: () => {
      toast.success('تم تغيير كلمة المرور بنجاح');
      navigate('/dashboard');
    },
    onErrorCallback: () => {
    //   if (error.response?.data?.message) {
    //     toast.error(error.response.data.message);
    //   } else {
    //     toast.error('حدث خطأ أثناء تغيير كلمة المرور');
    //   }
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ChangePasswordFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ChangePasswordFormData, string>> = {};

    if (!formData.current_password) {
      newErrors.current_password = 'كلمة المرور الحالية مطلوبة';
    }

    if (!formData.new_password) {
      newErrors.new_password = 'كلمة المرور الجديدة مطلوبة';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل';
    }

    if (!formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'كلمة المرور غير متطابقة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      changePasswordMutation.mutate(formData);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 p-2">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 mx-auto text-primary mb-2" />
            <h1 className="text-2xl font-bold">تغيير كلمة المرور</h1>
            <p className="text-gray-500 mt-1">قم بتغيير كلمة المرور الخاصة بك</p>
          </div>

          <div className="space-y-4">
            <Input
              label="كلمة المرور الحالية"
              name="current_password"
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.current_password}
              onChange={handleChange}
              error={errors.current_password}
              suffix={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <Input
              label="كلمة المرور الجديدة"
              name="new_password"
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.new_password}
              onChange={handleChange}
              error={errors.new_password}
              suffix={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <Input
              label="تأكيد كلمة المرور الجديدة"
              name="new_password_confirmation"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.new_password_confirmation}
              onChange={handleChange}
              error={errors.new_password_confirmation}
              suffix={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              type="button"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              isLoading={changePasswordMutation.isPending}
            >
              تغيير كلمة المرور
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;