import React, { useState } from "react";
import { Button, Collapse, Modal, Table } from "react-bootstrap";
import EditSalesForm from "./EditSalesForm";

const SalesYears = ( props ) => {
  console.log(props.data);
  const token = props.token;
  const storeId = props.storeId
  const [openYear, setOpenYear] = useState(null);
  const [selectedMonth,setSelectedMonth] = useState(null);
  const [setBudgetShow, setSetBudgetShow] = useState(false);

  const incrementReload = () => {
    props.reload();
  }

  const SetBudgetModal = (props) => {
    return (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton> 
          <Modal.Title id="contained-modal-title-vcenter" >
            Set Budget
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditSalesForm 
          storeId={storeId}
          closeForm = {setSetBudgetShow}
          monthName={selectedMonth?.monthName}
          reload={incrementReload}
          year={openYear ?? 0}
          token={token}
          products={selectedMonth?.products.map((i) => {return {name:i.name, quantity:parseInt(i.quantity) }}) }/>
          
        </Modal.Body>
      </Modal>
    );
  }

  const handleYearClick = (year) => {
    setOpenYear(year === openYear ? null : year);
  };

  return (
    <div>

        <SetBudgetModal 
                show={setBudgetShow}
                onHide={() => {
                    setSetBudgetShow(false);
                    }}
        />
      {props.data.years.map((yearData) => (
        <div key={yearData.year}>
          <Button variant="light"
            onClick={() => handleYearClick(yearData.year)}
            aria-controls={`year-${yearData.year}`}
            aria-expanded={openYear === yearData.year}
          >
            {yearData.year}
          </Button>
          <Collapse in={openYear === yearData.year}>
            <div id={`year-${yearData.year}`}>
              <Table>
                <thead>
                    <tr>
                        <th style={{textAlign:"center"}}>Month</th>
                        <th style={{textAlign:"center"}}>Sales Targets</th>
                        <th style={{textAlign:"center"}}>Update Sales Target</th>
                    </tr>
                </thead>
                <tbody>
                {yearData.months.map((month) => (
                  <tr key={month.monthName}>
                    <td style={{textAlign:"center"}}>{month.monthName}</td>
                    {!month.products.length ? <td style={{textAlign:"center"}}>-</td> :
                    <td >
                      <table style={{marginLeft:"auto",marginRight:"auto"}}>
                        <tbody >
                          {month.products.map((product) => (
                            <tr key={product._key}>
                              <td>{product.name}</td>
                              <td>{product.quantity}kg</td>
                            </tr>
                                        
                          ))}
                        </tbody>
                      </table>
                     </td>}
                    <td><Button onClick={() => {
                        setSelectedMonth(month);
                        setSetBudgetShow(true);
                    }}>Update Sales Target</Button></td>
                  </tr>
                ))}
                </tbody>
              </Table>
            </div>
          </Collapse>
        </div>
      ))}
    </div>
  );
};

export default SalesYears;
