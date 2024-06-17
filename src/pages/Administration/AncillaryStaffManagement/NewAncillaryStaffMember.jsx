import {Button, Card, DatePicker, Divider, Form, Input, InputNumber, message, Select} from "antd";
import {ArrowLeftOutlined, PlusOutlined} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import {capitaliseFirstLetters, phoneNumberPrefix, refreshPage} from "../../../common";
import {useState} from "react";
import AuthenticationService from "../../../services/authentication.service";
import HumanResources from "../../../services/human-resources";

const NewAncillaryStaffMember = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [gender, setGender] = useState("");
    const [nationality, setNationality] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleNames, setMiddleNames] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [birthCertNumber, setBirthCertNumber] = useState("");
    const [emergencyContactFullName, setEmergencyContactFullName] = useState("");
    const [emergencyContactRelationship, setEmergencyContactRelationship] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [dateOfHire, setDateOfHire] = useState("");
    const [employmentStatus, setEmploymentStatus] = useState("");
    const [employeeStatus, setEmployeeStatus] = useState("");
    const [salary, setSalary] = useState(null);
    const [compensationStructure, setCompensationStructure] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [address, setAddress] = useState("");

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

    const handleFormClear = () => {
        form.resetFields();
    };

    const handleSubmitCreateNewAncillaryStaffMember = async (values) => {
        let phoneNumber;
        let emergencyContactPhone;
        if(values.phoneNumber) phoneNumber = values.countryCode + values.phoneNumber;
        if(values.emegencyContactPhone) emergencyContactPhone = values.countryCode + values.emegencyContactPhone;

        setIsCreateNewAncillaryStaffBtn(true);

        try {
            const response = await HumanResources.createEmployee({
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
                salary: 0,
                compensation_structure: compensationStructure,
                department: null,
                address: address
            });

            if (response?.status === 201) {
                handleFormClear();
                message.success("New ancillary staff member created successfully!");
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
                <Link to={'..'}
                      onClick={(e) => {
                          e.preventDefault();
                          navigate(-1);
                      }}
                      className='text-muted text-decoration-none mb-2'
                >
                    <ArrowLeftOutlined/> Back
                </Link>
                <h3>New Ancillary Staff Member</h3>
            </div>
            <Divider className='my-1' type={"horizontal"}/>

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
                                    rules={[{ required: true, message: 'First name is required!' }]}
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
                                        <Form.Item name="dateOfBirth" label="Date of birth">
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
                                            rules={[{ required: true, message: 'Gender is required!' }]}
                                        >
                                            <Select
                                                name="gender"
                                                size={"large"}
                                                onChange={handleChangeGender}
                                                options={[
                                                    { label: "Male", value: "MALE" },
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
                                <Form.Item name="middleNames" label="Middle names">
                                    <Input
                                        onChange={(e) => setMiddleNames(e.target.value)}
                                        name="middleNames"
                                        size={"large"}
                                    />
                                </Form.Item>
                                <div className="row">
                                    <div className="col-md-12">
                                        <Form.Item name="birthCertNumber" label="Nation ID number">
                                            <Input
                                                onChange={(e) => setBirthCertNumber(e.target.value)}
                                                name="birthCertNumber"
                                                placeholder="63-232257R18"
                                                size={"large"}
                                                // onInput={toInputUppercase}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <Form.Item
                                    name="lastName"
                                    label="Last name"
                                    rules={[{ required: true, message: 'Last name is required!' }]}
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
                                    rules={[{ len: 9, message: 'Number should have 9 characters' }]}
                                >
                                    <Input
                                        addonBefore={phoneNumberPrefix}
                                        name="phoneNumber"
                                        className="w-100"
                                        size={"large"}
                                        type="number"
                                        min={9}
                                        maxLength={9}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-md-4">
                                <Form.Item name="email" label="Email">
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
                                        name="homeAddress"
                                        size={"large"}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <Form.Item
                                    name="emegencyContactPhone"
                                    label="Emergency contact phone"
                                    rules={[{ len: 9, message: 'Number should have 9 characters' }]}
                                >
                                    <Input
                                        addonBefore={phoneNumberPrefix}
                                        name="emegencyContactPhone"
                                        className="w-100"
                                        size={"large"}
                                        type="number"
                                        min={9}
                                        maxLength={9}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-md-4">
                                <Form.Item
                                    name="emegencyContactFullName"
                                    label="Emergency contact full name">
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
                                    label="Emergency contact relationship">
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
                                        <Form.Item name="dateOfHire" label="Date of hire">
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
                                        >
                                            <Select
                                                name="gender"
                                                size={"large"}
                                                onChange={handleChangeEmploymentStatus}
                                                options={[
                                                    { label: "Full time", value: "Full time" },
                                                    { label: "Contact", value: "Contract" },
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
                                <Form.Item name="department" label="Department">
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
                                        >
                                            <Select
                                                name="compensationStructure"
                                                size={"large"}
                                                options={[
                                                    { label: "Hourly", value: "Hourly" },
                                                    { label: "Weekly", value: "Weekly" },
                                                    { label: "Monthly", value: "Monthly" },
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
                                            >
                                            <Select
                                                name="employeeStatus"
                                                size={"large"}
                                                options={[
                                                    { label: "ACTIVE", value: "ACTIVE" },
                                                    { label: "ON LEAVE", value: "ON LEAVE" },
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
                                >
                                    <Input.TextArea
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        name="jobDescription"
                                        size={"large"}
                                        autoSize={{ minRows: 5 }}
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
                        icon={<PlusOutlined />}
                        style={{ background: "#39b54a", width: '200px' }}
                    >
                        Submit
                    </Button>
                </div>

            </Form>
        </div>
    )
}

export default NewAncillaryStaffMember