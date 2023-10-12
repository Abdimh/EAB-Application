import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  UncontrolledDropdown,
  Form,
  Label,
  Modal,
  DropdownMenu,
  FormGroup,
  DropdownToggle,
  Card,
  Badge,
  DropdownItem,
  ModalBody,
  Row,
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
import DatePicker from "react-datepicker";
import { CustomToast } from "../../../utils/CustomToast";
import { BadRequest } from "../../../utils/Error";
import moment from "moment";
import { Alert, UncontrolledAlert, Spinner } from "reactstrap";
import { log } from "util";
import DataTable from "react-data-table-component";
//import { Value } from "sass";
const InvoiceList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [search, SetSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [onSearch, setonSearch] = useState(true);
  const [existingFacility, setExistingFacility] = useState(false);
  const [isro, setIsRo] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("asc");
  const [sm, updateSm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerValue, setCustomerValue] = useState("");
  const [statusValue, setstatusValue] = useState("");
  const [filevaue, setFileValue] = useState("");
  const [facilityValue, setFacilityValue] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectedcustomers, setSelectedCustomers] = useState([]);
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
    guarantor: false,
  });

  const [editId, setEditedId] = useState();
  //const [data, setData] = useState(projectData);

  const [purposeValue, setPurposeValue] = useState("");
  const [rangeStart, setRangeStart] = useState(new Date());
  const [rangeEnd, setRangeEnd] = useState();

  const [rangeDate, setRangeDate] = useState({
    start: new Date(),
    end: null,
  });
  const [installment, setInstallment] = useState();
  const [profitrate, setProfitRate] = useState();
  const [rate, setRate] = useState();
  const [profitamount, setProfitAmount] = useState();
  const [totalamount, setTotalAmount] = useState();
  const [years, setYears] = useState();
  const [amount, setAmount] = useState();
  const [dbr, setDBR] = useState();
  const [dateFrom, setDateFrom] = useState(new Date(Date.now()));
  const [dateTo, setDateTo] = useState(new Date(Date.now()));
  const [id, setId] = useState("");
  const [hidedata, setHideData] = useState(false);
  const [artists, setArtists] = useState([]);
  const [formData, setFormData] = useState({
    id: 0,
    customerid: Number,
    purpose: "",
    amount: Number,
    facilityperiod: Number,
    profitrate: "",
    profitamount: Number,
    totalamount: Number,
    monthlyinstallment: Number,
    sourceofpayment: "",
    securitydetails: "",
    securitydescription: "",
    value: Number,
    contributio: 0,
    status: "",
    statuscheck: "",
    type: "",
    years: 0,
    yearrate: 0,
    phone: "",
  });

  const [guarantorform, setGuarantorForm] = useState({
    id: 0,
    Name: "",
    EABAccount: "",
    bankname: "",
    otheraccount: "",
    fulladdress: "",
    telphone: "",
    outstanding: "",
    installment: "",
    relationship: "",
    maturatiydate: "",
    applicationid: 0,
  });

  const fetchdata = () => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
    console.log(data);
  };
  const getApplications = async () => {
    try {
      const req = await instanceAxios.get("IndividualApp");

      setData(req.data);
      setFilter(req.data);
    } catch (e) {
      console.log(e);
    }
  };

  const changeRate = (e) => {
    const years = e.target.value;

    // calculate rate percentage

    const num = years * rate;

    setYears(years);
    /// set profit rate 22.5
    setProfitRate(num);
    // set total profit
    const totalprofit = (num / 100) * amount;

    console.log(totalprofit.toFixed(2));

    setProfitAmount(totalprofit);
    // set total amount

    setTotalAmount(parseFloat(totalprofit) + parseFloat(amount));
  };
  // function to reset the form
  const resetForm = () => {
    setFormData({
      id: 0,
      customerid: Number,
      purpose: "",
      amount: Number,
      facilityperiod: Number,
      profitrate: 0,
      profitamount: Number,
      totalamount: Number,
      monthlyinstallment: Number,
      sourceofpayment: "",
      securitydetails: "",
      securitydescription: "",
      value: Number,
      totalamount: 0,
      contributio: 0,
      status: "",
      statuscheck: "",
      type: "",
      yearrate: 0,
    });

    setSelected([]);
    setAmount();
    setTotalAmount(0);
    setRate(0);
    setProfitRate();
    setInstallment();
    setProfitAmount(0);
    setInstallment();
    setYears();
  };

  // function to close the form modal
  const onFormCancel = () => {
    setSelected([]);
    setModal({ edit: false, add: false });
    setExistingFacility(false);
    setRate(0);
    resetForm();
  };
  // Columns

  const columns = [
    {
      name: "Customer",
      selector: (row) => row?.customers.map((sub) => sub?.name),
      width: "10rem",
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
    },
    {
      name: "Profit Amount",
      selector: (row) => row.profitamount,
    },
    {
      name: "Total Amount",
      selector: (row) => row.totalamount,
    },

    user.role.name === "Relation Officer PI" && {
      name: "Action",
      cell: (row) => (
        <Button color="primary" size="sm" className="btn btn-dim" onClick={() => onEditClick(row.id)}>
          Edit
        </Button>
      ),
      width: "6rem",
    },

    user.role.name === "Relation Officer PI" && {
      name: "Action",

      cell: (row) => (
        <Button color="primary" size="sm" className="btn btn-dim" onClick={() => setModal({ guarantor: true })}>
          Add
        </Button>
      ),
      width: "6rem",
    },
    {
      name: "Action",
      cell: (row) => (
        <Link to={`${process.env.PUBLIC_URL}/application-details/${row.id}`}>
          <Button color="primary" size="sm" className="btn btn-dim">
            View
          </Button>
        </Link>
      ),
      width: "6rem",
    },
  ];

  // submit function to update a new item
  const onEditSubmit = async (sData) => {
    setLoading(true);
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
      filetype,
      statuscheck,
    } = sData;
    console.log(sData);
    try {
      const arraydata = [];
      selected.forEach((item) => arraydata.push(item.id));
      const RoleRes = await instanceAxios.put("IndividualApp", {
        applicationid: id,
        customerid: customerid,
        purpose: purposeValue,
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
        isRO: isro,
        value: value,
        CustomersList: arraydata,
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
        status: status,
        checkstatus: sData.statuscheck,
        filetype: sData.type,
        rateyear: rate,
        years: years,
        phone: sData.phone,
      });

      const { data } = RoleRes;
      // 200 Data

      CustomToast("Successfully Updated", false, "success");
      resetForm();
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
    setSelectedCustomers(data);
    // console.log(data.application.customers);
    setFormData({
      id: data.application.id,
      //   customerid: data.customer.customerid,
      purpose: data.application.purpose,
      amount: data.application.amount,
      tenure: data.application.tenure,
      profitrate: data.application.profitrate,
      phone: data.application.phone,
      totalamount: data.application.totalamount,
      monthlyinstallment: data.application.monthlyinstallment,
      sourceofpayment: data.application.sourceofpayment,
      securitydetails: data.application.securitydetails,
      securitydescription: data.application.securitydescription,
      value: data.application.value,
      contribution: data.application.contribution,
      createdby: user.userName,
      amountdisbursed: data.facility?.amountdisbursed,
      outstanding: data.facility?.outstanding,
      profitrateexist: data.facility?.exprofitrate,
      totalprofit: data.facility?.totalprofit,
      maturitydate: data.facility?.maturitydate,
      monthlyinstallmentexist: data.facility?.exmonthlyinstallment,
      facilitytype: data.facility?.facilityType,
      bank: data.facility?.bank,
      status: data.application.status,
      statuscheck: data.application.checkstatus,
      type: data.application.filetype,
      yearrate: data.application.rateyear,
      year: data.application.years,
    });

    setYears(data.application.years);
    setProfitAmount(data.application.profitamount);
    setRate(data.application.profitrate);
    checkApplicationHasCustomer(data);

    setTotalAmount(data.application.totalamount);

    if (data.facility?.facilityType === null) {
      setExistingFacility(true);
    } else {
      setExistingFacility(false);
    }

    setModal({ edit: true }, { add: false });
    setEditedId(id);
  };

  // Guarantor click

  const onguarantorClick = async (id) => {
    const Endpoint = `FullApplications/${id}`;
    const response = await instanceAxios.get(Endpoint);
    const data = response.data;
    setSelectedCustomers(data);
    // console.log(data.application.customers);
    setGuarantorForm({
      applicationid: data.application.id,
    });

    setModal({ guarantor: true });
    setEditedId(id);
  };
  // Changing state value when searching name
  useEffect(() => {
    fetchdata();
    getCustomers();
    getApplications();
    resetForm();
  }, []);

  /// Search data

  useEffect(() => {
    const result = data.filter((item) => {
      return item.phone.toLowerCase().match(search.toLocaleLowerCase());
    });
    setFilter(result);
  }, [search]);

  // submit function to add a new item

  const onFormSubmit = async (submitData) => {
    setLoading(true);
    const array = [{ id: 1 }, { id: 2 }];
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
      statuscheck,
      type,
      amountdisbursed,
      outstanding,
      profitrateexist,
      totalprofit,
      maturitydate,
      monthlyinstallmentexist,
      bank,
    } = submitData;

    // console.log(submitData);
    try {
      const arraydata = [];
      selected.forEach((item) => arraydata.push(item.id));
      const data = {
        purpose: purposeValue,
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
        CustomersList: arraydata,
        contribution: contribution,
        createdby: user.userName,
        amountdisbursed: amountdisbursed,
        outstanding: outstanding,
        profitrateexist: profitrateexist,
        totalprofit: totalprofit,
        maturitydate: maturitydate,
        monthlyinstallmentexist: monthlyinstallmentexist,
        facilitytype: submitData.facilitytype,
        bank: bank,
        checkstatus: submitData.statuscheck,
        filetype: submitData.type,
        rateyear: rate,
        years: years,
        phone: submitData.phone,
      };

      const RoleRes = await instanceAxios
        .post("IndividualApp", data, {
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        })
        .then((response) => {
          console.log(response.data);
        });

      CustomToast("Successfully Added", false, "success");
      resetForm();
      setLoading(false);
      console.log(data);
    } catch (error) {
      setLoading(false);
      // 401, 403, 400
      if (isAxiosError(error)) {
        const { response, status } = error;

        if (response.data.detail === "Duplicate Entery") CustomToast(response.data.detail, false, "error");

        console.log(response.status, response.data);

        console.log(response.data);

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

  // Submit guarantor
  const onFormGuarantor = async (submitData) => {
    try {
      setLoading(true);
      const data = {
        name: submitData.name,
        eabAccount: submitData.EABAccount,
        bankname: submitData.bankname,
        otheraccount: submitData.otheraccount,
        fulladdress: submitData.fulladdress,
        telphone: submitData.telphone,
        outstanding: submitData.outstanding,
        installment: submitData.installment,
        maturatiydate: submitData.maturatiydate,
        applicationid: submitData.applicationid,
        relationship: submitData.relationship,
      };

      const RoleRes = await instanceAxios.post("Guarantor", data).then((response) => {
        console.log(response.data);
      });

      CustomToast("Successfully Added", false, "success");
      resetForm();

      console.log(data);
    } catch (error) {
      setLoading(false);
      // 401, 403, 400
      if (isAxiosError(error)) {
        const { response, status } = error;

        if (response.data.detail === "Duplicate Entery") CustomToast(response.data.detail, false, "error");

        console.log(response.status, response.data);

        console.log(response.data);

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
    setModal({ guarantor: false }, { add: false });
  };
  var fromdate = moment(rangeStart).format("YYYY-MM-DD");
  var todate = moment(rangeEnd).format("YYYY-MM-DD");

  // onChange function for searching name

  // Change Page

  // function to toggle the search option

  const { errors, register, handleSubmit, setValue } = useForm();

  const options = customers.map(function (item) {
    return <option value={item.id}>{item.name}</option>;
  });

  // Set Profit Rate and Profit amount

  // Set Profit Amount

  // Set Total amount

  // Set Monthly Installment

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };

  const Changeinstallment = (e) => {
    const installment = totalamount / e.target.value;

    console.log(dbr);
    setInstallment(installment.toFixed(2));
  };
  const selectedHandler = (id) => {
    let newSelected = [...selected];

    if (selected.find((e) => e.id === id)) {
      newSelected = selected.filter((p) => p.id !== id);
    } else {
      var find = customers.find((e) => e.id === id);
      newSelected.push(find);
    }

    setSelected(newSelected);
  };

  const checkApplicationHasCustomer = (data) => {
    if (selectedcustomers == null) {
      setSelected([]);
      return;
    }

    let newlist = [...selected];

    data.application?.customers?.forEach((p) => {
      newlist.push(p);
    });

    setSelected([...newlist]);
  };
  useEffect(() => {
    setSelected([]);
    setLoading(false);
  }, []);
  console.log(amount);
  return (
    <React.Fragment>
      <Head title="Personal Investments"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <div className="mt-4">
                <div className="row gy-4">
                  <Col md="4">
                    <DatePicker
                      selected={rangeStart}
                      onChange={setRangeStart}
                      // selectsStart
                      // startDate={rangeStart}
                      // endDate={rangeEnd}
                      wrapperClassName="start-m"
                      className="form-control"
                    />
                  </Col>

                  <Col md="4">
                    <DatePicker
                      selected={rangeEnd}
                      onChange={setRangeEnd}
                      // startDate={rangeStart}
                      // endDate={rangeEnd}
                      // selectsEnd
                      minDate={rangeStart}
                      wrapperClassName="end-m"
                      className="form-control"
                    />
                  </Col>
                  <Col size="4">
                    <Link to={`${process.env.PUBLIC_URL}/report-print/${fromdate}/${todate}`} target="_blank">
                      <Button color="primary">
                        <span>Export</span>
                      </Button>
                    </Link>
                  </Col>
                </div>
              </div>
              <br />
              <BlockDes className="text-soft">
                <BlockDes className="text-soft">You have total {data.length} that you have created.</BlockDes>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <ul className="nk-block-tools g-3">
                {user.role.name === "Relation Officer PI" && (
                  <li className="nk-block-tools-opt" onClick={() => setModal({ add: true })}>
                    <Button color="primary">
                      <Icon name="plus"></Icon>
                      <span>Add Application</span>
                    </Button>
                  </li>
                )}
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
                </div>
              </div>
              <div className="card-inner p-0">
                <DataTable
                  columns={columns}
                  data={filter}
                  pagination
                  subHeader
                  subHeaderComponent={
                    <input
                      type="text"
                      className="w-100 form-control"
                      placeholder="Search by customer's phone"
                      value={search}
                      onChange={(e) => SetSearch(e.target.value)}
                    />
                  }
                />
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
                {/* <MultiSelect options={[customers]} value={selected} onChange={setSelected} labelledBy="Select" /> */}
                <Col md="12">
                  <div className="form-control-wrap">
                    <select
                      className="form-control"
                      onChange={(e) => {
                        var value = Number(e.target.value);

                        selectedHandler(value);
                      }}
                    >
                      {customers.map((employee, index) => {
                        return <option value={employee.id}>{employee.name}</option>;
                      })}
                    </select>
                    {errors.account && <span className="invalid">{errors.purpose.message}</span>}
                  </div>
                </Col>

                {selected.map((item) => {
                  return (
                    <ul>
                      <li style={{ padding: 4 }}>
                        <Button color="primary" onClick={() => selectedHandler(item.id)}>
                          <span>{item.name}</span>
                          <Icon name="cross" />
                        </Button>
                      </li>
                    </ul>
                  );
                })}
                {selected.length > 0 ? (
                  <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">File Type</label>
                        <div className="form-control-wrap">
                          <select
                            name="type"
                            className="form-control"
                            value={filevaue}
                            onChange={(e) => setFileValue(e.target.value)}
                            ref={register({ required: "This field is required" })}
                          >
                            <option value={"Joint"}>Joint</option>
                            <option value={"Person"}>Person</option>
                          </select>
                        </div>
                      </FormGroup>
                    </Col>

                    <Col size="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="product-title">
                          Select Facility Type
                        </label>
                        <div className="form-control-wrap">
                          <select
                            className="form-control"
                            name="purpose"
                            defaultValue={purposeValue}
                            onChange={(e) => setPurposeValue(e.target.value)}
                            ref={register({ required: "This field is required" })}
                          >
                            <option value="Leased Assets">Leased Assets</option>
                            <option value="Migrated Ijara Leased Assets">Migrated Ijara Leased Assets</option>
                            <option value="Istisna under Construction">Istisna under Construction</option>
                            <option value="Murabaha Commodity Financing">Murabaha Commodity Financing</option>
                            <option value="Murabaha Commodity Financial Instit">
                              Murabaha Commodity Financial Instit
                            </option>
                            <option value="Collateral Financing project">Collateral Financing project</option>
                            <option value="Murabaha Commodity Fin Qtly Instit">
                              Murabaha Commodity Fin Qtly Instit{" "}
                            </option>
                            <option value="Murabaha Goods">Murabaha Goods</option>
                            <option value="SME Murabaha Goods Profit first MIG">
                              SME Murabaha Goods Profit first MIG
                            </option>
                            <option value="Murabaha Goods Migration">Murabaha Goods Migration</option>
                            <option value="Murabaha Vehicle Multiple Asset">Murabaha Vehicle Multiple Asset</option>
                            <option value="Murabaha Motor Vehicles">Murabaha Motor Vehicles</option>
                            <option value="Murabaha Goods Profit First">Murabaha Goods Profit First</option>
                            <option value="Real Estate Murabaha">Real Estate Murabaha</option>
                            <option value="Mudaraba">Mudaraba</option>
                            <option value="MUSAWAMAH FOR SALAM">MUSAWAMAH FOR SALAM</option>
                            <option value="Musharaka">Musharaka</option>
                            <option value="PARALLEL SALAM PRODUCT">PARALLEL SALAM PRODUCT</option>
                            <option value="QARD HASSAN">QARD HASSAN</option>
                            <option value="Salary Advance Financing">Salary Advance Financing</option>
                            <option value="SALAM PRODUCT">SALAM PRODUCT</option>
                            <option value="MURABAHA FOR SALAM">MURABAHA FOR SALAM</option>
                          </select>
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Customer Phone</label>
                        <input
                          type="number"
                          step="any"
                          name="phone"
                          placeholder="Enter Phone"
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
                        <label className="form-label">Amount</label>
                        <input
                          type="number"
                          step="any"
                          name="amount"
                          placeholder="Enter amount"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        {errors.amount && <span className="invalid">{errors.amount.message}</span>}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Yearly Rate</label>
                        <input
                          type="number"
                          name="rateyear"
                          step="any"
                          defaultValue={rate}
                          placeholder="Enter profit rate"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                          onChange={(e) => setRate(e.target.value)}
                        />
                        {errors.yearrate && <span className="invalid">{errors.yearrate.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Financing Period ( Yearly )</label>
                        <input
                          type="number"
                          name="years"
                          step="any"
                          defaultValue={years}
                          placeholder="Enter profit rate"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                          onChange={(e) => changeRate(e)}
                        />
                        {errors.years && <span className="invalid">{errors.years.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Profit Rate</label>
                        <input
                          type="number"
                          name="profitrate"
                          step="any"
                          placeholder="Enter profit rate"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                          defaultValue={profitrate}
                        />
                        {errors.profitrate && <span className="invalid">{errors.profitrate.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Profit Amount</label>
                        <input
                          type="number"
                          step="any"
                          name="profitamount"
                          defaultValue={profitamount}
                          placeholder="Enter profit amount"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                        />
                        {errors.profitamount && <span className="invalid">{errors.profitamount.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Total Amount</label>
                        <input
                          type="number"
                          name="totalamount"
                          step=".01"
                          defaultValue={totalamount}
                          placeholder="Enter total amount"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                        />
                        {errors.totalamount && <span className="invalid">{errors.totalamount.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Facility Period (In Moths) </label>
                        <input
                          type="number"
                          name="tenure"
                          placeholder="Enter facility period"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                          onChange={(e) => Changeinstallment(e)}
                        />
                        {errors.tenure && <span className="invalid">{errors.tenure.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Monthly Installment</label>
                        <input
                          type="number"
                          step=".01"
                          name="monthlyinstallment"
                          defaultValue={installment}
                          placeholder="Enter monthly installment"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                        />
                        {errors.monthlyinstallment && (
                          <span className="invalid">{errors.monthlyinstallment.message}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Source of Payment</label>
                        <input
                          type="text"
                          name="sourceofpayment"
                          placeholder="Enter security details"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                        />
                        {errors.sourceofpayment && <span className="invalid">{errors.sourceofpayment.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Security Details</label>
                        <input
                          type="text"
                          name="securitydetails"
                          placeholder="Enter security details"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                        />
                        {errors.securitydetails && <span className="invalid">{errors.securitydetails.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Security description</label>
                        <input
                          type="text"
                          name="securitydescription"
                          placeholder="Enter security description"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                        />
                        {errors.securitydescription && (
                          <span className="invalid">{errors.securitydescription.message}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Value</label>
                        <input
                          type="number"
                          step=".01"
                          name="value"
                          placeholder="Enter value"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                        />
                        {errors.value && <span className="invalid">{errors.value.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Status check:</label>
                        <input
                          type="text"
                          name="statuscheck"
                          placeholder="Enter value"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                        />
                        {errors.statuscheck && <span className="invalid">{errors.statuscheck.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Contribution</label>
                        <input
                          type="number"
                          name="contribution"
                          step=".01"
                          placeholder="Enter contribution"
                          className="form-control"
                          ref={register({
                            required: "This field is required",
                          })}
                        />
                        {errors.contribution && <span className="invalid">{errors.contribution.message}</span>}
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

                              setExistingFacility(!existingFacility);
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
                                defaultValue={facilityValue}
                                onChange={(e) => setFacilityValue(e.target.value)}
                                ref={register({ required: "This field is required" })}
                              >
                                <option value="Leased Assets">Leased Assets</option>
                                <option value="Migrated Ijara Leased Assets">Migrated Ijara Leased Assets</option>
                                <option value="Istisna under Construction">Istisna under Construction</option>
                                <option value="Murabaha Commodity Financing">Murabaha Commodity Financing</option>
                                <option value="Murabaha Commodity Financial Instit">
                                  Murabaha Commodity Financial Instit
                                </option>
                                <option value="Collateral Financing project">Collateral Financing project</option>
                                <option value="Murabaha Commodity Fin Qtly Instit">
                                  Murabaha Commodity Fin Qtly Instit{" "}
                                </option>
                                <option value="Murabaha Goods">Murabaha Goods</option>
                                <option value="SME Murabaha Goods Profit first MIG">
                                  SME Murabaha Goods Profit first MIG
                                </option>
                                <option value="Murabaha Goods Migration">Murabaha Goods Migration</option>
                                <option value="Murabaha Vehicle Multiple Asset">Murabaha Vehicle Multiple Asset</option>
                                <option value="Murabaha Motor Vehicles">Murabaha Motor Vehicles</option>
                                <option value="Murabaha Goods Profit First">Murabaha Goods Profit First</option>
                                <option value="Real Estate Murabaha">Real Estate Murabaha</option>
                                <option value="Mudaraba">Mudaraba</option>
                                <option value="MUSAWAMAH FOR SALAM">MUSAWAMAH FOR SALAM</option>
                                <option value="Musharaka">Musharaka</option>
                                <option value="PARALLEL SALAM PRODUCT">PARALLEL SALAM PRODUCT</option>
                                <option value="QARD HASSAN">QARD HASSAN</option>
                                <option value="Salary Advance Financing">Salary Advance Financing</option>
                                <option value="SALAM PRODUCT">SALAM PRODUCT</option>
                                <option value="MURABAHA FOR SALAM">MURABAHA FOR SALAM</option>
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
                            {loading ? <Spinner size="sm" color="light" /> : "Submit"}
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
                ) : (
                  <Alert className="alert-fill alert-icon" color="light">
                    <Icon name="alert-circle" />
                    Please select <strong>customers first</strong>.
                  </Alert>
                )}
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
                <Col md="12">
                  <div className="form-control-wrap">
                    <select
                      className="form-control"
                      onChange={(e) => {
                        var value = Number(e.target.value);

                        selectedHandler(value);
                      }}
                    >
                      <option value="">Select Customer</option>
                      {customers.map((employee, index) => {
                        return <option value={employee.id}>{employee.name}</option>;
                      })}
                    </select>
                    {errors.account && <span className="invalid">{errors.purpose.message}</span>}
                  </div>
                </Col>
                {selected.map((item) => {
                  return (
                    <ul>
                      <li style={{ padding: 4 }}>
                        <Button color="primary" onClick={() => selectedHandler(item.id)}>
                          <span>{item.name}</span>
                          <Icon name="cross" />
                        </Button>
                      </li>
                    </ul>
                  );
                })}

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
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">File Type</label>
                      <div className="form-control-wrap">
                        <select
                          name="type"
                          className="form-control"
                          defaultValue={formData.type}
                          onChange={(e) => setFileValue(e.target.value)}
                          ref={register({ required: "This field is required" })}
                        >
                          <option value={"Group"}>Group</option>
                          <option value={"Person"}>Person</option>
                        </select>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col size="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="product-title">
                        Select Facility Type
                      </label>
                      <div className="form-control-wrap">
                        <select
                          className="form-control"
                          name="purpose"
                          defaultValue={formData.purpose}
                          onChange={(e) => setPurposeValue(e.target.value)}
                          ref={register({ required: "This field is required" })}
                        >
                          <option value="Leased Assets">Leased Assets</option>
                          <option value="Migrated Ijara Leased Assets">Migrated Ijara Leased Assets</option>
                          <option value="Istisna under Construction">Istisna under Construction</option>
                          <option value="Murabaha Commodity Financing">Murabaha Commodity Financing</option>
                          <option value="Murabaha Commodity Financial Instit">
                            Murabaha Commodity Financial Instit
                          </option>
                          <option value="Collateral Financing project">Collateral Financing project</option>
                          <option value="Murabaha Commodity Fin Qtly Instit">
                            Murabaha Commodity Fin Qtly Instit{" "}
                          </option>
                          <option value="Murabaha Goods">Murabaha Goods</option>
                          <option value="SME Murabaha Goods Profit first MIG">
                            SME Murabaha Goods Profit first MIG
                          </option>
                          <option value="Murabaha Goods Migration">Murabaha Goods Migration</option>
                          <option value="Murabaha Vehicle Multiple Asset">Murabaha Vehicle Multiple Asset</option>
                          <option value="Murabaha Motor Vehicles">Murabaha Motor Vehicles</option>
                          <option value="Murabaha Goods Profit First">Murabaha Goods Profit First</option>
                          <option value="Real Estate Murabaha">Real Estate Murabaha</option>
                          <option value="Mudaraba">Mudaraba</option>
                          <option value="MUSAWAMAH FOR SALAM">MUSAWAMAH FOR SALAM</option>
                          <option value="Musharaka">Musharaka</option>
                          <option value="PARALLEL SALAM PRODUCT">PARALLEL SALAM PRODUCT</option>
                          <option value="QARD HASSAN">QARD HASSAN</option>
                          <option value="Salary Advance Financing">Salary Advance Financing</option>
                          <option value="SALAM PRODUCT">SALAM PRODUCT</option>
                          <option value="MURABAHA FOR SALAM">MURABAHA FOR SALAM</option>
                        </select>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Customer Phone</label>
                      <input
                        type="number"
                        step="any"
                        name="phone"
                        defaultValue={formData.phone}
                        placeholder="Enter Phone"
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
                      <label className="form-label">Amount</label>
                      <input
                        type="number"
                        step="any"
                        name="amount"
                        placeholder="Enter amount"
                        defaultValue={formData.amount}
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      {errors.amount && <span className="invalid">{errors.amount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Years Rate (e.g)7.5</label>
                      <input
                        type="number"
                        name="profitrate"
                        step="any"
                        defaultValue={formData.yearrate}
                        placeholder="Enter profit rate"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                        onChange={(e) => setRate(e.target.value)}
                      />
                      {errors.profitrate && <span className="invalid">{errors.profitrate.message}</span>}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Financing Period ( Years e.g 3 years )</label>
                      <input
                        type="number"
                        defaultValue={years}
                        name="profitrate"
                        step="any"
                        placeholder="Enter profit rate"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                        onChange={(e) => changeRate(e)}
                      />
                      {errors.rate && <span className="invalid">{errors.rate.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Profit Rate</label>
                      <input
                        type="number"
                        name="profitrate"
                        step="any"
                        placeholder="Enter profit rate"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                        defaultValue={formData.profitrate}
                      />
                      {errors.profitrate && <span className="invalid">{errors.profitrate.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Profit Amount</label>
                      <input
                        type="number"
                        step="any"
                        name="profitamount"
                        defaultValue={profitamount}
                        placeholder="Enter profit amount"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.profitamount && <span className="invalid">{errors.profitamount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Total Amount</label>
                      <input
                        type="number"
                        name="totalamount"
                        step=".01"
                        defaultValue={totalamount}
                        placeholder="Enter total amount"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.totalamount && <span className="invalid">{errors.totalamount.message}</span>}
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
                      <label className="form-label">Status check:</label>
                      <input
                        type="text"
                        name="statuscheck"
                        defaultValue={formData.statuscheck}
                        placeholder="Enter value"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.statuscheck && <span className="invalid">{errors.statuscheck.message}</span>}
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
                          {loading ? <Spinner size="sm" color="light" /> : "Update"}
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
          isOpen={modal.guarantor}
          toggle={() => setModal({ guarantor: false })}
          className="modal-dialog-centered"
          size="lg"
        >
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
              <h5 className="title">Guarantor Details Form</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormGuarantor)}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Application ID</label>
                      <input
                        type="text"
                        name="applicationid"
                        placeholder="Enter Full Name"
                        defaultValue={guarantorform.applicationid}
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.applicationid && <span className="invalid">{errors.applicationid.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter Full Name"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Telphone</label>
                      <input
                        type="text"
                        name="telphone"
                        placeholder="Enter Telphone"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.telphone && <span className="invalid">{errors.telphone.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Relationship</label>
                      <input
                        type="text"
                        name="relationship"
                        placeholder="Enter Relationship"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.relationship && <span className="invalid">{errors.relationship.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">East Africa Bank Account</label>
                      <input
                        type="text"
                        name="EABAccount"
                        defaultValue={guarantorform.EABAccount}
                        placeholder="Enter East Africa Bank Account is exists"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.EABAccount && <span className="invalid">{errors.EABAccount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Other Bank Name</label>
                      <input
                        type="text"
                        name="bankname"
                        defaultValue={guarantorform.bankname}
                        placeholder="Enter other bank name if it exists"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.bankname && <span className="invalid">{errors.bankname.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Account Number From Other Bank</label>
                      <input
                        type="text"
                        name="otheraccount"
                        defaultValue={guarantorform.otheraccount}
                        placeholder="Enter other account number"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.otheraccount && <span className="invalid">{errors.otheraccount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Full Address</label>
                      <input
                        type="text"
                        name="fulladdress"
                        defaultValue={guarantorform.fulladdress}
                        placeholder="Enter full address"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.fulladdress && <span className="invalid">{errors.fulladdress.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Outstanding</label>
                      <input
                        type="text"
                        name="outstanding"
                        defaultValue={guarantorform.outstanding}
                        placeholder="Enter outstanding if it exists"
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
                      <label className="form-label">Installment</label>
                      <input
                        type="text"
                        name="installment"
                        defaultValue={guarantorform.installment}
                        placeholder="Enter monthly installment"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.installment && <span className="invalid">{errors.installment.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Maturity Date</label>
                      <input
                        type="date"
                        name="maturatiydate"
                        defaultValue={guarantorform.maturatiydate}
                        placeholder="Enter security details"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.maturatiydate && <span className="invalid">{errors.maturatiydate.message}</span>}
                    </FormGroup>
                  </Col>

                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          {loading ? <Spinner size="sm" color="light" /> : "Submit"}
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
      </Content>
    </React.Fragment>
  );
};
export default InvoiceList;
