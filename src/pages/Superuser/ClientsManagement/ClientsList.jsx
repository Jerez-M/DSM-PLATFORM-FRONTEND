import {Button, Divider, Dropdown, Space, Table, Tooltip} from "antd";
import {DownOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import NewClient from "./NewClient";
import {useEffect, useState} from "react";
import InstitutionOwnerService from "../../../services/institution-owner.service";
import {useLoaderData, useNavigate} from "react-router-dom";
export async function clientsListLoader() {
    try {
        const response = await InstitutionOwnerService.getAll();
        if(response?.status === 200) {
            const clients = response.data;
            return { clients };
        }
    } catch (e) {
        return []
    }
}
const ClientsList = () => {
    const { clients } = useLoaderData();
    const navigate = useNavigate();
    const [newClientModalState, setNewClientModalState] = useState(false);

    const _clients = clients.map(
        (i, key) => ({
            ...i,
            key
        })
    )


    const clientListTableColumns = [
        {
            title: 'Client ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Client name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Phone number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber'
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
            title: 'Website',
            dataIndex: 'website',
            key: 'website'
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View institution profile">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/superadmin/clients/${record?.id}/institutions`)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ]

    const handleFetchClients = async () => {

    }

    useEffect(
        () => {
            handleFetchClients();
        }
    )

    return (
        <div className={"overflow-x-hidden"}>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Clients</h3>

                <Button
                    icon={<PlusOutlined/>}
                    className='border-0 px-3 text-white'
                    style={{background: '#39b54a'}}
                    onClick={() => setNewClientModalState(true)}
                >
                    Add new client
                </Button>
            </div>
            <Divider type={"horizontal"}/>

            <Table
                dataSource={_clients}
                columns={clientListTableColumns}
                bordered={true}
                className="table-responsive"
            />

            <NewClient open={newClientModalState} close={() => setNewClientModalState(false)} />

        </div>
    )
}

export default ClientsList;