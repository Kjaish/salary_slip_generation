import axios from "axios";
import { useState } from "react";
import { Item } from "./employee-table";

type PreparingStatus = "not_yet" | "storing" | "generating" | "sending";

const SendingMail = ({ emp }: { emp: Item }) => {
  const [sendingMail, setSendingMail] = useState<boolean>(false);
  const [stage, setStage] = useState<PreparingStatus>("not_yet");

  // Save to database, generating PDF, sending email
  async function sendMailtoEmployee() {
    setSendingMail(true);

    try {
      const isStored = await requestForStorePayroll(emp);
      await requestForPdfGeneration({ emp_id: isStored?.data.emp_id });
      await requestForSendingMail({
        email: emp.email,
        emp_id: isStored?.data.emp_id,
      });

      setSendingMail(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function requestForStorePayroll(emp: Item) {
    try {
      setStage("storing")
      const response = await axios.post(
        "http://localhost:8000/api/payroll/add",
        emp,
        {
          method: "POST",
        }
      );

      return response;
    } catch {
      throw new Error("Error while store user in database.");
    }
  }

  async function requestForPdfGeneration({ emp_id }: { emp_id: string }) {
    try {
      setStage("generating")
      const response = await axios.post(
        "http://localhost:8000/api/pdf/generate",
        { employee_id: emp_id }
      );

      return response;
    } catch {
      throw new Error("Error while generating pdf file.");
    }
  }

  async function requestForSendingMail({
    email,
    emp_id,
  }: {
    email: string;
    emp_id: string;
  }) {
    try {
      setStage("sending")
      const response = await axios.post(
        "http://localhost:8000/api/email/send",
        {
          email: email,
          filename: emp_id + ".pdf",
        }
      );

      return response;
    } catch {
      throw new Error("Error while sending email.");
    }
  }

  return (
    <>
      {sendingMail === false ? (
        <button type="button" onClick={sendMailtoEmployee}>
          Send Salary Slip
        </button>
      ) : (
        <button disabled aria-disabled>
          {stage.charAt(0).toUpperCase() + stage.slice(1)}...
        </button>
      )}
    </>
  );
};

export default SendingMail;
