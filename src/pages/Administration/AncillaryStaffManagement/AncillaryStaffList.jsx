import {Avatar, Button, Divider, message, Modal, Popconfirm, Space, Table, Tag, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, UserOutlined} from "@ant-design/icons";
import {useLoaderData, useNavigate} from "react-router-dom";
import {useState} from "react";
import HumanResources from "../../../services/human-resources";
import AuthenticationService from "../../../services/authentication.service";
import AncillaryStaffMetrics from "./AncillaryStaffMetrics";
import {deleteColor, editColor, refreshPage} from "../../../common";


export async function retrieveAncillaryStaffLoader() {
    try {
        const response = await HumanResources.getAllEmployeesByInstitutionId(
            AuthenticationService.getUserTenantId()
        );
        if(response.status === 200) {
            const ancillaryStaff = response.data;
            return {ancillaryStaff};
        }
    } catch (error) {
        return []
    }
}

const AncillaryStaffList = () => {
    const navigate = useNavigate();
    const {ancillaryStaff} = useLoaderData();
    const [confirmDeleteAncillaryStaffMemberModal, setConfirmDeleteAncillaryStaffMemberModal] = useState(false);
    const [staffIdToBeDeleted, setStaffIdToBeDeleted] = useState(null);
    const [isDeleteStaffModalDisabled, setIsDeleteStaffModalDisabled] = useState(false);

    const ancillaryStaffMembers = ancillaryStaff.map((ancillaryStaffMember, index) => {
        return ({
            key: index,
            img: ancillaryStaffMember?.user?.profile_picture,
            name: ancillaryStaffMember?.user?.firstName + ' ' + ancillaryStaffMember?.user?.lastName,
            designation: ancillaryStaffMember?.job_title,
            phone: ancillaryStaffMember?.user?.phoneNumber,
            email: ancillaryStaffMember?.user?.email,
            contract: ancillaryStaffMember?.employment_status,
            staffNumber: ancillaryStaffMember?.user?.username,
            id: ancillaryStaffMember?.id
        })
    })

    const columns = [
        {
            title: '#',
            dataIndex: 'img',
            key: 'img',
            render: () => <Avatar icon={<UserOutlined />} />,
            responsive: ['md']
        },
        {
            title: 'Staff Number',
            dataIndex: 'staffNumber',
            key: 'staffNumber',
            responsive: ['md']
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            responsive: ['md']
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            responsive: ['md']
        },
        {
            title: 'Contract Type',
            dataIndex: 'contract',
            key: 'contract',
            render: (record) => {
                if(record === 'Full time') {
                    return <Tag className='bg-success border-0'>
                        <span className='small text-light fw-bold'>
                        Full time
                    </span>
                    </Tag>
                }
                return <Tag className='bg-warning border-0'>
                        <span className='small text-light fw-bold'>
                        Part time
                    </span>
                </Tag>
            }
        },
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'id',
            render: record => (
                <Space size="small">
                    <Tooltip title="More details">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/admin/ancillary-staff/${record}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Staff">
                        <Button
                            className="text-light border-0"
                            style={{ background: editColor }}
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/admin/ancillary-staff/${record}/edit-profile`)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Staff">
                        <Button
                            type="danger"
                            style={{ color: deleteColor }}
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                setStaffIdToBeDeleted(record);
                                setConfirmDeleteAncillaryStaffMemberModal(true)
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
            responsive: ['md']
        }
    ];

    const handleDeleteAncillaryStaffMember = async (employeeId) => {
        setIsDeleteStaffModalDisabled(true);

        try {
            await HumanResources.deleteEmployee(employeeId);
            message.success("Staff member deleted successfully");
            refreshPage();
        } catch (e) {
            message.error(e.response.data.error)
            setIsDeleteStaffModalDisabled(false);
        }
    }

    return (
        <div className='mx-4'>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Ancillary Staff</h3>
                <Button
                    icon={<PlusOutlined />}
                    className='border-0 px-3 text-white'
                    style={{background: '#39b54a'}}
                    onClick={() => navigate('/admin/ancillary-staff/new')}
                >
                    New staff member
                </Button>
            </div>
            <Divider className='my-1' type={"horizontal"}/>

            <AncillaryStaffMetrics/>

            <Table
                columns={columns}
                dataSource={ancillaryStaffMembers}
                className='mt-3'
            />

            <Modal
                open={confirmDeleteAncillaryStaffMemberModal}
                onCancel={() => setConfirmDeleteAncillaryStaffMemberModal(false)}
                destroyOnClose={true}
                maskClosable={true}
                centered={true}
                okButtonProps={{
                    className: 'd-none'
                }}
                cancelButtonProps={{
                    className: 'd-none'
                }}
            >
                <h3 className='text-center fw-bolder text-danger p-4'>
                    Are you sure you want to delete this staff member?
                </h3>

                <div className='d-flex justify-content-evenly align-content-center'>
                    <Button
                        className='w-100 m-1 border border-dark text-dark'
                        size={"large"}
                        onClick={() => setConfirmDeleteAncillaryStaffMemberModal(false)}
                        disabled={isDeleteStaffModalDisabled}
                    >
                        Cancel
                    </Button>
                    <Button
                        className='bg-danger border-0 text-light w-100 m-1'
                        size={"large"}
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteAncillaryStaffMember(staffIdToBeDeleted)}
                        disabled={isDeleteStaffModalDisabled}
                    >
                        Delete
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default AncillaryStaffList