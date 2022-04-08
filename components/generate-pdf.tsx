import React from "react";
import { jsPDF } from "jspdf";
import { Button } from "@chakra-ui/react";
import { PDFIcon } from "./icons";

type props = {
  data?: Domanda[];
  indicazione: string;
};

type Domanda = {
  domanda: string;
  risposta: string;
};
const GeneratePdf: React.FC<props> = ({ data, indicazione }) => {
  const generatePdf = () => {
    const doc = new jsPDF({ format: "a4", orientation: "p" });
    let domande = [];
    domande.push(indicazione);
    domande.push("");
    data.forEach(function(domanda: Domanda, index: number) {
      domande.push(`${index + 1}. ${domanda.domanda}`);
      if (domanda.risposta === "") {
        domande.push("", "", "", "", "");
      } else {
        domande.push(domanda.risposta);
      }
      domande.push("");
    });
    doc.setFontSize(10);
    doc.text(domande, 10, 15, { maxWidth: 190 });
    doc.save("5einf-verifica.pdf");
  };

  return (
    <Button
      aria-label="Generate PDF"
      onClick={generatePdf}
      bg="red.400"
      color="white"
      leftIcon={<PDFIcon />}
    >
      PDF
    </Button>
  );
};

export default GeneratePdf;
