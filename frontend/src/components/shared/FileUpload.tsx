import React, { useState } from 'react';
import { MdAddAPhoto, MdClose, MdCloudUpload } from 'react-icons/md';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import { usuariosService } from '@/services/usuarios.service';

interface FileUploadProps {
  idUsuario: string;
  cargarDatos: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ idUsuario, cargarDatos }) => {
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files?.[0];
    if (selectedImage) {
      setImageUpload(selectedImage);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(selectedImage);
    } else {
      setImageUpload(null);
      setPreviewUrl(null);
    }
  };

  const cancelUpload = () => {
    setImageUpload(null);
    setPreviewUrl(null);
    const input = document.getElementById('fileInput') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleClose = () => {
    setModalOpen(false);
    cancelUpload();
    setError('');
  };

  const uploadImage = async () => {
    if (!imageUpload) return;
    setError('');
    setIsLoading(true);
    try {
      await usuariosService.subirImagen(imageUpload, idUsuario);
      cargarDatos();
      handleClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir la imagen';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[#006989] rounded-lg border border-[#006989]/30 bg-[#006989]/5 hover:bg-[#006989]/10 hover:border-[#006989]/50 transition-colors"
      >
        <MdAddAPhoto className="text-base" /> Cambiar foto
      </button>

      <Dialog
        open={modalOpen}
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: '16px', maxWidth: '440px', width: '100%', overflow: 'hidden' },
        }}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <h2 className="text-base font-semibold text-gray-800">Cambiar foto de perfil</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {previewUrl ? (
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img src={previewUrl} alt="Preview" className="w-full object-cover max-h-64" />
            </div>
          ) : (
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center gap-3 py-10 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#006989] hover:bg-[#006989]/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <MdCloudUpload className="text-2xl text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Selecciona una imagen</p>
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP o GIF</p>
              </div>
            </label>
          )}

          <input
            id="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            className="hidden"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {previewUrl && (
            <div className="flex items-center gap-3">
              <label
                htmlFor="fileInput"
                className="flex-1 text-center py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Cambiar
              </label>
              <button
                type="button"
                onClick={uploadImage}
                disabled={isLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-medium text-white bg-[#006989] rounded-lg hover:bg-[#053F61] transition-colors disabled:opacity-50"
              >
                {isLoading ? <CircularProgress size={16} color="inherit" /> : null}
                {isLoading ? 'Subiendo...' : 'Actualizar'}
              </button>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default FileUpload;
