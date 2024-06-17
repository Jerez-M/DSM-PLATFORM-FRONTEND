import {Button, Popconfirm, Space, Table, Tooltip, message} from "antd";
import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {useEffect, useState} from "react";
import authenticationService from "../../../../services/authentication.service";
import schoolTerm from "../../../../services/schoolTerm.services";
import EditTerm from "./EditTerm";
import {deleteColor, editColor} from "../../../../common";


const TermsList = () => {
    const [editTermModalState, setEditTermModalState] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [schoolTermsList, setSchoolTermsList] = useState([]);

    const id = authenticationService.getUserTenantId();

    const fetchTerms = async () => {
        try {
            const response = await schoolTerm.getTermsInActiveAcademicYearByInstitutionId(id);

            if (response.status === 200) {
                setSchoolTermsList(response.data);
            } else {
                console.log("Request was not successful. Status:", response.status);
            }
        } catch (error) {
            console.error("Error occured during fetching academic years:", error);
        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    const termsTableColumns = [
        {
            title: "Term ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Term name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Start date",
            dataIndex: "startDate",
            key: "startDate",
        },
        {
            title: "End date",
            dataIndex: "endDate",
            key: "endDate",
        },
        {
            title: "Status",
            dataIndex: "is_active",
            key: "is_active",
            render: (value) => {
                if (value) {
                    return <span className="badge rounded-pill text-bg-success">Active</span>
                } else {
                    return <span className="badge rounded-pill text-bg-danger">Inactive</span>
                }
            }
        },
        {
            title: "Action",
            dataIndex: "",
            key: "",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit Term">
                        <Button
                            type="primary"
                            icon={<EditOutlined/>}
                            style={{ background: editColor }}
                            onClick={() => editTerm(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Term">
                        <Popconfirm
                            title="Delete Term"
                            description="Are you sure you want to delete this term?"
                            // onConfirm={() => deleteSubjectAllocation(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                style={{color: deleteColor}}
                                icon={<DeleteOutlined/>}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const editTerm = (record) => {
        setSelectedRecord(record)
        setEditTermModalState(true)
    }


    return (
        <>
            <Table dataSource={schoolTermsList} columns={termsTableColumns}/>

            <EditTerm open={editTermModalState} close={() => setEditTermModalState(false)} record={selectedRecord}/>
        </>
    );
};

export default TermsList;
