import React, { useState, useEffect } from "react";
import { Button, Icon, Block } from "../../../components/Component";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import LogoDark from "../../../images/log.png";
import { invoiceData } from "./Invoice";
import axios, { AxiosError, isAxiosError } from "axios";
import instanceAxios from "../../../utils/AxiosSetup";
import moment from "moment";
import { useParams } from "react-router-dom";
import { CustomToast } from "../../../utils/CustomToast";
const InvoicePrint = ({ match }) => {
  const [item, setitem] = useState();
  const [subtotalamount, setSubTotal] = useState();
  const [user, setUser] = useState([]);
  let { from, to } = useParams();
  const getApp = async () => {
    // var from,
    //   to = match.params;

    // var from = moment(fromdate).format("YYYY-MM-d");
    // var to = moment(todate).format();
    try {
      console.log("from ", from, "ttt ", to);

      const Endpoint = `IndividualApp/Report`;
      const data = await instanceAxios.get(Endpoint, {
        params: {
          from: from,
          to: to,
        },
      });
      console.log(data.data);
      setUser(data.data);
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        const { response, message } = e;
        if (response?.status == 400) {
          CustomToast(response?.data.detail, false, "error");
        }
      }
    }
  };

  useEffect(() => {
    getApp();
  }, []);
  let total = 0;
  let profitam = 0;

  user.forEach((item) => {
    total += item.totalamount;
    profitam += item.profitamount;
  });
  return (
    <body className="bg-white">
      <Head title="Invoice Print"></Head>
      <Content>
        <Block>
          <div className="invoice invoice-print">
            <div className="invoice-action">
              <Button
                size="lg"
                color="primary"
                outline
                className="btn-icon btn-white btn-dim"
                onClick={() => window.print()}
              >
                <Icon name="printer-fill"></Icon>
              </Button>
            </div>
            <div className="invoice-wrap">
              <div className="invoice-brand text-center">
                <img src={LogoDark} alt="" />
              </div>

              <div className="invoice-head">
                <div className="invoice-contact">
                  <span className="overline-title">Invoice To</span>
                  <div className="invoice-contact-info">
                    <h4 className="title">Application</h4>
                    <ul className="list-plain">
                      <li>
                        <Icon name="map-pin-fill"></Icon>
                        <span>
                          House #65, 4328 Marion Street
                          <br />
                          Newbury, VT 05051
                        </span>
                      </li>
                      <li>
                        <Icon name="call-fill"></Icon>
                        <span>Phone</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="invoice-desc">
                  <h5 className="title">Application Details</h5>
                  <ul className="list-plain">
                    <li className="invoice-id">
                      <span>App ID</span>:<span>Order</span>
                    </li>
                    <li className="invoice-date">
                      <span>Date</span>:<span>ddd</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Purpose</th>
                      <th>Months</th>
                      <th>Total Amount</th>
                      <th>Profit Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user?.map((employee, index) => {
                      return (
                        <tr>
                          <td>{employee?.id}</td>
                          <td>{employee?.purpose}</td>
                          <td>{employee?.tenure} Months</td>
                          <td>{employee?.totalamount}</td>
                          <td>{employee?.profitamount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2"></td>
                      <td>
                        <b>Sub Totals:</b>
                      </td>
                      <td>{total}</td>
                      <td>{profitam}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </Block>
      </Content>
      ;
    </body>
  );
};

export default InvoicePrint;
