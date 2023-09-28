import React from "react";
import { Row, Col } from "../../components/Component";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import EnglishFlag from "../../images/flags/english.png";
import SpanishFlag from "../../images/flags/spanish.png";
import FrenchFlag from "../../images/flags/french.png";
import TurkeyFlag from "../../images/flags/turkey.png";
import { Link } from "react-router-dom";

const AuthFooter = () => {
  return (
    <div className="nk-footer nk-auth-footer-full">
      <div className="container wide-lg">
        <Row className="g-3">
          <Col lg="12">
            <div className="nk-block-content text-center text-lg-left">
              <p className="text-soft">&copy; 2023 East African Bank. All Rights Reserved.</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default AuthFooter;
