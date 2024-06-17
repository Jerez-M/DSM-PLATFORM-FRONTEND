import {PlusOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import {Button, Card, DatePicker, Divider, Form, Input, message, Modal, Select} from "antd";
import AuthenticationService from "../../../../services/authentication.service";
import {useEffect, useState} from "react";
import TITLES from "../../../../utils/titles";
import TeacherService from "../../../../services/teacher.service";
import DESIGNATIONS from "../../../../utils/designations";
import SubjectService from "../../../../services/subject.service";
import {capitaliseFirstLetters, handleError, phoneNumberPrefix, refreshPage} from "../../../../common"

const NewTeacher = () => {
    const [form] = Form.useForm();
    const tenantId = AuthenticationService.getUserTenantId();

    const [newTeacherSubmitBtnLoader, setNewTeacherSubmitBtnLoader] = useState(false);
    const [newTeacherSubmitBtnDisabled, setNewTeacherSubmitBtnDisabled] = useState(false);

    const [bulkUploadModalState, setBulkUploadModalState] = useState(false);
    const [bulkUploadDisabledState, setBulkUploadDisabledState] = useState(false);

    const [gender, setGender] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleNames, setMiddleNames] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [national_id, setNational_id] = useState("");
    const [address, setAddress] = useState("");
    const [title, setTitle] = useState("");
    const [designation, setDesignation] = useState("");
    const [subjects, setSubjects] = useState([]);

    const handleClearForm = () => {
        form.resetFields();
    }

    const [$subjects, set$Subjects] = useState([]);

    const _subjects = $subjects.map(
        i => ({
            label: i?.name,
            value: i?.id
        })
    )

    const fetchSubjectsAndLevels = async () => {
        try {
            const subjectsResponse = await SubjectService.getAll(tenantId);
            set$Subjects(subjectsResponse.data)
        } catch (e) {
            set$Subjects([])
        }
    }

    const handleSubmit = async (values) => {
        let phoneNumber
        if(values.phoneNumber) phoneNumber = values.countryCode + values.phoneNumber;

        setNewTeacherSubmitBtnDisabled(true);
        setNewTeacherSubmitBtnLoader(true);

        try {
            const response = await TeacherService.create({
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
                designation,
                national_id,
                title,
                address,
                subjects
            })

            if(response?.status === 201) {
                handleClearForm();
                message.success("Teacher registered successfully.");
                setNewTeacherSubmitBtnDisabled(false);
                setNewTeacherSubmitBtnLoader(false);
                setFirstName('');
                setLastName('');
                setMiddleNames('');
                setEmail('');
                setDateOfBirth('');
                setNational_id('');
                setAddress('');
                setDesignation('');
                setTitle('');
                setSubjects([]);
                setGender('');
                refreshPage()
            } else {
                setNewTeacherSubmitBtnDisabled(false);
                setNewTeacherSubmitBtnLoader(false);
                message.error(response?.data?.error ?? "Teacher not registered. An error occurred.")
                console.clear();
            }
        } catch (e) {
            setNewTeacherSubmitBtnDisabled(false);
            setNewTeacherSubmitBtnLoader(false);
            handleError(e)
            console.clear();
        }
    }

    const handleChangeGender = (value) => {
        setGender(value)
    }
    const handleChangeSubjects = (value) => {
        setSubjects(value)
    }

    const handleChangeDateOfBirth = (date, dateString) => {
        setDateOfBirth(dateString)
    }

    const handleChangeTitle = (value) => {
        setTitle(value)
    }

    const handleChangeDesignation = (value) => {
        setDesignation(value)
    }

    useEffect(
        () => {
            fetchSubjectsAndLevels();
        }, []
    )

    const toInputUppercase = e => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };

    const handleBulkUploadSubmit = async (e) => {
        e.preventDefault();
        setBulkUploadDisabledState(true);
        const formData = new FormData(e.target);
        try {
            const response = await TeacherService.bulkUpload(AuthenticationService.getUserTenantId(), formData);
            if (response?.status === 201) {
                setBulkUploadDisabledState(false);
                setBulkUploadModalState(false);
                message.success("Teachers uploaded successfully.");
                refreshPage();
            } else {
                setBulkUploadDisabledState(false);
                message.error(response?.data?.error ?? "Teachers not uploaded. An error occurred.")
            }
        } catch (e) {
            setBulkUploadDisabledState(false);
            handleError(e)
        }
    }

    return (
        <div className='mx-5'>
            <div className="d-flex justify-content-between align-items-center">
                <h3>Register new teacher</h3>
                <Button
                    icon={<UsergroupAddOutlined/>}
                    className="border-0 text-light"
                    style={{background: '#39b54a'}}
                    onClick={() => setBulkUploadModalState(true)}
                >
                    Bulk registration
                </Button>
            </div>
            <Divider type={"horizontal"}/>

            <Form
                form={form}
                layout={"vertical"}
                className='m-2'
                onFinish={handleSubmit}
            >
                <div className='row gy-3'>
                    <Card title='Personal information' className='col-md-12'>
                        <div className='row'>
                            <div className='col-md-4'>
                                <Form.Item
                                    name='firstName'
                                    label='First name'
                                    rules={[{ required: true, message: 'First name is required!' }]}
                                >
                                    <Input
                                        onChange={e => setFirstName(e.target.value)}
                                        name="firstName"
                                        size={"large"}
                                        required/>
                                </Form.Item>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item name='dateOfBirth' label='Date of birth'>
                                            <DatePicker
                                                onChange={handleChangeDateOfBirth}
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
                                                onChange={handleChangeGender}
                                                options={[{label: "Male", value: "MALE"}, {label: "Female", value: "FEMALE"}]}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <Form.Item name='middleNames' label='Middle names'>
                                    <Input
                                        onChange={e => setMiddleNames(e.target.value)}
                                        name="middleNames"
                                        size={"large"}
                                    />
                                </Form.Item>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item name='id_number' label='Nation ID number'>
                                            <Input
                                                onChange={e => setNational_id(e.target.value)}
                                                onInput={toInputUppercase}
                                                placeholder="63-232257R18"
                                                name="id_number"
                                                size={"large"}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Item name='title' label='Title'>
                                            <Select
                                                name="title"
                                                size={"large"}
                                                onChange={handleChangeTitle}
                                                options={TITLES}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <Form.Item
                                    name='lastName'
                                    label='Last name'
                                    rules={[{ required: true, message: 'Last name is required!' }]}
                                >
                                    <Input
                                        onChange={e => setLastName(e.target.value)}
                                        name="lastName"
                                        size={"large"}
                                        required
                                    />
                                </Form.Item>
                                <Form.Item name='homeAddress' label='Teacher address'>
                                    <Input
                                        onChange={e => setAddress(e.target.value)}
                                        name="homeAddress"
                                        size={"large"}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </Card>

                    <Card title='Account information' className='col-md-12'>
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
                                <Form.Item name="email" label='Email'>
                                    <Input
                                        onChange={e => setEmail(e.target.value)}
                                        htmlType="email"
                                        name="email"
                                        size={"large"}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </Card>

                    <Card title='School information' className='col-md-12'>
                        <div className='row'>
                            <div className='col-md-6'>
                                <Form.Item name="subjects" label='Subjects'>
                                    <Select
                                        options={_subjects}
                                        mode={"multiple"}
                                        name="subjects"
                                        size={"large"}
                                        onChange={handleChangeSubjects}
                                    />
                                </Form.Item>
                            </div>
                            <div className='col-md-6'>
                                <Form.Item name="designation" label='Designation'>
                                    <Select
                                        options={DESIGNATIONS}
                                        name="designation"
                                        size={"large"}
                                        onChange={handleChangeDesignation}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="d-flex justify-content-end">
                    <Button
                        size={"large"}
                        className='px-5 mt-3 text-light border-0'
                        disabled={newTeacherSubmitBtnDisabled}
                        loading={newTeacherSubmitBtnLoader}
                        htmlType="submit"
                        icon={<PlusOutlined />}
                        style={{background: '#39b54a'}}
                    >
                        Register new teacher
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
                title='Bulk upload teachers'
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
                    <p className="text-muted mt-3">
                        <small>
                            <b>NOTE:</b> Only .xlsx and .xls files are allowed.
                        </small>
                    </p>
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
        </div>
    )
}

export default NewTeacher;