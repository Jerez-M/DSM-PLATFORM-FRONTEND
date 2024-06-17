import {Button, Card, DatePicker, Divider, Form, Input, InputNumber, message, Select} from "antd";
import {ArrowLeftOutlined, PlusOutlined} from "@ant-design/icons";
import {useLoaderData, useNavigate, Link} from "react-router-dom";
import {capitaliseFirstLetters, phoneNumberPrefix, refreshPage} from "../../../common";
import {useState} from "react";
import AuthenticationService from "../../../services/authentication.service";
import HumanResources from "../../../services/human-resources";
import dayjs from "dayjs";
import BackButton from "../../../common/BackButton";


export async function editAncillaryStaffMemberProfileLoader({params}) {
    try {
        const response = await HumanResources.getEmployee(params?.id);
        if (response.status === 200) {
            const ancillaryStaffMember = response.data;
            return {ancillaryStaffMember};
        }
    } catch (error) {
        return {}
    }
}

const EditAncillaryStaffMemberProfileInformation = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const {ancillaryStaffMember} = useLoaderData();
    const dateFormat = 'YYYY/MM/DD';

    const [gender, setGender] = useState(ancillaryStaffMember?.user?.gender);
    const [nationality, setNationality] = useState("");
    const [firstName, setFirstName] = useState(ancillaryStaffMember?.user?.firstName);
    const [lastName, setLastName] = useState(ancillaryStaffMember?.user?.lastName);
    const [middleNames, setMiddleNames] = useState(ancillaryStaffMember?.user?.middleNames);
    const [email, setEmail] = useState(ancillaryStaffMember?.user?.email);
    const [dateOfBirth, setDateOfBirth] = useState(ancillaryStaffMember?.user?.dateOfBirth);
    const [birthCertNumber, setBirthCertNumber] = useState(ancillaryStaffMember?.user?.birthCertNumber);
    const [emergencyContactFullName, setEmergencyContactFullName] = useState(
        ancillaryStaffMember?.emergency_contact_full_name
    );
    const [emergencyContactRelationship, setEmergencyContactRelationship] = useState(
        ancillaryStaffMember?.emergency_contact_relationship
    );
    const [jobTitle, setJobTitle] = useState(ancillaryStaffMember?.job_title);
    const [dateOfHire, setDateOfHire] = useState(ancillaryStaffMember?.date_of_hire);
    const [employmentStatus, setEmploymentStatus] = useState(ancillaryStaffMember?.employment_status);
    const [employeeStatus, setEmployeeStatus] = useState(ancillaryStaffMember?.status);
    const [salary, setSalary] = useState(ancillaryStaffMember?.salary);
    const [compensationStructure, setCompensationStructure] = useState(
        ancillaryStaffMember?.compensation_structure
    );
    const [jobDescription, setJobDescription] = useState(ancillaryStaffMember?.job_description);
    const [address, setAddress] = useState(ancillaryStaffMember?.address);

    const [isCreateNewAncillaryStaffBtn, setIsCreateNewAncillaryStaffBtn] = useState(false);

    const handleChangeDateOfBirth = (date, dateString) => {
        setDateOfBirth(dateString);
    };

    const handleChangeDateOfHire = (date, dateString) => {
        setDateOfHire(dateString);
    };

    const handleChangeGender = (value) => {
        setGender(value);
    };

    const handleChangeEmploymentStatus = (value) => {
        setEmploymentStatus(value);
    };

    const handleChangeEmployeeStatus = (value) => {
        setEmployeeStatus(value);
    }

    const handleChangeCompensationStructure = (value) => {
        setCompensationStructure(value);
    }

    const handleChangeSalary = (value) => {
        setSalary(value);
    }

    const handleFormClear = () => {
        form.resetFields();
    };

    const handleSubmitCreateNewAncillaryStaffMember = async (values) => {
        let phoneNumber;
        let emergencyContactPhone;
        if (values.phoneNumber) phoneNumber = values.countryCode + values.phoneNumber;
        if (values.emegencyContactPhone) emergencyContactPhone = values.countryCode + values.emegencyContactPhone;

        setIsCreateNewAncillaryStaffBtn(true);

        try {
            const response = await HumanResources.updateEmployee(
                ancillaryStaffMember?.id,
                {
                    user: {
                        firstName: capitaliseFirstLetters(firstName),
                        lastName: capitaliseFirstLetters(lastName),
                        middleNames: capitaliseFirstLetters(middleNames),
                        email,
                        phoneNumber,
                        dateOfBirth,
                        gender,
                        tenant: AuthenticationService.getUserTenantId(),
                        password: lastName.toUpperCase(),
                        birthCertNumber,
                    },
                    emergency_contact_full_name: emergencyContactFullName,
                    emergency_contact_phone: emergencyContactPhone,
                    emergency_contact_relationship: emergencyContactRelationship,
                    job_title: jobTitle,
                    job_description: jobDescription,
                    date_of_hire: dateOfHire,
                    employment_status: employmentStatus,
                    status: employeeStatus,
                    salary: salary,
                    compensation_structure: compensationStructure,
                    department: null,
                    address: address
                });

            if (response?.status === 200) {
                handleFormClear();
                setIsCreateNewAncillaryStaffBtn(false);
                setGender("");
                setNationality("");
                setFirstName("");
                setLastName("");
                setMiddleNames("");
                setEmail("");
                setDateOfBirth("");
                setBirthCertNumber("");
                setEmergencyContactFullName("");
                setEmploymentStatus("");
                setEmployeeStatus("");
                setSalary(null);
                setCompensationStructure("");
                setJobDescription("");
                setJobTitle("");
                setDateOfHire("");
                setEmergencyContactRelationship("");
                setAddress("");
                navigate(`/admin/ancillary-staff/${ancillaryStaffMember?.id}`)
                message.success("Profile updated successfully!");
                refreshPage();
            }
        } catch (e) {
            setIsCreateNewAncillaryStaffBtn(false);
            if (e?.response?.status === 400) {
                const data = e.response.data;
                Object.keys(data).forEach((key) => {
                    const value = data[key][0];
                    message.error(`${key}: ${value}`);
                });
            }
            console.clear();
        }
    };

    return (
        <div className='mx-5'>
            <div>
                <BackButton />
            </div>
            <Divider className='my-1' type={"horizontal"}/>

            <h3>Edit profile</h3>

            <Form
                form={form}
                layout={"vertical"}
                className="m-2"
                onFinish={handleSubmitCreateNewAncillaryStaffMember}
            >
                <div className="row gy-3">
                    <Card title="Personal information" className="col-md-12">
                        <div className="row">
                            <div className="col-md-4">
                                <Form.Item
                                    name="firstName"
                                    label="First name"
                                    rules={[{required: true, message: 'First name is required!'}]}
                                    initialValue={ancillaryStaffMember?.user?.firstName}
                                >
                                    <Input
                                        onChange={(e) => setFirstName(e.target.value)}
                                        name="firstName"
                                        size={"large"}
                                        required
                                    />
                                </Form.Item>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item
                                            name="dateOfBirth"
                                            label="Date of birth"
                                            initialValue={dayjs(ancillaryStaffMember?.user?.dateOfBirth, dateFormat)}
                                        >
                                            <DatePicker
                                                onChange={handleChangeDateOfBirth}
                                                name="dateOfBirth"
                                                size={"large"}
                                                className="w-100"
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Item
                                            name="gender"
                                            label="Gender"
                                            rules={[{required: true, message: 'Gender is required!'}]}
                                            initialValue={ancillaryStaffMember?.user?.gender}
                                        >
                                            <Select
                                                name="gender"
                                                size={"large"}
                                                onChange={handleChangeGender}
                                                options={[
                                                    {label: "Male", value: "MALE"},
                                                    {
                                                        label: "Female",
                                                        value: "FEMALE",
                                                    },
                                                ]}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <Form.Item
                                    name="middleNames"
                                    label="Middle names"
                                    initialValue={ancillaryStaffMember?.user?.middleNames}
                                >
                                    <Input
                                        onChange={(e) => setMiddleNames(e.target.value)}
                                        name="middleNames"
                                        size={"large"}
                                    />
                                </Form.Item>
                                <div className="row">
                                    <div className="col-md-12">
                                        <Form.Item
                                            name="birthCertNumber"
                                            label="Nation ID number"
                                            initialValue={ancillaryStaffMember?.user?.birthCertNumber}
                                        >
                                            <Input
                                                onChange={(e) => setBirthCertNumber(e.target.value)}
                                                name="birthCertNumber"
                                                placeholder="63-232257R18"
                                                size={"large"}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <Form.Item
                                    name="lastName"
                                    label="Last name"
                                    rules={[{required: true, message: 'Last name is required!'}]}
                                    initialValue={ancillaryStaffMember?.user?.lastName}
                                >
                                    <Input
                                        onChange={(e) => setLastName(e.target.value)}
                                        name="lastName"
                                        size={"large"}
                                        required
                                    />
                                </Form.Item>
                                <div className="row">
                                    <div className="col-md-12">
                                        <Form.Item name="nationality" label="Nationality" initialValue={"Zimbabwean"}>
                                            <Select
                                                name="nationality"
                                                size={"large"}
                                                // options={_NATIONALITIES}
                                                // onChange={handleChangeNationality}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card title="Contact information" className="col-md-12">
                        <div className="row">
                            <div className="col-md-4">
                                <Form.Item
                                    name="phoneNumber"
                                    label="Phone number"
                                    initialValue={ancillaryStaffMember?.user?.phoneNumber}
                                >
                                    <Input
                                        addonBefore={phoneNumberPrefix}
                                        name="phoneNumber"
                                        className="w-100"
                                        size={"large"}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-md-4">
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    initialValue={ancillaryStaffMember?.user?.email}
                                >
                                    <Input
                                        onChange={(e) => setEmail(e.target.value)}
                                        htmlType="email"
                                        name="email"
                                        size={"large"}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-md-4">
                                <Form.Item name="homeAddress" label="Address">
                                    <Input
                                        onChange={(e) => setAddress(e.target.value)}
                                        name="homeAddress"
                                        size={"large"}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <Form.Item
                                    name="emegencyContactPhone"
                                    label="Emergency contact phone"
                                    initialValue={ancillaryStaffMember?.emergency_contact_phone}
                                >
                                    <Input
                                        addonBefore={phoneNumberPrefix}
                                        name="emegencyContactPhone"
                                        className="w-100"
                                        size={"large"}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-md-4">
                                <Form.Item
                                    name="emegencyContactFullName"
                                    label="Emergency contact full name"
                                    initialValue={ancillaryStaffMember?.emergency_contact_full_name}
                                >
                                    <Input
                                        onChange={(e) => setEmergencyContactFullName(e.target.value)}
                                        name="emegencyContactFullName"
                                        size={"large"}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-md-4">
                                <Form.Item
                                    name="emergencyContactRelationship"
                                    label="Emergency contact relationship"
                                    initialValue={ancillaryStaffMember?.emergency_contact_relationship}
                                >
                                    <Input
                                        onChange={(e) => setEmergencyContactRelationship(e.target.value)}
                                        name="emergencyContactRelationship"
                                        size={"large"}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </Card>

                    <Card title="Employment information" className="col-md-12">
                        <div className="row">
                            <div className="col-md-4">
                                <Form.Item
                                    name="jobTitle"
                                    label="Job title"
                                    initialValue={ancillaryStaffMember?.job_title}
                                >
                                    <Input
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        name="jobTitle"
                                        size={"large"}
                                        required
                                    />
                                </Form.Item>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item
                                            name="dateOfHire"
                                            label="Date of hire"
                                            initialValue={dayjs(ancillaryStaffMember?.date_of_hire, dateFormat)}
                                        >
                                            <DatePicker
                                                onChange={handleChangeDateOfHire}
                                                name="dateOfHire"
                                                size={"large"}
                                                className="w-100"
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Item
                                            name="employmentStatus"
                                            label="Employment type"
                                            initialValue={ancillaryStaffMember?.employment_status}
                                        >
                                            <Select
                                                name="gender"
                                                size={"large"}
                                                onChange={handleChangeEmploymentStatus}
                                                options={[
                                                    {label: "Full time", value: "Full time"},
                                                    {label: "Contact", value: "Contract"},
                                                    {
                                                        label: "Part time",
                                                        value: "Part time",
                                                    },
                                                ]}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <Form.Item
                                    name="department"
                                    label="Department"
                                    initialValue={ancillaryStaffMember?.department}
                                >
                                    <Input
                                        onChange={(e) => setMiddleNames(e.target.value)}
                                        name="department"
                                        size={"large"}
                                        disabled
                                    />
                                </Form.Item>
                                <div className="row">
                                    <div className="col-md-12">
                                        <Form.Item
                                            name="compensationStructure"
                                            label="Compensation structure"
                                            initialValue={ancillaryStaffMember?.compensation_structure}
                                        >
                                            <Select
                                                name="compensationStructure"
                                                size={"large"}
                                                options={[
                                                    {label: "Hourly", value: "Hourly"},
                                                    {label: "Weekly", value: "Weekly"},
                                                    {label: "Monthly", value: "Monthly"},
                                                ]}
                                                onChange={handleChangeCompensationStructure}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="row">
                                    <div className="col-md-12">
                                        <Form.Item
                                            name="employeeStatus"
                                            label="Employee status"
                                            initialValue={ancillaryStaffMember?.status}
                                        >
                                            <Select
                                                name="employeeStatus"
                                                size={"large"}
                                                options={[
                                                    {label: "ACTIVE", value: "ACTIVE"},
                                                    {label: "ON LEAVE", value: "ON LEAVE"},
                                                    {
                                                        label: "PROBATION",
                                                        value: "PROBATION",
                                                    },
                                                    {
                                                        label: "FIELD TRIP",
                                                        value: "FIELD TRIP",
                                                    },
                                                    {
                                                        label: "OFF DUTY",
                                                        value: "OFF DUTY",
                                                    },
                                                    {
                                                        label: "DISMISSED",
                                                        value: "DISMISSED",
                                                    },
                                                    {
                                                        label: "RESIGNED",
                                                        value: "RESIGNED",
                                                    },
                                                ]}
                                                onChange={handleChangeEmployeeStatus}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className={"col-md-12"}>
                                <Form.Item
                                    name="jobDescription"
                                    label="Job description"
                                    initialValue={ancillaryStaffMember?.job_description}
                                >
                                    <Input.TextArea
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        name="jobDescription"
                                        size={"large"}
                                        autoSize={{minRows: 5}}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </Card>

                    <Button
                        size={"large"}
                        className="px-5 mt-4 ms-0 border-0 text-light"
                        disabled={isCreateNewAncillaryStaffBtn}
                        htmlType="submit"
                        icon={<PlusOutlined/>}
                        style={{background: "#39b54a", width: '200px'}}
                    >
                        Edit
                    </Button>
                </div>

            </Form>
        </div>
    )
}

export default EditAncillaryStaffMemberProfileInformation;