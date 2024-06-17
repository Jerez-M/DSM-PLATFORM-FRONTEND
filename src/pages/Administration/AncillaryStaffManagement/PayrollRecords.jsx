import {
    Button,
    Checkbox,
    Divider,
    Drawer,
    Dropdown,
    Form,
    Input,
    InputNumber,
    message,
    Modal, Popconfirm, Select,
    Space,
    Table, Tag, Tooltip
} from "antd";
import {
    ClockCircleOutlined,
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined
} from "@ant-design/icons";
import HumanResources from "../../../services/human-resources";
import AuthenticationService from "../../../services/authentication.service";
import {useLoaderData, useNavigate} from "react-router-dom";
import {useState} from "react";
import {capitaliseFirstLetters, deleteColor, editColor, MONTHS, refreshPage} from "../../../common";


export async function retrieveAllPayrollRecordsLoader() {
    try {
        const response = await HumanResources.getActiveYearPayrollRecordsByInstitutionId(
            AuthenticationService.getUserTenantId()
        );
        if (response.status === 200) {
            const payrollRecords = response.data;
            return {payrollRecords};
        }
    } catch (error) {
        return []
    }
}

const PayrollRecords = () => {
    const {payrollRecords} = useLoaderData();
    const navigate = useNavigate();

    const [compensationElementsData, setCompensationElementsData] = useState([]);

    const [code, setCode] = useState('');
    const [amount, setAmount] = useState(null);
    const [description, setDescription] = useState(null);
    const [isActive, setIsActive] = useState(false)

    const [isCompensationElementsOpen, setIsCompensationElementsOpen] = useState(false);
    const [isNewCompensationElementModalOpen, setIsNewCompensationElementModalOpen] = useState(false);
    const [compensationElementType, setCompensationElementType] = useState('');
    const [isCreateNewCompensationElementBtnDisabled, setIsCreateNewCompensationElementBtnDisabled] = useState(false);
    const [isProcessPayrollModalOpen, setIsProcessPayrollModalOpen] = useState(false);
    const [isProcessPayrollBtnDisabled, setIsProcessPayrollBtnDisabled] = useState(false);
    const [isEditCompensationElementModalOpen, setIsEditCompensationElementModalOpen] = useState(false);
    const [isEditCompensationElementBtnDisabled, setIsEditCompensationElementBtnDisabled] = useState(false);
    const [currentCompensationElement, setCurrentCompensationElement] = useState({});

    const [month, setMonth] = useState('');

    const payrollRecordsData = payrollRecords.map(
        payrollRecord => ({
            id: payrollRecord?.id,
            year: payrollRecord?.year?.name,
            month: payrollRecord?.month
        })
    )


    const payrollRecordsTableColumns = [
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year'
        },
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month'
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
                            onClick={() => navigate(`/admin/ancillary-staff/payroll-records/${record}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Payroll Record">
                        <Popconfirm
                            title="Delete payroll record"
                            description="Are you sure you want to delete this payroll record?"
                            onConfirm={() => console.log("not implemented")}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="danger" style={{color: deleteColor}} icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ]

    const items = [
        {
            label: 'Earnings',
            key: '1',
            onClick: () => handleFetchCompensationElements('earning')
        },
        {
            label: 'Deductions',
            key: '2',
            onClick: () => handleFetchCompensationElements('deduction')
        },
        {
            label: 'Process payroll',
            key: '3',
            onClick: () => setIsProcessPayrollModalOpen(true)
        }
    ];

    const handleFetchCompensationElements = async (element) => {
        if (element === 'earning') {
            setIsCompensationElementsOpen(true);
            setCompensationElementType('earning');
            try {
                const response = await HumanResources.getCompensationElementsByInstitutionIdAndType(
                    AuthenticationService.getUserTenantId(),
                    'Earning'
                )

                if(response?.status === 200) {
                    setCompensationElementsData(response?.data);
                }
            } catch (e) {

            }
        }

        if (element === 'deduction') {
            setIsCompensationElementsOpen(true);
            setCompensationElementType('deduction');
            const response = await HumanResources.getCompensationElementsByInstitutionIdAndType(
                AuthenticationService.getUserTenantId(),
                'Deduction'
            )

            if(response?.status === 200) {
                setCompensationElementsData(response?.data);
            }
        }
    }

    const handleSubmitNewCompensationElement = async () => {
        if(code === '') {
            message.error(`Please enter ${compensationElementType} code or name.`);
            return
        }
        if(amount === null) {
            message.error(`Please enter ${compensationElementType} amount.`);
            return
        }

        setIsCreateNewCompensationElementBtnDisabled(true);

        try {
            const response = await HumanResources.createCompensationElement({
                code: code,
                amount: amount,
                is_active: isActive,
                type: capitaliseFirstLetters(compensationElementType),
                description: description,
                institution: AuthenticationService.getUserTenantId()
            })
            if(response?.status === 201) {
                message.success(`${capitaliseFirstLetters(compensationElementType)} created.`);
                setIsCreateNewCompensationElementBtnDisabled(false);
                setCompensationElementType("");
                setIsNewCompensationElementModalOpen(false);
                setIsCompensationElementsOpen(false);
                refreshPage();
            }
        } catch (e) {
            if(e?.response?.status === 404) {
                message.error(e?.response?.data?.errors)
            }
            if(e?.response?.status === 400) {
                message.error(e?.response?.data?.errors)
            }
        }
    }

    const onChange = (e) => {
        if(e.target.checked === true) {
            setIsActive(true);
        } else {
            setIsActive(true);
        }
    };

    const handleOnChangeAmount = (value) => {
        setAmount(value);
    }

    const handleProcessPayroll = async () => {
        if(month === '') {
            message.error('Please select the payroll month.');
            return
        }

        setIsProcessPayrollBtnDisabled(true);
        try {
            const response = await HumanResources.processPayroll({
                institution: AuthenticationService.getUserTenantId(),
                month: month
            })
            if(response?.status === 201) {
                message.success('Payroll processed.');
                refreshPage();
            }
        } catch (e) {
            setIsProcessPayrollBtnDisabled(false);
            if(e?.response?.status === 400) {
                for(let i = 0; i < e?.response?.data?.errors.length; i++) {
                    message.error(e?.response?.data?.errors[i]);
                }
            }
            message.error('Payroll not processed.');
        }
    }

    const handleChangeMonth = (value) => {
        setMonth(value);
    };

    const handleDeleteCompensationElement = async (id) => {
        try {
            const response = await HumanResources.deleteCompensationElement(id);
            if(response.status === 204) {
                message.success("Compensation element deleted successfully.");
                refreshPage();
            }
        } catch (error) {
            message.error("An error occurred while deleting compensation element.");
        }
    }

    const handleSubmitEditCompensationElement = async (values) => {
        setIsEditCompensationElementBtnDisabled(true);
        try {
            const response = await HumanResources.updateCompensationElement(
                currentCompensationElement?.id,
                values
            );
            if(response.status === 200) {
                message.success("Compensation element updated successfully.");
                refreshPage();
            }
        } catch (error) {
            message.error("An error occurred while updating compensation element.");
        }
    }

    const handleOpenEditCompensationElementModal = async (data) => {
        setCurrentCompensationElement(data);
        setIsEditCompensationElementModalOpen(true);
    }

    return (
        <div className='mx-5'>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Payroll records</h3>
                <Dropdown menu={{items}}>
                    <Button
                        icon={<ClockCircleOutlined/>}
                        className='border-0 px-3 text-white'
                        style={{background: '#39b54a'}}
                    >
                        <Space>
                            Quick actions...
                            <DownOutlined/>
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <Divider className='my-1 mb-3' type={"horizontal"}/>

            <Table
                columns={payrollRecordsTableColumns}
                dataSource={payrollRecordsData}
            />

            <Drawer
                open={isCompensationElementsOpen}
                onClose={() => {
                    setIsCompensationElementsOpen(false);
                    setCompensationElementType('');
                }}
                extra={
                    <Space>
                        <Button
                            icon={<PlusOutlined/>}
                            type="primary"
                            className='rounded-circle bg-dark'
                            onClick={() => setIsNewCompensationElementModalOpen(true)}
                        ></Button>
                    </Space>
                }
            >
                <h4>{`${capitaliseFirstLetters(compensationElementType)}s`}</h4>
                {
                    compensationElementsData &&
                    compensationElementsData.map(
                        compensationElementsDataItem => (
                            <div key={compensationElementsDataItem?.id}>
                                <Divider type={"horizontal"} />
                                <div>
                                    <EditOutlined
                                        className='border border-warning rounded-1 bg-warning p-1 me-1 mb-1'
                                        style={{
                                            color: "white"
                                        }}
                                        onClick={() => handleOpenEditCompensationElementModal(compensationElementsDataItem)}
                                    />
                                    <DeleteOutlined
                                        className='border border-danger bg-danger p-1 rounded-1'
                                        style={{
                                            color: "white"
                                        }}
                                        onClick={() => handleDeleteCompensationElement(compensationElementsDataItem?.id)}
                                    />
                                </div>
                                <p className='small text-muted m-0'>Code</p>
                                <span className='d-block'>{compensationElementsDataItem?.code}</span>
                                <p className='small text-muted m-0'>Amount</p>
                                <span className='d-block'>${compensationElementsDataItem?.amount}</span>
                                <p className='small text-muted m-0'>Description</p>
                                <span className='d-block'>{compensationElementsDataItem?.description}</span>
                                <p className='small text-muted m-0'>Active</p>
                                <span className='d-block'>
                                    {
                                        compensationElementsDataItem?.is_active ?
                                            (
                                                <Tag
                                                    className='bg-success border-success text-light'
                                                >
                                                    Active
                                                </Tag>
                                            ) : (
                                                <Tag
                                                    className='bg-danger border-danger text-light'
                                                >
                                                    Inactive
                                                </Tag>
                                            )
                                    }
                                </span>
                            </div>
                        )
                    )
                }
            </Drawer>

            <Modal
                open={isNewCompensationElementModalOpen}
                okButtonProps={{
                    className: 'd-none'
                }}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                onCancel={() => setIsNewCompensationElementModalOpen(false)}
                destroyOnClose={true}
                title={`Add new ${compensationElementType}.`}
            >
                <Form
                    layout={"vertical"}
                >
                    <Form.Item
                        label='Code'
                    >
                        <Input
                            size={"large"}
                            onChange={e => setCode(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Description'
                    >
                        <Input.TextArea
                            onChange={e => setDescription(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Amount'
                    >
                        <InputNumber
                            size={"large"}
                            onChange={handleOnChangeAmount}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Active'
                    >
                        <Checkbox onChange={onChange}>Active</Checkbox>
                    </Form.Item>

                    <Button
                        onClick={handleSubmitNewCompensationElement}
                        size={"large"}
                        type={"primary"}
                        loading={isCreateNewCompensationElementBtnDisabled}
                        disabled={isCreateNewCompensationElementBtnDisabled}
                        block
                    >
                        Submit
                    </Button>
                </Form>

            </Modal>


            <Modal
                open={isProcessPayrollModalOpen}
                okButtonProps={{
                    className: 'd-none'
                }}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                onCancel={() => setIsProcessPayrollModalOpen(false)}
                destroyOnClose={true}
                title={`Process payroll.`}
            >
                <Form
                    layout={"vertical"}
                >
                    <Form.Item
                        label='Year'
                    >
                        <Input
                            size={"large"}
                            placeholder='Current year'
                            disabled
                        />
                    </Form.Item>

                    <Form.Item
                        label='Month'
                    >
                        <Select
                            size={"large"}
                            options={MONTHS}
                            onChange={handleChangeMonth}
                        />
                    </Form.Item>

                    <Button
                        onClick={handleProcessPayroll}
                        size={"large"}
                        type={"primary"}
                        loading={isProcessPayrollBtnDisabled}
                        disabled={isProcessPayrollBtnDisabled}
                        block
                    >
                        Submit
                    </Button>
                </Form>

            </Modal>


            <Modal
                open={isEditCompensationElementModalOpen}
                okButtonProps={{
                    className: 'd-none'
                }}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                onCancel={() => setIsEditCompensationElementModalOpen(false)}
                destroyOnClose={true}
                title='Edit compensation element.'
            >
                <Form
                    layout={"vertical"}
                    onFinish={handleSubmitEditCompensationElement}
                >
                    <Form.Item
                        label='Code'
                        name='code'
                        initialValue={currentCompensationElement?.code}
                    >
                        <Input
                            size={"large"}
                            name='code'
                        />
                    </Form.Item>

                    <Form.Item
                        label='Description'
                        name='description'
                        initialValue={currentCompensationElement?.description}
                    >
                        <Input.TextArea
                            name='description'
                        />
                    </Form.Item>

                    <Form.Item
                        label='Amount'
                        name='amount'
                        initialValue={currentCompensationElement?.amount}
                    >
                        <InputNumber
                            size={"large"}
                            name='amount'
                        />
                    </Form.Item>

                    <Form.Item
                        label='Active'
                        name='is_active'
                        initialValue={currentCompensationElement?.is_active}
                    >
                        <Checkbox
                            defaultChecked={currentCompensationElement?.is_active}
                            name='is_active'
                            onChange={onChange}
                        >
                            Active
                        </Checkbox>
                    </Form.Item>

                    <Button
                        htmlType={"submit"}
                        size={"large"}
                        type={"primary"}
                        loading={isEditCompensationElementBtnDisabled}
                        disabled={isEditCompensationElementBtnDisabled}
                        block
                    >
                        Save
                    </Button>
                </Form>

            </Modal>
        </div>
    )
}

export default PayrollRecords