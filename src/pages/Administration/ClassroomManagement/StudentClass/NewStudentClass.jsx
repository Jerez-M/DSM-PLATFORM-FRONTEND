import {Button, Form, Input, Modal, Select, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import ClassroomService from "../../../../services/classroom.service";
import AuthenticationService from "../../../../services/authentication.service";
import LevelService from "../../../../services/level.service";
import TeacherService from "../../../../services/teacher.service";
import SubjectService from "../../../../services/subject.service";
import {handleError, refreshPage, toInputUppercase} from "../../../../common";

const NewStudentClass = ({open, close, studentClass}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [levels, setLevels] = useState([]);
    const [subjects, setSubjects] = useState([])
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        capacity: null,
        class_teacher: null,
        level: null,
        subjects: []
    });

    const handleClear = () => {
        form.resetFields();
    }

    const handleFormChange = (fieldName, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: value,
        }));
    };

    const handleFormSubmit = async () => {
        const {name, capacity, class_teacher, level, subjects} = formData;
        if(level === null) {
            message.error("Level is required");
            return;
        }
        setLoading(true);
        setDisabled(true)
        try {
            const requestData = {
                name,
                capacity,
                class_teacher,
                level,
                subjects,
                institution: AuthenticationService.getUserTenantId(),
            };
            if(studentClass?.id) {
                requestData.is_active = studentClass.is_active;
                const response = await ClassroomService.update(studentClass.id, requestData);
                if (response.status === 200) {
                    refreshPage()
                    await message.success("Class Updated Successfully");
                }
            } else {
                const response = await ClassroomService.create(requestData);
                if (response.status === 201) {
                    message.success("Class Added Successfully");
                    refreshPage()
                }
            }

        } catch (error) {
            handleError(error)
            setDisabled(false)
        } finally {
            setDisabled(false)
            setLoading(false);
            close();
        }
    };


    useEffect(() => {
        console.log("studentClass", studentClass)
        getData()
        if(studentClass?.id) {
            setFormData({
                name: studentClass.name,
                capacity: studentClass.capacity,
                class_teacher: studentClass.class_teacher?.id,
                subjects: studentClass.subjects,
                level: studentClass.level?.id
            })
        } else {
            setFormData({
                name: "",
                capacity: null,
                class_teacher: null,
                subjects: [],
                level: null
            })
        }
    }, [studentClass]);

    const getData = () => {
        TeacherService.getAllTeachersByInstitutionId(AuthenticationService.getUserTenantId())
            .then(res => {
                const teachersMapped = res.data?.map(teacher => {
                    const label = `${teacher?.user?.firstName} ${teacher?.user?.lastName} (${teacher?.user?.username})`
                    return {label: label, value: teacher?.id}
                })
                setTeachers(teachersMapped)
            })
            .catch(e => {
                console.log({e})
            });

        LevelService.getAll(AuthenticationService.getUserTenantId())
            .then(res => {
                const levelsMapped = res.data?.map(level => {
                    return {label: level?.name, value: level?.id}
                })
                setLevels(levelsMapped)
            })
            .catch(e => {
                console.log({e})
            });

        SubjectService.getAll(AuthenticationService.getUserTenantId())
            .then(res => {
                const subjectsMapped = res.data?.map(subject => {
                    return {label: subject?.name, value: subject?.id}
                })
                setSubjects(subjectsMapped)
            })
            .catch(e => {
                console.log({e})
            });
    }

    console.clear()
    return (
        <>
            <Modal
                title={studentClass ? "Edit class" : "Add new class"}
                open={open}
                onCancel={() => {
                    handleClear();
                    close()
                }}
                okButtonProps={{
                    className: "d-none",
                }}
                cancelButtonProps={{
                    className: "d-none",
                }}
                maskClosable
                destroyOnClose
            >
                <Form
                    layout="vertical"
                    getFieldsValue={true}
                    form={form}
                    onFinish={() => handleFormSubmit()}
                >
                    <Form.Item
                        label="Class name"
                        name="className"
                        rules={[{ required: (studentClass === null), message: 'Class name is required!' }]}
                    >
                        <Input
                            placeholder="Class name"
                            size="large"
                            required
                            onInput={toInputUppercase}
                            defaultValue={studentClass && studentClass.name}
                            onChange={(e) => handleFormChange("name", e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Class teacher">
                        <Select
                            placeholder="Class teacher"
                            size="large"
                            onChange={(value) => handleFormChange("class_teacher", value)}
                            defaultValue={studentClass?.class_teacher?.id}
                            options={teachers}
                        />
                    </Form.Item>
                    <Form.Item
                        name="level"
                        label="Level"
                        rules={[{ required: (studentClass === null), message: 'Level is required!' }]}
                    >
                        <Select
                            placeholder="Level"
                            size="large"
                            required
                            onChange={(value) => handleFormChange("level", value)}
                            defaultValue={studentClass?.level?.id}
                            options={levels}
                        />
                    </Form.Item>
                    <Form.Item label="Subjects">
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Subjects"
                            size="large"
                            onChange={(value) => handleFormChange("subjects", value)}
                            defaultValue={studentClass?.subjects}
                            options={subjects}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Classroom Capacity"
                        name="capacity"
                        rules={[{ required: (studentClass === null), message: 'Classroom capacity is required!' }]}
                    >
                        <Input
                            placeholder="Classroom Capacity"
                            size="large"
                            type="number"
                            defaultValue={studentClass?.capacity}
                            onChange={(e) => handleFormChange("capacity", e.target.value)}
                        />
                    </Form.Item>
                    <Button
                        icon={<PlusOutlined/>}
                        type="primary"
                        size="large"
                        loading={loading}
                        disabled={disabled}
                        block
                        htmlType="submit"
                    >
                        {studentClass ? "Edit class" : "Add new class"}
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default NewStudentClass;
