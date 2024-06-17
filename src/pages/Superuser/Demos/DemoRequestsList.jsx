import {Divider, message, Popconfirm, Select, Table, Tag} from "antd";
import {CheckCircleOutlined, ClockCircleOutlined} from "@ant-design/icons";
import {useLoaderData} from "react-router-dom";
import DemoRequestsService from "../../../services/demo-requests.service";
import {useState} from "react";
import {handleSingleError, refreshPage, toHumanDate} from "../../../common";

export async function demoRequestsLoader() {
    try {
        const response = await DemoRequestsService.getAllRequests();
        if(response?.status === 200) {
            const demoRequests = response.data;
            return { demoRequests };
        }
    } catch (e) {
        return []
    }
}
const DemoRequestsList = () => {
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const { demoRequests } = useLoaderData();
    const filteredRequests = selectedStatus === "ALL" ? demoRequests : demoRequests.filter((request) => request.status === selectedStatus);

    const handleChange = (value) => {
        setSelectedStatus(value);
    };

    const changeStatus = async (id) => {
        try {
            const response = await DemoRequestsService.markAsAttended(id);

            if(response.status === 200) {
                message.success("Status Changed")
                refreshPage()
            }
        } catch (e) {
            handleSingleError(e)
        }
    }

    const demoRequestsTableColumns = [
        {
            title: 'Institution Name',
            dataIndex: 'institution_name',
            key: 'institution_name',
            render: name => <span className="fw-bold">{name}</span>
        },
        {
            title: 'Full Name',
            dataIndex: 'full_name',
            key: 'full_name'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => <a href={`mailto:${email}`}>{email}</a>
        },
        {
            title: 'Phone number',
            dataIndex: 'phone_number',
            key: 'phone_number'
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: value => {
                let color = "gold";
                return (
                    <Tag color={color} key={value}>
                        {value}
                    </Tag>
                )
            }
        },
        {
            title: 'Query',
            dataIndex: 'query',
            key: 'query'
        },
        {
            title: 'Date Requested',
            dataIndex: 'date_created',
            key: 'date_created',
            sorter: {
                compare: (a, b) => a.date_created < b.date_created,
                multiple: 1
            },
            defaultSortOrder: 'ascend',
            render: (created) => {
                return toHumanDate(created)
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: {
                compare: (a, b) => a.status > b.status,
                multiple: 2
            },
            defaultSortOrder: 'descend',
            render: (value, record) => {
                let color = value === "UNATTENDED" ? 'red' : 'green';
                let icon = value === "UNATTENDED" ? <ClockCircleOutlined /> : <CheckCircleOutlined />;
                return (
                    <Popconfirm
                        title="Change Status"
                        description="Mark request as Attended"
                        onConfirm={() => changeStatus(record.id)}
                        onOpenChange={() => console.log('open change')}
                        disabled={value !== "UNATTENDED"}
                    >
                        <Tag color={color} key={value} style={{cursor: "pointer"}}>
                            {icon} {value}
                        </Tag>
                    </Popconfirm>
                );
            }
        }
    ]

    const demoStatuses = [
        {value: "ALL", label: "All"},
        {value: "UNATTENDED", label: "Unattended"},
        {value: "ATTENDED", label: "Attended"}
    ]

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Requests for e-schools demonstration</h3>

                <Select
                    placeholder='Filter By'
                    options={demoStatuses}
                    value={selectedStatus}
                    onChange={handleChange}
                    style={{ minWidth: 120 }}
                />

            </div>
            <Divider type={"horizontal"}/>

            <Table
                dataSource={filteredRequests}
                columns={demoRequestsTableColumns}
                bordered={true}
                className="table-responsive"
            />
        </>
    )
}

export default DemoRequestsList;