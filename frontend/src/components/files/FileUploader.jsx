import { useRef, useState } from "react";
import { uploadFile } from "../../services/files";

export default function FileUploader({ onUploaded }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [error,      setError]      = useState(null);

  async function handleFiles(files) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of files) {
        const res = await uploadFile(file);
        onUploaded?.(res.data);
      }
    } catch (err) {
      const msg =
        err?.errors?.file?.[0] ??
        err?.message ??
        "Upload failed.";
      setError(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function onDragLeave() {
    setDragActive(false);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <div
        className={`file-dropzone${dragActive ? " drag-active" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {uploading ? (
          <span>Uploading…</span>
        ) : (
          <>
            <span className="dropzone-icon">↑</span>
            <span>Drag &amp; drop files here, or <strong>click to browse</strong></span>
            <span className="dropzone-hint">Images, PDF, Word, Excel, CSV, TXT, ZIP · max 10 MB</span>
          </>
        )}
      </div>
      {error && <p className="alert-error" style={{ marginTop: "0.5rem" }}>{error}</p>}
      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
