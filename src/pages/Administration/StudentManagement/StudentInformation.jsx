import {useLoaderData, useLocation, useNavigate} from "react-router-dom";
import StudentService from "../../../services/student.service";
import {
    Button,
    Card,
    Divider,
    Dropdown,
    Form,
    Input,
    Modal,
    Space,
    Tag,
    message,
    Empty,
    Image,
    Popconfirm, Select
} from "antd";
import {
    BarChartOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined, DeleteOutlined,
    DownloadOutlined,
    DownOutlined,
    EditOutlined,
    PauseCircleOutlined,
    PlusCircleOutlined, PlusOutlined,
    PrinterOutlined,
    QuestionOutlined,
    StopOutlined,
    SwapOutlined,
    TrophyOutlined,
    UpCircleOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import {useRef, useState} from "react";
import NewParent from "./NewParent";
import parentService from "../../../services/parent.service";
import UploadStudentBirthCertificate from "./UploadStudentBirthCertificate";
import {useReactToPrint} from "react-to-print";
import SuspendStudent from "./SuspendStudent";
import suspensionService from "../../../services/suspension-service";
import ExpelStudent from "./ExpelStudent";
import DeleteStudentModal from "./DeleteStudentModal";
import {refreshPage} from "../../../common";
import PromoteStudentModal from "./PromoteStudentModal";
import ParentService from "../../../services/parent.service";
import AuthenticationService from "../../../services/authentication.service";
import BackButton from "../../../common/BackButton";
import studentClassService from "../../../services/student-class.service";

export async function studentInformationLoader({params}) {
    try {
        const response = await StudentService.get(params?.id);
        const parentResponse = await parentService.getParentByStudentId(params?.id);
        if (response?.status === 200 || parentResponse?.status === 200) {
            const student = response.data;
            const parents = parentResponse.data;

            return {student, parents};
        }
    } catch (e) {
        return [];
    }
}

const StudentInformation = ({params}) => {
    const [newParentModalState, setNewParentModalState] = useState(false);
    const [suspenStudentModalState, setSuspendStudentModalState] =
        useState(false);
    const [expelStudentModalState, setExpelStudentModalState] = useState(false);
    const [uploadStudentDocumentModalState, setUploadStudentDocumentModalState] =
        useState(false);
    const [viewStudentDocumentModalState, setViewStudentDocumentModalState] =
        useState(false);
    const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false)
    const [showPromoteStudentModal, setShowPromoteStudentModal] = useState(false)
    const [selectExistingParentModalState, setSelectExistingParentModalState] = useState(false)
    const [selectExistingParentBtnLoading, setSelectExistingParentBtnLoading] = useState(false)
    const [selectedParentId, setSelectedParentId] = useState(null)
    const [allParents, setAllParents] = useState([])

    const {student, parents} = useLoaderData();

    const navigate = useNavigate();
    const location = useLocation();
    const studentId = location.pathname.split("/")[3];

    const showModal = () => {
        setNewParentModalState(true);
    };

    const showSuspensionModal = () => {
        setSuspendStudentModalState(true);
    };

    const showExpusionModal = () => {
        setExpelStudentModalState(true);
    };

    const parentAccountExist = async (e) => {
        setSelectExistingParentModalState(true);
        try {
            const response = await ParentService.getParentByInstitutionId(
                AuthenticationService.getUserTenantId()
            );
            if (response.status === 200) {
                const $parents = response.data;
                const options = $parents.map((_parent) => ({
                    value: _parent?.user?.id,
                    label: `${_parent?.user?.firstName} ${_parent?.user?.lastName}(${_parent?.user?.username})`,
                }));
                setAllParents(options);
            }
        } catch (error) {
            message.error("An error occurred. Please check your network connection.");
        }
    };
    const parentAccountDoesNotExist = (e) => {
        showModal();
    };

    const handleSelectParent = (value) => {
        setSelectedParentId(value)
    }

    const items = [
        {
            label: "View academic information",
            key: "1",
            icon: <BarChartOutlined/>,
            onClick: () =>
                navigate(`/admin/students/${student?.id}/academic-information`),
        },
        {
            label: <Popconfirm
                title="Add parent information"
                description="Does the parent already have another account?"
                onConfirm={parentAccountExist}
                onCancel={parentAccountDoesNotExist}
                okText="Yes"
                cancelText="No"
            >
                Add parent information
            </Popconfirm>,
            key: "2",
            icon: <PlusCircleOutlined/>,
        },
        {
            label: "Upload birth certificate",
            key: "3",
            icon: <UploadOutlined/>,
            onClick: () => {
                setUploadStudentDocumentModalState(true);
            },
        },
        {
            label: "View birth certificate",
            key: "4",
            icon: <DownloadOutlined/>,
            onClick: () => {
                // handleFetchBirthCertificate();
                setViewStudentDocumentModalState(true);
            },
        },
        {
            label: "Update student",
            key: "5",
            icon: <EditOutlined/>,
            onClick: () => {
                navigate(`/admin/students/${studentId}/edit`);
            },
        },
        {
            label: student?.status === "SUSPENDED" ? "Unsuspend Student" : "Suspend Student",
            key: "6",
            onClick: () => {
                if (student?.status === "SUSPENDED") {
                    handleUnsuspend()
                } else {
                    showSuspensionModal()
                }
            },
            icon: student?.status === "SUSPENDED" ? <PauseCircleOutlined/> : <UpCircleOutlined/>,
            disabled: student?.status === "EXPELLED" || student?.status === "TRANSFERRED" || student?.status === "INACTIVE"
        },
        {
            label: "Transfer Student",
            key: "8",
            onClick: () => handleTransfer(),
            icon: <SwapOutlined/>,
            disabled: student?.status === "EXPELLED" || student?.status === "TRANSFERRED"

        },
        {
            label: "Expel Student",
            key: "9",
            onClick: () => showExpusionModal(),
            icon: <CloseCircleOutlined/>,
            disabled: student?.status === "EXPELLED" || student?.status === "TRANSFERRED"

        },
        {
            label: "Upgrade Student Level",
            key: "10",
            onClick: () => setShowPromoteStudentModal(true),
            icon: <UpCircleOutlined/>
        },
        {
            label: "Delete Student",
            key: "11",
            onClick: () => setShowDeleteStudentModal(true),
            icon: <DeleteOutlined/>
        },
    ];

    const menuProps = {
        items,
    };

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Birth certificate for ${student && student?.user?.regNumber}`,
    });

    const fullname = student?.user?.firstName + " " + student?.user?.lastName;

    const renderStatusTag = (status) => {
        let tagProps = {
            color: "",
            className: "py-1 px-1 text-end",
            icon: null,
        };

        switch (status) {
            case "ACTIVE":
                tagProps.color = "success";
                tagProps.icon = <CheckCircleOutlined/>;
                break;
            case "GRADUATED":
                tagProps.color = "blue";
                tagProps.icon = <TrophyOutlined/>;
                break;
            case "EXPELLED":
                tagProps.color = "red";
                tagProps.icon = <CloseCircleOutlined/>;
                break;
            case "TRANSFERRED":
                tagProps.color = "orange";
                tagProps.icon = <SwapOutlined/>;
                break;
            case "SUSPENDED":
                tagProps.color = "warning";
                tagProps.icon = <StopOutlined/>;
                break;
            default:
                tagProps.color = "default";
                tagProps.icon = <QuestionOutlined/>;
                break;
        }

        return <Tag {...tagProps}>{status}</Tag>;
    };

    const handleUnsuspend = async () => {
        try {
            const data = {
                student,
            };
            const response = await suspensionService.unsuspend(data, studentId);

            if (response.status === 201) {
                message.success("Student Unsuspended Successifully");
                refreshPage();
            } else {
                message.error("An error occurred, please check your network.");
            }
        } catch (error) {
            message.error("An error occurred. Please check your network connection.");
        }
    };

    const handleTransfer = async () => {
        try {
            const data = {
                student,
            };
            const response = await suspensionService.transfer(data, studentId);

            await studentClassService.removeStudentFromClassByStudentId(studentId)

            navigate(-1);

            await window.location.reload();
            message.success("Student Transferred Successfully");
        } catch (error) {
            message.error("An error occurred. Please check your network connection.");
        }
    };

    const onParentSearch = (value) => {
        console.log('search:', value);
    };

    const parentFilterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleAddStudentToParent = async () => {
        if (!selectedParentId) {
            message.error("Please select a parent.")
            return
        }

        if (!student?.id) {
            message.error("An error occurred. Please refresh the page and try again.");
            return
        }

        try {
            setSelectExistingParentBtnLoading(true);
            const response = await StudentService.addStudentToParent(
                {
                    student: student?.id,
                    parent: selectedParentId
                }
            );
            if (response.status === 200) {
                message.success("Student added to parent successfully");
                setSelectExistingParentModalState(false);
                setSelectExistingParentBtnLoading(false);
                refreshPage()
            } else {
                message.error("An error occurred. Please check your network connection.");
                setSelectExistingParentBtnLoading(false);
            }
        } catch (error) {
            message.error(
                error?.response?.data?.error ?? "An error occurred. Please check your network connection."
            );
            setSelectExistingParentBtnLoading(false);
        }
    }

    return (
        <div className='mx-5'>
            <div className="d-flex justify-content-between align-content-center">
                <BackButton />
                <Dropdown menu={menuProps}>
                    <Button
                        icon={<ClockCircleOutlined/>}
                        className="border-0 px-3 text-white"
                        style={{background: "#39b54a"}}
                    >
                        <Space>
                            Quick actions...
                            <DownOutlined/>
                        </Space>
                    </Button>
                </Dropdown>
            </div>

            <Divider className='my-3' type={"horizontal"}/>

            <div className='d-flex justify-content-between align-items-center mb-3'>
                <h4>Student information</h4>
                <div>
                    Status: &nbsp; &nbsp;
                    {renderStatusTag(student?.status)}
                </div>
            </div>

            <Form layout={"vertical"}>
                <fieldset>
                    <div className="row mb-2">
                        <div className="col-md-3">
                            <Card className="pb-5">
                                <Form.Item label="First name">
                                    <Input size={"large"} value={student?.user?.firstName}/>
                                </Form.Item>
                                <Form.Item className="py-3" label="Middle names">
                                    <Input size={"large"} value={student?.user?.middleNames}/>
                                </Form.Item>
                                <Form.Item label="Last name">
                                    <Input size={"large"} value={student?.user?.lastName}/>
                                </Form.Item>
                                <Form.Item className="py-3" label="Date of birth">
                                    <Input size={"large"} value={student?.user?.dateOfBirth}/>
                                </Form.Item>
                                <Form.Item label="Gender">
                                    <Input size={"large"} value={student?.user?.gender}/>
                                </Form.Item>
                                <Form.Item className="py-3" label="National ID number">
                                    <Input size={"large"} value={student?.birthCertNumber} placeholder="63-232257R18"/>
                                </Form.Item>
                            </Card>
                        </div>
                        <div className="col-md-9">
                            <div className="row mb-2">
                                <div className="col-md-12">
                                    <Card>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <Form.Item label="Registration number">
                                                    <Input
                                                        size={"large"}
                                                        value={student?.user?.username}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className="col-md-4">
                                                <Form.Item label="Email">
                                                    <Input size={"large"} value={student?.user?.email}/>
                                                </Form.Item>
                                            </div>
                                            <div className="col-md-4">
                                                <Form.Item label="Phone number">
                                                    <Input
                                                        size={"large"}
                                                        value={student?.user?.phoneNumber}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12 my-2">
                                    <Card>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <Form.Item label="Province">
                                                    <Input size={"large"} value={student?.province}/>
                                                </Form.Item>
                                            </div>
                                            <div className="col-lg-6">
                                                <Form.Item label="Nationality">
                                                    <Input size={"large"} value={student?.nationality}/>
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <Form.Item label="Address">
                                                    <Input size={"large"} value={student?.address}/>
                                                </Form.Item>
                                            </div>
                                            <div className="col-md-4">
                                                <Form.Item label="Residence status">
                                                    <Input
                                                        size={"large"}
                                                        value={student?.residenceType}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className="col-md-4">
                                                <Form.Item label="Enrollment date">
                                                    <Input
                                                        size={"large"}
                                                        value={student?.enrollmentDate}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12 my-2">
                                    <Card>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <Form.Item label="Allergies">
                                                    <Input.TextArea
                                                        size={"small"}
                                                        value={student?.allergies}
                                                    />
                                                </Form.Item>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <Form.Item label="Medical aid name">
                                                            <Input
                                                                size={"large"}
                                                                value={student?.medicalAidName}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Form.Item
                                                            className="py-1"
                                                            label="Medical aid number"
                                                        >
                                                            <Input
                                                                size={"large"}
                                                                value={student?.medicalAidNumber}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                <Form.Item label='Inclusive Needs'>
                                                    <Input.TextArea
                                                        value={student?.inclusive_needs}
                                                        size={"small"}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </Form>

            <Form layout="vertical">
                <fieldset>
                    <legend className="text-bold">
                        <h4>Parent Information</h4>
                    </legend>

                    {parents?.map((parentData, key) => (
                        <div className="row" key={key}>
                            <div className="col-md-3">
                                <Card>
                                    <Form.Item label="First name">
                                        <Input size="large" value={parentData?.user?.firstName}/>
                                    </Form.Item>
                                    <Form.Item label="Username">
                                        <Input size="large" value={parentData?.user?.username}/>
                                    </Form.Item>
                                    <Form.Item label="Last name">
                                        <Input size="large" value={parentData?.user?.lastName}/>
                                    </Form.Item>
                                    <Form.Item label="Email">
                                        <Input size="large" value={parentData?.user?.email}/>
                                    </Form.Item>
                                    <Form.Item label="Password">
                                        <Input size="large" value={parentData?.user?.password}/>
                                    </Form.Item>
                                </Card>
                            </div>
                            <div className="col-md-9">
                                <div className="row mb-2">
                                    <div className="col-lg-6 col-md-6">
                                        <Card>
                                            <Form.Item label="Address">
                                                <Input size={"large"} value={parentData?.address}/>
                                            </Form.Item>
                                            <Form.Item label="Gender">
                                                <Input size="large" value={parentData?.user?.gender}/>
                                            </Form.Item>
                                        </Card>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <Card>
                                            <Form.Item label="Phone number">
                                                <Input
                                                    size="large"
                                                    value={parentData?.user?.phoneNumber}
                                                />
                                            </Form.Item>
                                            <Form.Item label="NationalId">
                                                <Input size="large" placeholder="63-232257R18"
                                                       value={parentData?.nationalId}/>
                                            </Form.Item>
                                        </Card>
                                    </div>
                                </div>
                                <Card className="mt-4">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <Form.Item label="Employer Address">
                                                        <Input
                                                            size="large"
                                                            value={parentData?.employer_address}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <Form.Item label="Occupation">
                                                        <Input
                                                            size="large"
                                                            value={parentData?.occupation}
                                                        />
                                                    </Form.Item>
                                                </div>
                                                <div className="col-md-6">
                                                    <Form.Item label="Monthly income">
                                                        <Input
                                                            size="large"
                                                            value={parentData?.monthlyIncome}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <Form.Item label="Parent type">
                                                <Input size="large" value={parentData?.parentType}/>
                                            </Form.Item>
                                            <Form.Item label="Single parent">
                                                <Input size="large" value={parentData?.singleParent}/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    ))}

                    {parents?.length < 1 && (
                        <Card>
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="text-center mt-1">
                                    <Empty description={false}/>
                                    <p className="lead mt-4 mb-0">
                                        Student has no parent information
                                    </p>
                                    <p className="fw-light mt-1 mb-0">
                                        Please Add Parent Data for Student
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </fieldset>
            </Form>

            <NewParent
                open={newParentModalState}
                params={params}
                close={() => setNewParentModalState(false)}
            />
            <SuspendStudent
                open={suspenStudentModalState}
                studentId={student?.id}
                fullname={fullname}
                params={params}
                close={() => setSuspendStudentModalState(false)}
            />
            <ExpelStudent
                open={expelStudentModalState}
                studentId={student?.id}
                fullname={fullname}
                params={params}
                close={() => setExpelStudentModalState(false)}
            />
            <DeleteStudentModal
                open={showDeleteStudentModal}
                userId={student?.user?.id}
                fullname={fullname}
                close={() => setShowDeleteStudentModal(false)}
            />
            <UploadStudentBirthCertificate
                open={uploadStudentDocumentModalState}
                close={() => setUploadStudentDocumentModalState(false)}
                id={student?.id}
            />
            <PromoteStudentModal
                open={showPromoteStudentModal}
                close={() => setShowPromoteStudentModal(false)}
                studentId={student?.id}
                fullname={fullname}
            />

            <Modal
                open={viewStudentDocumentModalState}
                onCancel={() => setViewStudentDocumentModalState(false)}
                cancelButtonProps={{
                    className: "d-none",
                }}
                okButtonProps={{
                    className: "d-none",
                }}
                destroyOnClose={true}
                width={1000}
                centered={true}
            >
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <div ref={componentRef} className="print-center">
                        <Image
                            height={400}
                            alt="Birth Certificate"
                            className="img-fluid"
                            src={student.document}
                            fallback="data:image/png;base64,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"
                        />
                    </div>

                        {(!student.document) &&
                            <div className="text-danger mt-2">Student did not upload their birth certificate</div>
                        }

                        <Button
                            icon={<PrinterOutlined/>}
                            type={"primary"}
                            className="mt-4 px-2"
                            disabled={!student.document}
                            onClick={handlePrint}
                        >
                            Print
                        </Button>
                    </div>
            </Modal>

            <Modal
                open={selectExistingParentModalState}
                onCancel={() => setSelectExistingParentModalState(false)}
                cancelButtonProps={{
                    className: "d-none",
                }}
                okButtonProps={{
                    className: "d-none",
                }}
                destroyOnClose={true}
                title={"Select existing parent"}
            >
                <Form layout={"vertical"}>
                    <Form.Item label="Select parent" help='Search the parent by USERNAME and select.'>
                        <Select
                            size={"large"}
                            showSearch
                            placeholder="Select parent"
                            optionFilterProp="children"
                            onSearch={onParentSearch}
                            filterOption={parentFilterOption}
                            options={allParents}
                            onChange={handleSelectParent}
                        />
                    </Form.Item>
                    <Button
                        icon={<PlusOutlined/>}
                        loading={selectExistingParentBtnLoading}
                        disabled={selectExistingParentBtnLoading}
                        onClick={handleAddStudentToParent}
                        className='mt-2'
                        type={"primary"}
                        size={"large"}
                        block
                    >
                        Add parent
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default StudentInformation;
