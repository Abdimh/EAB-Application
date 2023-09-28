import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  DropdownItem,
  Form,
} from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Col,
  UserAvatar,
  PaginationComponent,
  Button,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  TooltipComponent,
  RSelect,
  PreviewAltCard,
} from "../../../components/Component";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { filterStatus, userData } from "./UserData";
import { findUpper } from "../../../utils/Utils";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserContext } from "./UserContext";
import axios, { AxiosError, isAxiosError } from "axios";
import instanceAxios from "../../../utils/AxiosSetup";

import { CustomToast } from "../../../utils/CustomToast";
const UserList = () => {
  const { contextData } = useContext(UserContext);
  const [data, setData] = contextData;
  const [roles, setRoles] = useState([]);
  const [title, setTitles] = useState([]);
  const [sm, updateSm] = useState(false);
  const [onSearchText] = useState("");
  const [roleValue, setRoleValue] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [editId, setEditedId] = useState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "123456",
    phone: "",
    title: 0,
    role: 0,
    id: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);

  const getRoles = async () => {
    try {
      const data = await instanceAxios.get("Roles");
      //console.log(data.data)
      setRoles(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getTitles = async () => {
    try {
      const data = await instanceAxios.get("Titles");
      //console.log(data.data)
      setTitles(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getUsers = async () => {
    try {
      const data = await instanceAxios.get("Employee");
      //console.log(data.data)
      setData(data.data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  // unselects the data on mount
  useEffect(() => {
    let newData;
    newData = userData.map((item) => {
      item.checked = false;
      return item;
    });
    setData([...newData]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Changing state value when searching name
  useEffect(() => {
    getRoles();
    getTitles();
    getUsers();
    //  console.log(filterRole)
    if (onSearchText !== "") {
      const filteredObject = userData.filter((item) => {
        return (
          item.name.toLowerCase().includes(onSearchText.toLowerCase()) ||
          item.email.toLowerCase().includes(onSearchText.toLowerCase())
        );
      });
      setData([...filteredObject]);
    } else {
      setData([...userData]);
    }
  }, [onSearchText, setData]);

  // function to change the selected property of an item
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].checked = e.currentTarget.checked;
    setData([...newData]);
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      balance: "",
      phone: "",
      status: "Active",
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = async (submitData) => {
    const { name, email, phone, title, role, password } = submitData;
    console.log(submitData);
    try {
      const RoleRes = await instanceAxios.post("Employee", {
        name: name,
        email: email,
        phone: phone,
        password: password,
        title: title,
        role: role,
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
      title: title,
      name: name,
      email: email,
      phone: phone,
      role: role,
    };
    setData([submittedData, ...data]);
    resetForm();
    setModal({ edit: false }, { add: false });
  };

  // submit function to update a new item
  const onEditSubmit = async (submitData) => {
    const { id, name, email, phone, title, role, password } = submitData;
    console.log(submitData);
    try {
      const RoleRes = await instanceAxios.put("Employee", {
        id: id,
        name: name,
        email: email,
        phone: phone,
        password: password,
        title: title,
        role: role,
      });

      const { data } = RoleRes;
      // 200 Data

      if (data.title) CustomToast("Successfully Updated", false, "success");
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
          email: email,
          phone: phone,
          password: password,
          title: title,
          role: role,
        };
      }
    });
    let index = newitems.findIndex((item) => item.id === editId);
    newitems[index] = submittedData;
    setModal({ edit: false });
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        setFormData({
          name: item.name,
          email: item.email,
          title: item.titleid,
          role: item.roleid,
          phone: item.phone,
          id: item.id,
          password: item.password,
        });
        setModal({ edit: true }, { add: false });
        setEditedId(id);
      }
      console.log(item);
    });
  };

  // function to change to suspend property for an item
  const suspendUser = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].status = "Suspend";
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

  // function to delete the seletected item
  const selectorDeleteUser = () => {
    let newData;
    newData = data.filter((item) => item.checked !== true);
    setData([...newData]);
  };

  // function to change the complete property of an item
  const selectorSuspendUser = () => {
    let newData;
    newData = data.map((item) => {
      if (item.checked === true) item.status = "Suspend";
      return item;
    });
    setData([...newData]);
  };

  /*  const filterRole = roles.map(function (row) {
    return row;
});*/
  /*
const filterRole = [
  { value: roles.id, label:roles.name },
  { value: "seller", label: "Seller" },
  { value: "buyer", label: "Buyer" },
];
*/
  const options = roles.map(function (item) {
    return <option value={item.id}>{item.name}</option>;
  });

  const optionstitle = title.map(function (item) {
    return <option value={item.id}>{item.title}</option>;
  });

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit } = useForm();

  console.log(currentItems);
  return (
    <React.Fragment>
      <Head title="User List - Default"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Users Lists
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total 2,595 users.</p>
              </BlockDes>
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
                      <Button color="light" outline className="btn-white">
                        <Icon name="download-cloud"></Icon>
                        <span>Export</span>
                      </Button>
                    </li>
                    <li className="nk-block-tools-opt">
                      <Button color="primary" className="btn-icon" onClick={() => setModal({ add: true })}>
                        <Icon name="plus"></Icon>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <div className="nk-tb-list is-separate is-medium mb-3">
            <DataTableHead className="nk-tb-item">
              <DataTableRow className="nk-tb-col-check">
                <div className="custom-control custom-control-sm custom-checkbox notext">
                  <input
                    type="checkbox"
                    className="custom-control-input form-control"
                    onChange={(e) => selectorCheck(e)}
                    id="uid"
                  />
                  <label className="custom-control-label" htmlFor="uid"></label>
                </div>
              </DataTableRow>
              <DataTableRow>
                <span className="sub-text">Full Name</span>
              </DataTableRow>
              <DataTableRow size="mb">
                <span className="sub-text">E-mail</span>
              </DataTableRow>
              <DataTableRow size="md">
                <span className="sub-text">Phone</span>
              </DataTableRow>
              <DataTableRow size="lg">
                <span className="sub-text">Title</span>
              </DataTableRow>

              <DataTableRow className="nk-tb-col-tools text-right">
                <UncontrolledDropdown>
                  <DropdownToggle color="tranparent" className="dropdown-toggle btn btn-icon btn-trigger mr-n1">
                    <Icon name="more-h"></Icon>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <ul className="link-list-opt no-bdr">
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#"
                          onClick={(ev) => {
                            ev.preventDefault();
                            selectorDeleteUser();
                          }}
                        >
                          <Icon name="na"></Icon>
                          <span>Remove Selected</span>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#"
                          onClick={(ev) => {
                            ev.preventDefault();
                            selectorSuspendUser();
                          }}
                        >
                          <Icon name="trash"></Icon>
                          <span>Suspend Selected</span>
                        </DropdownItem>
                      </li>
                    </ul>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </DataTableRow>
            </DataTableHead>
            {/*Head*/}
            {currentItems.length > 0
              ? currentItems.map((item) => (
                  <DataTableItem key={item.id}>
                    <DataTableRow className="nk-tb-col-check">
                      <div className="custom-control custom-control-sm custom-checkbox notext">
                        <input
                          type="checkbox"
                          className="custom-control-input form-control"
                          defaultChecked={item.checked}
                          id={item.id + "uid1"}
                          key={Math.random()}
                          onChange={(e) => onSelectChange(e, item.id)}
                        />
                        <label className="custom-control-label" htmlFor={item.id + "uid1"}></label>
                      </div>
                    </DataTableRow>
                    <DataTableRow>
                      <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${item.id}`}>
                        <div className="user-card">
                          <UserAvatar theme={item.avatarBg} text={findUpper(item.name)}></UserAvatar>
                          <div className="user-info">
                            <span className="tb-lead">
                              {item.name} <span className="dot dot-success d-md-none ml-1"></span>
                            </span>
                            <span>{item.email}</span>
                          </div>
                        </div>
                      </Link>
                    </DataTableRow>
                    <DataTableRow size="mb">
                      <span className="tb-amount">{item.email}</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>{item.phone}</span>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <span>{item.title}</span>
                    </DataTableRow>

                    <DataTableRow className="nk-tb-col-tools">
                      <ul className="nk-tb-actions gx-1">
                        <li className="nk-tb-action-hidden" onClick={() => onEditClick(item.id)}>
                          <TooltipComponent
                            tag="a"
                            containerClassName="btn btn-trigger btn-icon"
                            id={"edit" + item.id}
                            icon="edit-alt-fill"
                            direction="top"
                            text="Edit"
                          />
                        </li>
                        {item.status !== "Suspend" && (
                          <React.Fragment>
                            <li className="nk-tb-action-hidden" onClick={() => suspendUser(item.id)}>
                              <TooltipComponent
                                tag="a"
                                containerClassName="btn btn-trigger btn-icon"
                                id={"suspend" + item.id}
                                icon="user-cross-fill"
                                direction="top"
                                text="Suspend"
                              />
                            </li>
                          </React.Fragment>
                        )}
                        <li>
                          <UncontrolledDropdown>
                            <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
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
                                {item.status !== "Suspend" && (
                                  <React.Fragment>
                                    <li className="divider"></li>
                                    <li onClick={() => suspendUser(item.id)}>
                                      <DropdownItem
                                        tag="a"
                                        href="#suspend"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        <Icon name="na"></Icon>
                                        <span>Suspend User</span>
                                      </DropdownItem>
                                    </li>
                                  </React.Fragment>
                                )}
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                      </ul>
                    </DataTableRow>
                  </DataTableItem>
                ))
              : null}
          </div>
          <PreviewAltCard>
            {currentItems.length > 0 ? (
              <PaginationComponent
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
          </PreviewAltCard>
        </Block>

        <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#close"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add User</h5>
              <div className="mt-4">
                <Form className="row gy-4" noValidate onSubmit={handleSubmit(onFormSubmit)}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        defaultValue={formData.name}
                        placeholder="Enter name"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Email </label>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        defaultValue={formData.email}
                        placeholder="Enter email"
                        ref={register({
                          required: "This field is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        })}
                      />
                      {errors.email && <span className="invalid">{errors.email.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Password</label>
                      <input
                        className="form-control"
                        type="number"
                        name="password"
                        defaultValue={formData.balance}
                        placeholder="Enter Password"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.balance && <span className="invalid">{errors.balance.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        type="number"
                        name="phone"
                        defaultValue={formData.phone}
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.phone && <span className="invalid">{errors.phone.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Title</label>
                      <div className="form-control-wrap">
                        <select
                          className="form-control"
                          name="title"
                          value={titleValue}
                          onChange={(e) => setTitleValue(e.target.value)}
                          ref={register({ required: "This field is required" })}
                        >
                          {optionstitle}
                        </select>
                      </div>
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Role</label>
                      <div className="form-control-wrap">
                        <select
                          name="role"
                          className="form-control"
                          value={roleValue}
                          onChange={(e) => setRoleValue(e.target.value)}
                          ref={register({ required: "This field is required" })}
                        >
                          {options}
                        </select>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Add User
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
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
              <h5 className="title">Update User</h5>
              <div className="mt-4">
                <Form className="row gy-4" noValidate onSubmit={handleSubmit(onEditSubmit)}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">ID</label>
                      <input
                        className="form-control"
                        type="text"
                        name="id"
                        defaultValue={formData.id}
                        placeholder="Enter ID"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.id && <span className="invalid">{errors.id.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        defaultValue={formData.name}
                        placeholder="Enter name"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Email </label>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        defaultValue={formData.email}
                        placeholder="Enter email"
                        ref={register({
                          required: "This field is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        })}
                      />
                      {errors.email && <span className="invalid">{errors.email.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Password</label>
                      <input
                        className="form-control"
                        type="number"
                        name="password"
                        defaultValue={formData.password}
                        placeholder="Enter Password"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.password && <span className="invalid">{errors.password.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        type="number"
                        name="phone"
                        defaultValue={formData.phone}
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.phone && <span className="invalid">{errors.phone.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Title</label>
                      <div className="form-control-wrap">
                        <select
                          className="form-control"
                          name="title"
                          defaultValue={formData.title}
                          onChange={(e) => setTitleValue(e.target.value)}
                          ref={register({ required: "This field is required" })}
                        >
                          {optionstitle}
                        </select>
                      </div>
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Role</label>
                      <div className="form-control-wrap">
                        <select
                          className="form-control"
                          name="role"
                          defaultValue={formData.role}
                          onChange={(e) => setRoleValue(e.target.value)}
                          ref={register({ required: "This field is required" })}
                        >
                          {options}
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
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
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
export default UserList;
