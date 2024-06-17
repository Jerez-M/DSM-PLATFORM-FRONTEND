import {Button, Card, DatePicker, Form, Input, InputNumber, message, Select, Upload} from "antd";
import {InboxOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {useLoaderData, useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import authenticationService from "../../../../services/authentication.service";
import schoolTermServices from "../../../../services/schoolTerm.services";
import subjectService from "../../../../services/subject.service";
import classroomService from "../../../../services/classroom.service";
import BackButton from "../../../../common/BackButton";
import TextEditor from "../../../../common/TextEditor";
import { dateFormat, handleJerryError } from "../../../../common";
import courseworkTypeService from "../../../../services/coursework-type.service";
import courseworkService from "../../../../services/coursework.service";
import teacherService from "../../../../services/teacher.service";

export const newCourseworkLoader = async () => {
    try {
        const institution = authenticationService.getUserTenantId()

        const response = await courseworkTypeService.getAll(institution);
        const termsResponse = await schoolTermServices.getTermsInActiveAcademicYearByInstitutionId(institution);
        const subjectsResponse = await subjectService.getAll(institution);
        const classesResponse = await classroomService.getAll(institution);
        const userId = await authenticationService.getUserId()
        const teacherResponse = await teacherService.getTeacherByUserId(userId);


        if (response.status === 200 && termsResponse.status === 200 && subjectsResponse.status === 200 && classesResponse.status === 200 && teacherResponse.status === 200) {
            const courseworkTypes = response.data?.map((type) => ({
                label: type?.name,
                value: type?.id,
            }));

            const subjects = subjectsResponse.data?.map((subject) => ({
                label: subject?.name,
                value: subject?.id,
            }));

            const classes = classesResponse.data?.map((classroom)=> ({
                label: `${classroom?.level?.name} - ${classroom?.name}`,
                value: classroom?.id
            }))

            const teacherData = teacherResponse?.data?.subjects
            const teacherObject = teacherData.map((subject) => ({
                label: subject?.name,
                value: subject?.id,
            }));
            
            const currentTerm = termsResponse.data?.filter(term => term.is_active = true)

            const teacherId = teacherResponse?.data.id

            return {courseworkTypes, subjects, classes, currentTerm: currentTerm[0], teacherId, teacherObject}
        } else {
            message.error("Failed to fetch data, please check your network and try again")
            return {courseworkTypes: [], subjects: [], classes: [], currentTerm: [], teacherId: [], teacherObject: []}
        }
    } catch (error) {
        message.error("Failed to fetch data, please check your network and try again")
        return {courseworkTypes: [], subjects: [], classes: [], currentTerm: [], teacherId: [], teacherObject: []}
    }
};

const NewCoursework = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const {courseworkTypes, subjects, classes, currentTerm, teacherId, teacherObject} = useLoaderData();
    const navigate = useNavigate();

    const handleFileUpload = ({ fileList }) => {
        setFile(fileList[0]?.originFileObj)
    }
    // const handleFileChange = (e) => {
    //     const selectedFile = e.target.files[0];
    //     setFile(selectedFile);
    //   };
    
    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);
            const formData = new FormData();
            // for (const [key, value] of Object.entries(values)) {
            //     if (key !== 'image' || 'is_published') {
            //         formData.append(key, value);
            //     }
            // }

            for (const [key, value] of Object.entries(values)) {
                if (key !== 'file' || (key === 'file' && value !== null)) {
                    formData.append(key, value);
                }
            }

            if (file === null) {
                formData.append("file", null);
            }
            else {
                formData.append("file", file);
            }

            formData.set("is_active", "True");
            formData.append("term", currentTerm?.id);

            formData.append("teacher", teacherId); 

            formData.append("institution", authenticationService.getUserTenantId());

            const response = await courseworkService.create(formData)
            if(response.status === 201) {
                message.success("Coursework Added Successfully");
                navigate(-1)
            }
        } catch (e) {
            handleJerryError(e)
            setLoading(false)
        }
    }

    return (
        <dic className="mx-4">
            <BackButton />
            <h3>Create Coursework</h3>
            <Form
                layout="vertical"
                form={form}
                onFinish={handleFormSubmit}
                encType="multipart/form-data"
            >
                <Card className="w-90 mx-auto">
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: "Please enter the Coursework title" }]}
                    >
                        <Input
                            placeholder="Title"
                            size="large"
                        />
                    </Form.Item>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="Coursework Type"
                                name="coursework_type"
                                rules={[{ required: true, message: "Please enter the Coursework type" }]}
                            >
                                <Select
                                    className="w-100"
                                    size="large"
                                    placeholder="Coursework Type"
                                    options={courseworkTypes}
                                />
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                label="Subject"
                                name="subject"
                                rules={[{ required: true, message: "Please enter the subject" }]}
                            >
                                <Select
                                    placeholder="Subject"
                                    size="large"
                                    options={teacherObject}
                                    showSearch
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item
                        label="Classes"
                        name="classrooms"
                        rules={[{ required: true, message: "Please enter the classrooms" }]}
                    >
                        <Select
                            placeholder="Classes"
                            size="large"
                            mode="multiple"
                            options={classes}
                            showSearch
                        />
                    </Form.Item>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="Total Mark"
                                name="total_mark"
                                rules={[{ required: true, message: "Please enter the total mark" }]}
                            >
                                <InputNumber
                                    placeholder="Total mark"
                                    className="w-100"
                                    type="number"
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                label="Due Date"
                                name="due_date"
                                getValueFromEvent={(e) => e?.format(dateFormat)}
                                getValueProps={(e) => ({
                                    value: e ? dayjs(e) : "",
                                })}
                            >
                                <DatePicker
                                    className="w-100"
                                    size="large"
                                    placeholder="Due Date"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item
                        label="File"
                        name="file"
                        // rules={[{ required: true, message: "Please enter homework file" }]}
                    >
                        <Upload.Dragger
                            name="file"
                            type="file"
                            maxCount={5}
                            multiple={false}
                            listType="picture"
                            accept=".pdf,.docx,.doc"
                            onChange={handleFileUpload}
                            maxFileSize={1024 * 1024 * 10}
                            beforeUpload={() => false}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                You can only upload one image at a time. The image should be a .pdf, .doc or .docx file. The maximum file size is 5MB.
                            </p>
                        </Upload.Dragger>
                    </Form.Item>

                    <Form.Item
                        label="Content"
                        name="content"
                    >
                        <TextEditor />
                    </Form.Item>
                </Card>

                <Button
                    type="primary"
                    size="large"
                    className="mt-4 px-4"
                    loading={loading}
                    htmlType="submit"
                    icon={<PlusOutlined />}
                >
                    Create Coursework
                </Button>
            </Form>
        </dic>
    )
}

export default NewCoursework;