import { Divider, Tabs } from "antd";
import CurrentReport from "../../Student/StudentReports/CurrentReport";
import PreviousReport from "../../Student/StudentReports/PreviousReport";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ArrowLeftOutlined, HistoryOutlined, ImportOutlined} from "@ant-design/icons";

const ChildReports = () => {
    const {childId} = useParams()
    const navigate = useNavigate()


    const tabItems = [
        {
            key: "1",
            label: "Current Report",
            children: <CurrentReport studentUserId={childId} />,
            icon: <ImportOutlined />
        },
        {
            key: "2",
            label: "Previous Report",
            children: <PreviousReport studentUserId={childId} />,
            icon: <HistoryOutlined />
        },
    ];

    return (
        <>
            <Link onClick={() => navigate(-1)} className='text-muted text-decoration-none mb-2'>
                <ArrowLeftOutlined /> Back
            </Link>
            <div className="d-flex justify-content-between align-items-center">
                <h3>Student Reports and Results</h3>
            </div>
            <Divider type={"horizontal"} />

            <div className="container-fluid p-0">
                <Tabs
                    defaultActiveKey="1"
                    items={tabItems}
                />
            </div>
        </>
    );
};

export default ChildReports;