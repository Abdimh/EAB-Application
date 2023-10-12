import React, { useEffect, useState } from "react";
import FileSaver, { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
import Content from "../../../layout/content/Content";
import Dropzone from "react-dropzone";
import Head from "../../../layout/head/Head";
import { Badge, Card } from "reactstrap";
import { Modal } from "reactstrap";
import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  UserAvatar,
  DataTableBody,
  DataTable,
  RSelect,
} from "../../../components/Component";

import { findUpper } from "../../../utils/Utils";
import { kycData } from "./KycData";
import { Link } from "react-router-dom";
import axios, { AxiosError, isAxiosError } from "axios";
import instanceAxios from "../../../utils/AxiosSetup";
import { svgSelect } from "./Data";
import { FileManagerContext } from "./FileManager";
import { bytesToMegaBytes, currentTime, getDateStructured } from "../../../utils/Utils";
import { CustomToast } from "../../../utils/CustomToast";
const KycDetailsRegular = ({ match }) => {
  const id = match.params.id;
  const [data] = useState(kycData);
  const [users, setUsers] = useState();
  const [uploadModal, setUploadModal] = useState(false);
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const [user, setUser] = useState([]);
  const [comments, setComments] = useState([]);
  const [inputText, setInputText] = useState("");
  const [infoapp, setData] = useState();
  const [files, setFiles] = useState([]);
  const params = useParams();
  const appId = params.appId;
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [recommended, setRecommended] = useState([]);

  // handles ondrop function of dropzone
  const handleDropChange = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const getFile = async (row) => {
    const Endpoint = `Businessfiles/download/${row.id}`;
    axios({
      url: "/api/" + Endpoint, // your url
      method: "POST",
      responseType: "blob", // important
    }).then((res) => {
      FileSaver.saveAs(res.data, row.filepath);
    });
  };

  const [userdata, setUserData] = useState({
    expireIn: Number,
    expireTimeStamp: String,
    fullname: String,
    role: { id: Number, name: String },
    token: String,
    userName: String,
  });
  const toggleUploadModal = () => {
    setUploadModal(!uploadModal);
  };
  const getApp = async () => {
    const id = match.params.id;

    try {
      const Endpoint = `FullApplications/${id}`;

      const datares = await instanceAxios.get(Endpoint);
      console.log(id);
      setUsers(datares.data);
      console.log(users);
    } catch (e) {
      console.log(e);
    }
  };
  const removeFromList = (name) => {
    let defaultFiles = files;
    defaultFiles = defaultFiles.filter((item) => item.name !== name);
    setFiles([...defaultFiles]);
  };

  const onInputChange = (e) => {
    setInputText(e.target.value);
  };

  const onTextSubmit = (e) => {
    const id = match.params.id;
    const Endpoint = "Recommend";
    instanceAxios
      .post(Endpoint, {
        recommendation: inputText,
        role: userdata.role.name,
        application: id,
      })
      .then((response) => {
        const Newcomment = response.data;

        setComments((oldrows) => [...oldrows, Newcomment]);

        setInputText("");
      })
      .catch((e) => {
        console.log("Hello errors");
      });
  };

  const getComments = async () => {
    const id = match.params.id;
    try {
      const Endpoint = `Recommend/${id}`;
      const data = await instanceAxios.get(Endpoint);

      setComments(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getUploads = async () => {
    const idget = match.params.id;
    try {
      const Endpoint = `Businessfiles/${idget}`;
      const data = await instanceAxios.get(Endpoint);

      setUser(data.data);
      console.log(user);
    } catch (e) {
      console.log(e);
    }
  };

  const addFilesToSystem = () => {
    let newFiles = [];
    const id = match.params.id;

    const formData = new FormData();
    try {
      files.forEach((file) => {
        formData.append(`files`, file);
        formData.append(`FileName`, file.name);
        formData.append(`Applicationid`, id);
      });

      const RoleRes = instanceAxios.post("Businessfiles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      getUploads();
      CustomToast("Successfully Uploaded", false, "success");
      setUploadModal(false);
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

  const fetchdata = () => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUserData(data);
    console.log(data);
  };

  const getvotes = async () => {
    try {
      const id = match.params.id;
      const Endpoint = `BusinessVoting/${id}`;
      const data = await instanceAxios.get(Endpoint);

      setRecommended(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchdata();
    getUploads();
    getApp();
    getComments();
    getvotes();
  }, []);

  return (
    <React.Fragment>
      <Head title="KYC Details - Regular"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockHeadContent>
              <Link to={`${process.env.PUBLIC_URL}/application-details/${id}`}>
                <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                  <Icon name="arrow-left"></Icon>
                  <span>Back</span>
                </Button>
                <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                  <Icon name="arrow-left"></Icon>
                </Button>
              </Link>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Row className="gy-5">
            <Col lg="5">
              <Block>
                <DataTable className="card-stretch">
                  <div className="card-inner">
                    <div className="card-title-group">
                      <div className="card-title">
                        <h5 className="title">Credit sss Commitee Decisions</h5>
                      </div>
                    </div>
                  </div>
                  <DataTableBody bodyclass="nk-tb-tnx">
                    <DataTableHead className="nk-tb-item">
                      <DataTableRow>
                        <span className="sub-text">ID</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span className="sub-text">Full Name</span>
                      </DataTableRow>
                      <DataTableRow>
                        <span className="sub-text">Status</span>
                      </DataTableRow>
                    </DataTableHead>

                    {recommended.length > 0
                      ? recommended.map((item) => (
                          <DataTableItem key={item.id}>
                            <DataTableRow>#{item.id}</DataTableRow>
                            <DataTableRow size="md">
                              <span>{item.fullname}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span
                                className={`dot bg-${item.status === "Approve" ? "success" : "warning"} d-mb-none`}
                              ></span>
                              <span
                                className={`badge badge-sm badge-dot has-bg badge-${
                                  item.status === "Approve" ? "success" : "warning"
                                } d-none d-mb-inline-flex`}
                              >
                                {item.status}
                              </span>
                            </DataTableRow>
                          </DataTableItem>
                        ))
                      : null}
                  </DataTableBody>
                </DataTable>
              </Block>
              <BlockHead>
                <BlockHeadContent>
                  <BlockTitle tag="h5">Uploaded Documents</BlockTitle>
                  <p>
                    Here is application related documents.
                    <Button color="primary" onClick={() => toggleUploadModal()}>
                      <Icon name="upload-cloud"></Icon> <span>Upload</span>
                    </Button>
                  </p>
                </BlockHeadContent>
              </BlockHead>

              <Card className="card-bordered">
                <ul className="data-list is-compact">
                  {user.map((row) => (
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-value">{row.fileName}</div>
                        <div className="data-label">
                          <li key={row.id}>
                            <Button onClick={() => getFile(row)}>Download</Button>
                          </li>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>

            <Col lg="7">
              <Card className="h-100">
                <div className="card-inner">
                  <div className="card-title-group mb-2">
                    <div className="card-title">
                      <h6 className="title">Comments</h6>
                    </div>
                  </div>
                  {comments.map((row) => (
                    <ul className="nk-top-products">
                      <li className="item">
                        <div className="thumb">
                          <div className="user-avatar">
                            <span>AM</span>
                          </div>
                        </div>

                        <>
                          <div className="info">
                            <div className="title">{row.role}</div>
                            <div className="price">{row.recommendation}.</div>
                          </div>
                          <div className="total">
                            <div className="amount">{row.datecreated}</div>
                          </div>
                        </>
                      </li>
                    </ul>
                  ))}
                </div>
                <div className="nk-chat-editor-form">
                  <div className="form-control-wrap">
                    <textarea
                      className="form-control form-control-simple no-resize"
                      rows="5"
                      id="default-textarea"
                      onChange={(e) => onInputChange(e)}
                      value={inputText}
                      placeholder="Type your message..."
                      onKeyDown={(e) => {
                        e.code === "Enter" && onTextSubmit(e);
                      }}
                    ></textarea>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Block>
      </Content>

      <Modal isOpen={uploadModal} size="md" toggle={toggleUploadModal}>
        <div className="modal-body modal-body-md">
          <div className="nk-upload-form">
            <h5 className="title mb-3">Upload File</h5>
            <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()} className="dropzone upload-zone small bg-lighter my-2 dz-clickable">
                    <input {...getInputProps()} />
                    <div className="dz-message">
                      <span className="dz-message-text">
                        <span>Drag and drop</span> file here or <span>browse</span>
                      </span>
                    </div>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="nk-upload-list">
            <h6 className="title">Uploaded Files</h6>
            {files.length > 0 ? (
              files.map((file, index) => (
                <div className="nk-upload-item" key={index}>
                  <div className="nk-upload-icon">
                    {svgSelect[file.type] ? svgSelect[file.type] : svgSelect["others"]}
                  </div>
                  <div className="nk-upload-info">
                    <div className="nk-upload-title">
                      <span className="title">{file.name}</span>
                    </div>
                    <div className="nk-upload-size">{bytesToMegaBytes(file.size)} MB</div>
                  </div>
                  <div className="nk-upload-action">
                    <a
                      href="#delete"
                      onClick={(ev) => {
                        ev.preventDefault();
                        removeFromList(file.name);
                      }}
                      className="btn btn-icon btn-trigger"
                    >
                      <Icon name="trash"></Icon>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="d-flex justify-center">
                <span>No files added yet !</span>
              </div>
            )}
          </div>
          <div className="nk-modal-action justify-end">
            <ul className="btn-toolbar g-4 align-center">
              <li>
                <a
                  href="#toggle"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setUploadModal(false);
                  }}
                  className="link link-primary"
                >
                  Cancel
                </a>
              </li>
              <li>
                <Button color="primary" onClick={() => addFilesToSystem()}>
                  Add Files
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};
export default KycDetailsRegular;
