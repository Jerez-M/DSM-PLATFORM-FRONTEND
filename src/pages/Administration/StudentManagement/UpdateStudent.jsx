import {EditOutlined} from "@ant-design/icons";
import {Button, Card, DatePicker, Divider, Form, Input, message, Select, Spin} from "antd";
import {useLoaderData, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import NATIONALITIES from "../../../utils/nationalities";
import RELIGIONS from "../../../utils/religions";
import _PROVINCES from "../../../utils/provinces";
import AuthenticationService from "../../../services/authentication.service";
import LevelService from "../../../services/level.service";
import ClassroomService from "../../../services/classroom.service";
import StudentService from "../../../services/student.service";
import TextArea from "antd/es/input/TextArea";
import dayjs from 'dayjs';
import {handleError, phoneNumberPrefix} from "../../../common";
import BackButton from "../../../common/BackButton";

export async function updateStudentLoader({params}) {
    try {
        const response = await StudentService.get(params?.id);
        const tenantId = AuthenticationService.getUserTenantId();
        const levelsResponse = await LevelService.getAll(tenantId);
        const classroomsResponse = await ClassroomService.getAll(tenantId)

        const student = response?.data;
        const levels = levelsResponse?.data;
        const classrooms = classroomsResponse?.data

        return {student, levels, classrooms};
    } catch (e) {
        return {};
    }
}

const UpdateStudent = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [userFormData, setUserFormData] = useState({
        firstName: "",
        lastName: "",
        middleNames: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: null,
        gender: ""
    });
    const [studentFormData, setStudentFormData] = useState({
        address: "",
        allergies: null,
        birthCertNumber: "",
        document: null,
        enrollmentDate: "",
        level: null,
        medicalAidName: null,
        medicalAidNumber: null,
        inclusive_needs: "",
        nationality: "",
        profilePicture: null,
        province: "",
        religion: "",
        residenceType: "",
        siblings: []
    })

    const navigate = useNavigate();
    const {student, levels, classrooms} = useLoaderData();
    const dateFormat = 'YYYY/MM/DD';

    const [studentsLoading, setStudentsLoading] = useState(false);
    const [searchedStudents, setSearchedStudents] = useState([])

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

    const $levels = levels?.map(
        i => ({
            label: i?.name,
            value: i?.id
        })
    )

    const $classrooms = classrooms?.map(
        i => ({
            label: `${i?.level?.name} ${i?.name}`,
            value: i?.id
        })
    )

    useEffect(() => {
        if(student?.id) {
            setUserFormData({
                firstName: student.user?.firstName,
                lastName: student.user?.lastName,
                middleNames: student.user?.middleNames,
                email: student.user?.email,
                phoneNumber: student.user?.phoneNumber,
                dateOfBirth: student.user?.dateOfBirth,
                gender: student.user?.gender,
            })

            setStudentFormData({
                address: student.address,
                allergies: student.allergies,
                birthCertNumber: student.birthCertNumber,
                document: student.document,
                enrollmentDate: student.enrollmentDate,
                level: student.level,
                medicalAidName: student.medicalAidName,
                medicalAidNumber: student.medicalAidNumber,
                nationality: student.nationality,
                profilePicture: student.profilePicture,
                province: student.province,
                religion: student.religion,
                siblings: student.siblings,
                residenceType: student.residenceType,
                inclusive_needs: student.inclusive_needs
            })

            if(student.user?.phoneNumber) {
                const num = student.user?.phoneNumber;
                const phoneNumber = +num.slice(-9)
                const prefix = num.split(phoneNumber)[0]

                form.setFieldsValue({"countryCode":  prefix})
                form.setFieldsValue({"phoneNumber": phoneNumber})
            }
        }

        fetchStudents()
    }, []);

    const PROVINCES = _PROVINCES.map(
        province => ({
            label: province,
            value: province
        })
    )

    const _NATIONALITIES = NATIONALITIES.map(
        nationality => ({
            label: nationality,
            value: nationality
        })
    )

    const _RELIGIONS = RELIGIONS.map(
        religion => ({
            label: religion,
            value: religion
        })
    )

    const handleChangeDateOfBirth = (date, dateString) => {
        handleUserFormChange("dateOfBirth", dateString)
    }

    const handleChangeEnrolmentDate = (date, dateString) => {
        handleUserFormChange("enrollmentDate", dateString)
    }

    const handleUserFormChange = (fieldName, value) => {
        setUserFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: value,
        }));
    };

    const handleStudentFormChange = (fieldName, value) => {
        setStudentFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: value,
        }));
    };

    const handleSubmit = async (values) => {
        if (
            /^[A-Za-z]+$/.test(userFormData.firstName) === false
        ) {
            message.error("First name is must contain alphabetic characters only");
            return;
        } else if (
            /^[A-Za-z]+$/.test(userFormData.lastName) === false
        ) {
            message.error("Last name is must contain alphabetic characters only");
            return;
        } else if (
            userFormData.middleNames !== '' && /^[A-Za-z]+$/.test(userFormData.middleNames) === false
        ) {
            message.error("Middle name is must contain alphabetic characters only");
            return;
        }

        const requestData = { ...studentFormData, user: { ...userFormData } }
        if(values.phoneNumber) requestData.user.phoneNumber = values.countryCode + values.phoneNumber
        setLoading(true)
        setDisabled(true)
        try {
            const updateResponse = await StudentService.update(student?.id, requestData);

            if(updateResponse.status === 200) {
                await message.success("You have successfully updated student details")
                navigate(`/admin/students/${student?.id}`)
            }
            setLoading(false)
            setDisabled(false)
        } catch (e) {
            console.log({e})
            handleError(e)
            setLoading(false)
            setDisabled(false)
        }
    }

    console.clear()
    return (
        <div className='mx-3'>
            <div>
                <BackButton />
                <h3>
                    Update {student?.user?.firstName} {student?.user?.lastName} ({student?.user?.username})'s details
                </h3>
            </div>
            <Divider className='my-3' type={"horizontal"}/>

            <Form
                layout={"vertical"}
                className='m-2'
                form={form}
                onFinish={handleSubmit}
            >
                <div className='row gy-3'>
                    <Card title='Personal information' className='col-md-12'>
                        <div className='row'>
                            <div className='col-md-4'>
                                <Form.Item name='firstName' label='First name'>
                                    <Input
                                        onChange={e => handleUserFormChange("firstName", e.target.value)}
                                        name="firstName"
                                        size={"large"}
                                        defaultValue={student?.user?.firstName}
                                    />
                                </Form.Item>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item name='dateOfBirth' label='Date of birth'>
                                            <DatePicker
                                                onChange={handleChangeDateOfBirth}
                                                defaultValue={student?.user?.dateOfBirth && dayjs(student?.user?.dateOfBirth, dateFormat)}
                                                name="dateOfBirth"
                                                size={"large"}
                                                className='w-100'/>
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Item name='gender' label='Gender'>
                                            <Select
                                                name="gender"
                                                size={"large"}
                                                onChange={(value) => handleUserFormChange("gender", value)}
                                                defaultValue={student?.user?.gender}
                                                options={[
                                                    {label: "Male", value: "MALE"},
                                                    {label: "Female", value: "FEMALE"}
                                                ]}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <Form.Item name='middleNames' label='Middle names'>
                                    <Input
                                        onChange={e => handleUserFormChange("middleNames", e.target.value)}
                                        name="middleNames"
                                        size={"large"}
                                        defaultValue={student?.user?.middleNames}
                                    />
                                </Form.Item>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item name='birthCertNumber' label='Nation ID number'>
                                            <Input
                                                onChange={e => handleStudentFormChange("birthCertNumber", e.target.value)}
                                                name="birthCertNumber"
                                                size={"large"}
                                                placeholder="63-232257R18"
                                                defaultValue={student?.birthCertNumber}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Item name='religion' label='Religion'>
                                            <Select
                                                name="religion"
                                                size={"large"}
                                                defaultValue={student?.religion}
                                                onChange={(value) => handleStudentFormChange("religion", value)}
                                                options={_RELIGIONS}
                                            />
                                        </Form.Item>

                                    </div>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <Form.Item name='lastName' label='Last name'>
                                    <Input
                                        onChange={e => handleUserFormChange("lastName", e.target.value)}
                                        name="lastName"
                                        size={"large"}
                                        defaultValue={student?.user?.lastName}
                                    />
                                </Form.Item>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item name='province' label='Province'>
                                            <Select
                                                name="province"
                                                size={"large"}
                                                defaultValue={student?.province}
                                                onChange={(value) => handleStudentFormChange("province", value)}
                                                options={PROVINCES}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Item name='nationality' label='Nationality'>
                                            <Select
                                                name="nationality"
                                                size={"large"}
                                                defaultValue={student?.nationality}
                                                options={_NATIONALITIES}
                                                onChange={(value) => handleStudentFormChange("nationality", value)}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card title='Contact information' className='col-md-12'>
                        <div className="row">
                            <div className="col">
                                <Form.Item name='homeAddress' label='Address'>
                                    <TextArea
                                        defaultValue={student?.address}
                                        onChange={e => handleStudentFormChange("address", e.target.value)}
                                        name="address"
                                        size={"large"}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <Form.Item
                                    name="phoneNumber"
                                    label="Phone number"
                                    // rules={[{ len: 9, message: 'Number should have 9 characters' }]}
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
                            <div className='col-md-6'>
                                <Form.Item name='email' label='Email'>
                                    <Input
                                        onChange={e => handleUserFormChange("email", e.target.value)}
                                        htmlType="email"
                                        defaultValue={student?.user?.email}
                                        name="email"
                                        size={"large"}/>
                                </Form.Item>
                            </div>
                        </div>
                    </Card>
                    <Card title='Health information' className='col-md-12'>
                        <div className='row'>
                            <div className='col-md-12'>
                                <Form.Item name='allergies' label='Allergies'>
                                    <Input.TextArea
                                        defaultValue={student?.allergies}
                                        onChange={e => handleStudentFormChange("allergies", e.target.value)}
                                        name="allergies"
                                        size={"large"}
                                    />
                                </Form.Item>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item name='medicalAidName' label='Medical aid name'>
                                            <Input
                                                defaultValue={student?.medicalAidName}
                                                onChange={e => handleStudentFormChange("medicalAidName", e.target.value)}
                                                name="medicalAidName"
                                                size={"large"}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Item name='medicalAidNumber' label='Medical aid number'>
                                            <Input
                                                defaultValue={student?.medicalAidNumber}
                                                onChange={e => handleStudentFormChange("medicalAidNumber", e.target.value)}
                                                name="medicalAidNumber"
                                                size={"large"}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                                <Form.Item name='inclusiveNeeds' label='Inclusive Needs'>
                                    <Input.TextArea
                                        defaultValue={student?.inclusive_needs}
                                        onChange={e => handleStudentFormChange("inclusive_needs", e.target.value)}
                                        name="inclusiveNeeds"
                                        size={"large"}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </Card>

                    <Card title='School information' className='col-md-12'>
                        <div className='row'>
                            <div className='col-md-4'>
                                <Form.Item name='grade' label='Grade'>
                                    <Select
                                        options={$levels}
                                        name="levelId"
                                        size={"large"}
                                        defaultValue={student?.level}
                                        onChange={(value) => handleStudentFormChange("level", value)}
                                    />
                                </Form.Item>
                            </div>
                            <div className='col-md-4'>
                                <Form.Item name='residenceStatus' label='Residence status'>
                                    <Select
                                        name="residenceType"
                                        size={"large"}
                                        defaultValue={student?.residenceType}
                                        onChange={(value) => handleStudentFormChange("residenceType", value)}
                                        options={[{label: "Boarder", value: "BOARDING"}, {label: "Day", value: "DAY"}]}
                                    />
                                </Form.Item>
                            </div>
                            <div className='col-md-4'>
                                <Form.Item name='enrollmentDate' label='Enrollment date'>
                                    <DatePicker
                                        onChange={handleChangeEnrolmentDate}
                                        name="enrollmentDate"
                                        defaultValue={dayjs(student?.enrollmentDate, dateFormat)} format={dateFormat}
                                        size={"large"}
                                        className='w-100'
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="row">
                            <Form.Item name="siblings" label="Siblings">
                                <Select
                                    mode="multiple"
                                    allowClear
                                    placeholder="Select Siblings to add"
                                    size="large"
                                    onChange={(value) => handleStudentFormChange("siblings", value)}
                                    options={searchedStudents}
                                    defaultValue={student?.siblings}
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

                    <div className="d-flex justify-content-end">
                        <Button
                            size={"large"}
                            className='px-5 my-3 border-0 text-light'
                            disabled={disabled}
                            loading={loading}
                            htmlType={"submit"}
                            icon={<EditOutlined/>}
                            style={{background: '#39b54a'}}
                        >
                            Update student details
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default UpdateStudent;