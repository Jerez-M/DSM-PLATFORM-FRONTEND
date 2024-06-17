import { useState, useEffect } from "react";
import {ArrowLeftOutlined, ClockCircleOutlined, PlusOutlined,} from "@ant-design/icons";
import {Button, Card, Divider, Form, Input, Select, message, DatePicker} from "antd";
import {useNavigate, useLocation, useLoaderData} from "react-router-dom";
import teacherService from "../../../../services/teacher.service";
import TITLES from "../../../../utils/titles";
import DESIGNATIONS from "../../../../utils/designations";
import TeacherService from "../../../../services/teacher.service";
import AuthenticationService from "../../../../services/authentication.service";
import SubjectService from "../../../../services/subject.service";
import dayjs from 'dayjs';
import {handleError, phoneNumberPrefix} from "../../../../common";

export async function teacherUpdateLoader({params}) {
    try {
        const tenantId = await AuthenticationService.getUserTenantId();
        const teacherResponse = await TeacherService.get(params.id);
        const subjectsResponse = await SubjectService.getAll(tenantId);

        const teacher = teacherResponse?.data;
        const subjects = subjectsResponse?.data;

        return {teacher, subjects}
    } catch (e) {
        return []
    }
}

const UpdateTeacher = () => {
    const [loading, setLoading] = useState(false)
    const [formattedSubjects, setFormattedSubjects] = useState()
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const dateFormat = 'YYYY/MM/DD';

    const {teacher, subjects} = useLoaderData();

    const [userFormData, setUserFormData] = useState({
        firstName: "",
        lastName: "",
        middleNames: "",
        email: "",
        dateOfBirth: null,
        gender: ""
    });
    const [teacherFormData, setTeacherFormData] = useState({
        address: "",
        national_id: "",
        alt_email: "",
        employmentDate: null,
        subjects: [],
        title: null,
        designation: null,
    })

    const handleChangeDateOfBirth = (date, dateString) => {
        handleUserFormChange("dateOfBirth", dateString)
    }

    const handleUserFormChange = (fieldName, value) => {
        setUserFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: value,
        }));
    };

    const handleTeacherFormChange = (fieldName, value) => {
        setTeacherFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: value,
        }));
    };


    useEffect(() => {
        if(teacher?.id) {
            setUserFormData({
                firstName: teacher.user?.firstName,
                lastName: teacher.user?.lastName,
                middleNames: teacher.user?.middleNames,
                email: teacher.user?.email,
                dateOfBirth: teacher.user?.dateOfBirth,
                gender: teacher.user?.gender,
            })

            setTeacherFormData({
                address: teacher.address,
                national_id: teacher.national_id,
                alt_email: teacher.alt_email,
                subjects: teacher.subjects,
                title: teacher.title,
                designation: teacher.designation,
                employmentDate: teacher.employmentDate,
            })
        }

        if(subjects) {
            const _subjects = subjects.map(subject => ({
                    label: `${subject?.name}`,
                    value: subject.id
                })
            )
            setFormattedSubjects(_subjects)
        }

        if(teacher.user?.phoneNumber) {
            const num = teacher.user?.phoneNumber;
            const phoneNumber = +num.slice(-9)
            const prefix = num.split(phoneNumber)[0]

            form.setFieldsValue({"countryCode":  prefix})
            form.setFieldsValue({"phoneNumber": phoneNumber})
            form.validateFields();
        }
    }, []);

    const handleSubmit = async (values) => {
        if(userFormData?.password || userFormData?.confirmPassword) {
            if(userFormData?.password !== userFormData?.confirmPassword) {
                message.error("The passwords you have set do not match")
                return
            }
        }
        const requestData = { ...teacherFormData, user: { ...userFormData } }
        if(values.phoneNumber) requestData.user.phoneNumber = values.countryCode + values.phoneNumber
        setLoading(true)

        try {

          const response = await teacherService.update(teacher?.user?.id, requestData);

          if (response.status === 200) {
            navigate(`/admin/teachers/${teacher.id}`)
            message.success("Teacher updated Successfully");
          }
        } catch (e) {
            handleError(e)
        } finally {
          setLoading(false);
        }
    };

    return (
        <>
            <div>
                <span onClick={() => navigate('/admin/teachers')} className='text-muted'>
                    <ArrowLeftOutlined /> Back
                </span>

            <h3 className='mt-2'>
                Update {teacher?.user?.firstName} {teacher?.user?.lastName} ({teacher?.user?.username})'s information
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
                                      onChange={(e) => handleUserFormChange("firstName", e.target.value)}
                                      defaultValue={teacher?.user?.firstName}
                                      name="firstName"
                                      size={"large"}
                                  />
                              </Form.Item>
                              <div className="row">
                                  <div className="col-md-6">
                                      <Form.Item name='dateOfBirth' label='Date of birth'>
                                          <DatePicker
                                              defaultValue={teacher?.user?.dateOfBirth && dayjs(teacher?.user?.dateOfBirth, dateFormat)}
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
                                              defaultValue={teacher?.user?.gender}
                                              onChange={(value) => handleUserFormChange("gender", value)}
                                              options={[{label: "Male", value: "MALE"}, {label: "Female", value: "FEMALE"}]}
                                          />
                                      </Form.Item>
                                  </div>
                              </div>
                          </div>
                          <div className='col-md-4'>
                              <Form.Item name='middleNames' label='Middle names'>
                                  <Input
                                      onChange={(e) => handleUserFormChange("middleNames", e.target.value)}
                                      defaultValue={teacher?.user?.middleNames}
                                      name="middleNames"
                                      size={"large"}
                                  />
                              </Form.Item>
                              <div className="row">
                                  <div className="col-md-6">
                                      <Form.Item name='national_id' label='Nation ID number'>
                                          <Input
                                              defaultValue={teacher?.national_id}
                                              onChange={(e) => handleTeacherFormChange("national_id", e.target.value)}
                                              name="national_id"
                                              size={"large"}
                                          />
                                      </Form.Item>
                                  </div>
                                  <div className="col-md-6">
                                      <Form.Item name='title' label='Title'>
                                          <Select
                                              name="title"
                                              size={"large"}
                                              defaultValue={teacher?.title}
                                              onChange={(value) => handleTeacherFormChange("title", value)}
                                              options={TITLES}
                                          />
                                      </Form.Item>
                                  </div>
                              </div>
                          </div>
                          <div className='col-md-4'>
                              <Form.Item name='lastName' label='Last name'>
                                  <Input
                                      onChange={(e) => handleUserFormChange("lastName", e.target.value)}
                                      defaultValue={teacher?.user?.lastName}
                                      name="lastName"
                                      size={"large"}
                                      required
                                  />
                              </Form.Item>
                              <Form.Item name='homeAddress' label='Teacher address'>
                                  <Input
                                      defaultValue={teacher?.address}
                                      onChange={(e) => handleTeacherFormChange("address", e.target.value)}
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
                                    // rules={[{ len: 9, message: 'Number should have 9 characters' }]}
                                    validateTrigger={['onBlur', 'debounce(100)']}
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
                                        onChange={e => handleUserFormChange("email",e.target.value)}
                                        defaultValue={teacher?.user?.email}
                                        htmlType="email"
                                        name="email"
                                        size={"large"}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Item
                                    name='password'
                                    label='Password'
                                    hasFeedback
                                >
                                    <Input.Password
                                        onChange={e => handleUserFormChange("password", e.target.value)}
                                        name="password"
                                        status="warning"
                                        type="password"
                                        prefix={<ClockCircleOutlined />}
                                        size={"large"}
                                        placeholder="Change Teacher Password"
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-md-6">
                                <Form.Item
                                    name='confirmPassword'
                                    label='Confirm Password'
                                    hasFeedback
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The new password that you entered do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        onChange={e => handleUserFormChange("confirmPassword", e.target.value)}
                                        name="password"
                                        status="warning"
                                        prefix={<ClockCircleOutlined />}
                                        type="password"
                                        size={"large"}
                                        placeholder="Confirm Changed Password"
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
                                        options={formattedSubjects}
                                        mode={"multiple"}
                                        name="subjects"
                                        size={"large"}
                                        defaultValue={teacher?.subjects}
                                        onChange={value => handleTeacherFormChange("subjects", value)}
                                        filterOption={(input, option) => (option?.label ?? '').includes(input) ||
                                            (option?.label ?? '').toLowerCase().includes(input)}
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            </div>
                            <div className='col-md-6'>
                                <Form.Item name="designation" label='Designation'>
                                    <Select
                                        options={DESIGNATIONS}
                                        name="designation"
                                        size={"large"}
                                        defaultValue={teacher.designation}
                                        onChange={value => handleTeacherFormChange("designation", value)}
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
                      disabled={loading}
                      loading={loading}
                      htmlType={"submit"}
                      icon={<PlusOutlined />}
                      style={{background: '#39b54a'}}
                    >
                      Update teacher
                    </Button>
                </div>
            </Form>
        </>
  )
}

export default UpdateTeacher;