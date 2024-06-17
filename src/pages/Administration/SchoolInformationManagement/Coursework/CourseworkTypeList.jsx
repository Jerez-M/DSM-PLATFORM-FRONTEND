import {Button, Popconfirm, Space, Table, Tooltip} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import {deleteColor, editColor} from "../../../../common";
import AuthenticationService from "../../../../services/authentication.service";
import CourseworkTypeService from "../../../../services/coursework-type.service";
import NewCourseworkType from "./NewCoursework";

const CourseworkTypeList = () => {
    const [courseworkTypesList, setCourseworkTypeList ] = useState([]);
    const [selectedRecord, setSelectedRecord ] = useState(null);
    const [editCourseworkTypeModalState, setEditCourseworkTypeModalState] = useState(false);

    const tenantId = AuthenticationService.getUserTenantId();

    useEffect(() => {
        const fetchCourseworkType = async () => {
            try {
                const response = await CourseworkTypeService.getAll(tenantId)

                if (response.status === 200) {
                    setCourseworkTypeList(response.data);
                }
            } catch (error) {
                console.error("Error occurred during fetching courseworkTypes:", error);
            }
        };

        fetchCourseworkType();
    }, []);


    const courseworkTypesTableColumns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Coursework Type',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit Coursework Type">
                        <Button
                            type="primary"
                            icon={<EditOutlined/>}
                            style={{ background: editColor }}
                            onClick={() => edit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Coursework Type">
                        <Popconfirm
                            title="Delete Coursework Type"
                            description="Cannot delete Coursework Type. this action will delete all courseworks which belongs to this type?"
                            okText="OK"
                            cancelText="Cancel"
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
        }
    ]

    const edit = (record) => {
        setSelectedRecord(record)
        setEditCourseworkTypeModalState(true)
    }

    return (
        <>
            <Table dataSource={courseworkTypesList} columns={courseworkTypesTableColumns} rowKey="id" />
            <NewCourseworkType
                open={editCourseworkTypeModalState}
                close={() => setEditCourseworkTypeModalState(false)}
                courseworkType={selectedRecord}
            />
        </>
    )
}

export default CourseworkTypeList;