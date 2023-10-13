import React, { useState } from 'react';
import Barcode from 'react-barcode';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const BarcodeGenerator = () => {
  const [seriesStart, setSeriesStart] = useState(1);
  const [numberOfBarcodes, setNumberOfBarcodes] = useState(1);
  const [barcodes, setBarcodes] = useState([]);

  const handleGenerateClick = () => {
    const generatedBarcodes = [];
    for (let i = seriesStart; i < seriesStart + numberOfBarcodes; i++) {
      generatedBarcodes.push(i.toString());
    }
    setBarcodes(generatedBarcodes);
  };

  // const handleDownloadAllClick = () => {
  //   barcodes.forEach((barcodeValue) => {
  //     const canvas = document.createElement('canvas');
  //     Barcode.toCanvas(canvas, barcodeValue, { width: 2, height: 50 });
  //     canvas.toBlob((blob) => {
  //       saveAs(blob, `barcode_${barcodeValue}.png`);
  //     });
  //   });
  // };

  return (
    <>
      

      <h1 className="text-center">Create Barcode</h1>

      <div style={{width:'300px',marginLeft:'auto',marginRight:'auto'}}>
      <Form>
      <Form.Group controlId="seriesstart">
        <Form.Label>Series Start</Form.Label>
        <Form.Control
          type="number"
          name="seriesstart"
          value={seriesStart}
          onChange={(e) => setSeriesStart(parseInt(e.target.value))}
          required
        />
      </Form.Group>

      <Form.Group controlId="numberofBarcode">
        <Form.Label>Number of Barcode</Form.Label>
        <Form.Control
          type="number"
          name="numberofBarcode"
          value={numberOfBarcodes}
          onChange={(e) => setNumberOfBarcodes(parseInt(e.target.value))}
          required
        />
      </Form.Group>

       <Button variant="primary" onClick={handleGenerateClick}>
              Generate Barcodes
        </Button>
   </Form> 
   </div>
      <Row className="barcode-container">
        {barcodes.map((barcodeValue, index) => (
          <Col key={index} xs="6" md="4">
            <div className="barcode-item">
              <span>Barcode {barcodeValue}:</span>
              <Barcode value={barcodeValue} />
            </div>
          </Col>
        ))}
      </Row>
    </>

    
  );
};

export default BarcodeGenerator;