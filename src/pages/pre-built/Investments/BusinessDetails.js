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
const InvoiceDetails = ({ match }) => {
  const userId = match.params.id;
  const [data] = useState(invoiceData);
  const [user, setUser] = useState();
  const [statusValue, setStatusValue] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
    facility: false,
    sharia: false,
    voting: false,
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
      const Endpoint = `Investments/${id}`;
      const data = await instanceAxios.get(Endpoint);
      console.log(id);
      setUser(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchdata = () => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUserDetails(data);
    console.log(data);
  };

  // submit function to add a new item
  const onFormSubmit = async (submitData) => {
    const appid = match.params.id;
    const { id, CA, status } = submitData;
    console.log(submitData);
    try {
      const RoleRes = await instanceAxios.put("IndividualApp/UpdateCA", {
        id: userId,
        status: user.status,
        customerid: user.customerid,
        purpose: user.purpose,
        amount: user.amount,
        tenure: user.tenure,
        contribution: user.contribution,
        profitrate: user.profitrate,
        profitamount: user.profitamount,
        totalamount: user.totalamount,
        monthlyinstallment: user.monthlyinstallment,
        securitydetails: user.securitydetails,
        securitydescription: user.securitydescription,
        sourceofpayment: user.sourceofpayment,
        value: user.value,
        condition: user.condition,
        RM: user.RM,
        ca: CA,
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

  // Update Statis
  const onUpdateSubmit = async (submitData) => {
    const appid = match.params.id;
    const { id, CA, status } = submitData;
    console.log(submitData);
    try {
      const RoleRes = await instanceAxios.put("IndividualApp", {
        id: userId,
        status: status,
        customerid: user.customerid,
        purpose: user.purpose,
        amount: user.amount,
        tenure: user.tenure,
        contribution: user.contribution,
        profitrate: user.profitrate,
        profitamount: user.profitamount,
        totalamount: user.totalamount,
        monthlyinstallment: user.monthlyinstallment,
        securitydetails: user.securitydetails,
        securitydescription: user.securitydescription,
        sourceofpayment: user.sourceofpayment,
        value: user.value,
        condition: user.condition,
        RM: user.RM,
        ca: user.CA,
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

  useEffect(() => {
    getApp();
    fetchdata();
    /*   const id = match.params.id;
    if (id !== undefined || null || "") {
      let spUser = data.find((item) => item.id === Number(id));
      setUser(spUser);
    } else {
      setUser(data[0]);
    }
    */
  }, []);
  const { errors, register, handleSubmit } = useForm();
  const teamList = [
    { value: "Purposed", label: "Purposed", theme: "purple" },
    { value: "Approved", label: "Approved", theme: "primary" },
    { value: "Rejected", label: "Rejected", theme: "red" },
  ];
  return (
    <React.Fragment>
      <Head title="Invoice Detail"></Head>
      {user && (
        <Content>
          <BlockHead>
            <BlockBetween className="g-3">
              <BlockHeadContent>
                <BlockTitle>
                  Application <strong className="text-primary small">#{user.id}</strong>
                </BlockTitle>
                <BlockDes className="text-soft">
                  <ul className="list-inline">
                    <li>
                      Created by: <span className="text-base">{userdetails.fullname}</span>
                    </li>
                  </ul>
                </BlockDes>
              </BlockHeadContent>
              <BlockHeadContent>
                <Link to={`${process.env.PUBLIC_URL}/kyc-details-regular/${user.id}`}>
                  <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                    <Icon name="file-download"></Icon>
                    <span>Attached & Application Details</span>
                  </Button>
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
                {userdetails.role.name === "Credit Commitee" && (
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
                <Link to={`${process.env.PUBLIC_URL}/invoice-print/${user.id}`} target="_blank">
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
                      <h4 className="title">{user.customername}</h4>
                      <ul className="list-plain">
                        <li>
                          <Icon name="map-pin-fill"></Icon>
                          <span>
                            {user.homeaddress}
                            <br />
                            {user.citizenship}
                          </span>
                        </li>
                        <li>
                          <Icon name="call-fill"></Icon>
                          <span>{user.mobile}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="invoice-desc">
                    <h3 className="title">Application</h3>
                    <ul className="list-plain">
                      <li className="invoice-id">
                        <span>Application ID</span>:<span>{user.id}</span>
                      </li>
                      <li className="invoice-date">
                        <span>Date</span>:<span>{user.createddate}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="invoice-bills">
                  <div className="table-responsive">
                    <h5>Basic Information</h5>
                    <table className="table table-striped">
                      <tbody>
                        <tr>
                          <td>
                            <b>Account</b>
                          </td>
                          <td>{user.account}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Applicant Name</b>
                          </td>
                          <td>{user.applicantName}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Full Address</b>
                          </td>
                          <td>{user.address}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Post Code</b>
                          </td>
                          <td>{user.postcode}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Tel. Mobile</b>
                          </td>
                          <td>{user.mobile}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Tel. Office</b>
                          </td>
                          <td>{user.teloffice}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Type of company</b>
                          </td>
                          <td>{user.type}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Nature of business</b>
                          </td>
                          <td>{user.natureofbusiness}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Date of establishment</b>
                          </td>
                          <td>{user.dateofestablishment}</td>
                        </tr>
                      </tbody>
                    </table>
                    <h5>Financing details</h5>
                    <table className="table table-striped">
                      <tbody>
                        <tr>
                          <td>
                            <b>Purpose</b>
                          </td>
                          <td>{user.purpose}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Total cost</b>
                          </td>
                          <td>{user.cost}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Your contribution</b>
                          </td>
                          <td>{user.contribution}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Amount requested</b>
                          </td>
                          <td>{user.amount}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Financing period (Months)</b>
                          </td>
                          <td>{user.period}</td>
                        </tr>
                      </tbody>
                    </table>
                    <h5>Security / Collateral</h5>
                    <table className="table table-striped">
                      <tbody>
                        <tr>
                          <td>
                            <b>Type of security /Collateral offered:</b>
                          </td>
                          <td>{user.security}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Name of guarantor (in case of third party)</b>
                          </td>
                          <td>{user.nameguarantor}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Nature of business</b>
                          </td>
                          <td>{user.natureofbusiness}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Address</b>
                          </td>
                          <td>{user.addresssecurity}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Phone</b>
                          </td>
                          <td>{user.phone}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Block>
        </Content>
      )}
      <Modal
        isOpen={modal.facility}
        toggle={() => setModal({ facility: false })}
        className="modal-dialog-centered"
        size="lg"
      >
        <ModalBody>
          <div className="p-2">
            <h5 className="title">Credit Analyst Recommendation Form</h5>
            <div className="mt-4">
              <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                <Col size="12">
                  <FormGroup>
                    <label className="form-label">Comment / Recommendation</label>
                    <textarea
                      name="CA"
                      defaultValue={formData.CA}
                      placeholder="Your description"
                      //    onChange={(e) => onInputChange(e)}
                      ref={register({ required: "This field is required" })}
                      className="form-control no-resize"
                    />
                    {errors.CA && <span className="invalid">{errors.CA.message}</span>}
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
      <Modal
        isOpen={modal.sharia}
        toggle={() => setModal({ sharia: false })}
        className="modal-dialog-centered"
        size="lg"
      >
        <ModalBody>
          <div className="p-2">
            <h5 className="title">Change Status</h5>
            <div className="mt-4">
              <Form className="row gy-4" onSubmit={handleSubmit(onUpdateSubmit)}>
                <Col size="12">
                  <FormGroup>
                    <label className="form-label">Current Status:</label>

                    <select
                      className="form-control"
                      name="status"
                      defaultValue={formData.status}
                      onChange={(e) => setStatusValue(e.target.value)}
                      ref={register({ required: "This field is required" })}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
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
                        Vote
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
    </React.Fragment>
  );
};
export default InvoiceDetails;
