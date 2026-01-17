import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ onImageChange, existingImageUrl = '' }) => {
    const [preview, setPreview] = useState(existingImageUrl || '');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result;
                setPreview(imageUrl);
                onImageChange(imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const handleRemove = () => {
        setPreview('');
        onImageChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            {preview ? (
                <div className="relative group">
                    <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-orange-200">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isDragging
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-orange-300 bg-orange-50/50 hover:border-orange-400 hover:bg-orange-50'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <div className="flex flex-col items-center">
                        <div className={`p-4 rounded-full mb-4 ${
                            isDragging ? 'bg-rose-100' : 'bg-orange-100'
                        }`}>
                            <Upload className={`w-8 h-8 ${
                                isDragging ? 'text-rose-600' : 'text-orange-600'
                            }`} />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">
                            {isDragging ? '이미지를 여기에 놓으세요' : '이미지를 드래그하거나 클릭하여 업로드'}
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF 최대 10MB</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
