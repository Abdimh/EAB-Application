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
    Account: "",
    ApplicantName: "",
    Address: "",
    Postcode: "",
    mobile: "",
    teloffice: "",
    natureofbusiness: "",
    typeofcompany: "",
    dateofestablishment: "",
    purpose: "",
    cost: 0,
    contribution: 0,
    amount: 0,
    period: "",
    security: "",
    nameguarantor: "",
    naturesecurity: "",
    Addresssecurity: "",
    phone: "",
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
      const datares = await instanceAxios.get("Investments");
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
      account,
      applicantName,
      Address,
      Postcode,
      mobile,
      teloffice,
      natureofbusiness,
      companytype,
      dateofestablishment,
      purpose,
      cost,
      typeofcompany,
      contribution,
      amount,
      period,
      security,
      nameguarantor,
      naturesecurity,
      Addresssecurity,
      phone,
    } = sData;
    console.log(sData);
    try {
      const RoleRes = await instanceAxios.put("Investments", {
        id: id,
        Account: account,
        ApplicantName: applicantName,
        Address: Address,
        Postcode: Postcode,
        Mobile: mobile,
        teloffice: teloffice,
        natureofbusiness: natureofbusiness,
        companytype: companytype,
        type: typeofcompany,
        purpose: purpose,
        cost: cost,
        contribution: contribution,
        amount: amount,
        period: period,
        security: security,
        nameguarantor: nameguarantor,
        naturesecurity: naturesecurity,
        Addresssecurity: Addresssecurity,
        phone: phone,
        status: "Purposed",
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
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        setFormData({
          id: item.id,
          Account: item.account,
          ApplicantName: item.applicantName,
          Address: item.address,
          Postcode: item.postcode,
          mobile: item.mobile,
          teloffice: item.teloffice,
          natureofbusiness: item.natureofbusiness,
          typeofcompany: item.type,
          dateofestablishment: item.dateofestablishment,
          purpose: item.purpose,
          cost: item.cost,
          contribution: item.contribution,
          amount: item.amount,
          period: item.period,
          security: item.security,
          nameguarantor: item.nameguarantor,
          naturesecurity: item.naturesecurity,
          Addresssecurity: item.addresssecurity,
          phone: item.phone,
        });
        console.log(item);
        setModal({ edit: true }, { add: false });
        setEditedId(id);
      }
    });
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
      account,
      applicantName,
      Address,
      Postcode,
      mobile,
      teloffice,
      natureofbusiness,
      companytype,
      dateofestablishment,
      purpose,
      cost,
      typeofcompany,
      contribution,
      amount,
      period,
      security,
      nameguarantor,
      naturesecurity,
      Addresssecurity,
      phone,
    } = submitData;
    console.log(submitData);
    try {
      const RoleRes = await instanceAxios.post("Investments", {
        Account: account,
        ApplicantName: applicantName,
        Address: Address,
        Postcode: Postcode,
        Mobile: mobile,
        teloffice: teloffice,
        natureofbusiness: natureofbusiness,
        companytype: companytype,
        type: typeofcompany,
        purpose: purpose,
        cost: cost,
        contribution: contribution,
        amount: amount,
        period: period,
        security: security,
        nameguarantor: nameguarantor,
        naturesecurity: naturesecurity,
        Addresssecurity: Addresssecurity,
        phone: phone,
        status: "Purposed",
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
    return <option value={item.name}>{item.name}</option>;
  });

  return (
    <React.Fragment>
      <Head title="Invoice List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Business Investments</BlockTitle>
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
                        <span className="tb-odr-id">Account</span>
                        <span className="tb-odr-date d-none d-md-inline-block">Applicant Name</span>
                      </th>
                      <th className="tb-odr-amount">
                        <span className="tb-odr-total">Purpose</span>
                        <span className="tb-odr-status d-none d-md-inline-block">Amount</span>
                      </th>
                      <th className="tb-odr-amount">
                        <span className="tb-odr-total">Period</span>
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
                                <span className="tb-odr-date">{item.applicantName}</span>
                              </td>
                              <td className="tb-odr-amount">
                                <span className="tb-odr-total">
                                  <span className="amount">{item.purpose}</span>
                                </span>
                                <span className="tb-odr-status">{item.amount}</span>
                              </td>
                              <td className="tb-odr-amount">
                                <span className="tb-odr-total">
                                  <span className="amount">{item.period}</span>
                                </span>
                                <span className="tb-odr-status">{item.status}</span>
                              </td>
                              <td className="tb-odr-action">
                                <div className="tb-odr-btns d-none d-sm-inline">
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn btn-dim"
                                    onClick={() => onEditClick(item.id)}
                                  >
                                    Edit
                                  </Button>

                                  <Link to={`${process.env.PUBLIC_URL}/business-details/${item.id}`}>
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
              <h5 className="title">New Business Investment</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                  <Col size="12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="product-title">
                        Select Applicant
                      </label>
                      <div className="form-control-wrap">
                        <select
                          className="form-control"
                          name="applicantName"
                          defaultValue={formData.applicantName}
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
                      <label className="form-label">Account</label>
                      <input
                        type="text"
                        name="account"
                        defaultValue={formData.account}
                        placeholder="Enter purpose"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.account && <span className="invalid">{errors.account.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        name="Address"
                        defaultValue={formData.Address}
                        placeholder="Enter Address"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.Address && <span className="invalid">{errors.Address.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Mobile</label>
                      <input
                        type="text"
                        name="mobile"
                        defaultValue={formData.mobile}
                        placeholder="Enter Mobile Number"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.mobile && <span className="invalid">{errors.mobile.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Post code</label>
                      <input
                        type="text"
                        name="Postcode"
                        defaultValue={formData.Postcode}
                        placeholder="Enter profit rate"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.Postcode && <span className="invalid">{errors.Postcode.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Tell Office</label>
                      <input
                        type="text"
                        name="teloffice"
                        defaultValue={formData.teloffice}
                        placeholder="Enter profit amount"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.teloffice && <span className="invalid">{errors.teloffice.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Nature of Business</label>
                      <input
                        type="text"
                        name="natureofbusiness"
                        defaultValue={formData.natureofbusiness}
                        placeholder="Enter nature of business"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.natureofbusiness && <span className="invalid">{errors.natureofbusiness.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Purpose of Finance</label>
                      <input
                        type="text"
                        name="purpose"
                        defaultValue={formData.purpose}
                        placeholder="Enter monthly installment"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.purpose && <span className="invalid">{errors.purpose.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Total Cost</label>
                      <input
                        type="text"
                        name="cost"
                        defaultValue={formData.cost}
                        placeholder="Enter security details"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.cost && <span className="invalid">{errors.cost.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Type of company</label>
                      <input
                        type="text"
                        name="typeofcompany"
                        defaultValue={formData.typeofcompany}
                        placeholder="Enter security details"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.typeofcompany && <span className="invalid">{errors.typeofcompany.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Your contribution</label>
                      <input
                        type="text"
                        name="contribution"
                        defaultValue={formData.contribution}
                        placeholder="Enter security description"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.contribution && <span className="invalid">{errors.contribution.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Amount requested</label>
                      <input
                        type="text"
                        name="amount"
                        defaultValue={formData.amount}
                        placeholder="Enter value"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.amount && <span className="invalid">{errors.amount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Financing Period</label>
                      <input
                        type="text"
                        name="period"
                        defaultValue={formData.period}
                        placeholder="Enter period"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.period && <span className="invalid">{errors.period.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Type of security </label>
                      <input
                        type="text"
                        name="security"
                        defaultValue={formData.security}
                        placeholder="Enter period"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.security && <span className="invalid">{errors.security.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name of guarantor</label>
                      <input
                        type="text"
                        name="nameguarantor"
                        defaultValue={formData.nameguarantor}
                        placeholder="Enter name guarantor"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.nameguarantor && <span className="invalid">{errors.nameguarantor.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        defaultValue={formData.phone}
                        placeholder="Enter phone"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.phone && <span className="invalid">{errors.phone.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Nature of business security</label>
                      <input
                        type="text"
                        name="naturesecurity"
                        defaultValue={formData.naturesecurity}
                        placeholder="Enter nature security"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.naturesecurity && <span className="invalid">{errors.naturesecurity.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        name="Addresssecurity"
                        defaultValue={formData.Addresssecurity}
                        placeholder="Enter contribution"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.Addresssecurity && <span className="invalid">{errors.Addresssecurity.message}</span>}
                    </FormGroup>
                  </Col>
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
              <h5 className="title">Update Business Investment</h5>
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
                        Select Applicant
                      </label>
                      <div className="form-control-wrap">
                        <select
                          className="form-control"
                          name="applicantName"
                          defaultValue={formData.applicantName}
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
                      <label className="form-label">Account</label>
                      <input
                        type="text"
                        name="account"
                        defaultValue={formData.Account}
                        placeholder="Enter purpose"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.account && <span className="invalid">{errors.account.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        name="Address"
                        defaultValue={formData.Address}
                        placeholder="Enter Address"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.Address && <span className="invalid">{errors.Address.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Mobile</label>
                      <input
                        type="text"
                        name="mobile"
                        defaultValue={formData.mobile}
                        placeholder="Enter Mobile Number"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.mobile && <span className="invalid">{errors.mobile.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Post code</label>
                      <input
                        type="text"
                        name="Postcode"
                        defaultValue={formData.Postcode}
                        placeholder="Enter profit rate"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.Postcode && <span className="invalid">{errors.Postcode.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Tell Office</label>
                      <input
                        type="text"
                        name="teloffice"
                        defaultValue={formData.teloffice}
                        placeholder="Enter profit amount"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.teloffice && <span className="invalid">{errors.teloffice.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Nature of Business</label>
                      <input
                        type="text"
                        name="natureofbusiness"
                        defaultValue={formData.natureofbusiness}
                        placeholder="Enter nature of business"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.natureofbusiness && <span className="invalid">{errors.natureofbusiness.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Purpose of Finance</label>
                      <input
                        type="text"
                        name="purpose"
                        defaultValue={formData.purpose}
                        placeholder="Enter monthly installment"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.purpose && <span className="invalid">{errors.purpose.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Total Cost</label>
                      <input
                        type="text"
                        name="cost"
                        defaultValue={formData.cost}
                        placeholder="Enter security details"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.cost && <span className="invalid">{errors.cost.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Type of company</label>
                      <input
                        type="text"
                        name="typeofcompany"
                        defaultValue={formData.typeofcompany}
                        placeholder="Enter security details"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.typeofcompany && <span className="invalid">{errors.typeofcompany.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Your contribution</label>
                      <input
                        type="text"
                        name="contribution"
                        defaultValue={formData.contribution}
                        placeholder="Enter security description"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.contribution && <span className="invalid">{errors.contribution.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Amount requested</label>
                      <input
                        type="text"
                        name="amount"
                        defaultValue={formData.amount}
                        placeholder="Enter value"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.amount && <span className="invalid">{errors.amount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Financing Period</label>
                      <input
                        type="text"
                        name="period"
                        defaultValue={formData.period}
                        placeholder="Enter period"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.period && <span className="invalid">{errors.period.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Type of security </label>
                      <input
                        type="text"
                        name="security"
                        defaultValue={formData.security}
                        placeholder="Enter period"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.security && <span className="invalid">{errors.security.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name of guarantor</label>
                      <input
                        type="text"
                        name="nameguarantor"
                        defaultValue={formData.nameguarantor}
                        placeholder="Enter name guarantor"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.nameguarantor && <span className="invalid">{errors.nameguarantor.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        defaultValue={formData.phone}
                        placeholder="Enter phone"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.phone && <span className="invalid">{errors.phone.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Nature of business security</label>
                      <input
                        type="text"
                        name="naturesecurity"
                        defaultValue={formData.naturesecurity}
                        placeholder="Enter nature security"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.naturesecurity && <span className="invalid">{errors.naturesecurity.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        name="Addresssecurity"
                        defaultValue={formData.Addresssecurity}
                        placeholder="Enter contribution"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.Addresssecurity && <span className="invalid">{errors.Addresssecurity.message}</span>}
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
