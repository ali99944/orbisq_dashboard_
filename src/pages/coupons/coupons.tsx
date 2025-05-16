import React, { useState } from 'react';
import { Edit, Trash2, Plus, AlertTriangle } from 'lucide-react';
import DataTable from '../../components/ui/data-table';
import Button from '../../components/ui/button';
import Modal from '../../components/ui/modal';
import Alert from '../../components/ui/alert';
import Badge, { BadgeColor } from '../../components/ui/badge';
import { Coupon } from '../../types/coupon';
import CouponForm from './coupon-form';

import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
import { toast } from 'react-hot-toast';

const CouponsPage: React.FC = () => {
//   const navigate = useNavigate();
  const { data: coupons = [], isLoading, error } = useGetQuery<Coupon[]>({
    key: ['coupons'],
    url: 'coupons',
  });
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // API mutations
  const createCouponMutation = useMutationAction<Coupon, Partial<Coupon>>({
    method: 'post',
    url: 'coupons',
    key: ['coupons'],
    onSuccessCallback: () => {
      toast.success('تم إنشاء الكوبون بنجاح');
      setIsCreateModalOpen(false);
    },
    onErrorCallback: () => toast.error('حدث خطأ أثناء إنشاء الكوبون')
  });

  const updateCouponMutation = useMutationAction<Coupon, Partial<Coupon>>({
    method: 'put',
    url: `coupons/${selectedCoupon?.id}`,
    key: ['coupons'],
    onSuccessCallback: () => {
      toast.success('تم تحديث الكوبون بنجاح');
      setIsEditModalOpen(false);
      setSelectedCoupon(null);
    },
    onErrorCallback: () => toast.error('حدث خطأ أثناء تحديث الكوبون')
  });

  const deleteCouponMutation = useMutationAction<void, void>({
    method: 'delete',
    url: `coupons/${selectedCoupon?.id}`,
    key: ['coupons'],
    onSuccessCallback: () => {
      toast.success('تم حذف الكوبون بنجاح');
      setIsDeleteModalOpen(false);
      setSelectedCoupon(null);
    },
    onErrorCallback: () => toast.error('حدث خطأ أثناء حذف الكوبون')
  });

  // Handle create coupon
  const handleCreateCoupon = (couponData: Partial<Coupon>) => {
    createCouponMutation.mutate(couponData);
  };

  // Handle update coupon
  const handleUpdateCoupon = (couponData: Partial<Coupon>) => {
    if (!selectedCoupon) return;
    updateCouponMutation.mutate(couponData);
  };

  // Handle delete coupon
  const handleDeleteCoupon = () => {
    if (!selectedCoupon) return;
    deleteCouponMutation.mutate();
  };

  // Table columns definition
  const columns = [
    {
      key: 'code',
      header: 'كود الكوبون',
      render: (coupon: Coupon) => (
        <div className="font-medium">{coupon.code}</div>
      )
    },
    {
      key: 'description',
      header: 'الوصف',
      render: (coupon: Coupon) => (
        <div className="max-w-xs truncate">{coupon.description || '-'}</div>
      )
    },
    {
      key: 'discount',
      header: 'الخصم',
      render: (coupon: Coupon) => {
        if (coupon.discount_type === 'percentage') {
          return <div>{coupon.discount_value}%</div>;
        } else if (coupon.discount_type === 'fixed_amount_off') {
          return <div>{coupon.discount_value} ر.س</div>;
        }
        return <div>-</div>;
      }
    },
    {
      key: 'usage',
      header: 'الاستخدام',
      render: (coupon: Coupon) => {
        const limit = coupon.per_user_limit;
        return (
          <div>
            {coupon.times_used} {limit ? `/ ${limit}` : ''}
          </div>
        );
      }
    },
    {
      key: 'validity',
      header: 'الصلاحية',
      render: (coupon: Coupon) => {
        if (coupon.expires_at) {
          return <div>{new Date(coupon.expires_at).toLocaleDateString()}</div>;
        }
        const status = 'صالح';
        const color = 'green';

        
        return (
          <Badge color={color as BadgeColor}>{status}</Badge>
        );
      }
    },
    {
      key: 'status',
      header: 'الحالة',
      render: (coupon: Coupon) => (
        <Badge color={coupon.is_active ? 'green' : 'gray'}>
          {coupon.is_active ? 'نشط' : 'غير نشط'}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'الإجراءات',
      render: (coupon: Coupon) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCoupon(coupon);
              setIsEditModalOpen(true);
            }}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCoupon(coupon);
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">الكوبونات</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          إضافة كوبون
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert 
          variant="error" 
          title="خطأ" 
          message={error.message}
        //   onClose={() => setError(null)}
        />
      )}

      {/* Coupons Table */}
      <DataTable
        columns={columns}
        data={coupons}
        isLoading={isLoading}
        error={error?.message}
        emptyStateMessage="لا توجد كوبونات لعرضها."
      />

      {/* Create Coupon Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إضافة كوبون جديد"
        size="lg"
      >
        <CouponForm 
          onSubmit={handleCreateCoupon} 
          onCancel={() => setIsCreateModalOpen(false)} 
        />
      </Modal>

      {/* Edit Coupon Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCoupon(null);
        }}
        title="تعديل الكوبون"
        size="lg"
      >
        {selectedCoupon && (
          <CouponForm 
            coupon={selectedCoupon} 
            onSubmit={handleUpdateCoupon} 
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedCoupon(null);
            }} 
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCoupon(null);
        }}
        title="حذف الكوبون"
        size="sm"
      >
        <div className="p-4 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">تأكيد الحذف</h3>
          <p className="text-sm text-gray-500 mb-6">
            هل أنت متأكد من رغبتك في حذف الكوبون "{selectedCoupon?.code}"؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedCoupon(null);
              }}
            >
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCoupon}
            >
              حذف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CouponsPage;