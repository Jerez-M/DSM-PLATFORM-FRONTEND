/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Popconfirm, Space, Table, Tooltip, message } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import EditCourseworkType from "./EditCourseworkType";
import courseworkTypeService from "../../../../services/coursework-type.service";
import authenticationService from "../../../../services/authentication.service";
import { deleteColor, editColor } from "../../../../common";

const CourseworkTypeList = () => {
    const [EditCourseworkTypeModalState, setEditCourseworkTypeModalState] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [CourseworkTypeList, setCourseworkTypeList] = useState([]);

    const id = authenticationService.getUserTenantId();

    const fetchCourseworkTypes = async () => {
        try {
            const response = await courseworkTypeService.getAll(id);

            if (response.status === 200) {
                setCourseworkTypeList(response.data);
            } else {
                console.log("Request was not successful. Status:", response.status);
            }
        } catch (error) {
            console.error("Error occured during fetching asset categories", error);
        }
    };

    useEffect(() => {
        fetchCourseworkTypes();
    }, []);

    const courseworkTypesTableColumns = [
        {
            title: "Coursework Type ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Coursework Type name",
            dataIndex: "name",
            key: "name",
            render: (dataIndex) => (
                <strong>
                    {dataIndex}
                </strong>
            )
        },
        {
            title: "Action",
            dataIndex: "",
            key: "",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit Coursework Type">
                        <Button
                            className="text-light border-0"
                            style={{ background: editColor }}
                            icon={<EditOutlined />}
                            onClick={() => EditCourseworkTypeRecord(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Coursework Type">
                        <Popconfirm
                            title="Delete Coursework Type"
                            description="Are you sure you want to delete this coursework type?"
                            onConfirm={() => deleteCourseworkType(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                icon={<DeleteOutlined />}
                                style={{ color: deleteColor }}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const deleteCourseworkType = async (record) => {
        try {
            console.log("record to delete is: ", record.id)
            const response = await courseworkTypeService.delete(record.id)

            if (response.status === 204) {
                message.info("Coursework type deleted successfully")
                fetchCourseworkTypes()
            } else {
                message.error("Coursework type could not be deleted")
            }
        } catch (error) {
            message.error("Coursework type could not be deleted")
        }
    }

    const EditCourseworkTypeRecord = (record) => {
        setSelectedRecord(record)
        setEditCourseworkTypeModalState(true)
    }

    return (
        <>
            <Table className="table-responsive" dataSource={CourseworkTypeList} columns={courseworkTypesTableColumns} />
            <EditCourseworkType open={EditCourseworkTypeModalState} close={() => setEditCourseworkTypeModalState(false)} record={selectedRecord} />
        </>
    );
};

export default CourseworkTypeList;
