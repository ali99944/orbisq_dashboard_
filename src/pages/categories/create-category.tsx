// src/pages/categories/AddCategoryPage.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Category } from '../../types/category'; // Adjust path

import { Save } from 'lucide-react';
import Alert from '../../components/ui/alert';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import FileUpload from '../../components/ui/file-upload';
import Input from '../../components/ui/input';
import Switch from '../../components/ui/switch';
import TextArea from '../../components/ui/textarea';
import Toolbar from '../../components/ui/toolbar';
import { useMutationAction } from '../../hooks/queries-actions';
import { AxiosError } from 'axios';

// Initial empty state for a new category
const initialCategoryState: Omit<Category, 'id' | 'created_at' | 'products_count'> = {
    name: '',
    description: null,
    image: null, // Handled by FileUpload state
    is_active: true, // Default to active
};

const AddCategoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialCategoryState);
    const [imageFile, setImageFile] = useState<File | null>(null); // State for the selected file
    const [imageUrl, setImageUrl] = useState<string | null>(null); // State for URL input (optional)
    const [formError, setFormError] = useState<string | null>(null);

    // --- API Mutation ---
    const { mutateAsync: createCategory, isPending: isLoading } = useMutationAction({
        url: 'categories', // Your API endpoint for creating categories
        method: 'post',
        contentType: 'multipart/form-data'
    });

    // --- Handlers ---
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if(formError) setFormError(null);
    };

    const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name as keyof typeof initialCategoryState]: checked }));
         if(formError) setFormError(null);
    };

     // Specific handlers for FileUpload component callbacks
     const handleFileSelect = (file: File | null) => {
        setImageFile(file);
        setImageUrl(null); // Clear URL if a file is selected
         if(formError) setFormError(null);
    };

     const handleUrlSelect = (url: string | null) => {
        setImageUrl(url);
        setImageFile(null); // Clear file if a URL is selected
         if(formError) setFormError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!formData.name) {
            setFormError("اسم التصنيف مطلوب.");
            return;
        }

        const submissionData = new FormData();

        // Append standard fields
        submissionData.append('name', formData.name);
        if (formData.description) {
            submissionData.append('description', formData.description);
        }
        submissionData.append('is_active', formData.is_active ? '1' : '0'); // Convert boolean

        // Append image file OR URL
        if (imageFile) {
            submissionData.append('image', imageFile); // Key 'image' must match backend
        } else if (imageUrl) {
            // If your backend accepts an 'image_url' field instead of uploading the file
            // submissionData.append('image_url', imageUrl);
            // OR if your backend downloads the URL - sending the file is usually better
            console.warn("Sending image URL - ensure backend handles this:", imageUrl);
            // For this example, we assume backend prefers file upload, so URL is not sent if file isn't present
        }

        // --- API Call ---
        try {
            await createCategory(submissionData, {
                onSuccess: () => {
                    // Use a success message/toast here before navigating
                    alert("تم إنشاء التصنيف بنجاح!"); // Replace with Alert or Toast
                    navigate('/categories'); // Navigate back to the list
                },
                onError: (err: AxiosError) => {
                    //  const message = (err.response?.data as { message: string })?.message || (err.response?.data)?.errors?.[Object.keys(err.response.data.errors)[0]]?.[0] || "فشل إنشاء التصنيف.";
                    // setFormError(message);
                    console.log(err);
                    
                },
            });
        } catch (error) {
            console.error("Create category error:", error);
            setFormError("حدث خطأ غير متوقع.");
        }
    };

    // --- Toolbar Config ---
    const breadcrumbItems = [
        { label: "لوحة التحكم", href: "/" },
        { label: "التصنيفات", href: "/categories" },
        { label: "إضافة جديد" }, // Current page
    ];

    const toolbarActions = (
        <Link to="/categories">
            <Button variant="secondary" size="sm">
                العودة للتصنيفات
            </Button>
        </Link>
    );

    return (
        <div className="space-y-6">
            <Toolbar breadcrumbItems={breadcrumbItems} actions={toolbarActions} />

            {formError && <Alert variant="error" message={formError} onClose={() => setFormError(null)} />}

             <form onSubmit={handleSubmit}>
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Form Fields (Left/Center) */}
                        <div className="md:col-span-2 space-y-5">
                            <Input
                                label="اسم التصنيف *"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="مثال: مقبلات، مشروبات..."
                                disabled={isLoading}
                            />
                             <TextArea
                                label="الوصف (اختياري)"
                                id="description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                rows={4}
                                placeholder="أضف وصفاً موجزاً لهذا التصنيف..."
                                disabled={isLoading}
                             />
                             <Switch
                                 label="الحالة"
                                 description="تحديد ما إذا كان التصنيف ظاهراً في القائمة."
                                 name="is_active"
                                 checked={formData.is_active}
                                 onChange={handleSwitchChange}
                                 disabled={isLoading}
                              />
                        </div>

                        {/* Image Upload (Right) */}
                        <div className="md:col-span-1">
                            <FileUpload
                                label="صورة التصنيف (اختياري)"
                                id="category-image"
                                accept="image/png, image/jpeg, image/webp"
                                maxSizeMB={2} // Example size limit
                                // currentImageUrl={null} // No current image for add page
                                onFileSelect={handleFileSelect}
                                onUrlSelect={handleUrlSelect}
                                // onFileRemove={() => { /* Optional: Handle removal if needed */ }}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Form Footer Actions */}
                    <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end gap-3">
                         <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/categories')}
                            disabled={isLoading}
                        >
                            إلغاء
                         </Button>
                         <Button
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                            disabled={isLoading}
                            icon={Save}
                        >
                            حفظ التصنيف
                         </Button>
                    </div>
                </Card>
             </form>
        </div>
    );
};

export default AddCategoryPage;