import React, { useState, useRef } from 'react';
import { ProductImage } from '../types';
import { 
  UploadCloud, 
  Trash2, 
  Star, 
  MoveLeft, 
  MoveRight, 
  RefreshCw, 
  Plus, 
  Image as ImageIcon, 
  AlertCircle, 
  Check, 
  Eye, 
  X, 
  GripVertical,
  Link as LinkIcon
} from 'lucide-react';

interface EbookImageGalleryProps {
  images: ProductImage[];
  onChange: (updatedImages: ProductImage[]) => void;
  maxImages?: number;
  isDigital?: boolean;
}

export const EbookImageGallery: React.FC<EbookImageGalleryProps> = ({
  images,
  onChange,
  maxImages = 15,
  isDigital = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Drag and drop reordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);

  // Validate File (Type and Size)
  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB limit per image

    const isTypeValid = validTypes.includes(file.type.toLowerCase()) || 
      /\.(jpg|jpeg|png|webp)$/i.test(file.name);

    if (!isTypeValid) {
      return `Invalid format (${file.name}). Only JPG, PNG, and WebP images are allowed.`;
    }

    if (file.size > maxSizeBytes) {
      return `File too large (${file.name}). Maximum size is 10MB per image.`;
    }

    return null;
  };

  // Helper to re-index display orders and enforce primary status
  const normalizeImageOrders = (items: ProductImage[]): ProductImage[] => {
    if (items.length === 0) return [];

    let hasPrimary = items.some(img => img.isPrimary);
    return items.map((img, idx) => ({
      ...img,
      displayOrder: idx,
      isPrimary: hasPrimary ? img.isPrimary : idx === 0
    }));
  };

  // Process multi-file upload
  const processFiles = (files: FileList | File[]) => {
    setErrorMessage('');
    const fileList = Array.from(files);

    if (images.length + fileList.length > maxImages) {
      setErrorMessage(`Maximum limit reached. You can upload up to ${maxImages} images per E-book.`);
      return;
    }

    const newImageItems: ProductImage[] = [];
    let errors: string[] = [];

    let pendingReads = fileList.length;
    if (pendingReads === 0) return;

    fileList.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
        pendingReads--;
        if (pendingReads === 0 && newImageItems.length > 0) {
          const combined = normalizeImageOrders([...images, ...newImageItems]);
          onChange(combined);
        }
        if (errors.length > 0) setErrorMessage(errors.join(' '));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        
        newImageItems.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          url,
          displayOrder: images.length + newImageItems.length,
          isPrimary: images.length === 0 && newImageItems.length === 0,
          createdAt: new Date().toISOString(),
          fileName: file.name,
          fileSize: sizeFormatted
        });

        pendingReads--;
        if (pendingReads === 0) {
          const combined = normalizeImageOrders([...images, ...newImageItems]);
          onChange(combined);
        }
      };

      reader.onerror = () => {
        errors.push(`Failed to read file ${file.name}`);
        pendingReads--;
        if (pendingReads === 0 && newImageItems.length > 0) {
          const combined = normalizeImageOrders([...images, ...newImageItems]);
          onChange(combined);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  // Drag and drop handlers for upload zone
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Add Image by URL
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (images.length >= maxImages) {
      setErrorMessage(`Maximum limit reached (${maxImages} images).`);
      return;
    }

    const newImg: ProductImage = {
      id: `img-url-${Date.now()}`,
      url: urlInput.trim(),
      displayOrder: images.length,
      isPrimary: images.length === 0,
      createdAt: new Date().toISOString(),
      fileName: 'External Image URL'
    };

    const combined = normalizeImageOrders([...images, newImg]);
    onChange(combined);
    setUrlInput('');
    setShowUrlInput(false);
  };

  // Set image as Cover / Primary
  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, idx) => ({
      ...img,
      isPrimary: idx === index
    }));
    
    // Move primary image to index 0
    const primaryObj = updated[index];
    const rest = updated.filter((_, idx) => idx !== index);
    const reordered = [primaryObj, ...rest];

    onChange(normalizeImageOrders(reordered));
  };

  // Remove individual image
  const handleRemoveImage = (index: number) => {
    const remaining = images.filter((_, idx) => idx !== index);
    onChange(normalizeImageOrders(remaining));
  };

  // Move image left/up or right/down
  const handleMove = (index: number, direction: 'prev' | 'next') => {
    const targetIndex = direction === 'prev' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    onChange(normalizeImageOrders(copy));
  };

  // Replace individual image
  const triggerReplace = (index: number) => {
    setReplaceTargetIndex(index);
    if (replaceInputRef.current) {
      replaceInputRef.current.click();
    }
  };

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replaceTargetIndex === null || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    const err = validateFile(file);
    if (err) {
      setErrorMessage(err);
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const url = evt.target?.result as string;
      const copy = [...images];
      copy[replaceTargetIndex] = {
        ...copy[replaceTargetIndex],
        url,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      };
      onChange(normalizeImageOrders(copy));
      setReplaceTargetIndex(null);
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop reordering handlers for thumbnails
  const handleCardDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCardDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const reordered = [...images];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, moved);

    setDraggedIndex(index);
    onChange(normalizeImageOrders(reordered));
  };

  return (
    <div className="space-y-4 text-left">
      {/* Hidden file input for replacing individual images */}
      <input
        type="file"
        ref={replaceInputRef}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleReplaceFile}
        className="hidden"
      />

      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-purple-400" />
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {isDigital ? 'E-book Cover & Preview Gallery' : 'Product Image Gallery'}
          </h3>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
            {images.length} / {maxImages} Uploaded
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-bold text-cyan-500 hover:text-cyan-400 flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{showUrlInput ? 'Hide URL Input' : 'Add Image by URL'}</span>
          </button>
        </div>
      </div>

      {/* URL Input Bar */}
      {showUrlInput && (
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL (https://...)"
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all ${
          isDragging
            ? 'border-purple-400 bg-purple-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-purple-500/50'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
              Drag & drop multiple E-book images here
            </p>
            <p className="text-[11px] text-slate-400">
              Main Cover, Table of Contents, Chapter Previews (JPG, PNG, WebP up to 10MB)
            </p>
          </div>
          <label className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow cursor-pointer text-xs active:scale-95 transition-all">
            <Plus className="w-3.5 h-3.5" />
            <span>Select Images from Device</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="p-1 text-red-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Gallery Cards Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
            <GripVertical className="w-3.5 h-3.5 text-purple-400" />
            <span>Drag thumbnails to reorder or use arrow controls. Image #1 is the Primary Cover Image.</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={img.id || `img-${idx}`}
                draggable
                onDragStart={(e) => handleCardDragStart(e, idx)}
                onDragOver={(e) => handleCardDragOver(e, idx)}
                className={`group relative rounded-2xl border bg-slate-900 overflow-hidden shadow-md transition-all ${
                  img.isPrimary || idx === 0
                    ? 'border-purple-500 ring-2 ring-purple-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Thumbnail Image Container */}
                <div className="relative aspect-3/4 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={img.url}
                    alt={`Preview ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Primary Cover Badge */}
                  {(img.isPrimary || idx === 0) ? (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1 z-10">
                      <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> Primary Cover
                    </span>
                  ) : (
                    <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-slate-300 font-extrabold text-[10px] px-2 py-0.5 rounded-md z-10">
                      Preview #{idx + 1}
                    </span>
                  )}

                  {/* Action Overlay Buttons */}
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setPreviewImage(img.url)}
                        title="View Full Resolution"
                        className="p-1.5 bg-slate-900/90 text-slate-200 hover:text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Delete Image"
                        className="p-1.5 bg-red-500/20 text-red-400 hover:text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {!img.isPrimary && idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          className="w-full py-1 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black rounded-lg shadow flex items-center justify-center gap-1"
                        >
                          <Star className="w-3 h-3 fill-current" /> Set as Cover
                        </button>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, 'prev')}
                          title="Move Left/Up"
                          className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-lg text-[10px] flex items-center justify-center"
                        >
                          <MoveLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerReplace(idx)}
                          title="Replace File"
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-[10px] font-bold flex items-center gap-0.5"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === images.length - 1}
                          onClick={() => handleMove(idx, 'next')}
                          title="Move Right/Down"
                          className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-lg text-[10px] flex items-center justify-center"
                        >
                          <MoveRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Info */}
                <div className="p-2 text-[10px] text-slate-400 truncate border-t border-slate-800 flex items-center justify-between">
                  <span className="truncate max-w-[100px]">{img.fileName || `Image ${idx + 1}`}</span>
                  {img.fileSize && <span className="text-[9px] font-mono text-slate-500">{img.fileSize}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-slate-400 hover:text-white p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Full Preview"
              referrerPolicy="no-referrer"
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};
