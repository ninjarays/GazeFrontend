import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from 'react-bootstrap';

function QuotePDFGenerator({order}) {
  const ingredients = order.materialPrices.map((p) => [p.materialName, p.weight.toString()])
  const generatePDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add your company information
    doc.text('Glaze', 15, 15);
    doc.text('Shop No, block,', 15, 25);
    doc.text('street name, panvel', 15, 35);
    doc.text('pin, Maharashtra', 15, 45);
    doc.text('Phone: temp number', 15, 55);
    doc.text('Email: swayampakghar.udyog@gmail.com', 15, 65);

    const tableHeaders = ['Name', 'Quantity'];

    doc.autoTable({
      startY: 60,
      head: [tableHeaders],
      body: ingredients,
    });

    // Save the PDF
    const date = new Date();
    doc.save(`quote_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.pdf`);
  };

  return (
    <Button onClick={generatePDF}>
      Download Quote
    </Button>
  );
}

export default QuotePDFGenerator;
