import { useState } from "react";
import "./App.css";
import FileUploader from "./components/file-uploader";
import EmployeeTable, { Item } from "./components/employee-table";

function App() {
  document.title = "ABC.In - Payroll";

  const [data, setData] = useState<Item[] | null>(null);

  return (
    <div className="w-full flex">
      {!data && (
        <div className="w-full">
          <FileUploader setData={setData} />
        </div>
      )}
      {data && (
        <EmployeeTable data={data} />
      )}
    </div>
  );
}

export default App;
