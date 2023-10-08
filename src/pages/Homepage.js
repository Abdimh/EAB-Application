import React, { useState, useEffect } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import SalesStatistics from "../components/partials/default/SalesStatistics";
import OrderStatistics from "../components/partials/default/OrderStatistics";
import StoreStatistics from "../components/partials/default/StoreStatistics";
import RecentOrders from "../components/partials/default/recent-orders/RecentOrders";
import TopProducts from "../components/partials/default/top-products/TopProducts";
import DataCard from "../components/partials/default/DataCard";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown, DropdownItem } from "reactstrap";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  Row,
  Col,
  BlockBetween,
} from "../components/Component";
import {
  DefaultCustomerChart,
  DefaultOrderChart,
  DefaultRevenueChart,
  DefaultVisitorChart,
} from "../components/partials/charts/default/DefaultCharts";
import instanceAxios from "../utils/AxiosSetup";
const Homepage = () => {
  const [data, setData] = useState([]);
  const [approved, setApprovedApps] = useState();
  const [review, setReview] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [totalcreated, setTotal] = useState(0);
  const [sm, updateSm] = useState(false);
  const [user, setUser] = useState({
    expireIn: Number,
    expireTimeStamp: String,
    fullname: String,
    role: { id: Number, name: String },
    token: String,
    userName: String,
  });
  const fetchdata = () => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
    console.log(data);
  };
  const getApplications = async () => {
    try {
      const datares = await instanceAxios.get("FullApplications");
      setApprovedApps(datares.data.approvedapps);
      setRejected(datares.data.rejectedapp);
      setDelivered(datares.data.deliveredapp);
      setReview(datares.data.reviewapp);
      setTotal(datares.data.totalapplications);
    } catch (e) {
      console.log(e);
    }
  };

  const getApplicationcreated = async () => {
    try {
      const datares = await instanceAxios.get("IndividualApp");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getApplications();
    getApplicationcreated();
    fetchdata();
  }, []);

  console.log(data.length);
  return (
    <React.Fragment>
      <Head title="Dashboard"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Dashboard
              </BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="more-v" />
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}></div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Row className="g-gs">
            <Col xxl="3" sm="6">
              <DataCard
                title="Approved Applicaitons"
                up={true}
                amount={approved}
                percentChange={"Total Approved Applications"}
              />
            </Col>
            <Col xxl="3" sm="6">
              <DataCard
                title="Rejected Applications"
                percentChange={"Total Rejected Applications"}
                up={false}
                amount={rejected}
              />
            </Col>
            <Col xxl="3" sm="6">
              <DataCard
                title="Delivered Applications"
                percentChange={"Total delivered applications"}
                up={true}
                amount={delivered}
              />
            </Col>
            <Col xxl="3" sm="6">
              <DataCard title="On Review" percentChange={"2.63"} up={false} amount={review} />
            </Col>

            <Col xxl="3" md="6">
              <OrderStatistics />
            </Col>
            {user.role.name === "Relation Officer PI" && (
              <Col xxl="3" sm="6">
                <DataCard title="Total Application Created" percentChange={"2.63"} up={false} amount={totalcreated} />
              </Col>
            )}
          </Row>
        </Block>
      </Content>
    </React.Fragment>
  );
};
export default Homepage;
