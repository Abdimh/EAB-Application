import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  BlockDes,
  Icon,
  Row,
  Col,
  Button,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
} from "../../../components/Component";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Badge } from "reactstrap";
import { productData, categoryOptions } from "./ProductData";
import SimpleBar from "simplebar-react";
import { useForm } from "react-hook-form";
import ProductH from "../../../images/product/h.png";
import Dropzone from "react-dropzone";
import { Modal, ModalBody } from "reactstrap";
import { RSelect } from "../../../components/Component";
import axios, { AxiosError, isAxiosError } from "axios";
import instanceAxios from "../../../utils/AxiosSetup";

import { CustomToast } from "../../../utils/CustomToast";
const ApplicationsList = () => {
  const [data, setData] = useState(productData);
  const [sm, updateSm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerValue, setCustomerValue] = useState("");
  const [user, setUser] = useState({
    expireIn: Number,
    expireTimeStamp: String,
    fullname: String,
    role: { id: Number, name: String },
    token: String,
    userName: String,
  });
  const [formData, setFormData] = useState({
    customerid: 0,
    purpose: "",
    amount: 0,
    tenur: 0,
    contribution: "",
    profitrate: "",
    profitamount: "",
    totalamount: "",
    monthlyinstallment: "",
    sourceofpayment: "",
    securitydetails: "",
    securitydescription: "",
    value: "",
    status: "Purposed",
  });
  const [editId, setEditedId] = useState();
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const [files, setFiles] = useState([]);
  const [row, setRows] = useState({});

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = productData.filter((item) => {
        return item.sku.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...productData]);
    }
  }, [onSearchText]);

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // category change
  const onCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      img: null,
      sku: "",
      price: 0,
      stock: 0,
      category: [],
      fav: false,
      check: false,
    });
    reset({});
  };

  const onFormSubmit = async (form) => {
    const {
      customerid,
      purpose,
      amount,
      tenur,
      contribution,
      profitrate,
      profitamount,
      totalamount,
      monthlyinstallment,
      sourceofpayment,
      securitydetails,
      securitydescription,
      value,
    } = form;

    try {
      const RoleRes = await instanceAxios.post("IndividualApp", {
        customerid: customerid,
        purpose: purpose,
        amount: amount,
        tenur: tenur,
        contribution: contribution,
        profitrate: profitrate,
        profitamount: profitamount,
        totalamount: totalamount,
        monthlyinstallment: monthlyinstallment,
        sourceofpayment: sourceofpayment,
        securitydetails: securitydetails,
        securitydescription: securitydescription,
        value: value,
        status: "Purposed",
      });

      const { data } = RoleRes;
      // 200 Data

      CustomToast("Successfully Added", false, "success");
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

    let submittedData = {
      customerid: customerid,
      purpose: purpose,
      amount: amount,
      tenur: tenur,
      contribution: contribution,
      profitrate: profitrate,
      profitamount: profitamount,
      totalamount: totalamount,
      monthlyinstallment: monthlyinstallment,
      sourceofpayment: sourceofpayment,
      securitydetails: securitydetails,
      securitydescription: securitydescription,
      value: value,
      status: "Purposed",
    };
    setData([submittedData, ...data]);
    setView({ open: false });
    setFiles([]);
    resetForm();
  };

  const onEditSubmit = () => {
    let submittedData;
    let newItems = data;
    let index = newItems.findIndex((item) => item.id === editId);

    newItems.forEach((item) => {
      if (item.id === editId) {
        submittedData = {
          id: editId,
          name: formData.name,
          img: files.length > 0 ? files[0].preview : item.img,
          sku: formData.sku,
          price: formData.price,
          stock: formData.stock,
          category: formData.category,
          fav: false,
          check: false,
        };
      }
    });
    newItems[index] = submittedData;
    //setData(newItems);
    resetForm();
    setView({ edit: false, add: false });
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        setFormData({
          purpose: item.purpose,
          amount: item.amount,
          tenur: item.tenur,
          contribution: item.contribution,
          profitrate: item.profitrate,
          profitamount: item.profitamount,
          totalamount: item.totalamount,
          monthlyinstallment: item.monthlyinstallment,
          sourceofpayment: item.sourceofpayment,
          securitydetails: item.securitydetails,
          securitydescription: item.securitydescription,
          value: item.value,
          status: item.status,
        });
      }
    });
    setEditedId(id);
    setFiles([]);
    setView({ add: false, edit: true });
  };

  // selects all the products
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.check = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // selects one product
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].check = e.currentTarget.checked;
    setData([...newData]);
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to delete a product
  const deleteProduct = (id) => {
    let defaultData = data;
    defaultData = defaultData.filter((item) => item.id !== id);
    setData([...defaultData]);
  };

  // function to delete the seletected item
  const selectorDeleteProduct = () => {
    let newData;
    newData = data.filter((item) => item.check !== true);
    setData([...newData]);
  };

  // toggle function to view product details
  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
      details: type === "details" ? true : false,
    });
  };

  // handles ondrop function of dropzone
  const handleDropChange = (acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
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

  const getApp = async (id) => {
    try {
      const Endpoint = `FullApplications/${id}`;
      const data = await instanceAxios.get(Endpoint);
      setRows(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getApplications = async () => {
    try {
      const data = await instanceAxios.get("IndividualApp");
      //console.log(data.data)
      setData(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchdata = () => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
    console.log(data);
  };

  useEffect(() => {
    getCustomers();
    getApplications();
    fetchdata();
  }, []);

  const options = customers.map(function (item) {
    return <option value={item.id}>{item.name}</option>;
  });
  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit, reset } = useForm();

  return (
    <React.Fragment>
      <Head title="Product List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Applications</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <a
                  href="#more"
                  className="btn btn-icon btn-trigger toggle-expand mr-n1"
                  onClick={(ev) => {
                    ev.preventDefault();
                    updateSm(!sm);
                  }}
                >
                  <Icon name="more-v"></Icon>
                </a>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right">
                          <Icon name="search"></Icon>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Quick search by SKU"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          color="transparent"
                          className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                        >
                          Status
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>New Items</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Featured</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Out of Stock</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li className="nk-block-tools-opt">
                      <Button
                        className="toggle btn-icon d-md-none"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                      </Button>
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                        <span>Add Application</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Card>
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <DataTableBody>
                  <DataTableHead>
                    <DataTableRow className="nk-tb-col-check">
                      <div className="custom-control custom-control-sm custom-checkbox notext">
                        <input
                          type="checkbox"
                          className="custom-control-input form-control"
                          id="uid_1"
                          onChange={(e) => selectorCheck(e)}
                        />
                        <label className="custom-control-label" htmlFor="uid_1"></label>
                      </div>
                    </DataTableRow>
                    <DataTableRow size="sm">
                      <span>Name</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Purpose</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Amount</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Profit Rate</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Profit Amount</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Total Amount</span>
                    </DataTableRow>

                    <DataTableRow className="nk-tb-col-tools">
                      <ul className="nk-tb-actions gx-1 my-n1">
                        <li className="mr-n1">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              tag="a"
                              href="#toggle"
                              onClick={(ev) => ev.preventDefault()}
                              className="dropdown-toggle btn btn-icon btn-trigger"
                            >
                              <Icon name="more-h"></Icon>
                            </DropdownToggle>
                            <DropdownMenu right>
                              <ul className="link-list-opt no-bdr">
                                <li>
                                  <DropdownItem tag="a" href="#edit" onClick={(ev) => ev.preventDefault()}>
                                    <Icon name="edit"></Icon>
                                    <span>Edit Selected</span>
                                  </DropdownItem>
                                </li>
                                <li>
                                  <DropdownItem
                                    tag="a"
                                    href="#remove"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      selectorDeleteProduct();
                                    }}
                                  >
                                    <Icon name="trash"></Icon>
                                    <span>Remove Selected</span>
                                  </DropdownItem>
                                </li>
                                <li>
                                  <DropdownItem tag="a" href="#stock" onClick={(ev) => ev.preventDefault()}>
                                    <Icon name="bar-c"></Icon>
                                    <span>Update Stock</span>
                                  </DropdownItem>
                                </li>
                                <li>
                                  <DropdownItem tag="a" href="#price" onClick={(ev) => ev.preventDefault()}>
                                    <Icon name="invest"></Icon>
                                    <span>Update Price</span>
                                  </DropdownItem>
                                </li>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                      </ul>
                    </DataTableRow>
                  </DataTableHead>
                  {currentItems.length > 0
                    ? currentItems.map((item) => {
                        return (
                          <DataTableItem key={item.id}>
                            <DataTableRow className="nk-tb-col-check">
                              <div className="custom-control custom-control-sm custom-checkbox notext">
                                <input
                                  type="checkbox"
                                  className="custom-control-input form-control"
                                  defaultChecked={item.check}
                                  id={item.id + "uid1"}
                                  key={Math.random()}
                                  onChange={(e) => onSelectChange(e, item.id)}
                                />
                                <label className="custom-control-label" htmlFor={item.id + "uid1"}></label>
                              </div>
                            </DataTableRow>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <span className="title">{item.customername}</span>
                              </span>
                            </DataTableRow>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <span className="title">{item.purpose}</span>
                              </span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">{item.amount}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">$ {item.profitrate}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">{item.profitamount}</span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">{item.totalamount}</span>
                            </DataTableRow>

                            <DataTableRow className="nk-tb-col-tools">
                              <ul className="nk-tb-actions gx-1 my-n1">
                                <li className="mr-n1">
                                  <UncontrolledDropdown>
                                    <DropdownToggle
                                      tag="a"
                                      href="#more"
                                      onClick={(ev) => ev.preventDefault()}
                                      className="dropdown-toggle btn btn-icon btn-trigger"
                                    >
                                      <Icon name="more-h"></Icon>
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                      <ul className="link-list-opt no-bdr">
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#edit"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              onEditClick(item.id);
                                              toggle("edit");
                                            }}
                                          >
                                            <Icon name="edit"></Icon>
                                            <span>Edit Product</span>
                                          </DropdownItem>
                                        </li>
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#view"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              getApp(item.id);
                                              toggle("details");
                                            }}
                                          >
                                            <Icon name="eye"></Icon>
                                            <span>View Product</span>
                                          </DropdownItem>
                                        </li>
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#remove"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              deleteProduct(item.id);
                                            }}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Remove Product</span>
                                          </DropdownItem>
                                        </li>
                                      </ul>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </li>
                              </ul>
                            </DataTableRow>
                          </DataTableItem>
                        );
                      })
                    : null}
                </DataTableBody>
                <div className="card-inner">
                  {data.length > 0 ? (
                    <PaginationComponent
                      itemPerPage={itemPerPage}
                      totalItems={data.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-silent">No products found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>

        <Modal isOpen={view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update Product</h5>
              <div className="mt-4">
                <form noValidate onSubmit={handleSubmit(onEditSubmit)}>
                  <Row className="g-3">
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="product-title">
                          Product Title
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            onChange={(e) => onInputChange(e)}
                            ref={register({
                              required: "This field is required",
                            })}
                            defaultValue={formData.purpose}
                          />
                          {errors.purpose && <span className="invalid">{errors.purpose.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="regular-price">
                          Regular Price
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            name="price"
                            ref={register({ required: "This is required" })}
                            className="form-control"
                            defaultValue={formData.amount}
                          />
                          {errors.amount && <span className="invalid">{errors.amount.message}</span>}
                        </div>
                      </div>
                    </Col>

                    <Col size="12">
                      <Button color="primary" type="submit">
                        <Icon className="plus"></Icon>
                        <span>Update Product</span>
                      </Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal isOpen={view.details} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="nk-modal-head">
              <h4 className="nk-modal-title title">Customer Details</h4>
            </div>
            <div className="nk-tnx-details mt-sm-3">
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="sub-text">Customer Name</span>
                  <span className="caption-text">{row.customername}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Address</span>
                  <span className="caption-text">{row.homeaddress}</span>
                </Col>

                <Col lg={6}>
                  <span className="sub-text">Phone</span>
                  <span className="caption-text"> {row.mobile}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Account</span>
                  <span className="caption-text">{row.account}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Employment Type</span>
                  <span className="caption-text"> {row.employmenttype}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Employer</span>
                  <span className="caption-text"> {row.employer}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Possition</span>
                  <span className="caption-text"> {row.position}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Salary</span>
                  <span className="caption-text"> {row.netmonthsalary}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Other Income</span>
                  <span className="caption-text"> {row.otherincome}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Citizenship</span>
                  <span className="caption-text"> {row.citizenship}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Liabilities</span>
                  <span className="caption-text"> {row.liabilities}</span>
                </Col>
              </Row>
            </div>
            <div className="nk-modal-head">
              <h4 className="nk-modal-title title">Application Details</h4>
            </div>
            <div className="nk-tnx-details mt-sm-3">
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="sub-text">Purpose</span>
                  <span className="caption-text">{row.customername}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Amount</span>
                  <span className="caption-text">{row.homeaddress}</span>
                </Col>

                <Col lg={6}>
                  <span className="sub-text">Profit Rate</span>
                  <span className="caption-text"> {row.mobile}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Total Profit</span>
                  <span className="caption-text">{row.account}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Employment Type</span>
                  <span className="caption-text"> {row.employmenttype}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Employer</span>
                  <span className="caption-text"> {row.employer}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Possition</span>
                  <span className="caption-text"> {row.position}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Salary</span>
                  <span className="caption-text"> {row.netmonthsalary}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Other Income</span>
                  <span className="caption-text"> {row.otherincome}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Citizenship</span>
                  <span className="caption-text"> {row.citizenship}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Liabilities</span>
                  <span className="caption-text"> {row.liabilities}</span>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>

        <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${
            view.add ? "content-active" : ""
          }`}
        >
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">New Application</BlockTitle>
              <BlockDes>
                <p>Financing Details.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3">
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
                <Col md="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="regular-price">
                      Purpose
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        name="purpose"
                        ref={register({ required: "This is required" })}
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.purpose}
                        className="form-control"
                      />
                      {errors.purpose && <span className="invalid">{errors.purpose.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="regular-price">
                      Amount
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        name="amount"
                        ref={register({ required: "This is required" })}
                        onChange={(e) => onInputChange(e)}
                        className="form-control"
                        defaultValue={formData.amount}
                      />
                      {errors.amount && <span className="invalid">{errors.amount.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="regular-price">
                      Tenure
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        name="tenur"
                        ref={register({ required: "This is required" })}
                        onChange={(e) => onInputChange(e)}
                        className="form-control"
                        defaultValue={formData.tenur}
                      />
                      {errors.tenur && <span className="invalid">{errors.tenur.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="regular-price">
                      Monthly Installment
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        name="monthlyinstallment"
                        ref={register({ required: "This is required" })}
                        onChange={(e) => onInputChange(e)}
                        className="form-control"
                        defaultValue={formData.monthlyinstallment}
                      />
                      {errors.monthlyinstallment && (
                        <span className="invalid">{errors.monthlyinstallment.message}</span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="regular-price">
                      Contrubution
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        name="contribution"
                        ref={register({ required: "This is required" })}
                        onChange={(e) => onInputChange(e)}
                        className="form-control"
                        defaultValue={formData.contribution}
                      />
                      {errors.contribution && <span className="invalid">{errors.contribution.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="regular-price">
                      Profit Rate
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        name="profitrate"
                        ref={register({ required: "This is required" })}
                        onChange={(e) => onInputChange(e)}
                        className="form-control"
                        defaultValue={formData.profitrate}
                      />
                      {errors.profitrate && <span className="invalid">{errors.profitrate.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="regular-price">
                      Profit Amount
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        name="profitamount"
                        ref={register({ required: "This is required" })}
                        onChange={(e) => onInputChange(e)}
                        className="form-control"
                        defaultValue={formData.profitamount}
                      />
                      {errors.profitamount && <span className="invalid">{errors.profitamount.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="sale-price">
                      Total Amount
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        className="form-control"
                        name="totalamount"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                        defaultValue={formData.totalamount}
                      />
                      {errors.totalamount && <span className="invalid">{errors.totalamount.message}</span>}
                    </div>
                  </div>
                </Col>

                <Col md="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="SKU">
                      Source of Payment
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="sourceofpayment"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                        defaultValue={formData.sourceofpayment}
                      />
                      {errors.sourceofpayment && <span className="invalid">{errors.sourceofpayment.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="SKU">
                      Security Details
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="securitydetails"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                        defaultValue={formData.securitydetails}
                      />
                      {errors.securitydetails && <span className="invalid">{errors.securitydetails.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="SKU">
                      Security Description
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="securitydescription"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                        defaultValue={formData.securitydescription}
                      />
                      {errors.securitydescription && (
                        <span className="invalid">{errors.securitydescription.message}</span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="SKU">
                      Value
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="value"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                        defaultValue={formData.value}
                      />
                      {errors.value && <span className="invalid">{errors.value.message}</span>}
                    </div>
                  </div>
                </Col>

                <Col size="12">
                  <Button color="primary" type="submit">
                    <Icon className="plus"></Icon>
                    <span>Submit</span>
                  </Button>
                </Col>
              </Row>
            </form>
          </Block>
        </SimpleBar>

        {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
      </Content>
    </React.Fragment>
  );
};

export default ApplicationsList;
