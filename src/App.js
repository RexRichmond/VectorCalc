import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GPCI_OPTIONS = [
  { label: "National Average", value: 1.0 },
  { label: "San Francisco", value: 1.15 },
  { label: "Dallas", value: 0.98 },
  { label: "New York", value: 1.1 }
];

export default function App() {
  const [patients, setPatients] = useState(100);
  const [compliance, setCompliance] = useState(80);
  const [reimbursement, setReimbursement] = useState(120);
  const [gpci, setGpci] = useState(1.0);
  const [mode, setMode] = useState("current");

  const compliantPatients = (patients * compliance) / 100;
  const adjustedReimbursement =
    reimbursement * gpci * (mode === "vector" ? 1.2 : 1.0);
  const revenue = compliantPatients * adjustedReimbursement;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("ROI Calculator Report", 14, 16);
    doc.autoTable({
      startY: 24,
      head: [["Field", "Value"]],
      body: [
        ["Number of Patients", patients],
        ["Compliance (%)", compliance],
        ["Reimbursement", `$${reimbursement}`],
        ["GPCI Locality", GPCI_OPTIONS.find((g) => g.value === gpci).label],
        ["Billing Mode", mode === "vector" ? "Vector" : "Current"],
        ["Compliant Patients", compliantPatients],
        ["Adjusted Reimbursement", `$${adjustedReimbursement.toFixed(2)}`],
        ["Estimated Revenue", `$${revenue.toFixed(2)}`]
      ]
    });
    doc.save("roi_report.pdf");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>ROI Calculator</h1>

      <label>
        Number of Patients:
        <input
          type="number"
          value={patients}
          onChange={(e) => setPatients(Number(e.target.value))}
        />
      </label>
      <br />

      <label>
        Compliance (%):
        <input
          type="number"
          value={compliance}
          onChange={(e) => setCompliance(Number(e.target.value))}
        />
      </label>
      <br />

      <label>
        Reimbursement per Patient ($):
        <input
          type="number"
          value={reimbursement}
          onChange={(e) => setReimbursement(Number(e.target.value))}
        />
      </label>
      <br />

      <label>
        GPCI Locality:
        <select value={gpci} onChange={(e) => setGpci(Number(e.target.value))}>
          {GPCI_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      <br />

      <label>
        Billing Mode:
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="current">Current</option>
          <option value="vector">Vector</option>
        </select>
      </label>

      <hr />

      <h2>Results</h2>
      <p>Compliant Patients: {compliantPatients}</p>
      <p>Adjusted Reimbursement: ${adjustedReimbursement.toFixed(2)}</p>
      <p>Estimated Revenue: ${revenue.toFixed(2)}</p>

      <button onClick={generatePDF}>Download PDF Report</button>
    </div>
  );
}
