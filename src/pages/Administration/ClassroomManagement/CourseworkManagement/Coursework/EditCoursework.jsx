import {Button, Card, DatePicker, Form, Input, InputNumber, message, Select, Upload} from "antd";
import {InboxOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useLoaderData, useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import authenticationService from "../../../../services/authentication.service";
import courseworkService from "../../../../services/coursework.service";
import courseworkTypeService from "../../../../services/coursework-type.service";
import schoolTermServices from "../../../../services/schoolTerm.services";
import subjectService from "../../../../services/subject.service";
import classroomService from "../../../../services/classroom.service";
import { dateFormat, handleJerryError } from "../../../../common";
import BackButton from "../../../../common/BackButton";
import TextEditor from "../../../../common/TextEditor";

export const editCourseworkLoader = async ({params}) => {
    try {
        const institution = authenticationService.getUserTenantId()

        const courseworkResponse = await courseworkService.getById(params.id);
        const response = await courseworkTypeService.getAll(institution);
        const termsResponse = await schoolTermServices.getTermsInActiveAcademicYearByInstitutionId(institution);
        const subjectsResponse = await subjectService.getAll(institution);
        const classesResponse = await classroomService.getAll(institution);
        if (response.status === 200) {
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

            const currentTerm = termsResponse.data?.filter(term => term.is_active = true)
            return {
                coursework: courseworkResponse.data,
                currentTerm: currentTerm[0],
                courseworkTypes,
                subjects,
                classes,
            }
        } else {
            console.log("Request was not successful. Status:", response.status);
        }
    } catch (error) {
        console.error("Error occurred during fetching coursework:", error);
    }
};

const EditCoursework = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const {coursework, courseworkTypes, subjects, classes, currentTerm} = useLoaderData();
    const navigate = useNavigate();

    const handleFileUpload = ({ fileList }) => {
        setFile(fileList[0]?.originFileObj)
    }

    useEffect(() => {
        form.setFieldsValue({
            "title": coursework?.title,
            "due_date": coursework?.due_date,
            "content": coursework?.content,
            "total_mark": coursework?.total_mark,
            "subject": coursework?.subject?.id,
            "coursework_type": coursework?.coursework_type?.id,
            "classrooms": coursework?.classrooms?.map(classroom => classroom?.id),
        })
    }, []);

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);
            const formData = new FormData();
            for (const [key, value] of Object.entries(values)) {
                if (key !== 'image' || 'is_published') {
                    formData.append(key, value);
                }
            }

            formData.append("file", file);
            formData.set("is_active", "True");
            formData.append("term", currentTerm?.id);
            formData.append("teacher", authenticationService.getUserId());
            formData.append("institution", authenticationService.getUserTenantId());

            const response = await courseworkService.update(coursework?.id, values)
            if(response.status === 202) {
                message.success("Coursework Updated Successfully");
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
            <h3>Edit Coursework</h3>
            <Form
                layout="vertical"
                form={form}
                onFinish={handleFormSubmit}
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
                            >
                                <Select
                                    placeholder="Subject"
                                    size="large"
                                    options={subjects}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item
                        label="Classes"
                        name="classrooms"
                    >
                        <Select
                            placeholder="Classes"
                            size="large"
                            mode="multiple"
                            options={classes}
                        />
                    </Form.Item>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="Total Mark"
                                name="total_mark"
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
                    >
                        <Upload.Dragger
                            name="file"
                            type="file"
                            maxCount={1}
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
                                You can only upload one image at a time. The image should be a .pdf, .doc or .docx file. The maximum file size is 10MB.
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
                    size="large"
                    type="primary"
                    loading={loading}
                    htmlType="submit"
                    className="mt-4 px-4"
                >
                    Edit Coursework
                </Button>
            </Form>
        </dic>
    )
}

export default EditCoursework;