import { Button, Divider, Popconfirm, Space, Table, Tooltip, message } from "antd";
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import InstitutionService from "../../../services/institution.service";
import NewInstitution from "./NewInstitution";
import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteColor, handleError, refreshPage } from "../../../common";
import institutionService from "../../../services/institution.service";


export async function institutionsListLoader() {
    try {
        const response = await InstitutionService.getAll();
        if (response?.status === 200) {
            const institutions = response.data;
            return { institutions };
        }
    } catch (e) {
        return []
    }
}
const InstitutionsList = () => {
    const { institutions } = useLoaderData();
    const navigate = useNavigate();
    const [newInstitutionModalState, setNewInstitutionModalState] = useState(false);

    const _institutions = institutions.map(
        (i, key) => ({
            ...i,
            key
        })
    )

    const institutionListTableColumns = [
        {
            title: 'Institution ID',
            dataIndex: 'tenant_id',
            key: 'tenant_id'
        },
        {
            title: 'Account #',
            dataIndex: 'institution_account_number',
            key: 'institution_account_number',
            render: record => (
                <span className="badge rounded-pill text-bg-light">{record}</span>
            )
        },
        {
            title: 'Institution name',
            dataIndex: 'institution_name',
            key: 'institution_name'
        },
        {
            title: 'Phone number',
            dataIndex: 'phone_number',
            key: 'phone_number'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: 'Email address',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Province',
            dataIndex: 'province',
            key: 'province'
        },
        {
            title: 'Institution client name',
            dataIndex: ['institutionOwner', 'name'],
            key: 'institutionOwner'
        },
        {
            title: 'Status',
            dataIndex: '',
            key: '',
            render: (record) => {
                if (record?.active === true) {
                    return (<span className="badge rounded-pill text-bg-success">Active</span>)
                } else {
                    return (<span className="badge rounded-pill text-bg-danger">Inactive</span>)
                }
            }
        },
        {
            title: 'Action',
            dataIndex: 'tenant_id',
            key: 'tenant_id',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View institution profile">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/superadmin/institutions/${record}`)}
                        />
                    </Tooltip>

                    <Tooltip title="Delete Institution">
                        <Popconfirm
                            title="Delete Institution"
                            description="Are you sure you want to delete this institution?"
                            onConfirm={() => deleteInstitution(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                style={{ color: deleteColor }}
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }
    ]

    const deleteInstitution = (record) => {
        console.log("tenant_id is", record?.tenant_id, "record is: ", record,)
        institutionService
            .delete(record)
            .then((res) => {
                if (res.status === 204) {
                    message.success(`Institution Deleted successfully`);
                    refreshPage();
                }
            })
            .catch((e) => {
                handleError(e);
            });
    };

    return (
        <div className={"overflow-x-hidden"}>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Institutions</h3>

                <Button
                    icon={<PlusOutlined />}
                    className='border-0 px-3 text-white'
                    style={{ background: '#39b54a' }}
                    onClick={() => setNewInstitutionModalState(true)}
                >
                    Add new institution
                </Button>
            </div>
            <Divider type={"horizontal"} />

            <Table
                dataSource={_institutions}
                columns={institutionListTableColumns}
                bordered={true}
                className="table-responsive"
            />

            <NewInstitution
                open={newInstitutionModalState}
                close={() => setNewInstitutionModalState(false)}
            />

        </div>
    )
}

export default InstitutionsList;