
import React, { useRef } from 'react';
import { Upload, Camera } from 'lucide-react';

interface ImageInputProps {
  onImageSelect: (base64: string) => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12 border-2 border-dashed border-neutral-800 rounded-3xl bg-neutral-900/30 hover:bg-neutral-900/50 transition-colors group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
      <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        <Upload className="text-white w-6 h-6" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-medium mb-1">Select Your Portrait</h3>
        <p className="text-neutral-500 text-sm">Upload a clear photo of your face for the best result.</p>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
    </div>
  );
};
