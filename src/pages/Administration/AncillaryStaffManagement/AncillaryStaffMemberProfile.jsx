import HumanResources from "../../../services/human-resources";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {
    ArrowLeftOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    DownOutlined,
    EditOutlined, PictureOutlined, PlusOutlined, UserOutlined
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card, Checkbox, DatePicker,
    Divider,
    Drawer,
    Dropdown,
    Empty,
    Form,
    Input,
    InputNumber,
    message,
    Modal, Select,
    Space,
    Tag
} from "antd";
import {useEffect, useState} from "react";
import AddEducationalQualification from "./AddEducationalQualification";
import {_CURRENCY_CODES, capitaliseFirstLetters, refreshPage} from "../../../common";
import AuthenticationService from "../../../services/authentication.service";
import dayjs from "dayjs";

export async function retrieveAncillaryStaffMemberLoader({params}) {
    try {
        const response = await HumanResources.getEmployee(params?.id);
        if(response.status === 200) {
            const ancillaryStaffMember = response.data;
            return {ancillaryStaffMember};
        }
    } catch (error) {
        return {}
    }
}
const AncillaryStaffMemberProfile = () => {
    const {ancillaryStaffMember} = useLoaderData();
    const navigate = useNavigate();
    const dateFormat = 'YYYY/MM/DD';

    const [isAddEducationalQualificationModalOpen, setIsAddEducationalQualificationModalOpen] = useState(false);
    const [updateAncillaryStaffMemberPictureModal, setUpdateAncillaryStaffMemberPictureModal] = useState(false);
    const [isUpdateAncillaryStaffMemberPictureBtnDisabled, setIsUpdateAncillaryStaffMemberPictureBtnDisabled] = useState(false);
    const [isSalaryAdjustmentsDrawerOpen, setIsSalaryAdjustmentsDrawerOpen] = useState(false);
    const [isSalaryAdjustmentModalOpen, setIsSalaryAdjustmentModalOpen] = useState(false);
    const [isCreateNewSalaryAdjustmentBtnDisabled, setIsCreateNewSalaryAdjustmentBtnDisabled] = useState(false);

    const [isActive, setIsActive] = useState(false);
    const [effectiveFrom, setEffectiveFrom] = useState('');
    const [currency, setCurrency] = useState('');
    const [salary, setSalary] = useState(null);
    const [compensationElements, setCompensationElements] = useState([]);

    const [compensationElementsFetchedData, setCompensationElementsFetchedData] = useState([]);

    const [employeeSalaryAdjustmentsData, setEmployeeSalaryAdjustmentsData] = useState([]);

    const [isDeleteSalaryAdjustmentBtnLoading, setIsDeleteSalaryAdjustmentBtnLoading] = useState(false);

    const [isEditSalaryAdjustmentModalOpen, setIsEditSalaryAdjustmentModalOpen] = useState(false);
    const [isEditSalaryAdjustmentBtnDisabled, setIsEditSalaryAdjustmentBtnDisabled] = useState(false);
    const [currentSalaryAdjustment, setCurrentSalaryAdjustment] = useState({});
    const [editEffectiveFrom, setEditEffectiveFrom] = useState('');

    const compensationElementsFetchedDataOptions = compensationElementsFetchedData.map(
        compensationElementsFetchedDataItem => ({
            value: compensationElementsFetchedDataItem?.id,
            label: `(${compensationElementsFetchedDataItem?.type} $${compensationElementsFetchedDataItem?.amount}) 
            ${compensationElementsFetchedDataItem?.code}`
        })
    )

    const handleFetchCompensationElements = async () => {
        try {
            const response = await HumanResources.getCompensationElementsByInstitutionId(
                AuthenticationService.getUserTenantId()
            )
            if(response?.status === 200) {
                setCompensationElementsFetchedData(response?.data);
            }
        } catch (e) {
            setCompensationElementsFetchedData([]);
        }
    }

    useEffect(
        () => {
            handleFetchCompensationElements()
        }, []
    )

    const handleSubmitNewSalaryAdjustment = async () => {
        if(effectiveFrom === '') {
            message.error('Please select the effective from date.');
            return
        }

        if(salary === null) {
            message.error('Please enter salary.');
            return
        }

        if(currency === '') {
            message.error('Please select currency.');
            return
        }

        setIsCreateNewSalaryAdjustmentBtnDisabled(true);

        try {
            const response = await HumanResources.createSalaryAdjustment({
                employee: ancillaryStaffMember?.id,
                effective_from: effectiveFrom,
                currency: currency,
                salary: salary,
                is_active: true,
                compensation_elements: compensationElements
            })

            if(response?.status === 201) {
                message.success('Salary adjustment created.');
                setIsCreateNewSalaryAdjustmentBtnDisabled(false);
                setIsSalaryAdjustmentModalOpen(false);
                refreshPage();
            }
        } catch (e) {
            message.error('An error occurred. Please try again.');
            setIsCreateNewSalaryAdjustmentBtnDisabled(false);
            setIsSalaryAdjustmentModalOpen(false);
        }

    }

    const items = [
        {
            label: 'Update profile',
            key: '1',
            onClick: () => {
                navigate(`/admin/ancillary-staff/${ancillaryStaffMember?.id}/edit-profile`);
            }
        },
        {
            label: 'Salary adjustment',
            key: '2',
            onClick: () => handleFetchSalaryAdjustments()
        },
        {
            label: 'Add educational qualification',
            key: '3',
            onClick: () => {
                setIsAddEducationalQualificationModalOpen(true);
            }
        },
    ];

    const menuProps = {
        items,
    };

    const handleDeleteEducationalQualification = async (id) => {
        try {
            const response = await HumanResources.deleteEducationalQualification(id);
            if(response.status === 204) {
                message.success("Educational qualification deleted successfully");
                refreshPage();
            }
        } catch (error) {
            message.error("An error occurred while deleting educational qualification");
        }
    }


    const handleUpdateAncillaryStaffMemberPicture = async (e) => {
        e.preventDefault();
        setIsUpdateAncillaryStaffMemberPictureBtnDisabled(true);

        const form = document.getElementById('update-picture-form');
        const formData = new FormData(form);

        try {
            const response = await HumanResources.updateAncillaryStaffMemberProfilePicture(ancillaryStaffMember?.id, formData);
            if(response.status === 200) {
                message.success("Picture updated successfully.");
                refreshPage();
            }
        } catch (error) {
            message.error("An error occurred while updating picture.");
            setIsUpdateAncillaryStaffMemberPictureBtnDisabled(false);
        }
    }

    const handleFetchSalaryAdjustments = async () => {
        setIsSalaryAdjustmentsDrawerOpen(true);

        try {
            const response = await HumanResources.getSalaryAdjustmentsByEmployeeId(
                ancillaryStaffMember?.id
            )

            if(response?.status === 200) {
                setEmployeeSalaryAdjustmentsData(response?.data);
            }
        } catch (e) {
            setEmployeeSalaryAdjustmentsData([]);
        }
    }

    const onChange = (e) => {
        if(e.target.checked === true) {
            setIsActive(true);
        } else {
            setIsActive(true);
        }
    };

    const handleOnChangeSalary = (value) => {
        setSalary(value);
    }

    const handleChangeEffectiveFrom = (date, dateString) => {
        setEffectiveFrom(dateString);
    };

    const handleChangeCompensationElements = (value) => {
        setCompensationElements(value);
    }

    const handleChangeCurrency = (value) => {
        setCurrency(value);
    }


    const handleDeleteSalaryAdjustment = async (id) => {
        setIsDeleteSalaryAdjustmentBtnLoading(true);
        try {
            const response = await HumanResources.deleteSalaryAdjustment(id);
            if(response.status === 204) {
                message.success("Salary adjustment deleted successfully.");
                refreshPage();
            }
        } catch (error) {
            setIsDeleteSalaryAdjustmentBtnLoading(false);
            message.error("An error occurred while deleting salary adjustment.");
        }
    }

    const handleSubmitEditSalaryAdjustment = async (values) => {
        const valuesToSubmit = {
            ...values,
            effective_from: editEffectiveFrom
        }
        setIsEditSalaryAdjustmentBtnDisabled(true);

        try {
            const response = await HumanResources.updateSalaryAdjustment(
                currentSalaryAdjustment?.id,
                valuesToSubmit
            );
            if(response.status === 200) {
                message.success("Salary adjustment updated successfully.");
                refreshPage();
            }
        } catch (error) {
            setIsEditSalaryAdjustmentBtnDisabled(false);
            message.error("An error occurred while updating salary adjustment.");
        }
    }

    const handleOpenUpdateSalaryAdjustmentModal = (salaryAdjustment) => {
        setEditEffectiveFrom(salaryAdjustment?.effective_from);
        setCurrentSalaryAdjustment(salaryAdjustment);
        setIsEditSalaryAdjustmentModalOpen(true);
    }

    const handleChangeEditEffectiveFrom = (date, dateString) => {
        setEditEffectiveFrom(dateString);
    };

    return (
        <div className='mx-5'>
            <div className='d-flex justify-content-between'>
                <Link to={'..'}
                      onClick={(e) => {
                          e.preventDefault();
                          navigate(-1);
                      }}
                      className='text-muted text-decoration-none mb-2'
                >
                    <ArrowLeftOutlined/> Back
                </Link>
                <Dropdown menu={menuProps}>
                    <Button
                        icon={<ClockCircleOutlined />}
                        className='border-0 px-3 text-white'
                        style={{background: '#39b54a'}}
                    >
                        <Space>
                            Quick actions...
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <Divider className='mb-3' type={"horizontal"}/>

            <div className='row gy-3'>
                <div className='col-md-4'>
                    <Card
                        title='Personal information'
                    >
                        <center>
                            {
                                ancillaryStaffMember?.profile_picture ? (
                                    <img
                                        src={ancillaryStaffMember?.profile_picture}
                                        alt={ancillaryStaffMember?.user?.firstName}
                                        className='img-fluid rounded-circle shadow-sm'
                                        style={{width: '200px', height: '200px'}}
                                    />
                                ) : <Avatar icon={<UserOutlined />} size={"large"} />
                            }

                            <Button
                                className='d-block mt-3'
                                size={"small"}
                                type={"primary"}
                                ghost={true}
                                icon={<PictureOutlined />}
                                onClick={() => setUpdateAncillaryStaffMemberPictureModal(true)}
                            >Update picture</Button>
                        </center>

                        <Divider type={"horizontal"}/>

                        <div className='text-center'>
                            <span>Full name</span>
                            <p className='h6 fw-bolder'>
                                {ancillaryStaffMember?.user?.firstName} &nbsp;
                                {ancillaryStaffMember?.user?.middleNames} &nbsp;
                                {ancillaryStaffMember?.user?.lastName}
                            </p>

                            <span>Employee number</span>
                            <p>
                                <Tag className='bg-primary text-light border-primary h6 fw-bolder'>
                                    {ancillaryStaffMember?.user?.username}
                                </Tag>
                            </p>

                            <span>Gender</span>
                            <p className='h6 fw-bolder'>
                                {ancillaryStaffMember?.user?.gender}
                            </p>

                            <span>Phone number</span>
                            <p className='h6 fw-bolder'>
                                {ancillaryStaffMember?.user?.phoneNumber}
                            </p>

                            <span>Personal email</span>
                            <p className='h6 fw-bolder'>
                                {ancillaryStaffMember?.user?.email}
                            </p>

                        </div>
                    </Card>

                    <Card
                        title='Emergency contact information'
                        className='mt-3'
                    >
                        <p>
                            <span>
                                Emergency contact full name: &nbsp;
                            </span>

                            <span className='h6 fw-bolder'>
                                {ancillaryStaffMember?.emergency_contact_full_name}
                            </span>
                        </p>

                        <p>
                            <span>
                                Emergency contact relationship: &nbsp;
                            </span>

                            <span className='h6 fw-bolder'>
                                {ancillaryStaffMember?.emergency_contact_relationship}
                            </span>
                        </p>

                        <p>
                            <span>
                                Emergency contact phone number: &nbsp;
                            </span>

                            <span className='h6 fw-bolder'>
                                {ancillaryStaffMember?.emergency_contact_phone}
                            </span>
                        </p>
                    </Card>
                </div>
                <div className='col-md-8 text-muted'>
                    <Card
                        title='Employment information'
                    >
                        <p>
                            <span>
                                Employee status: &nbsp;
                            </span>

                            <span>
                                {
                                    ancillaryStaffMember?.status === 'ACTIVE' ||
                                    ancillaryStaffMember?.status === null ? <Tag
                                        className='bg-success border-success text-light h6 fw-bolder'>
                                        ACTIVE
                                    </Tag> : <Tag
                                        className='bg-warning border-warning text-light h6 fw-bolder'>
                                        {ancillaryStaffMember?.status}
                                    </Tag>
                                }
                            </span>
                        </p>

                        <p>
                            <span>
                                Job title: &nbsp;
                            </span>

                            <span className='h6 fw-bolder'>
                                {ancillaryStaffMember?.job_title}
                            </span>
                        </p>

                        <p>
                            <span>
                                Employment type: &nbsp;
                            </span>

                            <span className='h6 fw-bolder'>
                                {ancillaryStaffMember?.employment_status}
                            </span>
                        </p>

                        <p>
                            <span>
                                Compensation structure: &nbsp;
                            </span>

                            <span className='h6 fw-bolder'>
                                {ancillaryStaffMember?.compensation_structure}
                            </span>
                        </p>

                        <p>
                            <span>
                                Date of hire: &nbsp;
                            </span>

                            <span className='h6 fw-bolder'>
                                {ancillaryStaffMember?.date_of_hire}
                            </span>
                        </p>

                        <p>
                            <span>
                                Job description: &nbsp;
                            </span>

                            <span className='h6 fw-bolder'>
                                {ancillaryStaffMember?.job_description}
                            </span>
                        </p>
                    </Card>

                    <Card
                        title='Educational qualifications'
                        className='mt-3'
                    >
                        {
                            ancillaryStaffMember?.educational_experience?.length > 0 ? ancillaryStaffMember?.educational_experience?.map((qualification) => {
                                return (
                                    <div className='mb-3'>
                                        <div className='d-flex justify-content-end'>
                                            <div>
                                                <EditOutlined
                                                    className='border border-warning rounded-1 bg-warning p-1 me-1 mb-1'
                                                    style={{
                                                        color: "white"
                                                    }}
                                                    disabled
                                                />
                                                <DeleteOutlined
                                                    className='border border-danger bg-danger p-1 rounded-1'
                                                    style={{
                                                        color: "white"
                                                    }}
                                                    onClick={() => handleDeleteEducationalQualification(qualification?.id)}
                                                />
                                            </div>
                                        </div>
                                        <p>
                                            <span className='h5'>
                                                Qualification: &nbsp;
                                            </span>

                                            <span>
                                                {qualification?.qualification}
                                            </span>
                                        </p>

                                        <p>
                                            <span className='h5'>
                                                Level: &nbsp;
                                            </span>

                                            <span>
                                                {qualification?.level}
                                            </span>
                                        </p>

                                        <p>
                                            <span className='h5'>
                                                Institution: &nbsp;
                                            </span>

                                            <span>
                                                {qualification?.institution}
                                            </span>
                                        </p>

                                        <p>
                                            <span className='h5'>
                                                Dates: &nbsp;
                                            </span>

                                            <span>
                                                {qualification?.start_date} - {qualification?.end_date}
                                            </span>
                                        </p>

                                        <p>
                                            <span className='h5'>
                                                Description: &nbsp;
                                            </span>

                                            <span>
                                                {qualification?.description}
                                            </span>
                                        </p>
                                        <Divider type={"horizontal"} />
                                    </div>
                                )
                            }) :
                                <Empty
                                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                    imageStyle={{
                                        height: 60,
                                    }}
                                    description={
                                        <span>No educational qualifications</span>
                                    }
                                >
                                    <Button
                                        type="primary"
                                        onClick={() => setIsAddEducationalQualificationModalOpen(true)}
                                    >
                                        Add Now
                                    </Button>
                                </Empty>
                        }

                    </Card>
                </div>
            </div>
            <AddEducationalQualification
                isOpen={isAddEducationalQualificationModalOpen}
                isClose={() => setIsAddEducationalQualificationModalOpen(false)}
                empId={ancillaryStaffMember?.id}
            />

            <Modal
                open={updateAncillaryStaffMemberPictureModal}
                onCancel={() => setUpdateAncillaryStaffMemberPictureModal(false)}
                destroyOnClose={true}
                maskClosable={true}
                okButtonProps={{
                    className: 'd-none'
                }}
                cancelButtonProps={{
                    className: 'd-none'
                }}
            >
                <h3>Update picture</h3>
                <form
                    id={'update-picture-form'}
                    method={'PUT'}
                    encType={'multipart/form-data'}
                    onSubmit={handleUpdateAncillaryStaffMemberPicture}
                >
                    <input
                        type={"file"}
                        name={"dp"}
                        id={"profile_picture"}
                        className={"form-control form-control-lg mb-3"}
                        required
                    />

                    <Button
                        htmlType={"submit"}
                        size={"large"}
                        type={"primary"}
                        disabled={isUpdateAncillaryStaffMemberPictureBtnDisabled}
                        block
                    >
                        Submit
                    </Button>
                </form>

            </Modal>


            <Drawer
                open={isSalaryAdjustmentsDrawerOpen}
                onClose={() => setIsSalaryAdjustmentsDrawerOpen(false)}
                extra={
                    <Space>
                        <Button
                            icon={<PlusOutlined/>}
                            type="primary"
                            className='rounded-circle bg-dark'
                            onClick={() => setIsSalaryAdjustmentModalOpen(true)}
                        ></Button>
                    </Space>
                }
            >
                <h4>Salary adjustments</h4>
                {
                    employeeSalaryAdjustmentsData &&
                    employeeSalaryAdjustmentsData.map(
                        employeeSalaryAdjustmentsDataItem => (
                            <div key={employeeSalaryAdjustmentsDataItem?.id}>
                                {
                                    employeeSalaryAdjustmentsDataItem?.is_active &&
                                        (
                                            <div>
                                                <EditOutlined
                                                    className='border border-warning rounded-1 bg-warning p-1 me-1 mb-1'
                                                    style={{
                                                        color: "white"
                                                    }}
                                                    onClick={() => handleOpenUpdateSalaryAdjustmentModal(employeeSalaryAdjustmentsDataItem)}
                                                />
                                                <DeleteOutlined
                                                    className='border border-danger bg-danger p-1 rounded-1'
                                                    loading={isDeleteSalaryAdjustmentBtnLoading}
                                                    style={{
                                                        color: "white"
                                                    }}
                                                    onClick={() => handleDeleteSalaryAdjustment(employeeSalaryAdjustmentsDataItem?.id)}
                                                />
                                            </div>
                                        )
                                }

                                <p className='small text-muted m-0'>Effective from</p>
                                <span className='d-block'>{employeeSalaryAdjustmentsDataItem?.effective_from}</span>
                                <p className='small text-muted m-0'>Salary</p>
                                <span className='d-block'>
                                    {employeeSalaryAdjustmentsDataItem?.currency} &nbsp;
                                    {employeeSalaryAdjustmentsDataItem?.salary}
                                </span>
                                <p className='small text-muted m-0'>Active</p>
                                <span className='d-block'>
                                    {
                                        employeeSalaryAdjustmentsDataItem?.is_active ?
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
                                {
                                    employeeSalaryAdjustmentsDataItem?.compensation_elements &&
                                    employeeSalaryAdjustmentsDataItem?.compensation_elements?.map(
                                        compensationElement => (
                                            <div
                                                key={compensationElement?.id}
                                                className='ps-3'
                                            >
                                                <Divider className='my-2' type={"horizontal"} />
                                                <span
                                                    className='small text-muted m-0'
                                                >
                                                    Code
                                                </span> &nbsp;
                                                <span>
                                                    {compensationElement?.code}
                                                </span>
                                                <br/>
                                                <span className='small text-muted m-0'>Type</span> &nbsp;
                                                <span>
                                                    {compensationElement?.type}
                                                </span>
                                                <br/>
                                                <span className='small text-muted m-0'>Amount</span> &nbsp;
                                                <span>
                                                    {compensationElement?.amount}
                                                </span>
                                            </div>
                                        )
                                    )
                                }
                                <Divider type={"horizontal"} />
                            </div>
                        )
                    )
                }
            </Drawer>

            <Modal
                open={isSalaryAdjustmentModalOpen}
                onCancel={() => setIsSalaryAdjustmentModalOpen(false)}
                destroyOnClose={true}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                okButtonProps={{
                    className: 'd-none'
                }}
            >
                <Form
                    layout={"vertical"}
                >
                    <Form.Item
                        label='Effective from'
                    >
                        <DatePicker
                            onChange={handleChangeEffectiveFrom}
                            size='large'
                            className='w-100'
                        />
                    </Form.Item>

                    <Form.Item
                        label='Salary'
                    >
                        <InputNumber
                            size={"large"}
                            onChange={handleOnChangeSalary}
                            className='w-100'
                        />
                    </Form.Item>

                    <Form.Item
                        label='Currency'
                    >
                        <Select
                            size={"large"}
                            onChange={handleChangeCurrency}
                            options={_CURRENCY_CODES}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Compensation elements'
                        help='Select deductions and earnings for this employee.'
                    >
                        <Select
                            size={"large"}
                            onChange={handleChangeCompensationElements}
                            mode={"multiple"}
                            options={compensationElementsFetchedDataOptions}
                        />
                    </Form.Item>

                    <Button
                        className='mt-3'
                        type={"primary"}
                        onClick={handleSubmitNewSalaryAdjustment}
                        size={"large"}
                        loading={isCreateNewSalaryAdjustmentBtnDisabled}
                        disabled={isCreateNewSalaryAdjustmentBtnDisabled}
                        block
                    >
                        Submit
                    </Button>
                </Form>
            </Modal>


            <Modal
                open={isEditSalaryAdjustmentModalOpen}
                onCancel={() => setIsEditSalaryAdjustmentModalOpen(false)}
                destroyOnClose={true}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                okButtonProps={{
                    className: 'd-none'
                }}
            >
                <Form
                    layout={"vertical"}
                    onFinish={handleSubmitEditSalaryAdjustment}
                >
                    <Form.Item
                        label='Effective from'
                        name='effective_from'
                        initialValue={dayjs(currentSalaryAdjustment?.effective_from, dateFormat)}
                    >
                        <DatePicker
                            onChange={handleChangeEditEffectiveFrom}
                            size='large'
                            className='w-100'
                            name='effective_from'
                        />
                    </Form.Item>

                    <Form.Item
                        label='Salary'
                        name='salary'
                        initialValue={currentSalaryAdjustment?.salary}
                    >
                        <InputNumber
                            size={"large"}
                            onChange={handleOnChangeSalary}
                            className='w-100'
                            name='salary'
                        />
                    </Form.Item>

                    <Form.Item
                        label='Currency'
                        name='currency'
                        initialValue={currentSalaryAdjustment?.currency}
                    >
                        <Select
                            size={"large"}
                            onChange={handleChangeCurrency}
                            options={_CURRENCY_CODES}
                            name={'currency'}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Compensation elements'
                        help='Select deductions and earnings for this employee.'
                        name='compensation_elements'
                        initialValue={
                            currentSalaryAdjustment?.compensation_elements?.map(
                                compensationElement => (
                                    compensationElement?.id
                                )
                            )
                        }
                    >
                        <Select
                            size={"large"}
                            onChange={handleChangeCompensationElements}
                            mode={"multiple"}
                            options={compensationElementsFetchedDataOptions}
                            name={'compensation_elements'}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Active'
                        name='active'
                        initialValue={currentSalaryAdjustment?.is_active}
                    >
                        <Checkbox
                            name='active'
                            onChange={onChange}
                            defaultChecked={currentSalaryAdjustment?.is_active}
                        >
                            Active
                        </Checkbox>
                    </Form.Item>

                    <Button
                        htmlType={"submit"}
                        size={"large"}
                        type={"primary"}
                        loading={isEditSalaryAdjustmentBtnDisabled}
                        disabled={isEditSalaryAdjustmentBtnDisabled}
                        block
                    >
                        Update
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}

export default AncillaryStaffMemberProfile;
