import React, { useContext, useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import DatePicker from "react-datepicker";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Progress,
  FormGroup,
  ModalBody,
  Modal,
  DropdownItem,
  Form,
} from "reactstrap";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Icon,
  Button,
  Col,
  UserAvatar,
  PaginationComponent,
  PreviewAltCard,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  RSelect,
} from "../../../components/Component";
import { projectData, teamList } from "./ProjectData";
import { findUpper, setDeadline, setDeadlineDays, calcPercentage } from "../../../utils/Utils";
import { useForm } from "react-hook-form";
import axios, { AxiosError, isAxiosError } from "axios";
import instanceAxios from "../../../utils/AxiosSetup";

import { CustomToast } from "../../../utils/CustomToast";
export const CustomersList = () => {
  const [sm, updateSm] = useState(false);
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [editId, setEditedId] = useState();
  const [data, setData] = useState(projectData);
  const [genderValue, setGenderValue] = useState("");
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    account: "",
    employmenttype: "",
    employer: "",
    position: "",
    homeaddress: "",
    mobile: "",
    netmonthsalary: "",
    datejoining: "",
    preemployer: "",
    otherincome: "",
    salarycrediteab: "",
    citizenship: "",
    otherbanks: "",
    eabopenedaccount: "",
    liabilities: "",
    gender: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const getcustomers = async () => {
    try {
      const customers = await instanceAxios.get("Customer");

      setData(customers.data);
    } catch (e) {
      console.log(e);
    }
  };

  // submit function to add a new item
  const onFormSubmit = async (submitData) => {
    const {
      name,
      account,
      employmenttype,
      employer,
      position,
      homeaddress,
      mobile,
      netmonthsalary,
      datejoining,
      preemployer,
      otherincome,
      salarycrediteab,
      citizenship,
      otherbanks,
      eabopenedaccount,
      liabilities,
      gender,
    } = submitData;
    console.log(submitData);
    try {
      const RoleRes = await instanceAxios.post("Customer", {
        name: name,
        account: account,
        employmenttype: submitData.employementtype,
        employer: employer,
        position: position,
        homeaddress: homeaddress,
        mobile: mobile,
        netmonthsalary: netmonthsalary,
        datejoining: datejoining,
        preemployer: preemployer,
        otherincome: otherincome,
        salarycrediteab: salarycrediteab,
        citizenship: citizenship,
        otherbanks: otherbanks,
        eabopenedaccount: eabopenedaccount,
        liabilities: liabilities,
        gender: gender,
      });

      const { data } = RoleRes;
      // 200 Data

      if (data.name) CustomToast("Successfully Added", false, "success");
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
      id: data.length + 1,
      name: name,
      account: account,
      employmenttype: employmenttype,
      employer: employer,
      position: position,
      homeaddress: homeaddress,
      mobile: mobile,
      netmonthsalary: netmonthsalary,
      datejoining: datejoining,
      preemployer: preemployer,
      otherincome: otherincome,
      salarycrediteab: salarycrediteab,
      citizenship: citizenship,
      otherbanks: otherbanks,
      eabopenedaccount: eabopenedaccount,
      liabilities: liabilities,
      gender: gender,
    };
    setData([submittedData, ...data]);
    resetForm();
    setModal({ edit: false }, { add: false });
  };

  // submit function to update a new item
  const onEditSubmit = async (sData) => {
    const {
      id,
      name,
      account,
      employmenttype,
      employer,
      position,
      homeaddress,
      mobile,
      netmonthsalary,
      datejoining,
      preemployer,
      otherincome,
      salarycrediteab,
      citizenship,
      otherbanks,
      eabopenedaccount,
      liabilities,
      gender,
    } = sData;
    console.log(sData);
    try {
      const RoleRes = await instanceAxios.put("Customer", {
        id: id,
        name: name,
        account: account,
        employmenttype: employmenttype,
        employer: employer,
        position: position,
        homeaddress: homeaddress,
        mobile: mobile,
        netmonthsalary: netmonthsalary,
        datejoining: datejoining,
        preemployer: preemployer,
        otherincome: otherincome,
        salarycrediteab: salarycrediteab,
        citizenship: citizenship,
        otherbanks: otherbanks,
        eabopenedaccount: eabopenedaccount,
        liabilities: liabilities,
        gender: gender,
      });

      const { data } = RoleRes;
      // 200 Data

      if (data.name) CustomToast("Successfully Updated", false, "success");
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

    let submittedData;
    let newitems = data;
    newitems.forEach((item) => {
      if (item.id === editId) {
        submittedData = {
          id: item.id,
          name: name,
          account: account,
          employmenttype: employmenttype,
          employer: employer,
          position: position,
          homeaddress: homeaddress,
          mobile: mobile,
          netmonthsalary: netmonthsalary,
          datejoining: datejoining,
          preemployer: preemployer,
          otherincome: otherincome,
          salarycrediteab: salarycrediteab,
          citizenship: citizenship,
          otherbanks: otherbanks,
          eabopenedaccount: eabopenedaccount,
          liabilities: liabilities,
          gender: gender,
        };
      }
    });
    let index = newitems.findIndex((item) => item.id === editId);
    newitems[index] = submittedData;
    resetForm();
    setModal({ edit: false });
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        setFormData({
          id: item.id,
          name: item.name,
          account: item.account,
          employmenttype: item.employmenttype,
          employer: item.employer,
          position: item.position,
          homeaddress: item.homeaddress,
          mobile: item.mobile,
          netmonthsalary: item.netmonthsalary,
          datejoining: item.datejoining,
          preemployer: item.preemployer,
          otherincome: item.otherincome,
          salarycrediteab: item.salarycrediteab,
          citizenship: item.citizenship,
          otherbanks: item.otherbanks,
          eabopenedaccount: item.eabopenedaccount,
          liabilities: item.liabilities,
          gender: item.gender,
        });
        setModal({ edit: true }, { add: false });
        setEditedId(id);
      }
    });
  };

  // function to change the complete a project property
  const completeProject = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].deadline = setDeadline(0);
    setData([...newData]);
  };

  // function to change the check property of an item
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.checked = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // function to change the complete property of an item
  const selectorCompleteProject = () => {
    let newData;
    newData = data.map((item) => {
      if (item.checked === true) item.deadline = setDeadline(0);
      return item;
    });
    setData([...newData]);
  };

  // function to delete the seletected item
  const selectorDeleteProject = () => {
    let newData;
    newData = data.filter((item) => item.checked !== true);
    setData([...newData]);
  };

  // function to change the check property of selected item
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].checked = e.currentTarget.checked;
    setData([...newData]);
  };

  // unselects the data on mount
  useEffect(() => {
    getcustomers();
    // let newData;
    /*  newData = userData.map((item) => {
      item.checked = false;
      return item;
    });*/
    // setData([...newData]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Project List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Customers</BlockTitle>
              <BlockDes className="text-soft">You have total {data.length} customers</BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="dropdown-toggle btn btn-white btn-dim btn-outline-light">
                          <Icon name="filter-alt" className="d-none d-sm-inline"></Icon>
                          <span>Filtered By</span>
                          <Icon name="chevron-right" className="dd-indc"></Icon>
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>Open</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>Closed</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>Onhold</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li className="nk-block-tools-opt" onClick={() => setModal({ add: true })}>
                      <Button color="primary">
                        <Icon name="plus"></Icon>
                        <span>Add Customer</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <div className="nk-tb-list is-separate nk-tb-ulist">
            <DataTableHead className="nk-tb-item nk-tb-head">
              <DataTableRow className="nk-tb-col-check">
                <div className="custom-control custom-control-sm custom-checkbox notext">
                  <input
                    type="checkbox"
                    className="custom-control-input form-control"
                    id="pid-all"
                    onChange={(e) => selectorCheck(e)}
                  />
                  <label className="custom-control-label" htmlFor="pid-all"></label>
                </div>
              </DataTableRow>
              <DataTableRow>
                <span className="sub-text">Customer Name</span>
              </DataTableRow>
              <DataTableRow size="xxl">
                <span className="sub-text">Account</span>
              </DataTableRow>
              <DataTableRow size="lg">
                <span className="sub-text">Type of Employment</span>
              </DataTableRow>
              <DataTableRow size="lg">
                <span className="sub-text">Employer</span>
              </DataTableRow>
              <DataTableRow size="lg">
                <span className="sub-text">Possition</span>
              </DataTableRow>
              <DataTableRow size="lg">
                <span className="sub-text">Mobile</span>
              </DataTableRow>
              <DataTableRow className="nk-tb-col-tools text-right">
                <UncontrolledDropdown>
                  <DropdownToggle tag="a" className="btn btn-xs btn-trigger btn-icon dropdown-toggle mr-n1">
                    <Icon name="more-h"></Icon>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <ul className="link-list-opt no-bdr">
                      <li onClick={() => selectorCompleteProject()}>
                        <DropdownItem
                          tag="a"
                          href="#markasdone"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                        >
                          <Icon name="check-round-cut"></Icon>
                          <span>Mark As Done</span>
                        </DropdownItem>
                      </li>
                      <li onClick={() => selectorDeleteProject()}>
                        <DropdownItem
                          tag="a"
                          href="#remove"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                        >
                          <Icon name="trash"></Icon>
                          <span>Remove Projects</span>
                        </DropdownItem>
                      </li>
                    </ul>
                  </DropdownMenu>
                </UncontrolledDropdown>
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
                            defaultChecked={item.checked}
                            id={item.id + "pid-all"}
                            key={Math.random()}
                            onChange={(e) => onSelectChange(e, item.id)}
                          />
                          <label className="custom-control-label" htmlFor={item.id + "pid-all"}></label>
                        </div>
                      </DataTableRow>
                      <DataTableRow>
                        <a
                          href="#title"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                          className="project-title"
                        >
                          <div className="project-info">
                            <h6 className="title">{item.name}</h6>
                          </div>
                        </a>
                      </DataTableRow>
                      <DataTableRow size="xxl">
                        <span>{item.account}</span>
                      </DataTableRow>
                      <DataTableRow size="lg">
                        <span>{item.employmenttype}</span>
                      </DataTableRow>
                      <DataTableRow size="lg">
                        <span>{item.employer}</span>
                      </DataTableRow>
                      <DataTableRow size="lg">
                        <span>{item.position}</span>
                      </DataTableRow>
                      <DataTableRow size="lg">
                        <span>{item.mobile}</span>
                      </DataTableRow>
                      <DataTableRow className="nk-tb-col-tools text-right">
                        <ul className="nk-tb-actions gx-1">
                          <li>
                            <UncontrolledDropdown>
                              <DropdownToggle tag="a" className="text-soft dropdown-toggle btn btn-icon btn-trigger">
                                <Icon name="more-h"></Icon>
                              </DropdownToggle>
                              <DropdownMenu right>
                                <ul className="link-list-opt no-bdr">
                                  <li onClick={() => onEditClick(item.id)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#edit"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="edit"></Icon>
                                      <span>Edit</span>
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
          </div>
          <PreviewAltCard>
            {data.length > 0 ? (
              <PaginationComponent
                itemPerPage={itemPerPage}
                totalItems={data.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            ) : (
              <div className="text-center">
                <span className="text-silent">No projects found</span>
              </div>
            )}
          </PreviewAltCard>
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
              <h5 className="title">Add Customer</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={formData.name}
                        placeholder="Enter Fullname"
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
                      <label className="form-label">Account</label>
                      <input
                        type="text"
                        name="account"
                        defaultValue={formData.account}
                        placeholder="Enter account"
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
                      <label className="form-label">Employment Type</label>
                      <input
                        type="text"
                        name="employementtype"
                        defaultValue={formData.employementtype}
                        placeholder="Enter employment type"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.employmenttype && <span className="invalid">{errors.employmenttype.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Employer </label>
                      <input
                        type="text"
                        name="employer"
                        defaultValue={formData.employer}
                        placeholder="Enter employer"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.employer && <span className="invalid">{errors.employer.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Possition</label>
                      <input
                        type="text"
                        name="position"
                        defaultValue={formData.position}
                        placeholder="Enter possition"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.position && <span className="invalid">{errors.position.message}</span>}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Home Address</label>
                      <input
                        type="text"
                        name="homeaddress"
                        defaultValue={formData.homeaddress}
                        placeholder="Enter home address"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.homeaddress && <span className="invalid">{errors.homeaddress.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Mobile</label>
                      <input
                        type="text"
                        name="mobile"
                        defaultValue={formData.mobile}
                        placeholder="Enter mobile"
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
                      <label className="form-label">Net month salary</label>
                      <input
                        type="text"
                        name="netmonthsalary"
                        defaultValue={formData.netmonthsalary}
                        placeholder="Enter net month salary"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.netmonthsalary && <span className="invalid">{errors.netmonthsalary.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Date Joining</label>
                      <input
                        type="date"
                        name="datejoining"
                        defaultValue={formData.datejoining}
                        placeholder="Enter net month salary"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.datejoining && <span className="invalid">{errors.datejoining.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Previous Employer</label>
                      <input
                        type="text"
                        name="preemployer"
                        defaultValue={formData.preemployer}
                        placeholder="Enter previous employer"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.preemployer && <span className="invalid">{errors.preemployer.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Other Income</label>
                      <input
                        type="text"
                        name="otherincome"
                        defaultValue={formData.otherincome}
                        placeholder="Enter other income"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.otherincome && <span className="invalid">{errors.otherincome.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Salary Credit EAB</label>
                      <input
                        type="text"
                        name="salarycrediteab"
                        defaultValue={formData.salarycrediteab}
                        placeholder="Enter mobile"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.salarycrediteab && <span className="invalid">{errors.salarycrediteab.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Citizenship</label>
                      <input
                        type="text"
                        name="citizenship"
                        defaultValue={formData.citizenship}
                        placeholder="Enter citizenship"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.citizenship && <span className="invalid">{errors.citizenship.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Other Banks</label>
                      <input
                        type="text"
                        name="otherbanks"
                        defaultValue={formData.otherbanks}
                        placeholder="Enter mobile"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.otherbanks && <span className="invalid">{errors.otherbanks.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Date Opened EAB Account</label>
                      <input
                        type="date"
                        name="eabopenedaccount"
                        defaultValue={formData.eabopenedaccount}
                        placeholder="Enter mobile"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.eabopenedaccount && <span className="invalid">{errors.eabopenedaccount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Liabilities</label>
                      <input
                        type="text"
                        name="liabilities"
                        defaultValue={formData.liabilities}
                        placeholder="Enter liabilities"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.liabilities && <span className="invalid">{errors.liabilities.message}</span>}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Gender</label>
                      <div className="form-control-wrap">
                        <select
                          name="gender"
                          className="form-control"
                          value={genderValue}
                          onChange={(e) => setGenderValue(e.target.value)}
                          ref={register({ required: "This field is required" })}
                        >
                          <option value={"Male"}>Male</option>
                          <option value={"Female"}>Female</option>
                        </select>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Add Project
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
              <h5 className="title">Update Customer Record</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Customer ID</label>
                      <input
                        type="text"
                        name="id"
                        defaultValue={formData.id}
                        placeholder="Enter ID"
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
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={formData.name}
                        placeholder="Enter Fullname"
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
                      <label className="form-label">Account</label>
                      <input
                        type="text"
                        name="account"
                        defaultValue={formData.account}
                        placeholder="Enter account"
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
                      <label className="form-label">Employment Type</label>
                      <input
                        type="text"
                        name="employmenttype"
                        defaultValue={formData.employmenttype}
                        placeholder="Enter employment type"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.employmenttype && <span className="invalid">{errors.employmenttype.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Employer </label>
                      <input
                        type="text"
                        name="employer"
                        defaultValue={formData.employer}
                        placeholder="Enter employer"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.employer && <span className="invalid">{errors.employer.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Possition</label>
                      <input
                        type="text"
                        name="position"
                        defaultValue={formData.position}
                        placeholder="Enter possition"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.position && <span className="invalid">{errors.position.message}</span>}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Home Address</label>
                      <input
                        type="text"
                        name="homeaddress"
                        defaultValue={formData.homeaddress}
                        placeholder="Enter home address"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.homeaddress && <span className="invalid">{errors.homeaddress.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Mobile</label>
                      <input
                        type="text"
                        name="mobile"
                        defaultValue={formData.mobile}
                        placeholder="Enter mobile"
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
                      <label className="form-label">Net month salary</label>
                      <input
                        type="text"
                        name="netmonthsalary"
                        defaultValue={formData.netmonthsalary}
                        placeholder="Enter net month salary"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.netmonthsalary && <span className="invalid">{errors.netmonthsalary.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Date Joining</label>
                      <input
                        type="date"
                        name="datejoining"
                        defaultValue={formData.datejoining}
                        placeholder="Enter net month salary"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.datejoining && <span className="invalid">{errors.datejoining.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Previous Employer</label>
                      <input
                        type="text"
                        name="preemployer"
                        defaultValue={formData.preemployer}
                        placeholder="Enter previous employer"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.preemployer && <span className="invalid">{errors.preemployer.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Other Income</label>
                      <input
                        type="text"
                        name="otherincome"
                        defaultValue={formData.otherincome}
                        placeholder="Enter other income"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.otherincome && <span className="invalid">{errors.otherincome.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Salary Credit EAB</label>
                      <input
                        type="text"
                        name="salarycrediteab"
                        defaultValue={formData.salarycrediteab}
                        placeholder="Enter mobile"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.salarycrediteab && <span className="invalid">{errors.salarycrediteab.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Citizenship</label>
                      <input
                        type="text"
                        name="citizenship"
                        defaultValue={formData.citizenship}
                        placeholder="Enter citizenship"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.citizenship && <span className="invalid">{errors.citizenship.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Other Banks</label>
                      <input
                        type="text"
                        name="otherbanks"
                        defaultValue={formData.otherbanks}
                        placeholder="Enter mobile"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.otherbanks && <span className="invalid">{errors.otherbanks.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Date Opened EAB Account</label>
                      <input
                        type="date"
                        name="eabopenedaccount"
                        defaultValue={formData.eabopenedaccount}
                        placeholder="Enter mobile"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.eabopenedaccount && <span className="invalid">{errors.eabopenedaccount.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Liabilities</label>
                      <input
                        type="text"
                        name="liabilities"
                        defaultValue={formData.liabilities}
                        placeholder="Enter liabilities"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.liabilities && <span className="invalid">{errors.liabilities.message}</span>}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Gender</label>
                      <div className="form-control-wrap">
                        <select
                          name="gender"
                          className="form-control"
                          value={genderValue}
                          onChange={(e) => setGenderValue(e.target.value)}
                          ref={register({ required: "This field is required" })}
                        >
                          <option value={"Male"}>Male</option>
                          <option value={"Female"}>Female</option>
                        </select>
                      </div>
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
      </Content>
    </React.Fragment>
  );
};

export default CustomersList;
