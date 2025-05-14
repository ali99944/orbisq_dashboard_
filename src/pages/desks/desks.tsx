"use client"; // If using Next.js App Router and client features

import React, { useState, useMemo, useEffect, ChangeEvent, FormEvent } from 'react';
// import { useNavigate } from 'react-router-dom'; // Remove if not using react-router-dom in Next.js

// --- Relative Imports (Keep YOUR actual paths) ---
import { useGetQuery, useMutationAction } from '../../hooks/queries-actions';
import type { Desk, DeskFormData } from '../../types/desk'; // Ensure Branch is exported from desk.ts or imported separately
import { initialDeskFormData } from '../../types/desk';
import type { ColumnDefinition } from '../../components/ui/data-table';
import Toolbar from '../../components/ui/toolbar';
import DataTable from '../../components/ui/data-table';
import Button from '../../components/ui/button';
import Modal from '../../components/ui/modal';
import Alert from '../../components/ui/alert';
import Input from '../../components/ui/input';
import { getImageLink } from '../../lib/storage';
// --- End Relative Imports ---

import { Plus, Edit, Trash2, QrCode, UserCheck, CheckCircle, Clock, Lock, HelpCircle, Save, X, Layers } from 'lucide-react'; // Added MapPin, X, and Layers
import StatusChangeModal from './status-change-modal'; // Assuming this exists
import { AxiosError } from 'axios';

// --- Helper Functions ---
const formatStatus = (status: Desk['status']): { text: string; colorClass: string; icon: React.ElementType } => {
  switch (status) {
    case 'free': return { text: 'فارغة', colorClass: 'bg-green-100 text-green-800', icon: CheckCircle };
    case 'occupied': return { text: 'مشغولة', colorClass: 'bg-yellow-100 text-yellow-800', icon: Clock };
    case 'reserved': return { text: 'محجوزة', colorClass: 'bg-blue-100 text-blue-800', icon: Lock };
    case 'cleaning': return { text: 'تنظيف', colorClass: 'bg-purple-100 text-purple-800', icon: UserCheck }; // Example
    case 'out_of_service': return { text: 'خارج الخدمة', colorClass: 'bg-red-100 text-red-800', icon: HelpCircle }; // Example
    default: return { text: status, colorClass: 'bg-gray-100 text-gray-800', icon: HelpCircle };
  }
};

// --- Component ---
const DesksPage: React.FC = () => {
  // const navigate = useNavigate(); // If using react-router-dom navigation
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [editingDesk, setEditingDesk] = useState<Desk | null>(null);
  const [formData, setFormData] = useState<DeskFormData>(initialDeskFormData); // Using your new initialDeskFormData
  const [showDeleteModal, setShowDeleteModal] = useState<Desk | null>(null);
  const [showQrModal, setShowQrModal] = useState<Desk | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [statusChangeDesk, setStatusChangeDesk] = useState<Desk | null>(null);
  const [showMultiModal, setShowMultiModal] = useState<boolean>(false);
  const [multiFormData, setMultiFormData] = useState<{ startRange: number; endRange: number }>({ startRange: 1, endRange: 10 });
  
  // --- Data Fetching ---
  const { data: desks, isLoading, error: queryError, refetch } = useGetQuery<Desk[]>({
    key: ['desks'],
    url: 'desks', // Include branch
  });

  // --- Mutations ---
  const { mutateAsync: createDesk, isPending: isCreating } = useMutationAction<Desk, Partial<DeskFormData>>({
    url: 'desks',
    method: 'post',
    key: ['desks'],
  });

  const { mutateAsync: updateDesk, isPending: isUpdating } = useMutationAction<Desk, Partial<DeskFormData>>({
    method: 'patch',
    url: `desks/${editingDesk?.id}`,
    key: ['desks'],
  });

  const { mutateAsync: deleteDeskAction, isPending: isDeleting } = useMutationAction({
    method: 'delete',
    url: `desks/${showDeleteModal?.id}`,
    key: ['desks'],
  });

  const [selectedDeskId, setSelectedDeskId] = useState<number | null>(null);

  const { mutateAsync: updateDeskStatusAction, isPending: isUpdatingStatus } = useMutationAction<Desk, { status: Desk['status'] }>({
    method: 'put', // Or 'post' depending on your API for status update
    url: `desks/${selectedDeskId}/status`,
    key: ['desks'],
  });

  const { mutateAsync: createMultiDesks, isPending: isCreatingMulti } = useMutationAction<any, { start_range: number; end_range: number }>({
    method: 'post',
    url: 'desks/multi',
    key: ['desks'],
  });

  // --- Effects ---
  useEffect(() => {
    if (editingDesk) {
      setFormData({
        // Keep existing fields
        desk_number: editingDesk.desk_number, // Store as number
        number_of_seats: editingDesk.number_of_seats, // Store as number
        name: editingDesk.name || '',
        customer_id: editingDesk.customer_id || null,
        // New fields
        section: editingDesk.section || '',
        floor: editingDesk.floor ?? 1, // Default to 1 if null/undefined
        position_x: editingDesk.position_x ?? 0,
        position_y: editingDesk.position_y ?? 0,
        reservation_time: editingDesk.reservation_time || '', // Assuming string input for now
        occupation_time: editingDesk.occupation_time || '',   // Assuming string input for now
        minimum_spend: editingDesk.minimum_spend ?? 0,
        has_outlets: editingDesk.has_outlets || false,
        has_view: editingDesk.has_view || false,
        is_wheelchair_accessible: editingDesk.is_wheelchair_accessible ?? true, // Default from model
        needs_cleaning: editingDesk.needs_cleaning || false,
        is_under_maintenance: editingDesk.is_under_maintenance || false,
        maintenance_notes: editingDesk.maintenance_notes || '',
        // branch_id: editingDesk.branch_id || null,
        // branch: null
        // 'branch' object is not part of DeskFormData, only branch_id
      });
      setShowFormModal(true);
    } else {
      setFormData(initialDeskFormData); // Use your comprehensive initial state
    }
  }, [editingDesk]);

  useEffect(() => {
    if (!showFormModal && !showDeleteModal && !showQrModal && !statusChangeDesk && !showMultiModal) {
      setApiError(null);
      setApiSuccess(null);
    }
  }, [showFormModal, showDeleteModal, showQrModal, statusChangeDesk, showMultiModal]);

  // --- Handlers ---
  const handleOpenAddModal = () => { setEditingDesk(null); /* useEffect resets formData */ setShowFormModal(true); setApiError(null); setApiSuccess(null); };
  const handleOpenEditModal = (desk: Desk) => { setEditingDesk(desk); setApiError(null); setApiSuccess(null); };
  const handleCloseFormModal = () => { setShowFormModal(false); setEditingDesk(null); };
  const openDeleteConfirm = (desk: Desk) => setShowDeleteModal(desk);
  const closeDeleteConfirm = () => setShowDeleteModal(null);
  const openQrCode = (desk: Desk) => setShowQrModal(desk);
  const closeQrCode = () => setShowQrModal(null);
  const openStatusModal = (desk: Desk) => { setApiError(null); setApiSuccess(null); setStatusChangeDesk(desk); };
  const closeStatusModal = () => { setStatusChangeDesk(null); setApiError(null); /* Clear error when modal closes */ };
  const openMultiModal = () => { setShowMultiModal(true); setApiError(null); setApiSuccess(null); };
  const closeMultiModal = () => { setShowMultiModal(false); };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox'; // For Switch components if they use checkbox internally
    
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }));
    if (apiError) setApiError(null);
    if (apiSuccess) setApiSuccess(null);
  };

  const handleMultiFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMultiFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
    if (apiError) setApiError(null);
    if (apiSuccess) setApiSuccess(null);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null); setApiSuccess(null);

    // Basic validation
    if (!formData.desk_number || formData.desk_number <= 0 || !formData.number_of_seats || formData.number_of_seats <= 0) {
      setApiError("رقم الطاولة وعدد المقاعد يجب أن تكون أرقامًا موجبة."); return;
    }

    // Construct payload with correct types
    const payload: Partial<DeskFormData> & { shop_id: number } = { // Add shop_id
      name: formData.name || null,
      desk_number: Number(formData.desk_number),
      number_of_seats: Number(formData.number_of_seats),
      customer_id: formData.customer_id ? Number(formData.customer_id) : null,
      section: formData.section || null || undefined,
      has_outlets: Boolean(formData.has_outlets),
      has_view: Boolean(formData.has_view),
      is_wheelchair_accessible: Boolean(formData.is_wheelchair_accessible),
      needs_cleaning: Boolean(formData.needs_cleaning),
      is_under_maintenance: Boolean(formData.is_under_maintenance),
      shop_id: 1, // TODO: Replace with actual shop_id from context/auth
    };

    try {
      if (editingDesk) {
        // Update existing desk
        await updateDesk(payload, {
          onSuccess: (response) => {
            const deskData = response || editingDesk;
            setApiSuccess(`تم تحديث الطاولة "${deskData.desk_number}"`);
            refetch();
            setTimeout(() => { handleCloseFormModal(); setApiSuccess(null); }, 1500);
          },
          onError: (error) => {
            const message = ((error as AxiosError).response?.data as AxiosError)?.message || error.message || "فشل تحديث الطاولة.";
            setApiError(message);
          },
        });
      } else {
        // Create new desk
        await createDesk(payload, {
          onSuccess: (response) => {
            const deskData = response || { desk_number: formData.desk_number };
            setApiSuccess(`تم إضافة الطاولة "${deskData.desk_number}"`);
            refetch();
            setTimeout(() => { handleCloseFormModal(); setApiSuccess(null); }, 1500);
          },
          onError: (error) => {
            const message = ((error as AxiosError).response?.data as AxiosError)?.message || error.message || "فشل إضافة الطاولة.";
            setApiError(message);
          },
        });
      }
    } catch (error) {
      console.error("Form Submit Catch Error:", error);
      setApiError((error as Error).message || "حدث خطأ غير متوقع عند الحفظ.");
    }
  };

  const handleMultiSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null); setApiSuccess(null);

    // Basic validation
    if (multiFormData.startRange <= 0 || multiFormData.endRange <= 0) {
      setApiError("يجب أن تكون الأرقام موجبة."); return;
    }

    if (multiFormData.startRange >= multiFormData.endRange) {
      setApiError("يجب أن يكون الرقم البداية أقل من رقم النهاية."); return;
    }

    try {
      await createMultiDesks({
        start_range: multiFormData.startRange,
        end_range: multiFormData.endRange
      }, {
        onSuccess: () => {
          setApiSuccess(`تم إنشاء الطاولات من ${multiFormData.startRange} إلى ${multiFormData.endRange} بنجاح.`);
          refetch();
          setTimeout(() => { closeMultiModal(); setApiSuccess(null); }, 1500);
        },
        onError: (error) => {
          const message = ((error as AxiosError).response?.data as AxiosError)?.message || error.message || "فشل إنشاء الطاولات المتعددة.";
          setApiError(message);
        },
      });
    } catch (error) {
      console.error("Multi Form Submit Catch Error:", error);
      setApiError((error as Error).message || "حدث خطأ غير متوقع عند إنشاء الطاولات المتعددة.");
    }
  };

  const confirmDelete = async () => {
    if (!showDeleteModal) return;
    setApiError(null); setApiSuccess(null);
    try {
      await deleteDeskAction({}, {
        onSuccess: () => {
          setApiSuccess(`تم حذف الطاولة رقم "${showDeleteModal.desk_number}" بنجاح.`);
          refetch();
          closeDeleteConfirm();
          setTimeout(() => setApiSuccess(null), 3000);
        },
        onError: (error: Error) => {
          setApiError(((error as AxiosError).response?.data as AxiosError)?.message || error.message || "فشل حذف الطاولة.");
        },
      });
    } catch (e) {
      console.error("Delete Catch Error:", e);
      setApiError((e as Error).message || "حدث خطأ غير متوقع أثناء الحذف.");
    }
  };

  const handleConfirmStatusChange = async (deskId: number, newStatus: Desk['status']) => {
    setSelectedDeskId(deskId);
    setApiError(null); setApiSuccess(null);
    try {
      await updateDeskStatusAction({ status: newStatus }, {
        onSuccess: () => {
          setApiSuccess(`تم تحديث حالة الطاولة ${deskId} بنجاح.`);
          closeStatusModal();
          refetch();
          setTimeout(() => setApiSuccess(null), 3000);
        },
        onError: (error: AxiosError) => {
          setApiError((error.response?.data as {message: string})?.message || error.message || "فشل تحديث حالة الطاولة.");
        },
      });
    } catch (error) {
      console.error("Status Update Catch Error:", error)
      setApiError((error as AxiosError).message || "خطأ غير متوقع عند تحديث الحالة.");
    }
  };

  // --- Table Columns ---
  const columns = useMemo((): ColumnDefinition<Desk>[] => [
    { key: 'desk_number', header: '#', cellClassName: 'font-semibold text-gray-800', width: '60px' },
    { key: 'name', header: 'اسم مخصص', render: (d) => d.name || <span className="text-gray-400">-</span> },
    { key: 'number_of_seats', header: 'مقاعد', cellClassName: 'text-center', width: '80px' },
    {
      key: 'status', header: 'الحالة', cellClassName: 'text-center', width: '120px',
      render: (d) => {
        const statusInfo = formatStatus(d.status);
        return (
          <button
            onClick={() => openStatusModal(d)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusInfo.colorClass} hover:opacity-80 transition-opacity`}
            title={`الحالة الحالية: ${statusInfo.text}. اضغط للتغيير.`}
          >
            <statusInfo.icon size={12}/> {statusInfo.text}
          </button>
        );
      }
    },
    {
      key: 'customer', header: 'العميل المخصص',
      render: (d) => d.customer ? (
        <span className="flex items-center gap-1.5 text-sm text-blue-700"> <UserCheck size={15}/> {d.customer.name} </span>
      ) : <span className="text-xs text-gray-400 italic">غير مخصصة</span>
    },
    {
      key: 'qrcode', header: 'QR Code', cellClassName: 'text-center', width: '80px',
      render: (d) => (
        <Button variant="ghost" size="sm" className="p-1 text-primary hover:bg-primary/10" onClick={() => openQrCode(d)} title="عرض QR Code">
          <QrCode size={18} />
        </Button>
      )
    },
    {
      key: 'actions', header: 'إجراءات', cellClassName: 'text-center w-[100px]',
      render: (d) => (
        <div className="flex justify-center items-center gap-1">
          <Button variant="ghost" size="sm" className="p-1 text-blue-600 hover:bg-blue-50" onClick={() => handleOpenEditModal(d)} title="تعديل"> <Edit size={16} /> </Button>
          <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:bg-red-50" onClick={() => openDeleteConfirm(d)} title="حذف"> <Trash2 size={16} /> </Button>
        </div>
      )
    },
  ], []); // Removed statusUpdateLoading, added desks

  // --- Toolbar Config ---
  const breadcrumbItems = [ { label: "لوحة التحكم", href: "/" }, { label: "إدارة القاعة" }, { label: "الطاولات" }, ];
  const toolbarActions = (
    <div className="flex gap-2">
      <Button onClick={openMultiModal} icon={Layers} variant="secondary">إنشاء طاولات متعددة</Button>
      <Button onClick={handleOpenAddModal} icon={Plus}>إضافة طاولة</Button>
    </div>
  );

  // --- Render ---
  return (
    <div className="space-y-4">
      <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />
      {apiError && !showFormModal && !showDeleteModal && !statusChangeDesk && !showMultiModal && <Alert variant="error" message={apiError} onClose={() => setApiError(null)} />}
      {apiSuccess && !showFormModal && !showDeleteModal && !statusChangeDesk && !showMultiModal && <Alert variant="success" message={apiSuccess} onClose={() => setApiSuccess(null)} />}

      <DataTable<Desk>
        columns={columns}
        data={desks ?? []}
        isLoading={isLoading}
        error={queryError ? (queryError as Error).message || "فشل تحميل الطاولات" : null}
        emptyStateMessage="لم يتم إضافة أي طاولات بعد."
        rowKey="id"
      />

      {/* --- Modals --- */}
      <Modal isOpen={showFormModal} onClose={handleCloseFormModal} title={editingDesk ? `تعديل الطاولة ${editingDesk.desk_number}` : "إضافة طاولة جديدة"} size="xl" /* Increased size */
        footer={<>
          <Button variant="secondary" onClick={handleCloseFormModal} disabled={isCreating || isUpdating} icon={X}>إلغاء</Button>
          <Button type="submit" form="desk-form" variant="primary" isLoading={isCreating || isUpdating} disabled={isCreating || isUpdating} icon={Save}> {editingDesk ? "حفظ التعديلات" : "إضافة الطاولة"} </Button>
        </>}
      >
        <form id="desk-form" onSubmit={handleFormSubmit} className="space-y-5 p-1">
          {apiError && <Alert variant="error" message={apiError} className="mb-4" onClose={()=>setApiError(null)}/>}
          
          <h3 className="text-md font-semibold text-gray-700 border-b pb-2 mb-3">معلومات أساسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="رقم الطاولة *" name="desk_number" type="number" value={String(formData.desk_number)} onChange={handleChange} required min="1" disabled={isCreating || isUpdating}/>
            <Input label="عدد المقاعد *" name="number_of_seats" type="number" value={String(formData.number_of_seats)} onChange={handleChange} required min="1" disabled={isCreating || isUpdating}/>
            <Input label="اسم مخصص (اختياري)" name="name" value={formData.name || ''} onChange={handleChange} placeholder="مثال: طاولة النافذة" disabled={isCreating || isUpdating}/>
          </div>

          <button type="submit" className="hidden" />
        </form>
      </Modal>

      {/* Multi-desk creation modal */}
      <Modal isOpen={showMultiModal} onClose={closeMultiModal} title="إنشاء طاولات متعددة" size="md"
        footer={<>
          <Button variant="secondary" onClick={closeMultiModal} disabled={isCreatingMulti} icon={X}>إلغاء</Button>
          <Button type="submit" form="multi-desk-form" variant="primary" isLoading={isCreatingMulti} disabled={isCreatingMulti} icon={Save}>إنشاء الطاولات</Button>
        </>}
      >
        <form id="multi-desk-form" onSubmit={handleMultiSubmit} className="space-y-4 p-1">
          {apiError && <Alert variant="error" message={apiError} className="mb-4" onClose={()=>setApiError(null)}/>}
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">يمكنك إنشاء مجموعة من الطاولات دفعة واحدة عن طريق تحديد نطاق الأرقام.</p>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="رقم البداية *" 
                name="startRange" 
                type="number" 
                value={String(multiFormData.startRange)} 
                onChange={handleMultiFormChange} 
                required 
                min="1" 
                disabled={isCreatingMulti}
              />
              <Input 
                label="رقم النهاية *" 
                name="endRange" 
                type="number" 
                value={String(multiFormData.endRange)} 
                onChange={handleMultiFormChange} 
                required 
                min="1" 
                disabled={isCreatingMulti}
              />
            </div>
            <p className="text-xs text-gray-500">ملاحظة: سيتم إنشاء {multiFormData.endRange - multiFormData.startRange + 1} طاولة بمقعدين لكل طاولة.</p>
          </div>
          
          <button type="submit" className="hidden" />
        </form>
      </Modal>

      {/* Delete, QR, Status Modals */}
      <Modal isOpen={!!showDeleteModal} onClose={closeDeleteConfirm} title="تأكيد حذف الطاولة" size="sm"
        footer={<>
          <Button variant="secondary" onClick={closeDeleteConfirm} disabled={isDeleting} icon={X}>إلغاء</Button>
          <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting} disabled={isDeleting} icon={Trash2}>نعم، حذف</Button>
        </>}
      >
        <p className="text-sm text-gray-600"> هل أنت متأكد من حذف الطاولة رقم <strong>{showDeleteModal?.desk_number}</strong>؟ </p>
        {apiError && showDeleteModal && <Alert variant="error" message={apiError} className="mt-3" onClose={()=>setApiError(null)}/>}
      </Modal>

      <Modal isOpen={!!showQrModal} onClose={closeQrCode} title={`QR Code للطاولة ${showQrModal?.desk_number}`} size="sm">
        {showQrModal?.qrcode ? (
          <div className="text-center">
            <img src={getImageLink(showQrModal.qrcode)} alt={`QR Code ${showQrModal.desk_number}`} className="mx-auto p-1 bg-white max-w-[250px] w-full"/>
            <p className="text-xs text-gray-500 mt-3">يمكن للعملاء مسح هذا الرمز.</p>
          </div>
        ) : <Alert variant='warning' message='لم يتم العثور على رمز QR لهذه الطاولة.'/>}
      </Modal>

      <StatusChangeModal
        isOpen={!!statusChangeDesk}
        onClose={closeStatusModal}
        currentDesk={statusChangeDesk}
        onConfirm={handleConfirmStatusChange}
        isLoading={isUpdatingStatus}
        apiError={apiError}
      />
    </div>
  );
};

export default DesksPage;