import React, { useState, useEffect } from "react";

import {
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  BlockDes,
  BlockHeadContent,
  Block,
  BlockBetween,
  Col,
  RSelect,
} from "../../../components/Component";
import {
  UncontrolledDropdown,
  Form,
  Modal,
  DropdownMenu,
  FormGroup,
  DropdownToggle,
  Card,
  Badge,
  DropdownItem,
  ModalBody,
} from "reactstrap";
import { useParams } from "react-router-dom";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";

import LogoDark from "../../../images/log.png";
import { invoiceData } from "./Invoice";
import { Link } from "react-router-dom";
import axios, { AxiosError, isAxiosError } from "axios";
import instanceAxios from "../../../utils/AxiosSetup";
import { useForm } from "react-hook-form";
import { CustomToast } from "../../../utils/CustomToast";
import { red } from "@mui/material/colors";
import moment from "moment";
const InvoiceDetails = ({ match }) => {
  const [message, setMessage] = useState(false);
  const userId = match.params.id;
  const [data] = useState(invoiceData);
  const [user, setUser] = useState();
  const [isprm, setIsPrm] = useState(true);
  const [isca, setIsCa] = useState(true);
  const [issharia, setSharia] = useState(true);
  const [iscredit, setCredit] = useState(true);
  const [isoperation, setOperation] = useState(true);
  const [statusValue, setStatusValue] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
    facility: false,
    sharia: false,
    voting: false,
    RM: false,
    cad: false,
    op: false,
  });
  const [formData, setFormData] = useState({
    CA: "",
    customerid: 0,
    purpose: "",
    amount: 0,
    facilityperiod: 0,
    profitrate: "",
    profitamount: 0,
    totalamount: 0,
    monthlyinstallment: 0,
    sourceofpayment: "",
    securitydetails: "",
    securitydescription: "",
    value: 0,
    contribution: 0,
    status: "",
  });

  const [voteData, setVoteData] = useState({
    recommendation: "",
    status: "",
  });

  const [userdetails, setUserDetails] = useState({
    expireIn: Number,
    expireTimeStamp: String,
    fullname: String,
    role: { id: Number, name: String },
    token: String,
    userName: String,
  });
  const getApp = async () => {
    const id = match.params.id;

    try {
      const Endpoint = `FullApplications/${id}`;
      const data = await instanceAxios.get(Endpoint);
      console.log(id);
      setUser(data.data);
      console.log();
    } catch (e) {
      console.log(e);
    }
  };

  const fetchdata = () => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUserDetails(data);
    // console.log(data);
  };

  // submit function to add a new item
  const onFormSubmit = async (submitData) => {
    const appid = match.params.id;
    const { id, CA, status } = submitData;
    console.log(user);
    try {
      const RoleRes = await instanceAxios.put("IndividualApp/UpdateCA", {
        applicationid: submitData.id,
        status: "Recommend",
        customerid: user?.customer.id,
        purpose: submitData.purpose,
        amount: submitData.amount,
        tenure: submitData.tenure,
        contribution: submitData.contribution,
        profitrate: submitData.profitrate,
        profitamount: submitData.profitamount,
        totalamount: submitData.totalamount,
        monthlyinstallment: submitData.monthlyinstallment,
        securitydetails: submitData.securitydetails,
        securitydescription: submitData.securitydescription,
        sourceofpayment: submitData.sourceofpayment,
        value: submitData.value,
        condition: submitData.condition,
        RM: submitData.RM,
        ca: submitData.CA,
      });

      const { data } = RoleRes;
      // 200 Data

      if (data.id) CustomToast("Successfully Added", false, "success");
    } catch (error) {
      // 401, 403, 400
      if (isAxiosError(error)) {
        const { response } = error;

        if (response.data.detail === "Duplicate Entery") CustomToast(response.data.detail, false, "error");

        console.log(response.status, response.data);

        if (response.status === 400 && response.status === 403) {
          //
        }
      }
    }
    setModal({ edit: false }, { add: false });
  };

  // Update Relation Manager Recommendation
  const onSubmitRMRecommendation = async (submitData) => {
    const appid = match.params.id;
    const { id, CA, status } = submitData;
    console.log(submitData);
    try {
      const RoleRes = await instanceAxios.put("IndividualApp", {
        applicationid: appid,

        isPRM: isprm,
        message: submitData.message,
        ismessage: message,
        RM: submitData.recommendation,
      });

      // const { data } = RoleRes;
      // 200 Data

      CustomToast("Application has been transferred", false, "success");
      setMessage(false);
      getApp();
    } catch (error) {
      // 401, 403, 400
      if (isAxiosError(error)) {
        const { response } = error;

        if (response.data.detail === "Duplicate Entery") CustomToast(response.data.detail, false, "error");

        console.log(response.status, response.data);

        if (response.status === 400 && response.status === 403) {
          //
        }
      }
    }
    setModal({ edit: false }, { add: false });
  };

  // Update Relation Manager Recommendation
  const onProcessSubmit = async (submitData) => {
    const appid = match.params.id;
    const { id, CA, status } = submitData;
    console.log(iscredit);
    try {
      const RoleRes = await instanceAxios.put("IndividualApp", {
        applicationid: appid,

        iscreditadminstration: iscredit,
        status: status,
      });

      // const { data } = RoleRes;
      // 200 Data

      CustomToast("Application has been transferred", false, "success");
      setCredit(false);
      getApp();
    } catch (error) {
      // 401, 403, 400
      if (isAxiosError(error)) {
        const { response } = error;

        if (response.data.detail === "Duplicate Entery") CustomToast(response.data.detail, false, "error");

        console.log(response.status, response.data);

        if (response.status === 400 && response.status === 403) {
          //
        }
      }
    }
    setModal({ edit: false }, { add: false });
  };

  // Update Relation Manager Recommendation
  const ondeliver = async (submitData) => {
    const appid = match.params.id;
    const { id, CA, status } = submitData;
    console.log(iscredit);
    try {
      const RoleRes = await instanceAxios.put("IndividualApp", {
        applicationid: appid,

        isoperation: isoperation,
        status: status,
      });

      // const { data } = RoleRes;
      // 200 Data

      CustomToast("Application has been transferred", false, "success");
      setCredit(false);
      getApp();
    } catch (error) {
      // 401, 403, 400
      if (isAxiosError(error)) {
        const { response } = error;

        if (response.data.detail === "Duplicate Entery") CustomToast(response.data.detail, false, "error");

        console.log(response.status, response.data);

        if (response.status === 400 && response.status === 403) {
          //
        }
      }
    }
    setModal({ edit: false }, { add: false });
  };

  // Update Credit Analyst Recommendation

  const onSubmitCARecommendation = async (submitData) => {
    const appid = match.params.id;
    const { id, CA, status } = submitData;
    console.log(submitData);
    try {
      const RoleRes = await instanceAxios.put("IndividualApp", {
        applicationid: appid,

        isCA: isca,
        message: submitData.message,
        ismessage: message,
        CA: submitData.CA,
      });

      const { data } = RoleRes;
      // 200 Data

      CustomToast("Application has been transferred", false, "success");
      setMessage(false);
      getApp();
    } catch (error) {
      // 401, 403, 400
      if (isAxiosError(error)) {
        const { response } = error;

        if (response.data.detail === "Duplicate Entery") CustomToast(response.data.detail, false, "error");

        console.log(response.status, response.data);

        if (response.status === 400 && response.status === 403) {
          //
        }
      }
    }
    setModal({ edit: false }, { add: false });
  };
  console.log(message);
  // Update Sharia
  const onSubmitSharia = async (submitData) => {
    const appid = match.params.id;
    const { id, CA, status } = submitData;

    try {
      const RoleRes = await instanceAxios.put("IndividualApp", {
        applicationid: appid,
        issharai: issharia,
        status: submitData.status,
        message: submitData.message,
        ismessage: message,
      });

      const { data } = RoleRes;
      // 200 Data

      CustomToast("Application has been transferred", false, "success");
      setMessage(false);
      setModal({ sharia: false, add: false });
    } catch (error) {
      // 401, 403, 400
      if (isAxiosError(error)) {
        const { response } = error;

        if (response.data.detail === "Duplicate Entery") CustomToast(response.data.detail, false, "error");

        console.log(response.status, response.data);

        if (response.status === 400 && response.status === 403) {
          //
        }
      }
    }
    setModal({ edit: false }, { add: false });
  };

  const insertvote = async (submitData) => {
    const { recommendation, status } = submitData;
    const Endpoint = "Voting";
    try {
      const RoleRes = await instanceAxios.post(Endpoint, {
        recommendation: recommendation,
        role: userdetails.role.name,
        fullname: userdetails.fullname,
        applicationid: userId,
        email: userdetails.userName,
        status: status,
      });
      CustomToast("Successfully Voted", false, "success");
      setModal({ voting: false }, { add: false });
    } catch (error) {
      // 401, 403, 400
      if (isAxiosError(error)) {
        const { response } = error;

        CustomToast(response.data.message, false, "warning");
        setModal({ voting: false }, { add: false });
      }
    }
  };

  const onFormCancel = () => {
    setMessage(false);
    setModal({ sharia: false, add: false });
    setModal({ facility: false, add: false });
    setModal({ RM: false, add: false });
  };

  useEffect(() => {
    getApp();
    fetchdata();
  }, []);
  const { errors, register, handleSubmit } = useForm();

  console.log(user);
  return (
    <React.Fragment>
      <Head title="Application Details"></Head>
      <Content>
        <BlockHead>
          <BlockBetween className="g-3">
            <BlockHeadContent>
              <BlockTitle>
                Application <strong className="text-primary small">#{user?.application?.id}</strong>
              </BlockTitle>
              <BlockDes className="text-soft">
                <ul className="list-inline">
                  <li>
                    Created by: <span className="text-base">{user?.application?.createdby}</span>
                  </li>
                </ul>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <Link to={`${process.env.PUBLIC_URL}/application-attachments/${user?.application?.id}`}>
                <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                  <Icon name="file-download"></Icon>
                  <span>Attached & Application Details</span>
                </Button>
              </Link>
              <Link to={`${process.env.PUBLIC_URL}/individual-investments`}>
                <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                  <Icon name="arrow-left"></Icon>
                  <span>Back</span>
                </Button>
              </Link>

              <Link to={`${process.env.PUBLIC_URL}/invoice-list`}>
                <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                  <Icon name="arrow-left"></Icon>
                </Button>
              </Link>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <div className="invoice">
            <div className="invoice-action">
              {userdetails.role.name === "Operation" && (
                <Button
                  size="lg"
                  color="primary"
                  outline
                  className="btn-icon btn-white btn-dim"
                  onClick={() => setModal({ op: true })}
                >
                  <Icon name="plus"></Icon>
                </Button>
              )}
              {userdetails.role.name === "Credit Administration" && (
                <Button
                  size="lg"
                  color="primary"
                  outline
                  className="btn-icon btn-white btn-dim"
                  onClick={() => setModal({ cad: true })}
                >
                  <Icon name="plus"></Icon>
                </Button>
              )}
              {userdetails.role.name === "Credit Analyst" && (
                <Button
                  size="lg"
                  color="primary"
                  outline
                  className="btn-icon btn-white btn-dim"
                  onClick={() => setModal({ facility: true })}
                >
                  <Icon name="plus"></Icon>
                </Button>
              )}
              {userdetails.role.name === "Relation Manager PI" && (
                <Button
                  size="lg"
                  color="primary"
                  outline
                  className="btn-icon btn-white btn-dim"
                  onClick={() => setModal({ RM: true })}
                >
                  <Icon name="plus"></Icon>
                </Button>
              )}
              {userdetails.role.name === "Sharia" && (
                <Button
                  size="lg"
                  color="primary"
                  outline
                  className="btn-icon btn-white btn-dim"
                  onClick={() => setModal({ sharia: true })}
                >
                  <Icon name="plus"></Icon>
                </Button>
              )}
              {userdetails.role.name === "Credit Committee" && (
                <Button
                  size="lg"
                  color="primary"
                  outline
                  className="btn-icon btn-white btn-dim"
                  onClick={() => setModal({ voting: true })}
                >
                  <em class="icon ni ni-file-check-fill"></em>
                </Button>
              )}
              <br />
              <br />
              <Link to={`${process.env.PUBLIC_URL}/application-print/${user?.application?.id}`} target="_blank">
                <Button size="lg" color="primary" outline className="btn-icon btn-white btn-dim">
                  <Icon name="printer-fill"></Icon>
                </Button>
              </Link>
            </div>
            <div className="invoice-wrap">
              <div className="invoice-brand text-center">
                <img src={LogoDark} alt="" />
              </div>

              <div className="invoice-head">
                <div className="invoice-contact">
                  <span className="overline-title">Application To</span>
                  <div className="invoice-contact-info">
                    <h4 className="title">{user?.application?.customers.map((sub) => sub?.name)}</h4>
                    <ul className="list-plain">
                      <li>
                        <Icon name="map-pin-fill"></Icon>
                        <span>{user?.application?.customers.map((sub) => sub?.homeaddress)}</span>
                      </li>
                      <li>
                        <Icon name="call-fill"></Icon>
                        {user?.application?.customers.map((sub) => sub?.mobile)}
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
              <div className="invoice-bills">
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
                          Basic Information.
                        </td>
                      </tr>
                      <tr>
                        <th>Name</th>
                        <td style={{ textAlign: "left" }}>{user?.application?.customers.map((sub) => sub.name)}</td>
                      </tr>
                      <tr>
                        <th>Employment Type</th>
                        <td style={{ textAlign: "left" }}>
                          {user?.application?.customers.map((sub) => sub.employmenttype)}
                        </td>
                      </tr>
                      <tr>
                        <th>Responsibilities</th>
                        <td style={{ textAlign: "left" }}>{user?.application?.customers.map((sub) => sub.position)}</td>
                      </tr>
                      <tr>
                        <th>Home Address</th>
                        <td style={{ textAlign: "left" }}>
                          {user?.application?.customers.map((sub) => sub.homeaddress)}
                        </td>
                      </tr>
                      <tr>
                        <th>Telephone</th>
                        <td style={{ textAlign: "left" }}>{user?.application?.customers.map((sub) => sub.mobile)}</td>
                      </tr>
                      <tr>
                        <th>Monthly Salary</th>
                        <td style={{ textAlign: "left" }}>
                          {user?.application?.customers.map((sub) => sub.netmonthsalary)}
                        </td>
                      </tr>
                      <tr>
                        <th>Date of Joining</th>
                        <td style={{ textAlign: "left" }}>
                          {user?.application?.customers.map((sub) => sub.datejoining)}
                        </td>
                      </tr>
                      <tr>
                        <th>Previous employer</th>
                        <td style={{ textAlign: "left" }}>
                          {user?.application?.customers.map((sub) => sub.preemployer)}
                        </td>
                      </tr>
                      <tr>
                        <th>Other Income (Amount)</th>
                        <td style={{ textAlign: "left" }}>
                          {user?.application?.customers.map((sub) => sub.otherincome)}
                        </td>
                      </tr>
                      <tr>
                        <th>Salary Account in EAB</th>
                        <td style={{ textAlign: "left" }}>{user?.application?.customers.map((sub) => sub.account)}</td>
                      </tr>
                      <tr>
                        <th>Citizenship</th>
                        <td style={{ textAlign: "left" }}>
                          {user?.application?.customers.map((sub) => sub.citizenship)}
                        </td>
                      </tr>
                      <tr>
                        <th>Other Banks</th>
                        <td style={{ textAlign: "left" }}>
                          {user?.application?.customers.map((sub) => sub.otherbanks)}
                        </td>
                      </tr>
                      <tr>
                        <th>Gender</th>
                        <td style={{ textAlign: "left" }}>{user?.application?.customers.map((sub) => sub.gender)}</td>
                      </tr>
                      <tr>
                        <th>Date of Brith</th>
                        <td style={{ textAlign: "left" }}>{user?.application?.customers.map((sub) => sub.dob)}</td>
                      </tr>
                      <tr>
                        <th>Account opened date</th>
                        <td style={{ textAlign: "left" }}>
                          {user?.application?.customers.map((sub) => sub.eabopenedaccount)}
                        </td>
                      </tr>
                      <tr>
                        <th>Other liabilities</th>
                        <td style={{ textAlign: "left" }}>
                          {user?.application?.customers.map((sub) => sub.liabilities)}
                        </td>
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
          </div>
        </Block>
      </Content>
      );
      <Modal
        isOpen={modal.facility}
        toggle={() => setModal({ facility: false })}
        className="modal-dialog-centered"
        size="lg"
      >
        <ModalBody>
          <div className="p-2">
            <h5 className="title">Credit Analyst Recommendation</h5>
            <div className="mt-4">
              <Form className="row gy-4" onSubmit={handleSubmit(onSubmitCARecommendation)}>
                <Col md="12">
                  <div className="preview-block">
                    <span className="preview-title overline-title">
                      Please send message back relation manager if you have any inqueries.
                    </span>
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          console.log("Check faci ");

                          setMessage(!message);
                        }}
                        className="custom-control-input form-control"
                        id="customSwitch2"
                      />
                      <label className="custom-control-label" htmlFor="customSwitch2">
                        {message ? "Yes" : "NO"}
                      </label>
                    </div>
                  </div>
                </Col>
                {message ? (
                  <>
                    <>
                      <Col size="12">
                        <FormGroup>
                          <label className="form-label">Your Inquiries</label>
                          <textarea
                            name="message"
                            placeholder="Your description"
                            //    onChange={(e) => onInputChange(e)}
                            ref={register({ required: "This field is required" })}
                            className="form-control no-resize"
                          />
                          {errors.message && <span className="invalid">{errors.message.message}</span>}
                        </FormGroup>
                      </Col>
                    </>
                  </>
                ) : (
                  <>
                    <>
                      <Col size="12">
                        <FormGroup>
                          <label className="form-label">Your Recommendation</label>
                          <textarea
                            name="CA"
                            placeholder="Your description"
                            //    onChange={(e) => onInputChange(e)}
                            ref={register({ required: "This field is required" })}
                            className="form-control no-resize"
                          />
                          {errors.CA && <span className="invalid">{errors.CA.message}</span>}
                        </FormGroup>
                      </Col>
                    </>
                  </>
                )}

                <Col size="12">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    <li>
                      <Button color="primary" size="md" type="submit">
                        Update
                      </Button>
                    </li>
                    <li>
                      <Button
                        onClick={(ev) => {
                          ev.preventDefault();
                          onFormCancel();
                        }}
                        className="link link-light"
                      >
                        Cancel
                      </Button>
                    </li>
                  </ul>
                </Col>
              </Form>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={modal.sharia}
        toggle={() => setModal({ sharia: false })}
        className="modal-dialog-centered"
        size="lg"
      >
        <ModalBody>
          <div className="p-2">
            <h5 className="title">Sharia</h5>
            <div className="mt-4">
              <Form className="row gy-4" onSubmit={handleSubmit(onSubmitSharia)}>
                <Col size="12">
                  <FormGroup>
                    <label className="form-label">Status:</label>
                    <select
                      className="form-control"
                      name="status"
                      defaultValue={statusValue}
                      onChange={(e) => setStatusValue(e.target.value)}
                      ref={register({ required: "This field is required" })}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                    </select>
                    {errors.status && <span className="invalid">{errors.status.message}</span>}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <div className="preview-block">
                    <span className="preview-title overline-title">
                      Please send message credit analyst if you have any inqueries.
                    </span>
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          console.log("Check faci ");

                          setMessage(!message);
                        }}
                        className="custom-control-input form-control"
                        id="customSwitch2"
                      />
                      <label className="custom-control-label" htmlFor="customSwitch2">
                        {message ? "Yes" : "NO"}
                      </label>
                    </div>
                  </div>
                </Col>
                {message && (
                  <>
                    <Col size="12">
                      <FormGroup>
                        <label className="form-label">Your Inquiries</label>
                        <textarea
                          name="message"
                          placeholder="Your description"
                          //    onChange={(e) => onInputChange(e)}
                          ref={register({ required: "This field is required" })}
                          className="form-control no-resize"
                        />
                        {errors.message && <span className="invalid">{errors.message.message}</span>}
                      </FormGroup>
                    </Col>
                  </>
                )}
                <Col size="12">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    <li>
                      <Button color="primary" size="md" type="submit">
                        Update
                      </Button>
                    </li>
                    <li>
                      <Button
                        onClick={(ev) => {
                          ev.preventDefault();
                          onFormCancel();
                        }}
                        className="link link-light"
                      >
                        Cancel
                      </Button>
                    </li>
                  </ul>
                </Col>
              </Form>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={modal.voting}
        toggle={() => setModal({ voting: false })}
        className="modal-dialog-centered"
        size="lg"
      >
        <ModalBody>
          <div className="p-2">
            <h5 className="title">Credit Commitee Decisions</h5>
            <div className="mt-4">
              <Form className="row gy-4" onSubmit={handleSubmit(insertvote)}>
                <Col size="12">
                  <FormGroup>
                    <label className="form-label">Status:</label>

                    <select
                      className="form-control"
                      name="status"
                      defaultValue={voteData.status}
                      onChange={(e) => setStatusValue(e.target.value)}
                      ref={register({ required: "This field is required" })}
                    >
                      <option value="Approve">Approve</option>
                      <option value="Reject">Reject</option>
                      <option value="Differed">Differed</option>
                      <option value="Transfer">Transfer</option>
                    </select>
                    {errors.status && <span className="invalid">{errors.status.message}</span>}
                  </FormGroup>
                </Col>
                <Col size="12">
                  <FormGroup>
                    <label className="form-label">Comment</label>
                    <textarea
                      name="recommendation"
                      defaultValue={voteData.recommendation}
                      placeholder="Your description"
                      //    onChange={(e) => onInputChange(e)}
                      ref={register({ required: "This field is required" })}
                      className="form-control no-resize"
                    />
                    {errors.recommendation && <span className="invalid">{errors.recommendation.message}</span>}
                  </FormGroup>
                </Col>

                <Col size="12">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    <li>
                      <Button color="primary" size="md" type="submit">
                        Submit
                      </Button>
                    </li>
                    <li>
                      <Button
                        onClick={(ev) => {
                          ev.preventDefault();
                          //   onFormCancel();
                        }}
                        className="link link-light"
                      >
                        Cancel
                      </Button>
                    </li>
                  </ul>
                </Col>
              </Form>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={modal.RM} toggle={() => setModal({ RM: false })} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <div className="p-2">
            <h5 className="title">Relation Manager Recommendation</h5>
            <div className="mt-4">
              <Form className="row gy-4" onSubmit={handleSubmit(onSubmitRMRecommendation)}>
                <Col md="12">
                  <div className="preview-block">
                    <span className="preview-title overline-title">
                      Please send message credit analyst if you have any inqueries.
                    </span>
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          console.log("Check faci ");

                          setMessage(!message);
                        }}
                        className="custom-control-input form-control"
                        id="customSwitch2"
                      />
                      <label className="custom-control-label" htmlFor="customSwitch2">
                        {message ? "Yes" : "NO"}
                      </label>
                    </div>
                  </div>
                </Col>
                {message ? (
                  <>
                    <>
                      <Col size="12">
                        <FormGroup>
                          <label className="form-label">Your Inquiries</label>
                          <textarea
                            name="message"
                            placeholder="Your description"
                            //    onChange={(e) => onInputChange(e)}
                            ref={register({ required: "This field is required" })}
                            className="form-control no-resize"
                          />
                          {errors.message && <span className="invalid">{errors.message.message}</span>}
                        </FormGroup>
                      </Col>
                    </>
                  </>
                ) : (
                  <>
                    <>
                      <Col size="12">
                        <FormGroup>
                          <label className="form-label">Recommendation</label>
                          <textarea
                            name="recommendation"
                            placeholder="Your description"
                            //    onChange={(e) => onInputChange(e)}
                            ref={register({ required: "This field is required" })}
                            className="form-control no-resize"
                          />
                          {errors.recommendation && <span className="invalid">{errors.recommendation.message}</span>}
                        </FormGroup>
                      </Col>
                    </>
                  </>
                )}

                <Col size="12">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    <li>
                      <Button color="primary" size="md" type="submit">
                        Update
                      </Button>
                    </li>
                    <li>
                      <Button
                        onClick={(ev) => {
                          ev.preventDefault();
                          onFormCancel();
                        }}
                        className="link link-light"
                      >
                        Cancel
                      </Button>
                    </li>
                  </ul>
                </Col>
              </Form>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={modal.cad} toggle={() => setModal({ cad: false })} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <div className="p-2">
            <h5 className="title">Credit Adminstration</h5>
            <div className="mt-4">
              <Form className="row gy-4" onSubmit={handleSubmit(onProcessSubmit)}>
                <Col size="12">
                  <FormGroup>
                    <label className="form-label">Status:</label>
                    <select
                      className="form-control"
                      name="status"
                      defaultValue={statusValue}
                      onChange={(e) => setStatusValue(e.target.value)}
                      ref={register({ required: "This field is required" })}
                    >
                      <option value="Process">Process</option>
                      <option value="Pending">Pending</option>
                    </select>
                    {errors.status && <span className="invalid">{errors.status.message}</span>}
                  </FormGroup>
                </Col>

                <Col size="12">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    <li>
                      <Button color="primary" size="md" type="submit">
                        Update
                      </Button>
                    </li>
                    <li>
                      <Button
                        onClick={(ev) => {
                          ev.preventDefault();
                          onFormCancel();
                        }}
                        className="link link-light"
                      >
                        Cancel
                      </Button>
                    </li>
                  </ul>
                </Col>
              </Form>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={modal.op} toggle={() => setModal({ op: false })} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <div className="p-2">
            <h5 className="title">Operation Department</h5>
            <div className="mt-4">
              <Form className="row gy-4" onSubmit={handleSubmit(ondeliver)}>
                <Col size="12">
                  <FormGroup>
                    <label className="form-label">Status:</label>
                    <select
                      className="form-control"
                      name="status"
                      defaultValue={statusValue}
                      onChange={(e) => setStatusValue(e.target.value)}
                      ref={register({ required: "This field is required" })}
                    >
                      <option value="On hold">On hold</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    {errors.status && <span className="invalid">{errors.status.message}</span>}
                  </FormGroup>
                </Col>

                <Col size="12">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    <li>
                      <Button color="primary" size="md" type="submit">
                        Update
                      </Button>
                    </li>
                    <li>
                      <Button
                        onClick={(ev) => {
                          ev.preventDefault();
                          onFormCancel();
                        }}
                        className="link link-light"
                      >
                        Cancel
                      </Button>
                    </li>
                  </ul>
                </Col>
              </Form>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
export default InvoiceDetails;
