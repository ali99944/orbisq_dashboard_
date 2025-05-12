import React, { useState, useCallback, ChangeEvent, DragEvent, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import Input from './input';
import Button from './button';



type UploadMethod = 'device' | 'url';
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface FileUploadProps {
    label: string;
    id: string; // Required for label association
    accept?: string; // e.g., "image/png, image/jpeg"
    maxSizeMB?: number; // Max size in Megabytes
    currentImageUrl?: string | null; // URL of already uploaded image (for edit mode)
    onFileSelect: (file: File | null) => void; // Callback for local file selection/removal
    onUrlSelect: (url: string | null) => void; // Callback for URL selection/removal
    onFileRemove?: () => void; // Callback when existing image is explicitly removed
    className?: string;
    disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
    label,
    id,
    accept = "image/*",
    maxSizeMB = 5, // Default 5MB limit
    currentImageUrl = null,
    onFileSelect,
    onUrlSelect,
    onFileRemove,
    className = '',
    disabled = false,
}) => {
    const [activeMethod, setActiveMethod] = useState<UploadMethod>('device');
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<UploadStatus>('idle'); // For potential upload simulation/feedback
    const inputRef = useRef<HTMLInputElement>(null); // Ref for triggering file input

    // Reset preview if currentImageUrl prop changes (e.g., form reset)
    React.useEffect(() => {
        setPreviewUrl(currentImageUrl);
        if (!currentImageUrl) {
             // If the prop clears, clear local state too
             setImageUrlInput('');
             onFileSelect(null);
             onUrlSelect(null);
        }
    }, [currentImageUrl]); // Dependency on external prop

    const MAX_BYTES = maxSizeMB * 1024 * 1024;

    // --- File Validation ---
    const validateFile = (file: File): boolean => {
        setError(null);
        setStatus('idle');
        if (!file) return false;

        // Check type
        if (!file.type.startsWith('image/')) { // Basic image check, refine with `accept` if needed
            setError(`نوع الملف غير مدعوم. الرجاء اختيار ملف صورة (${accept}).`);
            return false;
        }
        // Check size
        if (file.size > MAX_BYTES) {
            setError(`حجم الملف كبير جداً (الحد الأقصى ${maxSizeMB}MB).`);
            return false;
        }
        return true;
    };

    // --- Event Handlers ---
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            onFileSelect(file);
            onUrlSelect(null); // Clear URL if file is selected
            setImageUrlInput('');
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
            setStatus('success'); // Indicate selection success
             // Clear the input value so the same file can be selected again if removed
             if(inputRef.current) inputRef.current.value = "";
        } else {
            // Clear if validation failed or no file
             onFileSelect(null);
             // Do not clear preview here if validation failed, let error show
        }
    };

    const handleUrlInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setImageUrlInput(e.target.value);
        setError(null); // Clear error when typing URL
        setStatus('idle');
         if (e.target.value === '') { // If URL cleared, clear selection
            onUrlSelect(null);
            setPreviewUrl(currentImageUrl); // Revert preview to original if URL cleared
         }
    };

    const handleUrlConfirm = () => {
        if (imageUrlInput && (imageUrlInput.startsWith('http://') || imageUrlInput.startsWith('https://'))) {
            // Basic URL validation passed
            onUrlSelect(imageUrlInput);
            onFileSelect(null); // Clear file if URL is selected
            setPreviewUrl(imageUrlInput); // Use URL as preview
            setStatus('success');
            setError(null);
        } else {
            setError("الرجاء إدخال رابط URL صحيح يبدأ بـ http:// أو https://");
            onUrlSelect(null);
            setStatus('error');
            // setPreviewUrl(currentImageUrl); // Revert preview on invalid URL
        }
    };

    const handleRemoveImage = () => {
        setPreviewUrl(null);
        setImageUrlInput('');
        onFileSelect(null);
        onUrlSelect(null);
        setError(null);
        setStatus('idle');
        if (inputRef.current) inputRef.current.value = ""; // Clear file input
        if (onFileRemove) onFileRemove(); // Notify parent if needed
    };

    // --- Drag & Drop Handlers ---
    const handleDrag = useCallback((e: DragEvent<HTMLDivElement | HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement | HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setError(null);
        setStatus('idle');

        let file: File | null = null;
        let droppedUrl: string | null = null;

        // Try getting file from drop event
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            file = e.dataTransfer.files[0];
        }

        // Try getting URL (e.g., dragging image from another browser tab)
        if (!file) {
            try {
                 const htmlData = e.dataTransfer.getData('text/html');
                 // Simple regex to find image src within HTML data
                 const match = htmlData.match(/<img.*?src=["'](.*?)["']/i);
                 if (match && match[1]) {
                    droppedUrl = match[1];
                 } else {
                     // Fallback: Check if plain text is a URL
                    const textData = e.dataTransfer.getData('text/plain');
                     if (textData && (textData.startsWith('http://') || textData.startsWith('https://'))) {
                         droppedUrl = textData;
                     }
                 }
            } catch (err) {
                 console.warn("Could not parse dropped data for URL:", err);
            }
        }


        if (file && validateFile(file)) {
             setActiveMethod('device'); // Switch to device view
             onFileSelect(file);
             onUrlSelect(null);
             setImageUrlInput('');
             const reader = new FileReader();
             reader.onloadend = () => setPreviewUrl(reader.result as string);
             reader.readAsDataURL(file);
             setStatus('success');
        } else if (droppedUrl && (droppedUrl.startsWith('http://') || droppedUrl.startsWith('https://'))) {
             setActiveMethod('url'); // Switch to URL view
             setImageUrlInput(droppedUrl); // Set URL input value
             onUrlSelect(droppedUrl);
             onFileSelect(null);
             setPreviewUrl(droppedUrl); // Show URL as preview
             setStatus('success');
        } else if (!file && !droppedUrl) {
             setError("لم يتمكن من تحديد ملف أو رابط صورة صالح من العنصر المسقط.");
             setStatus('error');
        }
        // else: validateFile already set an error if the file was invalid

    }, [validateFile, onFileSelect, onUrlSelect, currentImageUrl]);


    return (
        <div className={`w-full ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>

            {/* Method Selection Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
                <button
                    type="button"
                    onClick={() => setActiveMethod('device')}
                    disabled={disabled}
                    className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors duration-150 focus:outline-none ${activeMethod === 'device' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    style={{ borderColor: activeMethod === 'device' ? '#A70000' : undefined, color: activeMethod === 'device' ? '#A70000' : undefined }}
                >
                    رفع من الجهاز
                </button>
                <button
                    type="button"
                    onClick={() => setActiveMethod('url')}
                    disabled={disabled}
                    className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors duration-150 focus:outline-none ${activeMethod === 'url' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                     style={{ borderColor: activeMethod === 'url' ? '#A70000' : undefined, color: activeMethod === 'url' ? '#A70000' : undefined }}
               >
                    استخدام رابط URL
                </button>
            </div>

            {/* Content Area */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Preview Area */}
                <div className="w-full sm:w-28 flex-shrink-0">
                    <div className={`relative aspect-square w-full rounded-md border overflow-hidden ${previewUrl ? 'border-gray-300 bg-white' : 'border-dashed border-gray-300 bg-gray-50'} ${dragActive ? 'border-primary ring-1 ring-primary/50' : ''}`}>
                        {previewUrl ? (
                             <>
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-1 right-1 p-0.5 bg-white/70 text-red-600 hover:bg-red-100 rounded-full focus:outline-none focus:ring-1 focus:ring-red-500"
                                        aria-label="إزالة الصورة"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                 )}
                             </>
                         ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                                <ImageIcon size={32} className="opacity-50" />
                             </div>
                        )}
                         {/* Drag Overlay */}
                        {dragActive && (
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none">
                                <UploadCloud className="w-8 h-8 text-primary opacity-70" />
                             </div>
                        )}
                    </div>
                     {/* Status Indicator */}
                     <div className="h-4 mt-1 text-xs text-center">
                         {status === 'uploading' && <span className="text-blue-600 flex items-center justify-center gap-1"><Loader2 size={12} className="animate-spin"/> جارِ الرفع...</span>}
                         {status === 'success' && !error && <span className="text-green-600 flex items-center justify-center gap-1"><CheckCircle size={12}/> تم الاختيار</span>}
                         {/* Error is displayed below inputs */}
                    </div>
                </div>

                {/* Input Area */}
                <div className="flex-grow w-full">
                    {/* Device Upload Area */}
                    {activeMethod === 'device' && (
                        <label
                            htmlFor={id}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`flex flex-col items-center justify-center w-full h-32 px-4 border-2 ${error ? 'border-red-400' : 'border-gray-300'} border-dashed rounded-lg cursor-pointer ${disabled ? 'bg-gray-100 opacity-70 cursor-not-allowed' : 'bg-gray-50 hover:bg-gray-100'} transition-colors ${dragActive ? 'border-primary bg-primary/5' : ''}`}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                <UploadCloud className={`w-8 h-8 mb-3 ${dragActive ? 'text-primary' : 'text-gray-400'}`} />
                                <p className={`mb-2 text-sm ${dragActive ? 'text-primary' : 'text-gray-500'}`}>
                                    <span className="font-semibold">انقر للرفع</span> أو اسحب وأفلت
                                </p>
                                <p className="text-xs text-gray-500">
                                    {accept.replace('image/', '').toUpperCase()} (بحد أقصى {maxSizeMB}MB)
                                </p>
                            </div>
                             <input
                                ref={inputRef}
                                id={id}
                                name={id}
                                type="file"
                                className="hidden"
                                accept={accept}
                                onChange={handleFileChange}
                                disabled={disabled}
                             />
                        </label>
                    )}

                     {/* URL Input Area */}
                     {activeMethod === 'url' && (
                        <div className="space-y-2">
                            <Input
                                ref={null} // No ref needed for URL input typically
                                label="أو أدخل رابط الصورة (URL)"
                                id={id + "-url"}
                                name={id + "-url"}
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrlInput}
                                onChange={handleUrlInputChange}
                                disabled={disabled}
                                size="sm"
                                className="ltr" // Ensure LTR for URL input
                                dir="ltr"
                             />
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleUrlConfirm}
                                disabled={!imageUrlInput || disabled}
                                icon={CheckCircle}
                            >
                                تأكيد الرابط
                             </Button>
                        </div>
                     )}

                     {/* Error Display */}
                    {error && (
                        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                            <AlertTriangle size={14} /> {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUpload;