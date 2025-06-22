import React, { useRef, useState } from 'react';
import axios from '../services/Axios';
import '../styles/FileUpload.css';
import Swal from 'sweetalert2';

const FileUpload = () => {
  const fileInputRef = useRef(null);
  const [inputKey, setInputKey] = useState(Date.now());
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Función para descargar texto como archivo .txt
  const downloadTxt = (filename, text) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setInputKey(Date.now());
      return;
    }

    // Validar que el archivo sea mp4
    if (file.type !== 'video/mp4') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Solo se permiten archivos de video MP4.',
      });
      setInputKey(Date.now());
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    setLoading(true);

    try {
      const response = await axios.post('/get/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Verifica la estructura real de la respuesta
      console.log('Respuesta del backend:', response.data);

      // Asegúrate de que los campos existen y son string
      const transcription = response.data?.transcription;
      const summary = response.data?.summary;

      // Descargar TXT de la transcripción
      if (transcription && typeof transcription === 'string') {
        downloadTxt('transcripcion.txt', transcription);
      }

      // Descargar TXT del resumen
      if (summary && typeof summary === 'string') {
        downloadTxt('resumen.txt', summary);
      }

    } catch (error) {
      console.error('Error al subir el video:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al procesar el video.',
      });
    } finally {
      setLoading(false);
      setInputKey(Date.now());
    }
  };

  return (
    <div className="file-upload">
      {loading && (
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div style={{ marginTop: 10, color: '#00ffcc', fontWeight: 'bold' }}>
            Procesando archivo...
          </div>
        </div>
      )}
      <div className="card" style={{ width: '18rem' }}>
        <div className="card-body">
          <h5 className="card-title" style={{ textAlign: 'center' }}>Resumidor de videos</h5>
          <p className="card-text">
            Sube un video y te lo resumimos en texto. Puedes subir videos de YouTube, Vimeo o cualquier otro sitio web.
          </p>
          <div className="btnFileUpload">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={handleButtonClick}
              disabled={loading}
            >
              subir
            </button>
            <input
              key={inputKey}
              type="file"
              accept="video/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;