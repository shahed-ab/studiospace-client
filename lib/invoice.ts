import jsPDF from "jspdf";
import { Booking } from "@/types";

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function generateBookingInvoice(booking: Booking, studioLocation?: string): string {
  const doc = new jsPDF("p", "mm", "a4");

  const startMin = parseTimeToMinutes(booking.startTime);
  const endMin = parseTimeToMinutes(booking.endTime);
  const computedHours = Math.max(1, (endMin - startMin) / 60);
  const hours = booking.totalHours || (booking as any).hours || computedHours;

  const deposit = (booking as any).securityDeposit || 0;
  const totalPrice = booking.totalPrice || 0;
  const subtotal = Math.max(0, totalPrice - deposit);
  const hourlyRate = hours > 0 ? Math.round(subtotal / hours) : subtotal;

  const invoiceNumber = `SS-${booking._id ? booking._id.slice(-6).toUpperCase() : "INV001"}`;
  const issueDate = new Date(booking.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const bookingDate = new Date(booking.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const location =
    studioLocation ||
    (booking as any).location ||
    (booking as any).studioLocation ||
    "Verified Production Facility";

  // ─── 1. HEADER ─────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 91, 46); // Accent #FF5B2E
  doc.text("StudioSpace", 20, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(107, 103, 95); // Muted
  doc.text("PREMIUM PRODUCTION & SOUNDSTAGE MARKETPLACE", 20, 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(17, 17, 17);
  doc.text("BOOKING INVOICE", 190, 20, { align: "right" });

  doc.setFontSize(10.5);
  doc.setTextColor(255, 91, 46);
  doc.text(`Invoice No: ${invoiceNumber}`, 190, 26, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(107, 103, 95);
  doc.text(`Issue Date: ${issueDate}`, 190, 31, { align: "right" });

  // ─── DIVIDER LINE ──────────────────────────────────────────────────────────
  doc.setDrawColor(220, 215, 205);
  doc.setLineWidth(0.3);
  doc.line(20, 36, 190, 36);

  // ─── 2. CONFIRMED STAMP ────────────────────────────────────────────────────
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(134, 239, 172);
  doc.roundedRect(20, 42, 170, 11, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(22, 101, 52); // Forest green
  doc.text(
    "CONFIRMED  -  ESCROW PAYMENT SECURED & VENUE CALENDAR LOCKED",
    105,
    49,
    { align: "center" }
  );

  // ─── 3. PARTIES SECTION (TWO COLUMNS) ──────────────────────────────────────
  // Left: Guest / Producer
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 91, 46); // Accent
  doc.text("GUEST / PRODUCTION TEAM", 20, 63);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(17, 17, 17);
  doc.text(booking.userName || "StudioSpace Creator", 20, 70);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(107, 103, 95);
  doc.text(`Email: ${booking.userEmail}`, 20, 76);
  doc.text("Role: Principal Producer / Renter", 20, 81);

  // Right: Studio & Host
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 91, 46); // Accent
  doc.text("STUDIO VENUE & HOST", 108, 63);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(17, 17, 17);
  doc.text(booking.studioTitle, 108, 70);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(107, 103, 95);
  doc.text(`Location: ${location}`, 108, 76);
  doc.text(`Host Contact: ${booking.ownerEmail}`, 108, 81);

  // ─── 4. RESERVATION SCHEDULE BOX ───────────────────────────────────────────
  doc.setFillColor(246, 243, 236);
  doc.setDrawColor(220, 215, 205);
  doc.roundedRect(20, 89, 170, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 91, 46);
  doc.text("SCHEDULED SHOOT DATE", 26, 96);
  doc.text("CALL TIME WINDOW", 85, 96);
  doc.text("SESSION DURATION", 145, 96);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(17, 17, 17);
  doc.text(bookingDate, 26, 104);
  doc.text(`${booking.startTime} - ${booking.endTime}`, 85, 104);
  doc.text(`${hours} Production Hour${hours > 1 ? "s" : ""}`, 145, 104);

  // ─── 5. FINANCIAL BREAKDOWN TABLE ──────────────────────────────────────────
  const tableY = 122;

  // Header background
  doc.setFillColor(21, 21, 24);
  doc.rect(20, tableY, 170, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("ITEM DESCRIPTION", 24, tableY + 5.5);
  doc.text("HOURS", 115, tableY + 5.5, { align: "right" });
  doc.text("RATE", 148, tableY + 5.5, { align: "right" });
  doc.text("AMOUNT (USD)", 186, tableY + 5.5, { align: "right" });

  // Row 1: Stage Access
  const row1Y = tableY + 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(17, 17, 17);
  doc.text(`Stage Rental - ${booking.studioTitle}`, 24, row1Y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(107, 103, 95);
  doc.text("Verified studio floor, basic grip & power access included", 24, row1Y + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(17, 17, 17);
  doc.text(`${hours} hrs`, 115, row1Y, { align: "right" });
  doc.text(`$${hourlyRate.toFixed(2)}/hr`, 148, row1Y, { align: "right" });
  doc.text(`$${subtotal.toFixed(2)}`, 186, row1Y, { align: "right" });

  // Row 2: Security Deposit (if present)
  let nextRowY = row1Y + 14;
  if (deposit > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(17, 17, 17);
    doc.text("Refundable Damage & Security Deposit", 24, nextRowY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(107, 103, 95);
    doc.text("Held in escrow; released within 48h after shoot wrap", 24, nextRowY + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(17, 17, 17);
    doc.text("-", 115, nextRowY, { align: "right" });
    doc.text("-", 148, nextRowY, { align: "right" });
    doc.text(`$${deposit.toFixed(2)}`, 186, nextRowY, { align: "right" });
    nextRowY += 14;
  }

  // Row 3: Totals Section
  doc.setDrawColor(220, 215, 205);
  doc.setLineWidth(0.3);
  doc.line(20, nextRowY, 190, nextRowY);

  const totalsY = nextRowY + 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(107, 103, 95);
  doc.text("Subtotal:", 148, totalsY, { align: "right" });
  doc.setTextColor(17, 17, 17);
  doc.text(`$${subtotal.toFixed(2)}`, 186, totalsY, { align: "right" });

  if (deposit > 0) {
    doc.setTextColor(107, 103, 95);
    doc.text("Security Deposit (Escrow):", 148, totalsY + 6, { align: "right" });
    doc.setTextColor(17, 17, 17);
    doc.text(`$${deposit.toFixed(2)}`, 186, totalsY + 6, { align: "right" });
  }

  const finalTotalY = deposit > 0 ? totalsY + 14 : totalsY + 8;
  doc.setFillColor(255, 91, 46); // Accent highlight bar
  doc.rect(115, finalTotalY - 4, 75, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL PAID (USD):", 120, finalTotalY + 2.5);
  doc.setFontSize(11);
  doc.text(`$${totalPrice.toFixed(2)}`, 186, finalTotalY + 2.5, { align: "right" });

  // ─── 6. PRODUCTION POLICIES & TERMS ────────────────────────────────────────
  const termsY = 205;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 91, 46);
  doc.text("PRODUCTION POLICIES & VENUE RULES", 20, termsY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(107, 103, 95);
  const policies = [
    "- Call time and wrap times must strictly adhere to the confirmed reservation schedule.",
    "- Overtime hours beyond the booked window will be billed per half-hour at 1.5x standard rates.",
    "- Proof of production insurance (COI) must be provided upon request by stage management.",
    "- Refundable security deposits are processed back to the original payment card within 48 hours.",
  ];
  policies.forEach((p, idx) => {
    doc.text(p, 20, termsY + 6 + idx * 5);
  });

  // ─── 7. FOOTER ─────────────────────────────────────────────────────────────
  doc.setDrawColor(220, 215, 205);
  doc.setLineWidth(0.3);
  doc.line(20, 265, 190, 265);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(17, 17, 17);
  doc.text(
    "StudioSpace Technologies Inc.  *  Certified Peer-to-Peer Creative Studio Marketplace",
    105,
    271,
    { align: "center" }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(107, 103, 95);
  doc.text(
    "Support & Inquiries: support@studiospace.io  *  Direct Host Line Available in Dashboard",
    105,
    276,
    { align: "center" }
  );

  const filename = `StudioSpace_Invoice_${invoiceNumber}.pdf`;
  doc.save(filename);
  return filename;
}

