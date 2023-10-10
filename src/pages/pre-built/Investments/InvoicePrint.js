import React, { useState, useEffect } from "react";
import { Button, Icon, Block } from "../../../components/Component";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import LogoDark from "../../../images/log.png";
import { invoiceData } from "./Invoice";
import axios, { AxiosError, isAxiosError } from "axios";
import instanceAxios from "../../../utils/AxiosSetup";
import moment from "moment";
import { Badge } from "reactstrap";
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
      <Head title="Report Print"></Head>
      {user && (
        <Content>
          <Block>
            <div className="Application Details">
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
                    <span className="overline-title">Application To</span>
                    <div className="invoice-contact-info">
                      <h4 className="title">{user.application.customers.map((sub) => sub.name)}</h4>
                      <ul className="list-plain">
                        <li>
                          <Icon name="map-pin-fill"></Icon>
                          <span>{user.application.customers.map((sub) => sub.homeaddress)}</span>
                        </li>
                        <li>
                          <Icon name="call-fill"></Icon>
                          {user.application.customers.map((sub) => sub.mobile)}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="invoice-desc">
                    <h3 className="title">Application</h3>
                    <ul className="list-plain">
                      <li className="invoice-id">
                        <span>Application ID</span>:<span>{user?.application?.id}</span>
                      </li>
                      <li className="invoice-date">
                        <span>Date</span>:<span>{new Date(user?.application?.createddate).toLocaleDateString()}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped" border="1">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <td style={{ textAlign: "left" }}>{user?.application?.customers.map((sub) => sub.name)}</td>
                      </tr>
                      <tr>
                        <th>Account Number</th>
                        <td style={{ textAlign: "left" }}>{user?.application?.customers.map((sub) => sub.account)}</td>
                      </tr>
                      <tr>
                        <th>Exchange Rate</th>
                        <td style={{ textAlign: "left" }}>USD=178 DJF</td>
                      </tr>
                    </thead>
                  </table>

                  <table className="table table-striped" border="1">
                    <thead>
                      <tr>
                        <td colSpan="4" style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}>
                          This application (all amounts in DJF).
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
                        <td>{user?.application?.purpose}</td>
                        <td>{user?.application?.amount}</td>
                        <td>{user?.application?.tenure} Months</td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="table table-striped" border="1">
                    <thead>
                      <tr>
                        <td colSpan="6" style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}>
                          Details of financing
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
                        <td>{user?.application?.amount}</td>
                        <td>{user?.application?.contribution}</td>
                        <td>{user?.application?.amount}</td>
                        <td>%{user?.application?.profitrate} p.a</td>
                        <td>{user?.application?.profitamount}</td>
                        <td>{user?.application?.tenure} Months</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="2" style={{ fontWeight: 800 }}>
                          Total Amount (Principal + Profit)
                        </td>
                        <td>${user?.application?.totalamount}</td>
                        <td colSpan="2" style={{ fontWeight: 800 }}>
                          Monthly Installment
                        </td>
                        <td>${user?.application?.totalamount}</td>
                      </tr>
                    </tfoot>
                  </table>

                  <table className="table table-striped" border="1">
                    <thead>
                      <tr>
                        <td colSpan="7" style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}>
                          Existing Facilities at EAB (all figures in DJF)
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
                      {(user?.facility?.bank === "EAB" && (
                        <tr>
                          <th scope="row">{user?.facility?.facilityType}</th>
                          <td>{user?.facility?.amountdisbursed}</td>
                          <td>{user?.facility?.outstanding}</td>
                          <td>{user?.facility?.profitrate}</td>
                          <td>{user?.facility?.totalprofit}</td>
                          <td>{user?.facility?.maturitydate}</td>
                          <td>{user?.facility?.monthlyinstallment}</td>
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
                        <td colSpan="7" style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}>
                          Existing Facilities at other banks (all figures in DJF)
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
                      {(user?.bank === "Other" && (
                        <tr>
                          <th scope="row">{user?.facility.facilityType}</th>
                          <td>{user?.facility.amountdisbursed}</td>
                          <td>{user?.facility.outstanding}</td>
                          <td>{user?.facility.exprofitrate}</td>
                          <td>{user?.facility.totalprofit}</td>
                          <td>{user?.facility.maturitydate}</td>
                          <td>{user?.facility.exmonthlyinstallment}</td>
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
                        <td colSpan="2" style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}>
                          Total exposure (limit issue)
                        </td>
                      </tr>
                      <tr>
                        <td>Total Principal outstanding ( existing facilities at EAB) in DJF</td>

                        {user?.facility === null ? <td>{0}</td> : <td>{user?.facility?.outstanding}</td>}
                      </tr>
                      <tr>
                        <td>Total amount (existing facilities and the proposed facility in USD</td>
                        <td>
                          {user?.facility == null
                            ? user?.application?.amount
                            : user?.facility?.outstanding + user?.application?.amount}
                        </td>
                      </tr>
                    </thead>
                  </table>

                  <table className="table table-striped" border="1">
                    <thead>
                      <tr>
                        <td colSpan="2" style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}>
                          Debt Burden Ratio
                        </td>
                      </tr>
                      <tr>
                        <td>Monthly Installment under proposed facility</td>
                        <td>{user?.application?.monthlyinstallment}</td>
                      </tr>
                      <tr>
                        <td>Monthly salary</td>
                        <td>{user?.application?.customers.map((sub) => sub.netmonthsalary)}</td>
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
                        <td colSpan="2" style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}>
                          Source of payment
                        </td>
                      </tr>
                      <tr>
                        <td>{user?.application?.sourceofpayment}</td>
                      </tr>
                    </thead>
                  </table>

                  <table className="table table-striped" border="1">
                    <thead>
                      <tr>
                        <td colSpan="3" style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}>
                          Proposed Security (all values in DJF)
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
                        <td>{user?.application?.securitydetails}</td>
                        <td>{user?.application?.securitydescription}</td>
                        <td>{user?.application?.value}</td>
                      </tr>
                    </tbody>
                  </table>
                  <table className="table table-striped" border="1">
                    <thead>
                      <tr>
                        <td colSpan="3" style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}>
                          Recommendation by relation manager
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="3" style={{ textAlign: "left" }}>
                          {user?.application?.rm}
                        </td>
                      </tr>
                      <tr>
                        <td>Name</td>
                        <td>Signature</td>
                        <td>Date</td>
                      </tr>
                    </thead>
                  </table>
                  <table className="table table-striped" border="1">
                    <thead>
                      <tr>
                        <td colSpan="3" style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}>
                          Credit Analyst recommendation
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="3" style={{ textAlign: "left" }}>
                          {user?.application?.ca}
                        </td>
                      </tr>
                      <tr>
                        <td>Name</td>
                        <td>Signature</td>
                        <td>Date</td>
                      </tr>
                    </thead>
                  </table>
                  <table className="table table-striped" border="1">
                    <thead>
                      <tr>
                        <td colSpan="2" style={{ textAlign: "left", fontSize: 16, fontWeight: 700, color: "#854fff" }}>
                          Credit Commitee
                        </td>
                      </tr>
                      <tr>
                        {user?.commit?.map((e) => (
                          <td style={{ textAlign: "left", fontWeight: 800 }}>{e.name}</td>
                        ))}
                      </tr>
                      <tr>
                        {user?.commit?.map((e) => (
                          <td style={{ textAlign: "left", fontWeight: 500 }}>{e?.title?.title}</td>
                        ))}
                      </tr>
                      <tr>
                        {user?.vote?.map((e) => (
                          <td style={{ textAlign: "left", fontWeight: 800 }}>
                            <Badge
                              color={e.status === "Approve" ? "success" : e.status === "Reject" ? "danger" : "warning"}
                              className="badge-dot"
                            >
                              {e.status}
                            </Badge>
                          </td>
                        ))}
                      </tr>{" "}
                    </thead>
                  </table>
                  <div className="nk-notes ff-italic fs-14px text-secondary">{user?.ca}</div>
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
