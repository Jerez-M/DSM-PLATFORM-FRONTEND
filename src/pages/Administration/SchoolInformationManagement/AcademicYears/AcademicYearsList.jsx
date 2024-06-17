import {useState, useEffect} from "react";
import {Button, Popconfirm, Space, Table, Tooltip, message, Badge} from "antd";
import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import academicYearService from "../../../../services/academic-year.service";
import authenticationService from "../../../../services/authentication.service";

const AcademicYearsList = () => {
    const [academicYears, setAcademicYears] = useState([]);

    const id = authenticationService.getUserTenantId();

    const fetchAcademicYears = async () => {
        try {
            const response = await academicYearService.getAllAcademicYears(id);

            if (response.status === 200) {
                setAcademicYears(response.data);
            } else {
                console.log("Request was not successful. Status:", response.status);
            }
        } catch (error) {
            console.error("Error occured during fetching academic years:", error);
        }
    };

    useEffect(() => {
        fetchAcademicYears();
    }, []);

    const academicYearsTableColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Year",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Start date",
            dataIndex: "startDate",
            key: "starts",
        },
        {
            title: "End date",
            dataIndex: "endDate",
            key: "end",
        },
        {
            title: "Status",
            dataIndex: "active_year",
            key: "active_year",
            render: (value) => {
                if (value) {
                    return <span className="badge rounded-pill text-bg-success">Active</span>
                } else {
                    return <span className="badge rounded-pill text-bg-danger">Inactive</span>
                }
            }
        }
    ];

    return (
        <>
            <Table columns={academicYearsTableColumns} dataSource={academicYears}/>
        </>
    );
};

export default AcademicYearsList;
