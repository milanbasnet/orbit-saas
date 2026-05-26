import { useState } from "react";
import { downloadFile, deleteFile } from "../../services/files";

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  if (bytes >= 1024)        return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}

function mimeLabel(mime) {
  if (mime.startsWith("image/"))          return "Image";
  if (mime === "application/pdf")         return "PDF";
  if (mime.includes("word"))              return "Word";
  if (mime.includes("excel") || mime.includes("spreadsheet")) return "Excel";
  if (mime === "text/csv")                return "CSV";
  if (mime === "text/plain")              return "TXT";
  if (mime === "application/zip")         return "ZIP";
  return mime.split("/")[1]?.toUpperCase() ?? mime;
}

export default function FileList({ files, onDeleted }) {
  const [busy, setBusy] = useState({});

  async function handleDownload(file) {
    setBusy((b) => ({ ...b, [file.id]: "dl" }));
    try {
      await downloadFile(file.id, file.original_name);
    } finally {
      setBusy((b) => ({ ...b, [file.id]: null }));
    }
  }

  async function handleDelete(file) {
    if (!window.confirm(`Delete "${file.original_name}"?`)) return;
    setBusy((b) => ({ ...b, [file.id]: "del" }));
    try {
      await deleteFile(file.id);
      onDeleted?.(file.id);
    } catch (err) {
      alert(err?.message ?? "Delete failed.");
      setBusy((b) => ({ ...b, [file.id]: null }));
    }
  }

  if (!files.length) {
    return <div className="empty-state">No files uploaded yet.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>File name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Uploaded by</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.original_name}</td>
              <td>
                <span className="badge badge-draft">{mimeLabel(file.mime_type)}</span>
              </td>
              <td>{formatSize(file.size)}</td>
              <td>{file.uploader?.name ?? "—"}</td>
              <td>{new Date(file.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn-secondary btn-sm"
                  onClick={() => handleDownload(file)}
                  disabled={!!busy[file.id]}
                >
                  {busy[file.id] === "dl" ? "…" : "Download"}
                </button>
                {" "}
                <button
                  className="btn-danger btn-sm"
                  onClick={() => handleDelete(file)}
                  disabled={!!busy[file.id]}
                >
                  {busy[file.id] === "del" ? "…" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
