import {
    DownOutlined,
    PlusOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    DatePicker,
    Divider,
    Dropdown,
    Form,
    Input, InputNumber,
    message,
    Modal,
    Select,
    Space, Spin,
} from "antd";
import {useEffect, useState} from "react";
import StudentService from "../../../services/student.service";
import NATIONALITIES from "../../../utils/nationalities";
import RELIGIONS from "../../../utils/religions";
import COUNTRY_CODES from "../../../utils/countrycodes";
import AuthenticationService from "../../../services/authentication.service";
import LevelService from "../../../services/level.service";
import { useLoaderData } from "react-router-dom";
import classroomService from "../../../services/classroom.service";
import {capitaliseFirstLetters, phoneNumberPrefix} from "../../../common";

export async function newStudentLoader() {
    try {
        const tenantId = AuthenticationService.getUserTenantId();
        const levelsResponse = await LevelService.getAll(tenantId);
        return { levels: levelsResponse.data};
    } catch (e) {
        return [];
    }
}

const NewStudent = () => {
    const { levels } = useLoaderData();
    const [classRoomsReturned, setClassRoomsReturned] = useState([]);


    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const tenantId = AuthenticationService.getUserTenantId();

    const [level, setLevel] = useState("");
    const [gender, setGender] = useState("");
    const [nationality, setNationality] = useState("");
    const [religion, setReligion] = useState("");
    const [residenceType, setResidenceType] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleNames, setMiddleNames] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [enrollmentDate, setEnrollmentDate] = useState("");
    const [birthCertNumber, setBirthCertNumber] = useState("");
    const [allergies, setAllergies] = useState("");
    const [medicalAidName, setMedicalAidName] = useState("");
    const [medicalAidNumber, setMedicalAidNumber] = useState("");
    const [inclusive_needs, setInclusiveNeeds] = useState("");
    const [address, setAddress] = useState("");

    const [isLevelSelected, setIsLevelSelected] = useState(true)

    const [bulkUploadClassroom, setBulkUploadClassroom] = useState(null);

    const [bulkUploadModalState, setBulkUploadModalState] = useState(false);
    const [bulkUploadDisabledState, setBulkUploadDisabledState] = useState(false);

    const [bulkUploadByClassModalState, setBulkUploadByClassModalState] =
        useState(false);
    const [bulkUploadByClassDisabledState, setBulkUploadByClassDisabledState] =
        useState(false);

    const [studentsLoading, setStudentsLoading] = useState(false);
    const [searchedStudents, setSearchedStudents] = useState([])
    const [selectedStudents, setSelectedStudents] = useState([])

    useEffect(() => {
        fetchStudents()
    }, []);

    const fetchStudents = async () => {
        setStudentsLoading(true)
        const institutionId = AuthenticationService.getUserTenantId()
        try {
            const studentsResponse = await StudentService.getAllStudentsByInstitutionId(institutionId)
            if(studentsResponse.status === 200) {
                const transformedStudents = studentsResponse.data ?
                    studentsResponse.data.map(student => {
                        const label = `${student.user?.firstName} ${student.user?.lastName} (${student.user?.username})`
                        return {label: label, value: student.id}
                    }) : []
                setSearchedStudents(transformedStudents)
            }
        } catch (e) {
            message.error("Failed to load Students")
        } finally {
            setStudentsLoading(false)
        }
    }

    const $levels = levels?.map((i) => ({
        label: i?.name,
        value: i?.id,
    }));

    const handleFormClear = () => {
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        // add regex to validate names
        if (
            /^[A-Za-z]+$/.test(firstName) === false
        ) {
            message.error("First name is must contain alphabetic characters only");
            return;
        } else if (
            /^[A-Za-z]+$/.test(lastName) === false
        ) {
            message.error("Last name is must contain alphabetic characters only");
            return;
        } else if (
            middleNames !== '' && /^[A-Za-z]+$/.test(middleNames) === false
        ) {
            message.error("Middle name is must contain alphabetic characters only");
            return;
        }

        let phoneNumber
        if(values.phoneNumber) phoneNumber = values.countryCode + values.phoneNumber;

        setDisabled(true);
        setLoading(true);

        try {
            const response = await StudentService.create({
                user: {
                    firstName: capitaliseFirstLetters(firstName),
                    lastName: capitaliseFirstLetters(lastName),
                    middleNames: capitaliseFirstLetters(middleNames),
                    email,
                    phoneNumber,
                    dateOfBirth,
                    gender,
                    tenant: tenantId,
                    password: lastName.toUpperCase(),
                },
                level,
                gender,
                nationality,
                religion,
                residenceType,
                enrollmentDate,
                birthCertNumber,
                allergies,
                medicalAidName,
                medicalAidNumber,
                address,
                inclusive_needs,
                siblings: selectedStudents,
                classroom: bulkUploadClassroom,
            });

            if (response?.status === 201) {
                handleFormClear();
                message.success("Student enrolled successfully.");
                setDisabled(false);
                setLoading(false);
                setLevel("");
                setGender("");
                setNationality("");
                setReligion("");
                setResidenceType("");
                setFirstName("");
                setLastName("");
                setMiddleNames("");
                setEmail("");
                setDateOfBirth("");
                setEnrollmentDate("");
                setBirthCertNumber("");
                setAllergies("");
                setMedicalAidName("");
                setMedicalAidNumber("");
                setInclusiveNeeds("");
                setAddress("");
                window.location.reload();
            }
        } catch (e) {
            setDisabled(false);
            setLoading(false);
            if (e?.response?.status === 400) {
                const data = e.response.data.user;
                Object.keys(data).forEach((key) => {
                    const value = data[key][0];
                    message.error(`${key}: ${value}`);
                });
            }
            console.clear();
        }
    };

    const handleChangeLevelId = async (value) => {
        await setLevel(value);

        if (value){
            console.log("level value is: ", value)
            try {
                const response = await classroomService.getAllClassroomsByLevelId(value, tenantId)
                if (response?.status === 200) {

                    const MappedClassrooms = response?.data?.map((i) => ({
                        label: `${i?.name}`,
                        value: i?.id,
                    }));

                    setClassRoomsReturned(MappedClassrooms)
                } else {
                    console.log("Error occured during fetching classrooms")
                }
            } catch (error) {
                console.log("Error occured during fetching classrooms")
            }
        }

        setIsLevelSelected(false)

    };
    const handleChangeGender = (value) => {
        setGender(value);
    };

    const handleChangeNationality = (value) => {
        setNationality(value);
    };

    const handleChangeReligion = (value) => {
        setReligion(value);
    };

    const handleChangeResidenceType = (value) => {
        setResidenceType(value);
    };

    const handleChangeEnrollmentDate = (date, dateString) => {
        setEnrollmentDate(dateString);
    };

    const handleChangeDateOfBirth = (date, dateString) => {
        console.log(dateString);
        setDateOfBirth(dateString);
    };

    const _NATIONALITIES = NATIONALITIES.map((nationality) => ({
        label: nationality,
        value: nationality,
    }));

    const _RELIGIONS = RELIGIONS.map((religion) => ({
        label: religion,
        value: religion,
    }));

    const handleBulkUploadSubmit = async (e) => {
        e.preventDefault();
        setBulkUploadDisabledState(true);

        try {
            const form = document.querySelector("#bulk-upload-form");
            const _data = new FormData(form);
            const response = await StudentService.bulkUpload(tenantId, _data);
            setBulkUploadDisabledState(false);
            setBulkUploadModalState(false);
            message.success(`${response.data.message}`);

            for (
                let msg_item = 0;
                msg_item <= response.data.errors.length;
                msg_item++
            ) {
                if ("birthCertNumber" in response.data.errors[msg_item]) {
                    message.error(response.data.errors[msg_item].birthCertNumber[0], 5);
                }
                if ("level" in response.data.errors[msg_item]) {
                    message.error(response.data.errors[msg_item].level[0], 5);
                }
            }
        } catch (e) {
            if(e.response.status === 400) {
                message.error(e.response.data.error)
            }
            setBulkUploadDisabledState(false);
        }
    };

    const handleBulkUploadByClassSubmit = async (e) => {
        e.preventDefault();
        setBulkUploadByClassDisabledState(true);

        if (bulkUploadClassroom === null) {
            message.warning(
                "Please select the class in which you want to enrol the students."
            );
            return 1;
        }

        try {
            const form = document.querySelector("#bulk-by-class-upload-form");
            const $data = new FormData(form);
            const response = await StudentService.bulkUploadByClass(
                tenantId,
                bulkUploadClassroom,
                $data
            );
            setBulkUploadByClassDisabledState(false);
            setBulkUploadByClassModalState(false);
            message.success(`${response.data.message}`);

            for (
                let msg_item = 0;
                msg_item <= response.data.errors.length;
                msg_item++
            ) {
                if ("birthCertNumber" in response.data.errors[msg_item]) {
                    message.error(response.data.errors[msg_item].birthCertNumber[0], 5);
                }
                if ("level" in response.data.errors[msg_item]) {
                    message.error(response.data.errors[msg_item].level[0], 5);
                }
            }
        } catch (e) {
            if(e.response.status === 400) {
                message.error(e.response.data.error)
            }
            setBulkUploadByClassDisabledState(false);
            setBulkUploadByClassModalState(false);
        }
    };

    const bulkUploadItems = [
        {
            label: "Level only",
            key: "1",
            onClick: () => setBulkUploadModalState(true),
        },
        {
            label: "Class",
            key: "2",
            onClick: () => setBulkUploadByClassModalState(true),
        },
    ];

    const menuProps = {
        items: bulkUploadItems,
    };

    const handleChangeClassroom = (value) => {
        setBulkUploadClassroom(value);
    };
    const toInputUppercase = (e) => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };

    return (
        <div className='mx-5'>
            <div className="d-flex justify-content-between align-items-center">
                <h3>Enrol new student</h3>
                <Dropdown menu={menuProps}>
                    <Button
                        icon={<UsergroupAddOutlined />}
                        className="border-0 px-3 text-white"
                        style={{ background: "#39b54a" }}
                    >
                        <Space>
                            Bulk enrollment by...
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <Divider type={"horizontal"} />

            <Form
                form={form}
                layout={"vertical"}
                className="m-2"
                onFinish={handleSubmit}
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
                                    <div className="col-md-6">
                                        <Form.Item name="birthCertNumber" label="Nation ID number">
                                            <Input
                                                onChange={(e) => setBirthCertNumber(e.target.value)}
                                                name="birthCertNumber"
                                                placeholder="63-232257R18"
                                                size={"large"}
                                                onInput={toInputUppercase}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Item name="homeAddress" label="Address">
                                            <Input
                                                onChange={(e) => setAddress(e.target.value)}
                                                name="homeAddress"
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
                                    <div className="col-md-6">
                                        <Form.Item name="religion" label="Religion">
                                            <Select
                                                name="religion"
                                                size={"large"}
                                                onChange={handleChangeReligion}
                                                options={_RELIGIONS}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Item name="nationality" label="Nationality" initialValue={"Zimbabwean"}>
                                            <Select
                                                name="nationality"
                                                size={"large"}
                                                options={_NATIONALITIES}
                                                onChange={handleChangeNationality}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card title="Account information" className="col-md-12">
                        <div className="row">
                            <div className="col-md-6">
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
                            <div className="col-md-6">
                                <Form.Item name="email" label="Email">
                                    <Input
                                        onChange={(e) => setEmail(e.target.value)}
                                        htmlType="email"
                                        name="email"
                                        size={"large"}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </Card>

                    <Card title="Health information" className="col-md-12">
                        <div className="row">
                            <div className="col-md-12">
                                <Form.Item name="allergies" label="Allergies">
                                    <Input.TextArea
                                        onChange={(e) => setAllergies(e.target.value)}
                                        name="allergies"
                                        size={"large"}
                                    />
                                </Form.Item>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item name="medicalAidName" label="Medical aid name">
                                            <Input
                                                onChange={(e) => setMedicalAidName(e.target.value)}
                                                name="medicalAidName"
                                                size={"large"}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Item
                                            name="medicalAidNumber"
                                            label="Medical aid number"
                                        >
                                            <Input
                                                onChange={(e) => setMedicalAidNumber(e.target.value)}
                                                name="medicalAidNumber"
                                                size={"large"}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                                <Form.Item name="inclusiveNeeds" label="Inclusive Needs">
                                    <Input.TextArea
                                        onChange={(e) => setInclusiveNeeds(e.target.value)}
                                        name="inclusiveNeeds"
                                        size={"large"}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </Card>

                    <Card title="School information" className="col-md-12">
                        <div className="row">
                            <div className="col-md-3">
                                <Form.Item
                                    name="grade"
                                    label="Level/Grade"
                                    rules={[{ required: true, message: 'Student level is required!' }]}
                                >
                                    <Select
                                        options={$levels}
                                        name="levelId"
                                        size={"large"}
                                        onChange={handleChangeLevelId}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-md-3">
                                <Form.Item name="class" label="Class" help="Please select the Level first before attempting to select class.">
                                    <Select
                                        options={classRoomsReturned}
                                        name="classId"
                                        size={"large"}
                                        onChange={handleChangeClassroom}
                                        disabled={isLevelSelected}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-md-3">
                                <Form.Item name="residenceStatus" label="Residence status">
                                    <Select
                                        name="residenceType"
                                        size={"large"}
                                        onChange={handleChangeResidenceType}
                                        options={[
                                            { label: "Boarder", value: "BOARDING" },
                                            { label: "Day", value: "DAY" },
                                        ]}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-md-3">
                                <Form.Item name="enrollmentDate" label="Enrolment date">
                                    <DatePicker
                                        onChange={handleChangeEnrollmentDate}
                                        name="enrollmentDate"
                                        size={"large"}
                                        className="w-100"
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="row">
                            <Form.Item name="siblings" label="Siblings">
                                <Select
                                    mode="multiple"
                                    allowClear
                                    placeholder="Select Siblings who attend the school"
                                    size="large"
                                    onChange={setSelectedStudents}
                                    options={searchedStudents}
                                    notFoundContent={studentsLoading ? <Spin size="small" /> : null}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input) ||
                                        (option?.label ?? '').toLowerCase().includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </div>
                    </Card>
                </div>

                <div className="d-flex justify-content-end">
                    <Button
                        size={"large"}
                        className="px-5 mt-4 border-0 text-light"
                        disabled={disabled}
                        loading={loading}
                        htmlType="submit"
                        icon={<PlusOutlined />}
                        style={{ background: "#39b54a" }}
                    >
                        Enrol student
                    </Button>
                </div>
            </Form>

            <Modal
                open={bulkUploadModalState}
                onCancel={() => setBulkUploadModalState(false)}
                cancelButtonProps={{
                    className: "d-none",
                }}
                okButtonProps={{
                    className: "d-none",
                }}
                destroyOnClose
            >
                <form
                    id="bulk-upload-form"
                    className="pt-5"
                    onSubmit={handleBulkUploadSubmit}
                    method="post"
                    encType="multipart/form-data"
                >
                    <input
                        type="file"
                        name="data"
                        className="form-control form-control-lg"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />
                    <Button
                        size={"large"}
                        htmlType="submit"
                        className="border-0 my-3 text-light"
                        style={{ background: "#39b54a" }}
                        disabled={bulkUploadDisabledState}
                        loading={bulkUploadDisabledState}
                        block
                    >
                        Upload
                    </Button>
                </form>
            </Modal>

            <Modal
                title="Fill in all fields before attempting to upload!"
                open={bulkUploadByClassModalState}
                onCancel={() => setBulkUploadByClassModalState(false)}
                cancelButtonProps={{
                    className: "d-none",
                }}
                okButtonProps={{
                    className: "d-none",
                }}
                destroyOnClose
            >
                <form
                    id="bulk-by-class-upload-form"
                    className="pt-2"
                    onSubmit={handleBulkUploadByClassSubmit}
                    method="post"
                    encType="multipart/form-data"
                >
                    <Form layout={"vertical"}>
                        <Form.Item name="grade" label="Level/Grade">
                            <Select
                                placeholder="Please select Level"
                                options={$levels}
                                name="levelId"
                                size={"large"}
                                onChange={handleChangeLevelId}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Select class"
                            help="Please select the Level first on the field above."
                        >
                            <Select
                                placeholder="Please select class"
                                options={classRoomsReturned}
                                size={"large"}
                                onChange={handleChangeClassroom}
                                disabled={isLevelSelected}
                            />
                        </Form.Item>
                    </Form>

                    <input
                        type="file"
                        name="data"
                        className="form-control form-control-lg mt-5"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />
                    <Button
                        size={"large"}
                        htmlType="submit"
                        className="border-0 my-3 text-light"
                        style={{ background: "#39b54a" }}
                        disabled={bulkUploadByClassDisabledState || isLevelSelected}
                        loading={bulkUploadByClassDisabledState}
                        block
                    >
                        Upload
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

export default NewStudent;
