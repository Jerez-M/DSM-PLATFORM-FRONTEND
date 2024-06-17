import { Button, Divider, Tabs } from "antd";
import { useState } from "react";
import CurrentReport from "./CurrentReport";
import PreviousReport from "./PreviousReport";
import AuthenticationService from "../../../services/authentication.service";
// import PreviousReport from "./PreviousReport";

const Reports = () => {
  const [currentReport, setCurrentReport] = useState(false);
  const [previousReportsModalState, setPreviousReportsModalState] =
    useState(false);
  const userId = AuthenticationService.getUserId();

  const items = [
    {
      label: "CurrentReport",
      key: "1",
      onClick: () => setCurrentReport(true),
    },
    {
      label: "Previous Report",
      key: "3",
      onClick: () => setPreviousReportsModalState(true),
    },
  ];

  const menuProps = {
    items,
  };

  const tabItems = [
    {
      key: "4",
      label: (
        <Button type={"default"} className="border-0">
          Current Report
        </Button>
      ),
      children: <CurrentReport studentUserId={userId} />,
    },
    {
      key: "5",
      label: (
        <Button type={"default"} className="border-0">
          Previous Reports
        </Button>
      ),
      children: <PreviousReport studentUserId={userId} />,
    },
  ];

  const onChange = (key) => {
    console.log(key);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3>Student Reports and Results</h3>
      </div>
      <Divider type={"horizontal"} />

      <div className="container-fluid p-0">
        <Tabs
          defaultActiveKey="1"
          items={tabItems}
          onChange={onChange}
          style={{ color: "#39b54a" }}
        />
      </div>
    </>
  );
};

export default Reports;


