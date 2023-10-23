import React, { useState } from "react";
import { Button, Collapse, Modal, Table } from "react-bootstrap";
import EditBudgetForm from "./EditBudgetForm";

const BudgetYears = ( props ) => {
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
          <EditBudgetForm 
          storeId={storeId}
          closeForm = {setSetBudgetShow}
          monthName={selectedMonth?.monthName}
          reload={incrementReload}
          year={openYear ?? 0}
          token={token}
          budget={selectedMonth?.monthlyBudget}/>
          
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
                        <th>Month</th>
                        <th>Budget</th>
                        <th>Update Budget</th>
                    </tr>
                </thead>
                <tbody>
                {yearData.months.map((month) => (
                  <tr key={month.monthName}>
                    <td>{month.monthName}</td>
                    <td>{month.monthlyBudget}</td>
                    <td><Button onClick={() => {
                        setSelectedMonth(month);
                        setSetBudgetShow(true);
                    }}>Update Budget</Button></td>
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

export default BudgetYears;
