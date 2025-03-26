import axios from "axios";
import { ChangeEvent, useRef, useState } from "react";
import { Item } from "./employee-table";

type UploadStatus = "idle" | "uploading" | "success" | "error";

const FileUploader = ({
  setData, 
}: {
  setData: (data: Item[]) => void; 
}) => {
  const [file, setfile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadingProgress, setUploadingProgress] = useState(0);

  function handleFileUploadClick() {
    return fileInputRef.current?.click();
  }

  function handleClearFileInput() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setfile(null);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (
      selectedFile &&
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setfile(selectedFile);
      setError(null);
    } else {
      setError("Only accept Excel file. (.xlsx)");
    }
  }

  async function handleFileUpload() {
    if (!file) return;

    setStatus("uploading");

    // reset the progress bar
    setUploadingProgress(0);

    // attached file to the request form-data
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/upload/file",
        formData,
        {
          method: "POST",
          headers: {
            "content-type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progressResponse = progressEvent.total
              ? Math.round((progressEvent.loaded / progressEvent.total) * 100)
              : 0;

            setUploadingProgress(progressResponse);
          },
        }
      );
 
      if (response.status == 200) {
        setData(response.data.data);
      }

      setfile(null);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setUploadingProgress(0);
      console.log("error occurs: " + error);
    }
  }

  // handling drag event
  function handleDrag(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(event.type === "dragenter" || event.type === "dragover");
  }

  // handling, when file is dropped.
  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const droppedFile = event.dataTransfer?.files?.[0];

    if (
      droppedFile &&
      droppedFile.type ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setfile(null);
      setfile(event.dataTransfer?.files[0]);
    } else {
      setError("Only accept Excel file. (.xlsx)");
    }

    // event.dataTransfer?.clearData();
  }

  return (
    <div className="w-full px-[2em]">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-left text-5xl my-3 font-bold">Payroll</div>
          <div className="text-left text-1xl my-3 font-light">
            Upload excel file, to process further
          </div>
        </div>
        <div>
          {file && <button onClick={handleClearFileInput}>Clear File</button>}
        </div>
      </div>
      <div
        className={`h-[40em] border-2 border-gray-300 border-dashed p-10 rounded-xl cursor-pointer flex justify-center items-center ${
          dragActive ? "bg-gray-100" : ""
        }`}
        onClick={handleFileUploadClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrag={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {file ? (
          <div>
            <p>{file.name}</p>
            <p>{(file.size / 1000000).toFixed(2)} KB</p>
          </div>
        ) : (
          <div>
            <p>Drop a file or Browse file</p>
          </div>
        )}
      </div>
      {error && <div className="mt-4 text-md text-red-400">{error}</div>}

      {file && status != "uploading" && (
        <button className="mt-5" onClick={handleFileUpload}>
          upload
        </button>
      )}

      {file && status == "uploading" && (
        <button className="mt-5 text-semibold " aria-disabled>
          {uploadingProgress}%
        </button>
      )}
    </div>
  );
};

export default FileUploader;
