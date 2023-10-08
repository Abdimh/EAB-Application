import React, { useState } from "react";
import { DropdownToggle, DropdownMenu, Dropdown, Modal, ModalBody, Form, Col, FormGroup, Button } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList, LinkItem } from "../../../../components/links/Links";
import UserAvatar from "../../../../components/user/UserAvatar";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { findUpper } from "../../../../utils/Utils";
import axios, { AxiosError, isAxiosError } from "axios";
import instanceAxios from "../../../../utils/AxiosSetup";
import { CustomToast } from "../../../../utils/CustomToast";
const User = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
  const [user, setUser] = useState({
    expireIn: Number,
    expireTimeStamp: String,
    fullname: String,
    role: { id: Number, name: String },
    token: String,
    title: { id: Number, title: String },
    userName: String,
  });
  const [modal, setModal] = useState({
    editpassword: false,
  });
  const handleSignout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthorized");
    localStorage.removeItem("accessToken");
  };
  // Update Relation Manager Recommendation
  const onSubmitRMRecommendation = async (submitData) => {
    const { id, CA, status } = submitData;
    console.log(submitData);
    try {
      const RoleRes = await instanceAxios.put("IndividualApp", {
        Password: submitData.password,
      });

      // const { data } = RoleRes;
      // 200 Data

      CustomToast("Password Changed", false, "success");
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
    setModal({ edit: false });
  };

  const onFormCancel = () => {
    setModal({ editpassword: false });
  };
  const fetchdata = () => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
    console.log(data);
  };
  useEffect(() => {
    fetchdata();
  }, []);
  const { errors, register, handleSubmit, setValue } = useForm();
  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar icon="user-alt" className="sm" />
          <div className="user-info d-none d-md-block">
            {/* <div className="user-status">{user.role?.name}</div> */}
            <div className="user-name dropdown-indicator">{user?.fullname}</div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu right className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card sm">
            <div className="user-avatar"></div>
            <div className="user-info">
              <span className="lead-text">{user?.title?.title}</span>
              <span className="sub-text">{user?.userName}</span>
            </div>
          </div>
        </div>

        <div className="dropdown-inner">
          <LinkList>
            <a href={`${process.env.PUBLIC_URL}/reset-password`}>
              <Icon name="signout"></Icon>
              <span>Reset Password</span>
            </a>
          </LinkList>
          <LinkList>
            <a href={`${process.env.PUBLIC_URL}/auth-login`} onClick={handleSignout}>
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList>
        </div>

        <Modal
          isOpen={modal.editpassword}
          toggle={() => setModal({ editpassword: false })}
          className="modal-dialog-centered"
          size="lg"
        >
          <ModalBody>
            <div className="p-2">
              <h5 className="title">Reset Password</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onSubmitRMRecommendation)}>
                  <Col size="12">
                    <FormGroup>
                      <input
                        type="text"
                        name="password"
                        placeholder="Enter new password"
                        className="form-control"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.password && <span className="invalid">{errors.password.message}</span>}
                    </FormGroup>
                  </Col>

                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Reset Password
                        </Button>
                      </li>
                      <li>
                        <Button
                          onClick={(ev) => {
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
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
