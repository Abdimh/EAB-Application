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
import { useHistory } from "react-router-dom";
import { invoiceData } from "./Invoice";
import axios, { AxiosError, isAxiosError } from "axios";
import instanceAxios from "../../../utils/AxiosSetup";

import { CustomToast } from "../../../utils/CustomToast";
import { BadRequest } from "../../../utils/Error";

//import { Value } from "sass";
const InvoiceList = () => {
  const history = useHistory();
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

  // Update Relation Manager Recommendation
  const onReset = async (submitData) => {
    const { id, CA, status } = submitData;
    console.log(submitData);
    try {
      const RoleRes = await instanceAxios.put("Account", {
        Password: submitData.password,
        username: user.userName,
      });

      // const { data } = RoleRes;
      // 200 Data

      CustomToast("Password Changed", false, "success");
      history.push(`${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`);
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
  };
  const { errors, register, handleSubmit, setValue } = useForm();
  return (
    <React.Fragment>
      <Head title="Invoice List"></Head>
      <Content>
        <Block>
          <Card className="card-stretch">
            <div className="card-inner-group">
              <div className="card-inner">
                <div className="card-title-group"></div>
              </div>
              <div className="card-inner p-0">
                <div className="p-2">
                  <h5 className="title">Reset Password</h5>
                  <div className="mt-4">
                    <Form className="row gy-4" onSubmit={handleSubmit(onReset)}>
                      <Col size="12">
                        <FormGroup>
                          <input
                            type="password"
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
                          <li></li>
                        </ul>
                      </Col>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};
export default InvoiceList;
