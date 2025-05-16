// src/pages/orders/OrdersPage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Clock, Truck, ShoppingBag, User, DollarSign, Calendar, CheckCircle, XCircle } from 'lucide-react';

import { useAppSelector } from '../../hooks/redux';
import Alert from '../../components/ui/alert';
import Button from '../../components/ui/button';
import DataTable, { ColumnDefinition } from '../../components/ui/data-table';
import Modal from '../../components/ui/modal';
import Toolbar from '../../components/ui/toolbar';
import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
import { ApiErrorWithMessage } from '../../types/error';
import Badge, { BadgeColor } from '../../components/ui/badge';
import Card from '../../components/ui/card';
import Select from '../../components/ui/select';

// Define Order type based on the Prisma schema
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
}

const OrdersPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showCancelModal, setShowCancelModal] = useState<Order | null>(null);
    const [cancellationReason, setCancellationReason] = useState<string>('');
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);
    const [orderStatus, setOrderStatus] = useState<string>('');
    const [paymentStatus, setPaymentStatus] = useState<string>('');
    const currency_info = useAppSelector(state => state.auth_store.portal?.shop.currency_info);
    const currencyIcon = currency_info?.currency_code || 'ج.م';

    // --- Data Fetching ---
    const { data: orders, isLoading, error, refetch } = useGetQuery<Order[]>({
        key: ['orders'],
        url: 'orders?include=order_items',
    });

    // --- Mutations ---
    const { mutateAsync: cancelOrder, isPending: isCancelling } = useMutationAction({
        method: 'put',
        url: `orders/${selectedOrder?.id}/status`
    });

    const { mutateAsync: updateOrder, isPending: isUpdating } = useMutationAction({
        method: 'put',
        url: `orders/${selectedOrder?.id}/status`
    });

    // --- Handlers ---
    const handleAdd = () => navigate('/orders/create');
    
    const handleView = (order: Order) => {
        setSelectedOrder(order);
        setOrderStatus(order.status);
        setPaymentStatus(order.payment_status);
    };
    
    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };
    
    const openCancelModal = (order: Order) => {
        setShowCancelModal(order);
        setCancellationReason('');
    };
    
    const closeCancelModal = () => {
        setShowCancelModal(null);
        setCancellationReason('');
    };

    const confirmCancel = async () => {
        if (!showCancelModal) return;
        
        try {
            await cancelOrder({
                cancellation_reason: cancellationReason,
                status: 'cancelled'
            });
            setApiSuccess(`تم إلغاء الطلب "${showCancelModal.order_number}" بنجاح`);
            refetch();
            closeCancelModal();
            
            // If the cancelled order was the selected one, update its status
            if (selectedOrder && selectedOrder.id === showCancelModal.id) {
                setSelectedOrder({
                    ...selectedOrder,
                    status: 'cancelled',
                    cancellation_reason: cancellationReason
                });
                setOrderStatus('cancelled');
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "فشل إلغاء الطلب";
            setApiError(errorMsg);
        }
    };

    const updateOrderStatus = async () => {
        if (!selectedOrder) return;
        
        try {
            await updateOrder({ status: orderStatus });
            setApiSuccess(`تم تحديث حالة الطلب "${selectedOrder.order_number}" بنجاح`);
            refetch();
            
            // Update the selected order's status locally
            setSelectedOrder({
                ...selectedOrder,
                status: orderStatus
            });
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "فشل تحديث حالة الطلب";
            setApiError(errorMsg);
        }
    };

    const updatePaymentStatus = async () => {
        if (!selectedOrder) return;
        
        try {
            await updateOrder({
                url: `orders/${selectedOrder.id}`,
                data: { payment_status: paymentStatus }
            });
            setApiSuccess(`تم تحديث حالة الدفع للطلب "${selectedOrder.order_number}" بنجاح`);
            refetch();
            
            // Update the selected order's payment status locally
            setSelectedOrder({
                ...selectedOrder,
                payment_status: paymentStatus
            });
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "فشل تحديث حالة الدفع";
            setApiError(errorMsg);
        }
    };

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

    // --- Order Status Options ---
    const orderStatusOptions = [
        { value: 'pending', label: 'قيد الانتظار' },
        { value: 'confirmed', label: 'مؤكد' },
        { value: 'preparing', label: 'قيد التحضير' },
        { value: 'ready', label: 'جاهز' },
        { value: 'served', label: 'تم التقديم' },
        { value: 'out_for_delivery', label: 'قيد التوصيل' },
        { value: 'delivered', label: 'تم التوصيل' },
        { value: 'completed', label: 'مكتمل' },
        { value: 'cancelled', label: 'ملغي' },
        { value: 'refunded', label: 'مسترجع' }
    ];

    // --- Payment Status Options ---
    const paymentStatusOptions = [
        { value: 'unpaid', label: 'غير مدفوع' },
        { value: 'partially_paid', label: 'مدفوع جزئياً' },
        { value: 'paid', label: 'مدفوع' },
        { value: 'refunded', label: 'مسترجع' },
        { value: 'failed', label: 'فشل الدفع' }
    ];

    // --- Table Columns ---
    const columns = useMemo((): ColumnDefinition<Order>[] => [
        { 
            key: 'order_number', 
            header: 'رقم الطلب', 
            cellClassName: 'font-medium text-gray-800', 
            render: (order) => order.order_number 
        },
        {
            key: 'status',
            header: 'الحالة',
            render: (order) => getStatusBadge(order.status)
        },
        {
            key: 'order_type',
            header: 'نوع الطلب',
            render: (order) => getOrderTypeBadge(order.order_type)
        },
        {
            key: 'customer',
            header: 'العميل',
            render: (order) => {
                const name = order.order_type === 'delivery' 
                    ? (order.delivery_customer_name || order.customer_name || '-')
                    : (order.order_type === 'takeaway' 
                        ? (order.takeaway_customer_name || order.customer_name || '-')
                        : (order.customer_name || '-'));
                return (
                    <div className="flex items-center gap-1">
                        <User size={14} className="text-gray-400" />
                        <span>{name}</span>
                    </div>
                );
            }
        },
        {
            key: 'placed_at',
            header: 'وقت الطلب',
            render: (order) => (
                <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{formatDate(order.placed_at)}</span>
                </div>
            )
        },
        {
            key: 'total',
            header: 'المبلغ الإجمالي',
            cellClassName: 'font-medium',
            render: (order) => (
                <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-gray-400" />
                    <span>{parseFloat(String(order.total)).toFixed(2)} {currencyIcon}</span>
                </div>
            )
        },
        {
            key: 'payment_status',
            header: 'حالة الدفع',
            render: (order) => getPaymentStatusBadge(order.payment_status)
        },
        {
            key: 'actions',
            header: 'إجراءات',
            cellClassName: 'text-center w-[130px]',
            render: (order) => (
                <div className="flex justify-center items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 text-gray-600 hover:bg-gray-100" 
                        onClick={() => handleView(order)} 
                        title="عرض التفاصيل"
                    >
                        <Eye size={16} />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 text-red-600 hover:bg-red-50" 
                        onClick={() => openCancelModal(order)} 
                        title="إلغاء الطلب"
                        disabled={['cancelled', 'completed', 'refunded'].includes(order.status)}
                    >
                        <Clock size={16} />
                    </Button>
                </div>
            )
        },
    ], [currencyIcon]);

    // --- Toolbar Config ---
    const breadcrumbItems = [
        { label: "لوحة التحكم", href: "/" },
        { label: "الطلبات" }
    ];
    
    const toolbarActions = (
        <Button onClick={handleAdd} icon={Plus}>إضافة طلب</Button>
    );

    // --- Helper function to get customer details based on order type ---
    const getCustomerDetails = (order: Order) => {
        if (order.order_type === 'delivery') {
            return {
                name: order.delivery_customer_name || order.customer_name,
                phone: order.delivery_customer_phone || order.customer_phone,
                address: order.delivery_address,
                landmark: order.delivery_landmark,
                instructions: order.delivery_instructions
            };
        } else if (order.order_type === 'takeaway') {
            return {
                name: order.takeaway_customer_name || order.customer_name,
                phone: order.takeaway_customer_phone || order.customer_phone,
                pickup_time: order.takeaway_pickup_time
            };
        } else {
            return {
                name: order.customer_name,
                phone: order.customer_phone,
                desk_number: order.desk_number
            };
        }
    };

    return (
        <div className="space-y-4">
            <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
            
            {apiError && (
                <Alert 
                    variant="error" 
                    message={apiError} 
                    onClose={() => setApiError(null)} 
                />
            )}
            
            {apiSuccess && (
                <Alert 
                    variant="success" 
                    message={apiSuccess} 
                    onClose={() => setApiSuccess(null)} 
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className={`${selectedOrder ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    <DataTable<Order>
                        columns={columns}
                        data={orders ?? []}
                        isLoading={isLoading}
                        error={error ? (error as ApiErrorWithMessage).message || "فشل تحميل الطلبات" : null}
                        emptyStateMessage="لم يتم إضافة أي طلبات بعد."
                        rowKey="id"
                        onRowClick={(order) => handleView(order)}
                        // selectedRowId={selectedOrder?.id}
                    />
                </div>

                {selectedOrder && (
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">تفاصيل الطلب #{selectedOrder.order_number}</h3>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="p-1 text-gray-600 hover:bg-gray-100" 
                                    onClick={closeOrderDetails}
                                >
                                    <XCircle size={18} />
                                </Button>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Order Info */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-700">معلومات الطلب</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">رقم الطلب</span>
                                            <span className="font-medium">{selectedOrder.order_number}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">وقت الطلب</span>
                                            <span>{formatDate(selectedOrder.placed_at)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">نوع الطلب</span>
                                            <span>{getOrderTypeBadge(selectedOrder.order_type)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">حالة الطلب</span>
                                            <span>{getStatusBadge(selectedOrder.status)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">حالة الدفع</span>
                                            <span>{getPaymentStatusBadge(selectedOrder.payment_status)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Customer Info */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-700">معلومات العميل</h4>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        {(() => {
                                            const customer = getCustomerDetails(selectedOrder);
                                            return (
                                                <>
                                                    {customer.name && (
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500">الاسم</span>
                                                            <span className="font-medium">{customer.name}</span>
                                                        </div>
                                                    )}
                                                    {customer.phone && (
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500">رقم الهاتف</span>
                                                            <span className="font-medium">{customer.phone}</span>
                                                        </div>
                                                    )}
                                                    {customer.desk_number && (
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500">رقم الطاولة</span>
                                                            <span className="font-medium">{customer.desk_number}</span>
                                                        </div>
                                                    )}
                                                    {customer.pickup_time && (
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500">وقت الاستلام</span>
                                                            <span className="font-medium">{formatDate(customer.pickup_time)}</span>
                                                        </div>
                                                    )}
                                                    {customer.address && (
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500">العنوان</span>
                                                            <span className="font-medium">{customer.address}</span>
                                                        </div>
                                                    )}
                                                    {customer.landmark && (
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500">علامة مميزة</span>
                                                            <span className="font-medium">{customer.landmark}</span>
                                                        </div>
                                                    )}
                                                    {customer.instructions && (
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500">تعليمات التوصيل</span>
                                                            <span className="font-medium">{customer.instructions}</span>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                                
                                {/* Order Items */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-700">العناصر المطلوبة</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.order_items.map((item) => (
                                            <Card key={item.id} className="p-2">
                                                <div className="flex justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{item.product_name || `المنتج #${item.product_id}`}</span>
                                                        <span className="text-sm text-gray-500">
                                                            {item.quantity} × {parseFloat(String(item.unit_price)).toFixed(2)} {currencyIcon}
                                                        </span>
                                                        {item.special_requests && (
                                                            <span className="text-xs text-gray-500 mt-1">
                                                                طلبات خاصة: {item.special_requests}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-medium">{parseFloat(String(item.total_price)).toFixed(2)} {currencyIcon}</span>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Order Summary */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-700">ملخص الطلب</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">المجموع الفرعي</span>
                                            <span>{parseFloat(String(selectedOrder.subtotal)).toFixed(2)} {currencyIcon}</span>
                                        </div>
                                        {selectedOrder.tax_amount > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">الضريبة</span>
                                                <span>{parseFloat(String(selectedOrder.tax_amount)).toFixed(2)} {currencyIcon}</span>
                                            </div>
                                        )}
                                        {selectedOrder.discount_amount > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">الخصم</span>
                                                <span>-{parseFloat(String(selectedOrder.discount_amount)).toFixed(2)} {currencyIcon}</span>
                                            </div>
                                        )}
                                        {selectedOrder.service_charge && selectedOrder.service_charge > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">رسوم الخدمة</span>
                                                <span>{parseFloat(String(selectedOrder.service_charge)).toFixed(2)} {currencyIcon}</span>
                                            </div>
                                        )}
                                        {selectedOrder.delivery_fee && selectedOrder.delivery_fee > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">رسوم التوصيل</span>
                                                <span>{parseFloat(String(selectedOrder.delivery_fee)).toFixed(2)} {currencyIcon}</span>
                                            </div>
                                        )}
                                        {selectedOrder.tip_amount && selectedOrder.tip_amount > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">الإكرامية</span>
                                                <span>{parseFloat(String(selectedOrder.tip_amount)).toFixed(2)} {currencyIcon}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-medium border-t pt-2 mt-2">
                                            <span>الإجمالي</span>
                                            <span>{parseFloat(String(selectedOrder.total)).toFixed(2)} {currencyIcon}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Order Actions */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700">إجراءات</h4>
                                    
                                    {/* Update Order Status */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            تحديث حالة الطلب
                                        </label>
                                        <div className="flex gap-2">
                                            <Select
                                                options={orderStatusOptions}
                                                value={orderStatus}
                                                onChange={setOrderStatus}
                                                disabled={['cancelled', 'completed', 'refunded'].includes(selectedOrder.status)}
                                                className="flex-1"
                                            />
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={updateOrderStatus}
                                                disabled={['cancelled', 'completed', 'refunded'].includes(selectedOrder.status) || orderStatus === selectedOrder.status}
                                                isLoading={isUpdating}
                                            >
                                                <CheckCircle size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {/* Update Payment Status */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            تحديث حالة الدفع
                                        </label>
                                        <div className="flex gap-2">
                                            <Select
                                                options={paymentStatusOptions}
                                                value={paymentStatus}
                                                onChange={setPaymentStatus}
                                                disabled={['refunded'].includes(selectedOrder.payment_status)}
                                                className="flex-1"
                                            />
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={updatePaymentStatus}
                                                disabled={['refunded'].includes(selectedOrder.payment_status) || paymentStatus === selectedOrder.payment_status}
                                                isLoading={isUpdating}
                                            >
                                                <CheckCircle size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {/* Cancel Order */}
                                    {!['cancelled', 'completed', 'refunded'].includes(selectedOrder.status) && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => openCancelModal(selectedOrder)}
                                            className="w-full"
                                        >
                                            إلغاء الطلب
                                        </Button>
                                    )}
                                    
                                    {/* Notes */}
                                    {selectedOrder.notes && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-gray-700">ملاحظات</h4>
                                            <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded-md">
                                                {selectedOrder.notes}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {/* Cancellation Reason (if cancelled) */}
                                    {selectedOrder.cancellation_reason && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-red-600">سبب الإلغاء</h4>
                                            <p className="text-sm text-gray-700 p-2 bg-red-50 rounded-md">
                                                {selectedOrder.cancellation_reason}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Cancel Order Modal */}
            <Modal 
                isOpen={!!showCancelModal} 
                onClose={closeCancelModal} 
                title="تأكيد إلغاء الطلب" 
                size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={closeCancelModal}>إلغاء</Button>
                        <Button 
                            variant="danger" 
                            onClick={confirmCancel} 
                            isLoading={isCancelling}
                        >
                            تأكيد الإلغاء
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        هل أنت متأكد من إلغاء الطلب "<strong>{showCancelModal?.order_number}</strong>"؟
                    </p>
                    <div>
                        <label htmlFor="cancellation_reason" className="block text-sm font-medium text-gray-700 mb-1">
                            سبب الإلغاء
                        </label>
                        <textarea
                            id="cancellation_reason"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            rows={3}
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            placeholder="يرجى ذكر سبب إلغاء الطلب..."
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OrdersPage;