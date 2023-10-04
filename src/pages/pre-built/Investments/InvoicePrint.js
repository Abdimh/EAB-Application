import React, { useState, useEffect } from "react";
import { Button, Icon, Block } from "../../../components/Component";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import LogoDark from "../../../images/log.png";
import { invoiceData } from "./Invoice";
import axios, { AxiosError, isAxiosError } from "axios";
import instanceAxios from "../../../utils/AxiosSetup";
const InvoicePrint = ({ match }) => {
  const [data] = useState(invoiceData);
  const [user, setUser] = useState();

  const getApp = async () => {
    const id = match.params.id;
    try {
      const Endpoint = `FullApplications/${id}`;
      const data = await instanceAxios.get(Endpoint);
      console.log(id);
      setUser(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    setTimeout(() => window.print(), 500);
  }, []);

  useEffect(() => {
    getApp();
  }, []);

  return (
    <body className="bg-white">
      <Head title="Invoice Print"></Head>
      {user && (
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
                      <h4 className="title">{user.customername}</h4>
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
                          <span>{user.phone}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="invoice-desc">
                    <h5 className="title">Application Details</h5>
                    <ul className="list-plain">
                      <li className="invoice-id">
                        <span>App ID</span>:<span>{user.orderId}</span>
                      </li>
                      <li className="invoice-date">
                        <span>Date</span>:<span>{user.id}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="invoice-bills">
                  <div className="table-responsive">
                    <table className="table table-striped" border="1">
                      <thead>
                        <tr>
                          <td
                            colSpan="4"
                            style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}
                          >
                            1. This application (all amounts in DJF).
                          </td>
                        </tr>
                        <tr>
                          <th className="w-60">Purpose (purchase of)</th>
                          <th className="w-30">Amount (DJF)</th>
                          <th className="w-50">Facility period</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{user.purpose}</td>
                          <td>{user.amount}</td>
                          <td>{user.tenure} Months</td>
                        </tr>
                      </tbody>
                    </table>

                    <table className="table table-striped" border="1">
                      <thead>
                        <tr>
                          <td
                            colSpan="6"
                            style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}
                          >
                            2. Details of financing
                          </td>
                        </tr>
                        <tr>
                          <th>Amount</th>
                          <th>Customer's Contribution</th>
                          <th>Amount Requested</th>
                          <th>Profit Rate</th>
                          <th>Profite Amount</th>
                          <th>Tenor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{user.amount}</td>
                          <td>{user.contribution}</td>
                          <td>{user.amount}</td>
                          <td>%{user.profitrate} p.a</td>
                          <td>{user.profitamount}</td>
                          <td>{user.tenure} Months</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="2" style={{ fontWeight: 800 }}>
                            Total Amount (Principal + Profit)
                          </td>
                          <td>${user.totalamount}</td>
                          <td colSpan="2" style={{ fontWeight: 800 }}>
                            Monthly Installment
                          </td>
                          <td>${user.totalamount}</td>
                        </tr>
                      </tfoot>
                    </table>

                    <table className="table table-striped" border="1">
                      <thead>
                        <tr>
                          <td
                            colSpan="7"
                            style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}
                          >
                            3. Existing Facilities at EAB (all figures in DJF)
                          </td>
                        </tr>
                        <tr>
                          <th>Facility type</th>
                          <th>Amount Disbursed</th>
                          <th>Outstanding</th>
                          <th>Profit Rate</th>
                          <th>Total Profit</th>
                          <th>Maturity Date</th>
                          <th>Monthly Installment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(user.bank === "EAB" && (
                          <tr>
                            <th scope="row">{user.facilityType}</th>
                            <td>{user.amountdisbursed}</td>
                            <td>{user.outstanding}</td>
                            <td>{user.exprofitrate}</td>
                            <td>{user.totalprofit}</td>
                            <td>{user.maturitydate}</td>
                            <td>{user.exmonthlyinstallment}</td>
                          </tr>
                        )) || (
                          <tr>
                            <th scope="row">Nill</th>
                            <td>Nill</td>
                            <td>Nill</td>
                            <td>Nill</td>
                            <td>Nill</td>
                            <td>Nill</td>
                            <td>Nill</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <table className="table table-striped" border="1">
                      <thead>
                        <tr>
                          <td
                            colSpan="7"
                            style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}
                          >
                            3. Existing Facilities at other banks (all figures in DJF)
                          </td>
                        </tr>
                        <tr>
                          <th>Facility type</th>
                          <th>Amount Disbursed</th>
                          <th>Outstanding</th>
                          <th>Profit Rate</th>
                          <th>Total Profit</th>
                          <th>Maturity Date</th>
                          <th>Monthly Installment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(user.bank === "Other" && (
                          <tr>
                            <th scope="row">{user.facilityType}</th>
                            <td>{user.amountdisbursed}</td>
                            <td>{user.outstanding}</td>
                            <td>{user.exprofitrate}</td>
                            <td>{user.totalprofit}</td>
                            <td>{user.maturitydate}</td>
                            <td>{user.exmonthlyinstallment}</td>
                          </tr>
                        )) || (
                          <tr>
                            <th scope="row">Nill</th>
                            <td>Nill</td>
                            <td>Nill</td>
                            <td>Nill</td>
                            <td>Nill</td>
                            <td>Nill</td>
                            <td>Nill</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <table className="table table-striped" border="1">
                      <thead>
                        <tr>
                          <td
                            colSpan="2"
                            style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}
                          >
                            4. Total exposure (limit issue)
                          </td>
                        </tr>
                        <tr>
                          <td>Total Principal outstanding ( existing facilities at EAB) in DJF</td>
                          <td>{user.outstanding}</td>
                        </tr>
                        <tr>
                          <td>Total amount (existing facilities and the proposed facility in USD</td>
                          <td>{user.outstanding + user.amount}</td>
                        </tr>
                      </thead>
                    </table>

                    <table className="table table-striped" border="1">
                      <thead>
                        <tr>
                          <td
                            colSpan="2"
                            style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}
                          >
                            5. Debt Burden Ratio
                          </td>
                        </tr>
                        <tr>
                          <td>Monthly Installment under proposed facility</td>
                          <td>{user.monthlyinstallment}</td>
                        </tr>
                        <tr>
                          <td>Monthly salary</td>
                          <td>{user.netmonthsalary}</td>
                        </tr>
                        <tr>
                          <td>DBR</td>
                          <td>25%</td>
                        </tr>
                      </thead>
                    </table>
                    <table className="table table-striped" border="1">
                      <thead>
                        <tr>
                          <td
                            colSpan="2"
                            style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}
                          >
                            6. Source of payment
                          </td>
                        </tr>
                        <tr>
                          <td>{user.sourceofpayment}</td>
                        </tr>
                      </thead>
                    </table>

                    <table className="table table-striped" border="1">
                      <thead>
                        <tr>
                          <td
                            colSpan="3"
                            style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}
                          >
                            7. Proposed Security (all values in DJF)
                          </td>
                        </tr>
                        <tr>
                          <th className="w-60">Details</th>
                          <th className="w-40">Details/Description/Location</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{user.securitydetails}</td>
                          <td>{user.securitydescription}</td>
                          <td>{user.value}</td>
                        </tr>
                      </tbody>
                    </table>

                    <table className="table table-striped" border="1">
                      <thead>
                        <tr>
                          <td
                            colSpan="2"
                            style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}
                          >
                            8. Credit Analyst Recommendation
                          </td>
                        </tr>
                        <tr>
                          <td>Mohamed Kamil Signature: .......................</td>
                          <td>Date: ..........................</td>
                        </tr>
                        <tr>
                          <td>{user.ca}</td>
                        </tr>
                      </thead>
                    </table>
                    <table className="table table-striped" border="1">
                      <thead>
                        <tr>
                          <td
                            colSpan="2"
                            style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}
                          >
                            9. Credit Commitee
                          </td>
                        </tr>
                        <tr>
                          <td style={{ height: 50 }}> </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>Ismail Guyo CEO</td>
                          <td>Abdiaziz Mohamed Director Operations</td>
                          <td>Mohamed Kamil: CRCO</td>
                          <td>Saad Moussa Djama: Deputy CEO</td>
                          <td>Ibraahim Rashid Jaffar: CFO</td>
                        </tr>
                      </thead>
                    </table>
                    <div className="nk-notes ff-italic fs-12px text-soft">
                      Invoice was created on a computer and is valid without the signature and seal.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Block>
        </Content>
      )}
    </body>
  );
};

export default InvoicePrint;
