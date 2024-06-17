import {Button, Card, Divider, message, Popconfirm, Space, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import BankAccountService from "../../../../services/bank-account.service";
import AuthenticationService from "../../../../services/authentication.service";
import NewBankDetails from "./NewBankDetails";
import StudentClassService from "../../../../services/classroom.service";

const SchoolBankInformation = () => {
    const [banks, setBanks] = useState()
    const [selectedBankDetail, setSelectedBankDetail] = useState()
    const [newBankDetailsModal, setNewBankDetailsModal] = useState(false);

    async function fetchSchoolBanks() {
        try {
            const tenantId = AuthenticationService.getUserTenantId();
            const _banks = await BankAccountService.getSchoolBankingDetails(tenantId);
            setBanks(_banks.data);
        } catch (e) {
            setBanks(null)
        }
    }

    useEffect(() => {
        fetchSchoolBanks().then()
    }, []);


    const bankDetailsTableColumns = [
        {
            title: "Bank Name",
            dataIndex: "bankName",
            key: "bankName"
        },
        {
            title: "Account Name",
            dataIndex: "accountName",
            key: "accountName"
        },
        {
            title: "Account Number",
            dataIndex: "accountNumber",
            key: "accountNumber"
        },
        {
            title: "Branch Name",
            dataIndex: "branch",
            key: "branch"
        },
        {
            title: "Swift Code",
            dataIndex: "swiftCode",
            key: "swiftCode"
        },
        {
            title: "Action",
            dataIndex: "",
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit Banking Details">
                        <Button
                            type="primary"
                            icon={<EditOutlined/>}
                            onClick={() => editBankingDetail(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Class">
                        <Popconfirm
                            title="Delete Class"
                            description="Are you sure you want to delete this class?"
                            onConfirm={() => deleteBankingDetails(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                icon={<DeleteOutlined/>}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ]


    const addNewBankingDetail = () => {
        setSelectedBankDetail(null)
        setNewBankDetailsModal(true)
    }

    const editBankingDetail = (bankDetails) => {
        setSelectedBankDetail(bankDetails)
        setNewBankDetailsModal(true)
    }

    const deleteBankingDetails = (classId) => {
        StudentClassService.delete(classId)
            .then(res => {
                if (res.status === 204) {
                    message.success("Banking details Deleted");
                }
            })
            .catch(e => {
                message.error("Failed to delete, please check your network.");
            })
    }

    console.clear()
    return (
        <>
            <Card>
                <div className='d-flex justify-content-between align-items-center'>
                    <h4>All Banks</h4>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => addNewBankingDetail(true)}
                    >
                        Add New Banking Details
                    </Button>
                </div>

                <Divider type={"horizontal"}/>

                <Table
                    columns={bankDetailsTableColumns}
                    dataSource={banks}
                />
            </Card>

            <NewBankDetails
                open={newBankDetailsModal}
                close={() => setNewBankDetailsModal(false)}
                schoolBankDetails={selectedBankDetail}
            />

        </>
    )
}

export default SchoolBankInformation;