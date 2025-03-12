import React, { useRef } from 'react';

interface FileUploadButtonProps {
  onFilesSelected: (files: FileList) => void;
  multiple?: boolean;
  accept?: string;
  buttonText?: string;
  className?: string;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFilesSelected,
  multiple = false,
  accept = 'image/*',
  buttonText = 'Upload',
  className = 'px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700'
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      // Reset input value to allow selecting same file again
      e.target.value = '';
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        className={className}
      >
        {buttonText}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
};

export default FileUploadButton;
