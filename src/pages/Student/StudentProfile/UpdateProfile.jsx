import {ArrowLeftOutlined, EditOutlined} from "@ant-design/icons";
import {Button, Card, DatePicker, Divider, Form, Input, message, Select} from "antd";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import NATIONALITIES from "../../../utils/nationalities";
import RELIGIONS from "../../../utils/religions";
import _PROVINCES from "../../../utils/provinces";
import StudentService from "../../../services/student.service";
import TextArea from "antd/es/input/TextArea";
import dayjs from 'dayjs';
import {handleError, phoneNumberPrefix} from "../../../common";

export async function updateStudentProfileLoader() {
    try {
        const response = await StudentService.getStudentByUserId();

        const student = response?.data;

        return {student};
    } catch (e) {
        return {};
    }
}

const UpdateProfile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [userFormData, setUserFormData] = useState({
        firstName: "",
        lastName: "",
        middleNames: "",
        email: "",
        dateOfBirth: null,
        gender: ""
    });
    const [studentFormData, setStudentFormData] = useState({
        address: "",
        allergies: null,
        birthCertNumber: "",
        document: null,
        enrollmentDate: "",
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
    const {student} = useLoaderData();
    const dateFormat = 'YYYY/MM/DD';

    useEffect(() => {
        if(student?.id) {
            setUserFormData({
                firstName: student.user?.firstName,
                lastName: student.user?.lastName,
                middleNames: student.user?.middleNames,
                email: student.user?.email,
                dateOfBirth: student.user?.dateOfBirth,
                gender: student.user?.gender,
            })

            setStudentFormData({
                address: student.address,
                allergies: student.allergies,
                birthCertNumber: student.birthCertNumber,
                document: student.document,
                enrollmentDate: student.enrollmentDate,
                medicalAidName: student.medicalAidName,
                medicalAidNumber: student.medicalAidNumber,
                nationality: student.nationality,
                profilePicture: student.profilePicture,
                province: student.province,
                religion: student.religion,
                residenceType: student.residenceType,
                inclusive_needs: student.inclusive_needs,
                siblings: student.siblings,
            })
        }
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
        const requestData = { ...studentFormData, user: { ...userFormData } }
        if(values.phoneNumber) {
            requestData.user.phoneNumber = values.countryCode + values.phoneNumber
        } else {
            requestData.user.phoneNumber = student?.user?.phoneNumber
        }
        setLoading(true)
        setDisabled(true)
        try {
            const updateResponse = await StudentService.update(student?.id, requestData);

            if(updateResponse.status === 200) {
                await message.success("You have successfully updated your details")
                navigate(`/student/account`)
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

    // console.clear()
    return (
        <>
            <Link to="/student/account" className='text-muted text-decoration-none mb-2'>
                <ArrowLeftOutlined /> Back
            </Link>
            <div className="d-flex justify-content-between align-items-center">
                <h3>
                    Update {student?.user?.firstName} {student?.user?.lastName} ({student?.user?.username})'s details
                </h3>
            </div>
            <Divider type={"horizontal"}/>

            <Form
                form={form}
                onFinish={handleSubmit}
                layout={"vertical"}
                className='m-2'
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
                </div>

                <div className="d-flex justify-content-end">
                    <Button
                        size={"large"}
                        className='px-5 mt-3 border-0 text-light'
                        disabled={disabled}
                        loading={loading}
                        htmlType="submit"
                        icon={<EditOutlined/>}
                        style={{background: '#39b54a'}}
                    >
                        Update student details
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default UpdateProfile;