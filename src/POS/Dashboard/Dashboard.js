import React from "react";
import "./Dashboard.css";

const DashboardPos = () => {
  return (
    <div className="body-dash">
      <div className="dashboard">
        <div className="head-title">
          <div className="headtile1">Sales Dashboard</div>
        </div>
        <div className="table-billing">
          <table>
            <thead>
              <tr className="title-row">
                <th className="d-flex align-items-start">
                  <span className="span-th">Sale Ticket #</span>
                </th>
                <th className="">
                  <span className="span-th">Date</span>
                </th>
                <th className="">
                  <span className="span-th">Product X Qtty</span>
                </th>
                <th className="">
                  <span className="span-th">Total Price</span>
                </th>
                <th className="d-flex justify-content-end">
                  <span className="span-th">Mode Of Payment</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>123</td>
                <td>{123}</td>
                <td>{500}</td>
                <td>{12}</td>
                <td >Gpay</td>
              </tr>

              <tr>
                <td>456</td>
                <td>{456}</td>
                <td>{250}</td>
                <td>{10}</td>
                <td>Gpay</td>

              </tr>

              <tr>
                <td>789</td>
                <td>{789}</td>
                <td>{300}</td>
                <td>{20}</td>
                <td>Gpay</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPos;
