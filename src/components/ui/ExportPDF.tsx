import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAssessment } from "@/hooks/useAssessment";
import { SCOPE3_CATEGORIES } from "@/data/scope3Categories";
import {
  ApplicabilityStatus,
  DataAvailabilityStatus,
} from "@/types/assessment.types";

// HELPERS

function getApplicabilityLabel(status: string): string {
  const map: Record<string, string> = {
    [ApplicabilityStatus.APPLICABLE]: "Applicable",
    [ApplicabilityStatus.NOT_APPLICABLE]: "Not Applicable",
    [ApplicabilityStatus.POTENTIAL]: "Potential",
    [ApplicabilityStatus.PENDING]: "Pending",
  };
  return map[status] ?? "Pending";
}

function getAvailabilityLabel(status: string): string {
  const map: Record<string, string> = {
    [DataAvailabilityStatus.AVAILABLE]: "Available",
    [DataAvailabilityStatus.PARTIALLY_AVAILABLE]: "Partial",
    [DataAvailabilityStatus.NOT_AVAILABLE]: "Not Available",
    [DataAvailabilityStatus.PLANNED]: "Planned",
  };
  return map[status] ?? "Not Available";
}

// EXPORT FUNCTION

function generatePDF(state: ReturnType<typeof useAssessment>["state"]) {
  const doc = new jsPDF();
  const green = [15, 95, 75] as [number, number, number];
  const emerald = [31, 169, 113] as [number, number, number];
  const gray = [107, 114, 128] as [number, number, number];
  const lightGray = [249, 250, 251] as [number, number, number];

  // ── Header bar ──
  doc.setFillColor(...green);
  doc.rect(0, 0, 210, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("URIMPACT", 14, 12);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Scope 3 GHG Applicability Assessment Report", 14, 20);

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-GB")}`, 160, 20);

  // ── Company info section ──
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Company Profile", 14, 40);

  doc.setDrawColor(...emerald);
  doc.setLineWidth(0.5);
  doc.line(14, 42, 196, 42);

  const profile = state.companyProfile;
  const infoRows = [
    ["Company Name", profile.name || "—"],
    ["Industry", profile.industry || "—"],
    ["Country", profile.country || "—"],
    ["Reporting Year", profile.reportingYear || "—"],
    ["Org Boundary", profile.orgBoundary || "—"],
    ["Employees", profile.employeeCount || "—"],
  ];

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  infoRows.forEach(([label, value], i) => {
    const y = 50 + i * 7;
    doc.setTextColor(...gray);
    doc.text(label, 14, y);
    doc.setTextColor(30, 30, 30);
    doc.text(value, 80, y);
  });

  // ── Summary stats ──
  const applicable = Object.values(state.categoryResponses).filter(
    (r) => r.applicability === ApplicabilityStatus.APPLICABLE,
  );
  const notApplicable = Object.values(state.categoryResponses).filter(
    (r) => r.applicability === ApplicabilityStatus.NOT_APPLICABLE,
  );
  const potential = Object.values(state.categoryResponses).filter(
    (r) => r.applicability === ApplicabilityStatus.POTENTIAL,
  );
  const readyCount = applicable.filter(
    (r) =>
      r.dataAvailability === DataAvailabilityStatus.AVAILABLE ||
      r.dataAvailability === DataAvailabilityStatus.PARTIALLY_AVAILABLE,
  ).length;
  const readiness =
    applicable.length === 0
      ? 0
      : Math.round((readyCount / applicable.length) * 100);

  const statsY = 96;
  doc.setFillColor(...lightGray);
  doc.roundedRect(14, statsY, 182, 24, 3, 3, "F");

  const stats = [
    { label: "Applicable", value: String(applicable.length) },
    { label: "Not Applicable", value: String(notApplicable.length) },
    { label: "Potential", value: String(potential.length) },
    { label: "Data Readiness", value: `${readiness}%` },
  ];

  stats.forEach((s, i) => {
    const x = 14 + i * 46;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...green);
    doc.text(s.value, x + 10, statsY + 12);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text(s.label, x + 5, statsY + 20);
  });

  // ── Categories table ──
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Category Assessment", 14, 134);

  doc.setDrawColor(...emerald);
  doc.line(14, 136, 196, 136);

  const tableRows = SCOPE3_CATEGORIES.map((cat) => {
    const r = state.categoryResponses[cat.id];
    return [
      cat.id.toString(),
      cat.ghgCode,
      cat.name,
      cat.isUpstream ? "Upstream" : "Downstream",
      getApplicabilityLabel(r?.applicability ?? ApplicabilityStatus.PENDING),
      getAvailabilityLabel(
        r?.dataAvailability ?? DataAvailabilityStatus.NOT_AVAILABLE,
      ),
    ];
  });

  autoTable(doc, {
    startY: 140,
    head: [["#", "Code", "Category Name", "Stream", "Applicability", "Data"]],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: green,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 30, 30],
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 18 },
      2: { cellWidth: 72 },
      3: { cellWidth: 24 },
      4: { cellWidth: 36 },
      5: { cellWidth: 28 },
    },
    alternateRowStyles: { fillColor: lightGray },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 4) {
        const val = data.cell.text[0];
        if (val === "Applicable") data.cell.styles.textColor = [15, 95, 75];
        if (val === "Not Applicable") data.cell.styles.textColor = [...gray];
        if (val === "Potential") data.cell.styles.textColor = [217, 119, 6];
      }
    },
  });

  // ── Footer ──
  const pageCount = (
    doc as jsPDF & { internal: { getNumberOfPages: () => number } }
  ).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(...green);
    doc.rect(0, 285, 210, 12, "F");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("URIMPACT Platform — Scope 3 Assessment Report", 14, 292);
    doc.text(`Page ${i} of ${pageCount}`, 185, 292);
  }

  // ── Save ──
  const filename = `URIMPACT_Scope3_${profile.name || "Assessment"}_${profile.reportingYear || new Date().getFullYear()}.pdf`;
  doc.save(filename);
}

// COMPONENT

export default function ExportPDF() {
  const { state } = useAssessment();

  return (
    <button
      onClick={() => generatePDF(state)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[13px] font-semibold text-[#1D1F21] hover:bg-[#F3FBF7] hover:border-[#1FA971] transition-all duration-200 shadow-sm"
    >
      <Download size={15} className="text-[#0F5F4B]" />
      Export PDF
    </button>
  );
}
