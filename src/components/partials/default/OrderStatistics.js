import React, { useState, useEffect } from "react";
import { Card } from "reactstrap";
import { DefaultOrderStatistics } from "../charts/default/DefaultCharts";
import instanceAxios from "../../../utils/AxiosSetup";
const OrderStatistics = () => {
  return (
    <Card className="card-full overflow-hidden">
      <div className="nk-ecwg nk-ecwg7 h-100">
        <div className="card-inner flex-grow-1">
          <div className="card-title-group mb-4">
            <div className="card-title">
              <h6 className="title">Applications Status</h6>
            </div>
          </div>
          <div className="nk-ecwg7-ck">
            <DefaultOrderStatistics />
          </div>
          <ul className="nk-ecwg7-legends">
            <li>
              <div className="title">
                <span className="dot dot-lg sq" style={{ background: "#99ab21" }}></span>
                <span>Delivered</span>
              </div>
            </li>
            <li>
              <div className="title">
                <span className="dot dot-lg sq" style={{ background: "#335c94" }}></span>
                <span>Processing</span>
              </div>
            </li>
            <li>
              <div className="title">
                <span className="dot dot-lg sq" style={{ background: "#558e42" }}></span>
                <span>Approved</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
export default OrderStatistics;
