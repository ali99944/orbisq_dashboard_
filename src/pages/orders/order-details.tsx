// src/pages/orders/order-details.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Calendar, Clock, MapPin, Phone, ShoppingBag, 
  Truck, User, ChevronDown, CheckCircle, XCircle, CreditCard, Edit
} from 'lucide-react';

import { useAppSelector } from '../../hooks/redux';
import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
import Alert from '../../components/ui/alert';
import Badge, { BadgeColor } from '../../components/ui/badge';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import Spinner from '../../components/ui/spinner';
import Toolbar from '../../components/ui/toolbar';
import { ApiErrorWithMessage } from '../../types/error';
import Select from '../../components/ui/select';
import Modal from '../../components/ui/modal';
import TextArea from '../../components/ui/textarea';
import Tabs from '../../components/ui/tabs';

// Interfaces
interface OrderItemModifier {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderItemAddon {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_requests?: string;
  variant_options?: Record<string, string>;
  status: string;
  started_at?: Date;
  completed_at?: Date;
  created_at: Date;
  modifiers?: OrderItemModifier[];
  addons?: OrderItemAddon[];
}

interface OrderStatusHistory {
  id: number;
  status: string;
  created_at: Date;
  user_name?: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  customer_name?: string;
  customer_phone?: string;
  desk_number?: number;
  order_type: string;
  takeaway_pickup_time?: Date;
  takeaway_customer_name?: string;
  takeaway_customer_phone?: string;
  delivery_address?: string;
  delivery_landmark?: string;
  delivery_instructions?: string;
  delivery_customer_name?: string;
  delivery_customer_phone?: string;
  estimated_delivery_time?: Date;
  actual_delivery_time?: Date;
  delivery_fee?: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  service_charge?: number;
  tip_amount?: number;
  total: number;
  payment_status: string;
  payment_method?: string;
  transaction_id?: string;
  paid_at?: Date;
  placed_at: Date;
  preparation_time?: number;
  ready_at?: Date;
  served_at?: Date;
  completed_at?: Date;
  notes?: string;
  shop_id: number;
  cancelled_at?: Date;
  cancellation_reason?: string;
  created_at: Date;
  updated_at: Date;
  order_items: OrderItem[];
  status_history?: OrderStatusHistory[];
}

// Status options
const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'قيد الانتظار' },
  { value: 'confirmed', label: 'مؤكد' },
  { value: 'preparing', label: 'قيد التحضير' },
  { value: 'ready', label: 'جاهز' },
  { value: 'served', label: 'تم التقديم' },
  { value: 'out_for_delivery', label: 'قيد التوصيل' },
  { value: 'delivered', label: 'تم التوصيل' },
  { value: 'completed', label: 'مكتمل' },
  { value: 'cancelled', label: 'ملغي' }
];

// const PAYMENT_STATUS_OPTIONS = [
//   { value: 'unpaid', label: 'غير مدفوع' },
//   { value: 'partially_paid', label: 'مدفوع جزئياً' },
//   { value: 'paid', label: 'مدفوع' },
//   { value: 'refunded', label: 'مسترجع' }
// ];

const ITEM_STATUS_OPTIONS = [
  { value: 'pending', label: 'قيد الانتظار' },
  { value: 'preparing', label: 'قيد التحضير' },
  { value: 'completed', label: 'مكتمل' }
];

const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: 'نقداً' },
  { value: 'card', label: 'بطاقة ائتمان' },
  { value: 'wallet', label: 'محفظة إلكترونية' }
];

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currency_info = useAppSelector(state => state.auth_store.portal?.shop.currency_info);
  const currencyIcon = currency_info?.currency_code || 'ج.م';
  
  // State for editing and modals
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('details');
  const [cancellationReason, setCancellationReason] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [expandedItems, setExpandedItems] = useState<{[key: number]: boolean}>({});

  // Fetch order details
  const { 
    data: order, 
    isLoading, 
    error 
  } = useGetQuery<Order>({
    key: ['order', id],
    url: `orders/${id}?include=order_items,status_history`,
  });

  // Mutations for updating the order
  const updateOrderStatusMutation = useMutationAction({
    url: `orders/${id}/status`,
    method: 'put',
    // onSuccess: () => {
    //   toast.success('تم تحديث حالة الطلب بنجاح');
    //   refetchOrder();
    //   setIsStatusModalOpen(false);
    // },
    // onError: (error: ApiErrorWithMessage) => {
    //   toast.error(`فشل تحديث حالة الطلب: ${error.message}`);
    // }
  });

  const updateOrderItemStatusMutation = useMutationAction({
    url: `order-items/{itemId}/status`,
    method: 'put',
    // onSuccess: () => {
    //   toast.success('تم تحديث حالة المنتج بنجاح');
    //   refetchOrder();
    // },
    // onError: (error: ApiErrorWithMessage) => {
    //   toast.error(`فشل تحديث حالة المنتج: ${error.message}`);
    // }
  });

  const cancelOrderMutation = useMutationAction({
    url: `orders/${id}/cancel`,
    method: 'put',
    // onSuccess: () => {
    //   toast.success('تم إلغاء الطلب بنجاح');
    //   refetchOrder();
    //   setIsCancelModalOpen(false);
    // },
    // onError: (error: ApiErrorWithMessage) => {
    //   toast.error(`فشل إلغاء الطلب: ${error.message}`);
    // }
  });

  const updatePaymentStatusMutation = useMutationAction({
    url: `orders/${id}/payment`,
    method: 'put',
    // onSuccess: () => {
    //   toast.success('تم تحديث حالة الدفع بنجاح');
    //   refetchOrder();
    //   setIsPaymentModalOpen(false);
    // },
    // onError: (error: ApiErrorWithMessage) => {
    //   toast.error(`فشل تحديث حالة الدفع: ${error.message}`);
    // }
  });

  // Helper function to format date
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle expanded items
  const toggleItemExpanded = (itemId: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
      pending: { color: 'gray', label: 'قيد الانتظار' },
      confirmed: { color: 'blue', label: 'مؤكد' },
      preparing: { color: 'yellow', label: 'قيد التحضير' },
      ready: { color: 'indigo', label: 'جاهز' },
      served: { color: 'green', label: 'تم التقديم' },
      out_for_delivery: { color: 'purple', label: 'قيد التوصيل' },
      delivered: { color: 'green', label: 'تم التوصيل' },
      completed: { color: 'green', label: 'مكتمل' },
      cancelled: { color: 'red', label: 'ملغي' },
      refunded: { color: 'orange', label: 'مسترجع' }
    };

    const statusInfo = statusMap[status] || { color: 'gray', label: status };
    return <Badge color={statusInfo.color as BadgeColor}>{statusInfo.label}</Badge>;
  };

  // Helper function to get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
      unpaid: { color: 'red', label: 'غير مدفوع' },
      partially_paid: { color: 'yellow', label: 'مدفوع جزئياً' },
      paid: { color: 'green', label: 'مدفوع' },
      refunded: { color: 'orange', label: 'مسترجع' },
      failed: { color: 'red', label: 'فشل الدفع' }
    };

    const statusInfo = statusMap[status] || { color: 'gray', label: status };
    return <Badge color={statusInfo.color as BadgeColor}>{statusInfo.label}</Badge>;
  };

  // Helper function to get order type badge
  const getOrderTypeBadge = (type: string) => {
    const typeMap: Record<string, { color: string, label: string, icon: React.ReactNode }> = {
      dine_in: { color: 'blue', label: 'تناول بالمطعم', icon: <ShoppingBag size={14} /> },
      takeaway: { color: 'purple', label: 'استلام', icon: <ShoppingBag size={14} /> },
      delivery: { color: 'green', label: 'توصيل', icon: <Truck size={14} /> }
    };

    const typeInfo = typeMap[type] || { color: 'gray', label: type, icon: <ShoppingBag size={14} /> };
    return (
      <Badge color={typeInfo.color as BadgeColor} className="flex items-center gap-1">
        {typeInfo.icon} {typeInfo.label}
      </Badge>
    );
  };

  interface CustomerInfo {
    name: string;
    phone: string;
    pickup_time?: string;
    address?: string;
    landmark?: string;
    instructions?: string;
    desk_number?: number;
  }

  // Get customer info based on order type
  const getCustomerInfo = (order: Order): CustomerInfo => {
    if (order.order_type === 'delivery') {
      return {
        name: order.delivery_customer_name || order.customer_name || '-',
        phone: order.delivery_customer_phone || order.customer_phone || '-',
        address: order.delivery_address || '-',
        landmark: order.delivery_landmark || '-',
        instructions: order.delivery_instructions || '-'
      };
    } else if (order.order_type === 'takeaway') {
      return {
        name: order.takeaway_customer_name || order.customer_name || '-',
        phone: order.takeaway_customer_phone || order.customer_phone || '-',
        pickup_time: order.takeaway_pickup_time ? formatDate(order.takeaway_pickup_time) : '-'
      };
    } else { // dine_in
      return {
        name: order.customer_name || '-',
        phone: order.customer_phone || '-',
        desk_number: order.desk_number
      };
    }
  };

  // Handle updates
  const handleStatusUpdate = (status: string) => {
    updateOrderStatusMutation.mutate({ status });
  };

  const handleItemStatusUpdate = (itemId: number, status: string) => {
    updateOrderItemStatusMutation.mutate({ itemId, status }, { 
    //   url: `order-items/${itemId}/status`
    });
  };

  const handleCancelOrder = () => {
    cancelOrderMutation.mutate({ reason: cancellationReason });
  };

  const handlePaymentUpdate = () => {
    updatePaymentStatusMutation.mutate({
      status: 'paid',
      payment_method: selectedPaymentMethod,
      transaction_id: transactionId || undefined
    });
  };

  // Toolbar config
  const breadcrumbItems = [
    { label: "لوحة التحكم", href: "/" },
    { label: "الطلبات", href: "/orders" },
    { label: order ? `طلب #${order.order_number}` : 'تفاصيل الطلب' }
  ];

  const toolbarActions = (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={() => navigate('/orders')} icon={ArrowRight}>
        العودة للطلبات
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
        <Alert
          variant="error"
          message={(error as ApiErrorWithMessage)?.message || "فشل تحميل تفاصيل الطلب"}
        />
      </div>
    );
  }

  const customerInfo = getCustomerInfo(order);
  const canUpdateStatus = !['cancelled', 'completed', 'refunded'].includes(order.status);
  const canCancelOrder = !['cancelled', 'completed', 'refunded', 'delivered'].includes(order.status);
  const canUpdatePayment = order.payment_status !== 'paid' && order.payment_status !== 'refunded';

  // Tab components for organization
  const tabs = [
    { id: 'details', label: 'تفاصيل الطلب' },
    { id: 'items', label: 'المنتجات' },
    { id: 'payment', label: 'الدفع' },
    { id: 'history', label: 'سجل الحالة' }
  ];

  return (
    <div className="space-y-6">
      <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />

      {/* Order Header Card */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900">طلب #{order.order_number}</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>{formatDate(order.placed_at)}</span>
                </div>
                {getOrderTypeBadge(order.order_type)}
                {getStatusBadge(order.status)}
                {getPaymentStatusBadge(order.payment_status)}
              </div>
            </div>
            <div className="text-right bg-white p-4 rounded-lg border border-gray-100">
              <div className="text-sm text-gray-500">المبلغ الإجمالي</div>
              <div className="text-2xl font-bold text-gray-900">
                {parseFloat(String(order.total)).toFixed(2)} {currencyIcon}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {canUpdateStatus && (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setIsStatusModalOpen(true)}
                icon={Edit}
              >
                تحديث الحالة
              </Button>
            )}
            
            {canUpdatePayment && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsPaymentModalOpen(true)}
                icon={CreditCard}
              >
                تحديث الدفع
              </Button>
            )}
            
            {canCancelOrder && (
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => setIsCancelModalOpen(true)}
                icon={XCircle}
              >
                إلغاء الطلب
              </Button>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs 
          tabs={tabs} 
          activeTab={selectedTab} 
          onChange={setSelectedTab} 
          className="px-6 pt-4"
        />

        {/* Tab Content */}
        <div className="p-6">
          {selectedTab === 'details' && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">معلومات العميل</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-blue-500" />
                        <span className="text-sm text-gray-500">الاسم:</span>
                        <span className="font-medium">{customerInfo.name}</span>
                      </div>
                      {customerInfo.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-green-500" />
                          <span className="text-sm text-gray-500">رقم الهاتف:</span>
                          <span className="font-medium">{customerInfo.phone}</span>
                        </div>
                      )}
                      {order.order_type === 'dine_in' && 'desk_number' in customerInfo && (
                        <div className="flex items-center gap-2">
                          <ShoppingBag size={16} className="text-purple-500" />
                          <span className="text-sm text-gray-500">رقم الطاولة:</span>
                          <span className="font-medium">{customerInfo.desk_number}</span>
                        </div>
                      )}
                    </div>

                    {order.order_type === 'delivery' && (
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="text-red-500 mt-1 flex-shrink-0" />
                          <div>
                            <span className="text-sm text-gray-500 block">العنوان:</span>
                            <span className="font-medium">{(customerInfo as CustomerInfo).address}</span>
                          </div>
                        </div>
                        {(customerInfo as CustomerInfo).landmark && (
                          <div className="flex items-start gap-2">
                            <div className="w-4"></div> {/* Spacer for alignment */}
                            <div>
                              <span className="text-sm text-gray-500 block">علامة مميزة:</span>
                              <span className="font-medium">{(customerInfo as CustomerInfo).landmark}</span>
                            </div>
                          </div>
                        )}
                        {(customerInfo as CustomerInfo).instructions && (
                          <div className="flex items-start gap-2">
                            <div className="w-4"></div> {/* Spacer for alignment */}
                            <div>
                              <span className="text-sm text-gray-500 block">تعليمات التوصيل:</span>
                              <span className="font-medium">{(customerInfo as CustomerInfo).instructions}</span>
                            </div>
                          </div>
                        )}
                        {order.estimated_delivery_time && (
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-orange-500" />
                            <span className="text-sm text-gray-500">وقت التوصيل المتوقع:</span>
                            <span className="font-medium">{formatDate(order.estimated_delivery_time)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {order.order_type === 'takeaway' && 'pickup_time' in customerInfo && (
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-orange-500" />
                        <span className="text-sm text-gray-500">وقت الاستلام:</span>
                        <span className="font-medium">{customerInfo.pickup_time}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">ملاحظات</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700">{order.notes}</p>
                  </div>
                </div>
              )}

              {/* Cancellation Reason */}
              {order.status === 'cancelled' && order.cancellation_reason && (
                <div className="bg-red-50 rounded-lg border border-red-200 overflow-hidden">
                  <div className="bg-red-100 px-4 py-3 border-b border-red-200">
                    <h3 className="text-lg font-medium text-red-700">سبب الإلغاء</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-red-600">{order.cancellation_reason}</p>
                    {order.cancelled_at && (
                      <p className="text-sm text-red-500 mt-2">تم الإلغاء في: {formatDate(order.cancelled_at)}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'items' && (
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 border ${expandedItems[item.id] ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'} rounded-md transition-colors duration-200 hover:border-blue-200`}
                >
                  <div className="flex flex-wrap justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="cursor-pointer p-1 rounded-full hover:bg-gray-100"
                        onClick={() => toggleItemExpanded(item.id)}
                      >
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${expandedItems[item.id] ? 'transform rotate-180' : ''}`} 
                        />
                      </div>
                      <span className="font-medium text-gray-900">{item.product_name || `منتج #${item.product_id}`}</span>
                      <Badge size="sm" color="blue">{item.quantity}x</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-gray-900">
                        {parseFloat(String(item.unit_price)).toFixed(2)} {currencyIcon}
                      </div>
                      <Select
                        value={item.status || 'pending'}
                        onChange={(e) => handleItemStatusUpdate(item.id, e)}
                        options={ITEM_STATUS_OPTIONS}
                        // size="sm"
                        disabled={!canUpdateStatus}
                        // style={{ minWidth: '120px' }}
                      />
                    </div>
                  </div>

                  {expandedItems[item.id] && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {/* Modifiers */}
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="mt-2 pl-4 border-r-2 border-blue-200">
                          <div className="text-sm font-medium text-blue-700 mb-1">التعديلات:</div>
                          <div className="space-y-1">
                            {item.modifiers.map((modifier, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>
                                  {modifier.name} {modifier.quantity > 1 && `(${modifier.quantity}x)`}
                                </span>
                                <span>
                                  {parseFloat(String(modifier.price)).toFixed(2)} {currencyIcon}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Addons */}
                      {item.addons && item.addons.length > 0 && (
                        <div className="mt-2 pl-4 border-r-2 border-green-200">
                          <div className="text-sm font-medium text-green-700 mb-1">الإضافات:</div>
                          <div className="space-y-1">
                            {item.addons.map((addon, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>
                                  {addon.name} {addon.quantity > 1 && `(${addon.quantity}x)`}
                                </span>
                                <span>
                                  {parseFloat(String(addon.price)).toFixed(2)} {currencyIcon}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Special Requests */}
                      {item.special_requests && (
                        <div className="mt-2 text-sm p-2 bg-gray-50 rounded-md">
                          <span className="text-gray-700 font-medium">طلبات خاصة:</span>
                          <p className="mt-1 text-gray-700">{item.special_requests}</p>
                        </div>
                      )}

                      <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between text-sm font-medium">
                        <span>المجموع</span>
                        <span className="text-blue-700">{parseFloat(String(item.total_price)).toFixed(2)} {currencyIcon}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'payment' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">معلومات الدفع</h3>
                    <div>{getPaymentStatusBadge(order.payment_status)}</div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">المجموع الفرعي</span>
                      <span className="font-medium">{parseFloat(String(order.subtotal)).toFixed(2)} {currencyIcon}</span>
                    </div>
                    {order.tax_amount > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">الضريبة</span>
                        <span className="font-medium">{parseFloat(String(order.tax_amount)).toFixed(2)} {currencyIcon}</span>
                      </div>
                    )}
                    {order.delivery_fee && order.delivery_fee > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">رسوم التوصيل</span>
                        <span className="font-medium">{parseFloat(String(order.delivery_fee)).toFixed(2)} {currencyIcon}</span>
                      </div>
                    )}
                    {order.service_charge && order.service_charge > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">رسوم الخدمة</span>
                        <span className="font-medium">{parseFloat(String(order.service_charge)).toFixed(2)} {currencyIcon}</span>
                      </div>
                    )}
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">الخصم</span>
                        <span className="text-green-600 font-medium">-{parseFloat(String(order.discount_amount)).toFixed(2)} {currencyIcon}</span>
                      </div>
                    )}
                    {order.tip_amount && order.tip_amount > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">البقشيش</span>
                        <span className="font-medium">{parseFloat(String(order.tip_amount)).toFixed(2)} {currencyIcon}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 mt-2 bg-gray-50 rounded-md px-3 font-bold">
                      <span>المجموع</span>
                      <span className="text-blue-700">{parseFloat(String(order.total)).toFixed(2)} {currencyIcon}</span>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-600 block font-medium">طريقة الدفع:</span>
                          <span className="text-gray-900">
                            {order.payment_method ? (
                              order.payment_method === 'cash' ? 'نقداً' :
                              order.payment_method === 'card' ? 'بطاقة ائتمان' :
                              order.payment_method === 'wallet' ? 'محفظة إلكترونية' :
                              order.payment_method
                            ) : '-'}
                          </span>
                          {order.transaction_id && (
                            <span className="text-xs text-gray-500 block mt-1">
                              رقم العملية: {order.transaction_id}
                            </span>
                          )}
                        </div>
                        <div className="text-left">
                          {order.paid_at && (
                            <span className="text-sm text-gray-500 block">
                              تاريخ الدفع: {formatDate(order.paid_at)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {canUpdatePayment && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Button 
                            variant="outline"
                            size="sm"
                            icon={CreditCard}
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="w-full"
                          >
                            تحديث معلومات الدفع
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'history' && (
            <div className="space-y-4">
              {/* Status History */}
              {order.status_history && order.status_history.length > 0 ? (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute top-0 bottom-0 right-[19px] w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-6">
                    {order.status_history.map((history, index) => (
                      <div key={index} className="relative flex gap-4">
                        <div className="absolute right-0 w-10 h-10 rounded-full bg-white border-4 border-blue-200 flex items-center justify-center z-10">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        </div>
                        <div className="flex-1 mr-14 bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{getStatusBadge(history.status)}</div>
                              {history.user_name && (
                                <div className="text-sm text-gray-500 mt-1">بواسطة: {history.user_name}</div>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{formatDate(history.created_at)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  لا يوجد سجل للحالة
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Status Update Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="تحديث حالة الطلب"
      >
        <div className="space-y-4 p-4">
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">الحالة الحالية</div>
            <div className="p-2 bg-gray-50 rounded-md">
              {getStatusBadge(order.status)}
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">الحالة الجديدة</div>
            <Select
              options={ORDER_STATUS_OPTIONS.filter(option => option.value !== order.status)}
              onChange={(e) => handleStatusUpdate(e)}
              placeholder="اختر الحالة الجديدة"
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsStatusModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={() => setIsStatusModalOpen(false)}
              disabled={updateOrderStatusMutation.isPending}
            >
              {updateOrderStatusMutation.isPending ? <Spinner size="sm" /> : 'تحديث'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="إلغاء الطلب"
      >
        <div className="space-y-4 p-4">
          <Alert
            variant="warning"
            message="سيتم إلغاء الطلب بشكل نهائي. هل أنت متأكد؟"
          />
          
          <div>
            <div className="text-sm font-medium mb-2">سبب الإلغاء</div>
            <TextArea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="أدخل سبب إلغاء الطلب"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsCancelModalOpen(false)}
            >
              تراجع
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelOrder}
              disabled={cancelOrderMutation.isPending || !cancellationReason.trim()}
            >
              {cancelOrderMutation.isPending ? <Spinner size="sm" /> : 'تأكيد الإلغاء'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payment Update Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="تحديث حالة الدفع"
      >
        <div className="space-y-4 p-4">
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">حالة الدفع الحالية</div>
            <div className="p-2 bg-gray-50 rounded-md">
              {getPaymentStatusBadge(order.payment_status)}
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">طريقة الدفع</div>
            <Select
              options={PAYMENT_METHOD_OPTIONS}
              onChange={(e) => setSelectedPaymentMethod(e)}
              value={selectedPaymentMethod || order.payment_method || ''}
              placeholder="اختر طريقة الدفع"
            />
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">رقم العملية (اختياري)</div>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="أدخل رقم العملية"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md text-sm flex items-center gap-2 border border-blue-100">
            <CheckCircle size={16} className="text-blue-500" />
            <span>سيتم تحديث حالة الدفع إلى "مدفوع"</span>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handlePaymentUpdate}
              disabled={updatePaymentStatusMutation.isPending || !selectedPaymentMethod}
            >
              {updatePaymentStatusMutation.isPending ? <Spinner size="sm" /> : 'تحديث الدفع'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetailsPage;