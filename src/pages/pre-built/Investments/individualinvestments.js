import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
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

import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  PaginationComponent,
  Col,
} from "../../../components/Component";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import { invoiceData } from "./Invoice";
import axios, { AxiosError, isAxiosError } from "axios";
import instanceAxios from "../../../utils/AxiosSetup";

import { CustomToast } from "../../../utils/CustomToast";
import { BadRequest } from "../../../utils/Error";
//import { Value } from "sass";
const InvoiceList = () => {
  const [data, setData] = useState(invoiceData);
  const [onSearch, setonSearch] = useState(true);
  const [existingFacility, setExistingFacility] = useState(false);
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("asc");
  const [sm, updateSm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerValue, setCustomerValue] = useState("");
  const [facilityValue, setFacilityValue] = useState("");
  const [user, setUser] = useState({
    expireIn: Number,
    expireTimeStamp: String,
    fullname: String,
    role: { id: Number, name: String },
    token: String,
    userName: String,
  });
  const [modal, setModal] = useState({
    edit: false,
    add: false,
    facility: false,
  });
  const [editId, setEditedId] = useState();
  //const [data, setData] = useState(projectData);
  const [genderValue, setGenderValue] = useState("");
  const [formData, setFormData] = useState({
    id: 0,
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
    contributio: 0,
    status: "",
  });
  // Sorting data
  const sortFunc = () => {
    let defaultData = data;
    if (sort === "dsc") {
      let sortedData = defaultData.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
      setData([...sortedData]);
    } else if (sort === "asc") {
      let sortedData = defaultData.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
      setData([...sortedData]);
    }
  };

  const fetchdata = () => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
    console.log(data);
  };
  const getApplications = async () => {
    try {
      const datares = await instanceAxios.get("IndividualApp");
      //console.log(data.data)
      setData(datares.data);
    } catch (e) {
      console.log(e);
    }
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      lead: "",
      tasks: 0,
      totalTask: 0,
      team: [],
      date: new Date(),
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // submit function to update a new item
  const onEditSubmit = async (sData) => {
    const {
      id,
      customerid,
      purpose,
      amount,
      tenure,
      profitrate,
      profitamount,
      totalamount,
      monthlyinstallment,
      sourceofpayment,
      securitydetails,
      securitydescription,
      value,
      contribution,
      status,
      facilitytype,
      amountdisbursed,
      outstanding,
      profitrateexist,
      totalprofit,
      maturitydate,
      monthlyinstallmentexist,
      bank,
    } = sData;
    console.log(sData);
    try {
      const RoleRes = await instanceAxios.put("IndividualApp", {
        applicationid: id,
        customerid: customerid,
        purpose: purpose,
        amount: amount,
        tenure: tenure,
        profitrate: profitrate,
        profitamount: profitamount,
        totalamount: totalamount,
        monthlyinstallment: monthlyinstallment,
        sourceofpayment: sourceofpayment,
        securitydetails: securitydetails,
        securitydescription: securitydescription,
        isExisting: existingFacility,
        value: value,
        contribution: contribution,
        createdby: user.userName,
        amountdisbursed: amountdisbursed,
        outstanding: outstanding,
        profitrateexist: profitrateexist,
        totalprofit: totalprofit,
        maturitydate: maturitydate,
        monthlyinstallmentexist: monthlyinstallmentexist,
        facilitytype: facilitytype,
        bank: bank,
      });

      const { data } = RoleRes;
      // 200 Data

      CustomToast("Successfully Updated", false, "success");
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

    getApplications();
    setModal({ edit: false });
  };

  const getCustomers = async () => {
    try {
      const data = await instanceAxios.get("Customer");
      //console.log(data.data)
      setCustomers(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  // function that loads the want to editted data
  const onEditClick = async (id) => {
    const Endpoint = `FullApplications/${id}`;
    const response = await instanceAxios.get(Endpoint);
    const data = response.data;
    console.log("Edit Data from API", data);

    setFormData({
      id: data.id,
      customerid: data.customerid,
      purpose: data.purpose,
      amount: data.amount,
      tenure: data.tenure,
      profitrate: data.profitrate,
      profitamount: data.profitamount,
      totalamount: data.totalamount,
      monthlyinstallment: data.monthlyinstallment,
      sourceofpayment: data.sourceofpayment,
      securitydetails: data.securitydetails,
      securitydescription: data.securitydescription,
      value: data.value,
      contribution: data.contribution,
      createdby: user.userName,
      amountdisbursed: data.amountdisbursed,
      outstanding: data.outstanding,
      profitrateexist: data.exprofitrate,
      totalprofit: data.totalprofit,
      maturitydate: data.maturitydate,
      monthlyinstallmentexist: data.exmonthlyinstallment,
      facilitytype: data.facilityType,
      bank: data.bank,
    });

    if (data.facilityType != "Nil") {
      setExistingFacility(true);
    } else {
      setExistingFacility(false);
    }

    setModal({ edit: true }, { add: false });
    setEditedId(id);
  };

  // Changing state value when searching name
  useEffect(() => {
    fetchdata();
    getCustomers();
    getApplications();
  }, []);
  // submit function to add a new item
  const onFormSubmit = async (submitData) => {
    const {
      customerid,
      purpose,
      amount,
      tenure,
      profitrate,
      profitamount,
      totalamount,
      monthlyinstallment,
      sourceofpayment,
      securitydetails,
      securitydescription,
      value,
      contribution,
      status,
      facilitytype,
      amountdisbursed,
      outstanding,
      profitrateexist,
      totalprofit,
      maturitydate,
      monthlyinstallmentexist,
      bank,
    } = submitData;
    console.log(submitData);
    try {
      const RoleRes = await instanceAxios.post("IndividualApp", {
        customerid: customerid,
        purpose: purpose,
        amount: amount,
        tenure: tenure,
        profitrate: profitrate,
        profitamount: profitamount,
        totalamount: totalamount,
        monthlyinstallment: monthlyinstallment,
        sourceofpayment: sourceofpayment,
        securitydetails: securitydetails,
        securitydescription: securitydescription,
        value: value,
        contribution: contribution,
        createdby: user.userName,
        amountdisbursed: amountdisbursed,
        outstanding: outstanding,
        profitrateexist: profitrateexist,
        totalprofit: totalprofit,
        maturitydate: maturitydate,
        monthlyinstallmentexist: monthlyinstallmentexist,
        facilitytype: facilitytype,
        bank: bank,
      });

      const { data } = RoleRes;
      // 200 Data

      CustomToast("Successfully Added", false, "success");
    } catch (error) {
      // 401, 403, 400
      if (isAxiosError(error)) {
        const { response, status } = error;

        if (response.data.detail === "Duplicate Entery") CustomToast(response.data.detail, false, "error");

        console.log(response.status, response.data);

        if (response.status === 400) {
          //

          if (response.data["detail"] != null) {
            // type: String,
            // title: String,
            // status: Number,
            // detail: String, // ,message
            // traceId: String,
            CustomToast(response.data["detail"], false, "error");
            console.log("\n \n error", response.data["detail"]);
          }
        }
      }
    }
    getApplications();
    setModal({ edit: false }, { add: false });
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);
  const { errors, register, handleSubmit } = useForm();

  const options = customers.map(function (item) {
    return <option value={item.id}>{item.name}</option>;
  });

  return (
    <React.Fragment>
      <Head title="Invoice List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Personal Investments</BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total 937 invoices.{user.role.name}</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <ul className="nk-block-tools g-3">
                <li className="nk-block-tools-opt" onClick={() => setModal({ add: true })}>
                  <Button color="primary">
                    <Icon name="plus"></Icon>
                    <span>Add Application</span>
                  </Button>
                </li>
              </ul>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Card className="card-stretch">
            <div className="card-inner-group">
              <div className="card-inner">
                <div className="card-title-group">
                  <div className="card-title">
                    <h5 className="title">All Applications</h5>
                  </div>
                  <div className="card-tools mr-n1">
                    <ul className="btn-toolbar">
                      <li>
                        <Button onClick={toggle} className="btn-icon search-toggle toggle-search">
                          <Icon name="search"></Icon>
                        </Button>
                      </li>
                      <li className="btn-toolbar-sep"></li>
                      <li>
                        <UncontrolledDropdown>
                          <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                            <Icon name="setting"></Icon>
                          </DropdownToggle>
                          <DropdownMenu right>
                            <ul className="link-check">
                              <li>
                                <span>Show</span>
                              </li>
                              <li className={itemPerPage === 10 ? "active" : ""}>
                                <DropdownItem
                                  tag="a"
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setItemPerPage(10);
                                  }}
                                >
                                  10
                                </DropdownItem>
                              </li>
                              <li className={itemPerPage === 15 ? "active" : ""}>
                                <DropdownItem
                                  tag="a"
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setItemPerPage(15);
                                  }}
                                >
                                  15
                                </DropdownItem>
                              </li>
                            </ul>
                            <ul className="link-check">
                              <li>
                                <span>Order</span>
                              </li>
                              <li className={sort === "dsc" ? "active" : ""}>
                                <DropdownItem
                                  tag="a"
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setSortState("dsc");
                                    sortFunc("dsc");
                                  }}
                                >
                                  DESC
                                </DropdownItem>
                              </li>
                              <li className={sort === "asc" ? "active" : ""}>
                                <DropdownItem
                                  tag="a"
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setSortState("asc");
                                    sortFunc("asc");
                                  }}
                                >
                                  ASC
                                </DropdownItem>
                              </li>
                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </li>
                    </ul>
                  </div>
                  <div className={`card-search search-wrap ${!onSearch ? "active" : ""}`}>
                    <div className="search-content">
                      <Button
                        className="search-back btn-icon toggle-search"
                        onClick={() => {
                          setSearchText("");
                          toggle();
                        }}
                      >
                        <Icon name="arrow-left"></Icon>
                      </Button>
                      <input
                        type="text"
                        className="form-control border-transparent form-focus-none"
                        placeholder="Search by Order Id"
                        value={onSearchText}
                        onChange={(e) => onFilterChange(e)}
                      />
                      <Button className="search-submit btn-icon">
                        <Icon name="search"></Icon>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-inner p-0">
                <table className="table table-orders">
                  <thead className="tb-odr-head">
                    <tr className="tb-odr-item">
                      <th className="tb-odr-info">
                        <span className="tb-odr-id">ID</span>
                        <span className="tb-odr-date d-none d-md-inline-block">Customer Name</span>
                      </th>
                      <th className="tb-odr-amount">
                        <span className="tb-odr-total">Amount</span>
                        <span className="tb-odr-status d-none d-md-inline-block">Status</span>
                      </th>
                      <th className="tb-odr-action">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody className="tb-odr-body">
                    {currentItems.length > 0
                      ? currentItems.map((item) => {
                          return (
                            <tr className="tb-odr-item" key={item.id}>
                              <td className="tb-odr-info">
                                <span className="tb-odr-id">
                                  <Link to={`${process.env.PUBLIC_URL}/invoice-details/${item.id}`}>#{item.id}</Link>
                                </span>
                                <span className="tb-odr-date">{item.customername}</span>
                              </td>
                              <td className="tb-odr-amount">
                                <span className="tb-odr-total">
                                  <span className="amount">${item.amount}</span>
                                </span>
                                <span className="tb-odr-status">
                                  <Badge
                                    color={
                                      item.status === "Approved"
                                        ? "success"
                                        : item.status === "Declined"
                                        ? "danger"
                                        : "warning"
                                    }
                                    className="badge-dot"
                                  >
                                    {item.status}
                                  </Badge>
                                </span>
                              </td>
                              <td className="tb-odr-action">
                                <div className="tb-odr-btns d-none d-sm-inline">
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn btn-dim"
                                    onClick={() => onEditClick(item.id)}
                                  >
                                    Edit {console.log(item)}
                                  </Button>

                                  <Link to={`${process.env.PUBLIC_URL}/invoice-details/${item.id}`}>
                                    <Button color="primary" size="sm" className="btn btn-dim">
                                      View
                                    </Button>
                                  </Link>
                                </div>
                                <Link to={`${process.env.PUBLIC_URL}/invoice-details/${item.id}`}>
                                  <Button className="btn-pd-auto d-sm-none">
                                    <Icon name="chevron-right"></Icon>
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </tbody>
                </table>
              </div>
              <div className="card-inner">
                {currentItems.length > 0 ? (
                  <PaginationComponent
                    noDown
                    itemPerPage={itemPerPage}
                    totalItems={data.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-silent">No data found</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Block>

        <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">New Application</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                  <Col size="12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="product-title">
                        Select Customer Name
                      </label>
                      <div className="form-control-wrap">
                        <select
                          className="form-control"
                          name="customerid"
                          defaultValue={formData.customerid}
                          onChange={(e) => setCustomerValue(e.target.value)}
                          ref={register({ required: "This field is required" })}
                        >
                          {options}
                        </select>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Purpose</label>
                      <input
                        type="text"
                        name="purpose"
                        defaultValue={formData.purpose}
                        placeholder="Enter purpose"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.account && <span className="invalid">{errors.purpose.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Amount</label>
                      <input
                        type="text"
                        name="amount"
                        defaultValue={formData.amount}
                        placeholder="Enter amount"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.employmenttype && <span className="invalid">{errors.amount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Facility Period </label>
                      <input
                        type="text"
                        name="tenure"
                        defaultValue={formData.tenure}
                        placeholder="Enter facility period"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.tenure && <span className="invalid">{errors.tenure.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Profit Rate</label>
                      <input
                        type="text"
                        name="profitrate"
                        defaultValue={formData.profitrate}
                        placeholder="Enter profit rate"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.position && <span className="invalid">{errors.profitrate.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Profit Amount</label>
                      <input
                        type="text"
                        name="profitamount"
                        defaultValue={formData.profitamount}
                        placeholder="Enter profit amount"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.homeaddress && <span className="invalid">{errors.profitamount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Total Amount</label>
                      <input
                        type="text"
                        name="totalamount"
                        defaultValue={formData.totalamount}
                        placeholder="Enter total amount"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.mobile && <span className="invalid">{errors.totalamount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Monthly Installment</label>
                      <input
                        type="text"
                        name="monthlyinstallment"
                        defaultValue={formData.monthlyinstallment}
                        placeholder="Enter monthly installment"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.netmonthsalary && <span className="invalid">{errors.monthlyinstallment.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Source of Payment</label>
                      <input
                        type="text"
                        name="sourceofpayment"
                        defaultValue={formData.sourceofpayment}
                        placeholder="Enter security details"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.datejoining && <span className="invalid">{errors.sourceofpayment.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Security Details</label>
                      <input
                        type="text"
                        name="securitydetails"
                        defaultValue={formData.securitydetails}
                        placeholder="Enter security details"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.preemployer && <span className="invalid">{errors.securitydetails.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Security description</label>
                      <input
                        type="text"
                        name="securitydescription"
                        defaultValue={formData.securitydescription}
                        placeholder="Enter security description"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.otherincome && <span className="invalid">{errors.securitydescription.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Value</label>
                      <input
                        type="text"
                        name="value"
                        defaultValue={formData.value}
                        placeholder="Enter value"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.salarycrediteab && <span className="invalid">{errors.value.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Contribution</label>
                      <input
                        type="text"
                        name="contribution"
                        defaultValue={formData.contribution}
                        placeholder="Enter contribution"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.citizenship && <span className="invalid">{errors.contribution.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <div className="preview-block">
                      <span className="preview-title overline-title">Existing Facilities Available</span>
                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            console.log("Check faci ");

                            setExistingFacility(e.target.value);
                          }}
                          className="custom-control-input form-control"
                          defaultChecked={existingFacility}
                          id="customSwitch2"
                        />
                        <label className="custom-control-label" htmlFor="customSwitch2">
                          {existingFacility ? "Yes" : "NO"}
                        </label>
                      </div>
                    </div>
                  </Col>
                  {existingFacility && (
                    <>
                      <Col size="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor="product-title">
                            Select Facility Type
                          </label>
                          <div className="form-control-wrap">
                            <select
                              className="form-control"
                              name="facilitytype"
                              defaultValue={formData.facilitytype}
                              onChange={(e) => setFacilityValue(e.target.value)}
                              ref={register({ required: "This field is required" })}
                            >
                              <option value="Murabaha">Murabaha</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Amount Disbursed</label>
                          <input
                            type="text"
                            name="amountdisbursed"
                            defaultValue={formData.value}
                            placeholder="Enter value"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.salarycrediteab && <span className="invalid">{errors.value.message}</span>}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Outstanding</label>
                          <input
                            type="text"
                            name="outstanding"
                            defaultValue={formData.value}
                            placeholder="Enter value"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.salarycrediteab && <span className="invalid">{errors.value.message}</span>}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Profit Rate</label>
                          <input
                            type="text"
                            name="profitrateexist"
                            defaultValue={formData.value}
                            placeholder="Enter value"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.salarycrediteab && <span className="invalid">{errors.value.message}</span>}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Total Profit</label>
                          <input
                            type="text"
                            name="totalprofit"
                            defaultValue={formData.value}
                            placeholder="Enter value"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.salarycrediteab && <span className="invalid">{errors.value.message}</span>}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Maturity Date</label>
                          <input
                            type="date"
                            name="maturitydate"
                            defaultValue={formData.maturitydate}
                            placeholder="Enter net month salary"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.maturitydate && <span className="invalid">{errors.maturitydate.message}</span>}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Monthly Installment</label>
                          <input
                            type="text"
                            name="monthlyinstallmentexist"
                            defaultValue={formData.value}
                            placeholder="Enter value"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.salarycrediteab && <span className="invalid">{errors.value.message}</span>}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Bank</label>
                          <input
                            type="text"
                            name="bank"
                            defaultValue={formData.bank}
                            placeholder="Enter value"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.bank && <span className="invalid">{errors.bank.message}</span>}
                        </FormGroup>
                      </Col>
                    </>
                  )}

                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Add Application
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

        <Modal isOpen={modal.edit} toggle={() => setModal({ edit: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update Application</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)}>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Application ID</label>
                      <input
                        type="text"
                        name="id"
                        defaultValue={formData.id}
                        placeholder="Enter purpose"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.id && <span className="invalid">{errors.id.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="product-title">
                        Select Customer Name
                      </label>
                      <div className="form-control-wrap">
                        <select
                          className="form-control"
                          name="customerid"
                          defaultValue={formData.customerid}
                          onChange={(e) => setCustomerValue(e.target.value)}
                          ref={register({ required: "This field is required" })}
                        >
                          {options}
                        </select>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Purpose</label>
                      <input
                        type="text"
                        name="purpose"
                        defaultValue={formData.purpose}
                        placeholder="Enter purpose"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.account && <span className="invalid">{errors.purpose.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Amount</label>
                      <input
                        type="text"
                        name="amount"
                        defaultValue={formData.amount}
                        placeholder="Enter amount"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.employmenttype && <span className="invalid">{errors.amount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Facility Period </label>
                      <input
                        type="text"
                        name="tenure"
                        defaultValue={formData.tenure}
                        placeholder="Enter facility period"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.tenure && <span className="invalid">{errors.tenure.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Profit Rate</label>
                      <input
                        type="text"
                        name="profitrate"
                        defaultValue={formData.profitrate}
                        placeholder="Enter profit rate"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.position && <span className="invalid">{errors.profitrate.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Profit Amount</label>
                      <input
                        type="text"
                        name="profitamount"
                        defaultValue={formData.profitamount}
                        placeholder="Enter profit amount"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.homeaddress && <span className="invalid">{errors.profitamount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Total Amount</label>
                      <input
                        type="text"
                        name="totalamount"
                        defaultValue={formData.totalamount}
                        placeholder="Enter total amount"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.mobile && <span className="invalid">{errors.totalamount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Monthly Installment</label>
                      <input
                        type="text"
                        name="monthlyinstallment"
                        defaultValue={formData.monthlyinstallment}
                        placeholder="Enter monthly installment"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.netmonthsalary && <span className="invalid">{errors.monthlyinstallment.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Source of Payment</label>
                      <input
                        type="text"
                        name="sourceofpayment"
                        defaultValue={formData.sourceofpayment}
                        placeholder="Enter security details"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.datejoining && <span className="invalid">{errors.sourceofpayment.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Security Details</label>
                      <input
                        type="text"
                        name="securitydetails"
                        defaultValue={formData.securitydetails}
                        placeholder="Enter security details"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.preemployer && <span className="invalid">{errors.securitydetails.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Security description</label>
                      <input
                        type="text"
                        name="securitydescription"
                        defaultValue={formData.securitydescription}
                        placeholder="Enter security description"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.otherincome && <span className="invalid">{errors.securitydescription.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Value</label>
                      <input
                        type="text"
                        name="value"
                        defaultValue={formData.value}
                        placeholder="Enter value"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.salarycrediteab && <span className="invalid">{errors.value.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Contribution</label>
                      <input
                        type="text"
                        name="contribution"
                        defaultValue={formData.contribution}
                        placeholder="Enter contribution"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.citizenship && <span className="invalid">{errors.contribution.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <div className="preview-block">
                      <span className="preview-title overline-title">Existing Facilities Available</span>
                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            // console.log("Facility Edit ", existingFacility, e.target.value);
                            setExistingFacility(!existingFacility);
                          }}
                          className="custom-control-input form-control"
                          defaultChecked={existingFacility}
                          id="customSwitch2"
                        />
                        <label className="custom-control-label" htmlFor="customSwitch2">
                          {existingFacility ? "YES" : "NO"}
                        </label>
                      </div>
                    </div>
                  </Col>
                  {existingFacility == true && (
                    <>
                      <Col size="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor="product-title">
                            Select Facility Type
                          </label>
                          <div className="form-control-wrap">
                            <select
                              className="form-control"
                              name="facilitytype"
                              defaultValue={formData.facilitytype}
                              onChange={(e) => setFacilityValue(e.target.value)}
                              ref={register({ required: "This field is required" })}
                            >
                              <option value="Murabaha">Murabaha</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Amount Disbursed</label>
                          <input
                            type="text"
                            name="amountdisbursed"
                            defaultValue={formData.amountdisbursed}
                            placeholder="Enter value"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.amountdisbursed && <span className="invalid">{errors.amountdisbursed.message}</span>}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Outstanding</label>
                          <input
                            type="text"
                            name="outstanding"
                            defaultValue={formData.outstanding}
                            placeholder="Enter value"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.outstanding && <span className="invalid">{errors.outstanding.message}</span>}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Profit Rate</label>
                          <input
                            type="text"
                            name="profitrateexist"
                            defaultValue={formData.profitrateexist}
                            placeholder="Enter value"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.profitrateexist && <span className="invalid">{errors.profitrateexist.message}</span>}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Total Profit</label>
                          <input
                            type="text"
                            name="totalprofit"
                            defaultValue={formData.totalprofit}
                            placeholder="Enter value"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.totalprofit && <span className="invalid">{errors.totalprofit.message}</span>}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Maturity Date</label>
                          <input
                            type="date"
                            name="maturitydate"
                            defaultValue={formData.maturitydate}
                            placeholder="Enter net month salary"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.maturitydate && <span className="invalid">{errors.maturitydate.message}</span>}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Monthly Installment</label>
                          <input
                            type="text"
                            name="monthlyinstallmentexist"
                            defaultValue={formData.monthlyinstallmentexist}
                            placeholder="Enter value"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.monthlyinstallmentexist && (
                            <span className="invalid">{errors.monthlyinstallmentexist.message}</span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label className="form-label">Bank</label>
                          <input
                            type="text"
                            name="bank"
                            defaultValue={formData.bank}
                            placeholder="Enter value"
                            className="form-control"
                            ref={register({
                              required: "This field is required",
                            })}
                          />
                          {errors.bank && <span className="invalid">{errors.bank.message}</span>}
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
          isOpen={modal.facility}
          toggle={() => setModal({ facility: false })}
          className="modal-dialog-centered"
          size="lg"
        >
          <ModalBody>Welcome</ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};
export default InvoiceList;
