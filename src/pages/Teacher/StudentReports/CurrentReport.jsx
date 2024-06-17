import { Card, Input, Form, Table, Button, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import "./stamp.css";
import authenticationService from "../../../services/authentication.service";
import studentResultsService from "../../../services/student-results.service";
import schoolService from "../../../services/school-service";
import { PrinterOutlined } from "@ant-design/icons";
import institutionService from "../../../services/institution.service";

const CurrentReport = (params) => {
  const { id } = useParams()
  const [resultsData, setResultsData] = useState([]);
  const [studentDataa, setStudentDataa] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const [institutionName, setInstitutionName] = useState();
  const [logoUrl, setLogoUrl] = useState();
  const [address, setAddress] = useState();

  const tenantId = authenticationService.getUserTenantId();

  let date = new Date();

  const fetchStudentResults = async () => {
    try {
      const response = await studentResultsService.getCurrentTermResults(
        id
      );

      if (response.status === 200) {
        setResultsData(response.data[1]);
        setStudentDataa(response.data[0]);
      } else {
        console.log("Request was not successful. Status:", response.status);
      }
    } catch (error) {
      console.error("Error occured during fetching academic years:", error);
    }
  };

  const fetchSchoolData = async () => {
    try {
      const schoolResponse = await schoolService.getSchoolbytenantId(tenantId);

      if (schoolResponse.status === 200) {
        setSchoolData(schoolResponse.data);
        setInstitutionName(schoolResponse?.data?.institution_name);
        setAddress(schoolResponse?.data.address);
      } else {
        console.log(
          "Request was not successful. Status:",
          schoolResponse.status
        );
      }
    } catch (error) {
      console.error("Error occured during fetching academic years:", error);
    }
  };

  useEffect(() => {
    fetchStudentResults();
    fetchSchoolData();
    fetchInstitutionLogo();
  }, []);

  const fetchInstitutionLogo = async () => {
    try {
      const response = await institutionService.getLogoByTenantId(tenantId);
      if (response?.status === 200) {
        const logo = response?.data?.url;
        setLogoUrl(logo);
      }
    } catch (e) {

    }
  }

  const tableColumns = [
    {
      title: "SUBJECT",
      dataIndex: ["subject"],
      key: "1",
      render: (text) => <span>{text.toUpperCase()}</span>,
      onHeaderCell: () => {
        return {
          style: {
            background: "green",
            color: "white",
          },
        };
      },
    },
    {
      title: "MARK",
      dataIndex: "total_mark",
      key: "2",
      onHeaderCell: () => {
        return {
          style: {
            background: "green",
            color: "white",
          },
        };
      },
    },
    {
      title: "GRADE",
      dataIndex: "grade",
      key: "3",
      onHeaderCell: () => {
        return {
          style: {
            background: "green",
            color: "white",
          },
        };
      },
    },
    {
      title: "TEACHER'S COMMENT",
      dataIndex: "comment",
      key: "4",
      onHeaderCell: () => {
        return {
          style: {
            background: "green",
            color: "white",
          },
        };
      },
    },
  ];

  const CustomTable = ({ resultsData }) => (
    <div className="col-12">
      <Table
        className="table-responsive table-layout pb-2"
        dataSource={resultsData}
        columns={tableColumns}
        pagination={false}
        bordered={true}
        locale={{
          emptyText: "Report Not Yet Available. Please consult your teacher.",
        }}
        loading={() => "Report Not Yet Available"}
        rowClassName={() => "custom-row"}
      />
    </div>
  );

  const currentComponentRef = useRef();
  const handlePrintCurrentResults = useReactToPrint({
    content: () => currentComponentRef.current,
    documentTitle: `Report for ${studentDataa && studentDataa?.student?.firstName}`,
  });

  //   console.clear();

  return (
    <>
      <div className="d-flex justify-content-between mt-2 mb-4 align-items-center">
        <h3></h3>
        <Button
          className="border-0 px-3 text-white"
          style={{ background: "#39b54a" }}
          onClick={handlePrintCurrentResults}
        >
          <Space>
            <PrinterOutlined />
            Print report card
          </Space>
        </Button>
      </div>
      <div
        className="container"
        style={{
          backgroundColor: "white",
          border: "0",
          borderTop: "0",
          //   color: "black",
          borderBottom: "0",
          borderLeft: "10px solid green",
          borderRight: "10px solid green",
        }}
        ref={currentComponentRef}
      >
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mt-1 pt-2 table-responsive">
            <img
              src={logoUrl}
              id="schoolLogo"
              width="200"
              height="170"
              alt="School Logo"
            />
            <div>
              <h3 className="text-center">
                {institutionName && institutionName.toUpperCase()}
              </h3>{" "}
              <h5 className="text-center">STUDENT REPORT</h5>
            </div>
          </div>

          <div className="row my-4">
            <Form layout={"vertical"}>
              <div className="row">
                <div className="col-md-6">
                  <Card hoverable>
                    <Form.Item label="First name">
                      <Input
                        value={studentDataa && studentDataa?.student?.firstName}
                        size={"large"}
                      />
                    </Form.Item>
                    <Form.Item label="Reg Number">
                      <Input
                        value={studentDataa?.student?.regNumber}
                        size={"large"}
                      />
                    </Form.Item>
                    <Form.Item label="Academic Year">
                      <Input
                        value={studentDataa?.academic_year}
                        size={"large"}
                      />
                    </Form.Item>
                  </Card>
                </div>
                <div className="col-md-6">
                  <Card hoverable>
                    <Form.Item label="Last name">
                      <Input
                        value={studentDataa?.student?.lastName}
                        size={"large"}
                      />
                    </Form.Item>
                    <Form.Item label="Level">
                      <Input
                        value={studentDataa?.student?.level}
                        size={"large"}
                      />
                    </Form.Item>
                    <Form.Item label="Current term">
                      <Input value={studentDataa?.term} size={"large"} />
                    </Form.Item>
                  </Card>
                </div>
              </div>
            </Form>
          </div>

          <div className="rounded py-4 mb-3">
            <div className="row mt-2 mb-3">
              <div className="col-12">
                <CustomTable resultsData={resultsData} />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-lg- col-md-9 col-sm-12">
                <div className="row mx-2 border rounded justify-content-between align-content-center">
                  <div className="col-sm-2 mt-3">
                    <h6 className="mb-0  text-sm">
                      <strong>HEAD'S COMMENT</strong>
                      <font class="text-danger">*</font>
                    </h6>
                  </div>
                  <div className="col-sm-10 text-secondary py-4 rounded">
                    <textarea
                      className="form-control form-control-sm bg-grey py-3"
                      placeholder="Head's Comment"
                      data-val="true"
                      name="comment"
                      //   value={resultsData?.headsComment.toUpperCase()}
                      readOnly={true}
                      style={{ resize: "none", pointerEvents: "none" }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3">
                <div id="stamp" className="p-2 text-center">
                  <div id="stamp-rectangle">
                    <h1 id="stamp-school-name">{institutionName}</h1>
                    <span>This is an authorized digital stamp</span>
                    <p id="stamp-date">{date.toDateString()}</p>
                    <p id="stamp-address">{address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentReport;
