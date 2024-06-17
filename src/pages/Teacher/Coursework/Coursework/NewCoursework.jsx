import { Button, Card, DatePicker, Form, Input, InputNumber, message, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import authenticationService from "../../../../services/authentication.service";
import schoolTermServices from "../../../../services/schoolTerm.services";
import subjectService from "../../../../services/subject.service";
import classroomService from "../../../../services/classroom.service";
import BackButton from "../../../../common/BackButton";
import TextEditor from "../../../../common/TextEditor";
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

            const classes = classesResponse.data?.map((classroom) => ({
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

            return { courseworkTypes, subjects, classes, currentTerm: currentTerm[0], teacherId, teacherObject }
        } else {
            message.error("Failed to fetch data, please check your network and try again")
            return { courseworkTypes: [], subjects: [], classes: [], currentTerm: [], teacherId: [], teacherObject: [] }
        }
    } catch (error) {
        message.error("Failed to fetch data, please check your network and try again")
        return { courseworkTypes: [], subjects: [], classes: [], currentTerm: [], teacherId: [], teacherObject: [] }
    }
};

const NewCoursework = () => {
    const [loading, setLoading] = useState(false);
    const { courseworkTypes, subjects, classes, currentTerm, teacherId, teacherObject } = useLoaderData();
    const navigate = useNavigate();
    const [classrooms, setClassrooms] = useState([]);
    const [subject, setSubject] = useState(null);
    const [dueDate, setDueDate] = useState('');
    const [content, setContent] = useState('');
    const [totalMark, setTotalMark] = useState(null);
    const [courseworkType, setCourseworkType] = useState(null);
    const [title, setTitle] = useState('');

    const handleChangeClassrooms = (value) => {
        setClassrooms(value);
    }

    const handleChangeSubject = (value) => {
        setSubject(value);
    }

    const handleChangeCourseworkType = (value) => {
        setCourseworkType(value);
    }

    const handleChangeTotalMark = (value) => {
        setTotalMark(value);
    }

    const handleChangeContent = (value) => {
        setContent(value);
    }

    const handleChangeDueDate = (date, dateString) => {
        setDueDate(dateString);
    };

    const handleSubmit = async () => {
        const today = new Date().toISOString();
        const _dueDate = new Date(dueDate).toISOString();
        const getForm = document.querySelector('#coursework-file-form');
        const form = new FormData(getForm);
        const fileInputField = document.querySelector('#file');
        const isFileSelected = fileInputField.files.length > 0;
        const fileSize = isFileSelected && fileInputField.files[0].size;
        const isFileSizeAllowed = fileSize && fileSize < 1024 * 1024 * 5;

        if (title === '') {
            message.error('Title is required');
            return;
        } else if (classrooms.length === 0) {
            message.error('Classrooms are required');
            return;
        } else if (subject === null) {
            message.error('Subject is required');
            return;
        } else if (dueDate === '') {
            message.error('Due date is required');
            return;
        } else if (totalMark === null) {
            message.error('Total mark is required');
            return;
        } else if (courseworkType === null) {
            message.error('Coursework type is required');
            return;
        } else if (_dueDate < today) {
            message.error('Due date must not be in the past');
            return;
        } else if (totalMark <= 0) {
            message.error('Total mark must be greater than 0');
            return;
        } else if (isFileSizeAllowed && isFileSizeAllowed === false) {
            message.error(`File size ${fileSize / (1024 * 1024)}MB is too large. File size must be less than 5MB`);
            return;
        }

        setLoading(true);

        try {
            const response = await courseworkService.create({
                title: title,
                classrooms: classrooms,
                subject: subject,
                is_active: true,
                term: currentTerm?.id,
                teacher: teacherId,
                institution: authenticationService.getUserTenantId(),
                due_date: dueDate,
                content: content,
                total_mark: totalMark,
                coursework_type: courseworkType,
            })

            if (response.status === 201) {
                if (isFileSelected === true) {
                    await courseworkService.uploadCourseworkFile(response.data.id, form);
                    message.success('Course upload successfully');
                    navigate(-1);
                    return;
                }
                message.success('Course upload successfully');
                navigate(-1);
            }
        } catch (e) {
            setLoading(false);
            message.error("Failed to upload coursework file");
        }
    }

    return (
        <div className="mx-4">
            <BackButton />
            <h3>Create Coursework</h3>
            <Form
                layout="vertical"
            >
                <Card className="w-90 mx-auto">
                    <Form.Item
                        label="Title"
                    >
                        <Input
                            placeholder="Title"
                            size="large"
                            onChange={e => setTitle(e.target.value)}
                        />
                    </Form.Item>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="Coursework Type"
                            >
                                <Select
                                    className="w-100"
                                    size="large"
                                    placeholder="Coursework Type"
                                    options={courseworkTypes}
                                    onChange={handleChangeCourseworkType}
                                />
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                label="Subject"
                            >
                                <Select
                                    placeholder="Subject"
                                    size="large"
                                    options={teacherObject}
                                    onChange={handleChangeSubject}
                                    showSearch
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item
                        label="Classes"
                    >
                        <Select
                            placeholder="Select classes"
                            size="large"
                            mode="multiple"
                            onChange={handleChangeClassrooms}
                            options={classes}
                            showSearch
                        />
                    </Form.Item>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="Total Mark"
                            >
                                <InputNumber
                                    min={1}
                                    placeholder="Total mark"
                                    className="w-100"
                                    type="number"
                                    size="large"
                                    onChange={handleChangeTotalMark}
                                />
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                label="Due Date"
                            >
                                <DatePicker
                                    className="w-100"
                                    size="large"
                                    placeholder="Due Date"
                                    onChange={handleChangeDueDate}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <form
                        encType="multipart/form-data"
                        id="coursework-file-form"
                        className='mb-3'
                    >
                        <label>
                            Select file
                            <input
                                id='file'
                                type='file'
                                name='file'
                                className="form-control"
                                accept='application/pdf, .docx, .doc, .xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                multiple={false}
                            />
                        </label>
                    </form>

                    <Form.Item
                        label="Content"
                        name="content"
                    >
                        <TextEditor value={content} onChange={handleChangeContent}/>
                    </Form.Item>
                </Card>

                <Button
                    type="primary"
                    size="large"
                    className="mt-4 px-4"
                    loading={loading}
                    icon={<PlusOutlined />}
                    onClick={handleSubmit}
                >
                    Create coursework
                </Button>
            </Form>
        </div>
    )
}

export default NewCoursework;