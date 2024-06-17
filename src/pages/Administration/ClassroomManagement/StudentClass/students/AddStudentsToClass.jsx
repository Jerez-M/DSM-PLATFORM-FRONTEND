import {Button, Form, Modal, Select, message, Spin, Checkbox} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import StudentClassService from "../../../../../services/student-class.service";
import StudentService from "../../../../../services/student.service";
import {capitalize, handleListErrors, refreshPage} from "../../../../../common";
import AuthenticationService from "../../../../../services/authentication.service";

const AddStudentsToClass = ({open, close, classDetails, academicYears, activeAcademicYear, level}) => {
    const [loading, setLoading] = useState(false);
    const [studentsLoading, setStudentsLoading] = useState(false)
    const [disabled, setDisabled] = useState(false);
    const [students, setStudents] = useState()
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [viewPreviousClasses, setViewPreviousClasses] = useState(false)
    const [previousClasses, setPreviousClasses] = useState([])

    const [form] = Form.useForm()

    const handleFormSubmit = async () => {
        setLoading(true);
        setDisabled(true)
        try {
            const requestData = {
                student: selectedStudents,
                classroom: +classDetails.classId,
                academicYear: activeAcademicYear?.id,
            };

            console.log({requestData})
            const response = await StudentClassService.create(requestData);
            if (response.status === 201) {
                message.success("Students Added Successfully");
                refreshPage()
            }
        } catch (error) {
            handleListErrors(error)
            setDisabled(false)
        } finally {
            setDisabled(false)
            setLoading(false);
            close();
        }
    };

    useEffect(() => {
        setStudentsLoading(true)
        StudentService.getAllStudentsByLevel(level?.id)
            .then(res => {
                const transformedStudents = res.data ?
                    res.data.map(student => {
                        const label = `${student.user?.firstName} ${student.user?.lastName} (${student.user?.username})`
                        return {label: label, value: student.id}
                    }) : []
                setStudents(transformedStudents)
                setStudentsLoading(false)
            })
            .catch(e => {
                console.log({e})
                setStudentsLoading(false)
            })

        StudentClassService.getAllPreviousClasses(classDetails.classId)
            .then(res => {
                if (res.data?.length > 0) {
                    const classes = res.data.map(classRoom => {
                        const label = `${classRoom?.level?.name} ${classRoom?.name}`
                        return {label: label, value: classRoom.id}
                    });
                    setPreviousClasses(classes)
                }
            })
            .catch(e => {
                console.log({e})
            })
    }, []);

    const onChangeViewClasses = (e) => {
        setViewPreviousClasses(e.target.checked);
    };

    const getStudentsByClass = (value) => {
        setStudentsLoading(true)
        setLoading(true)
        console.log(academicYears)
        const currentYear = new Date().getFullYear();
        const prevYear = currentYear - 1;
        const previousAcademicYear = academicYears.find(year => year.label === `${prevYear}`)
        if(!previousAcademicYear) {
            message.error(`There is no previous academic year`)
            setStudentsLoading(false)
            setLoading(false)
            return;
        }
        return StudentClassService.getAllByClassAndYear(AuthenticationService.getUserTenantId(), value, previousAcademicYear?.value)
            .then((response => {
                const studentsInClass = response.data?.map(student => student.student?.id);
                form.setFieldsValue({students: studentsInClass})
                setSelectedStudents(studentsInClass)
                message.info(`Added ${studentsInClass?.length} students to class options, click save to continue`)
            }))
            .catch(e => {
                console.log({e})
                message.error(`No students from the previous year have been found. PLease enter students manually`)
            })
            .finally(() => {
                setStudentsLoading(false)
                setLoading(false)
            });
    }

    // console.clear()
    return (
        <>
            <Modal
                title={`Add Students to ${capitalize(level?.name)} ${classDetails.className}`}
                open={open}
                onCancel={close}
                okButtonProps={{
                    className: "d-none",
                }}
                cancelButtonProps={{
                    className: "d-none",
                }}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={() => handleFormSubmit()}
                >
                    <Form.Item
                        label="Academic Year"
                        rules={[{ required: true, message: 'Choose Academic Year' }]}
                        trigger="onSubmit"
                    >
                        <Select
                            placeholder="Select Academic Year"
                            size="large"
                            disabled={true}
                            defaultValue={activeAcademicYear?.id}
                            options={academicYears}
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        name="students"
                        label={`${capitalize(level?.name)} Students`}
                        rules={[{ required: true, message: 'At least one student is required!' }]}
                    >
                        <Select
                            name="students"
                            mode="multiple"
                            allowClear
                            placeholder="Select Students to add"
                            size="large"
                            onChange={setSelectedStudents}
                            options={students}
                            defaultValue={selectedStudents}
                            notFoundContent={studentsLoading ? <Spin size="small" /> : null}
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input) ||
                                (option?.label ?? '').toLowerCase().includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                        />
                    </Form.Item>

                    <Form.Item>
                        <Checkbox disabled={false} checked={viewPreviousClasses} onChange={onChangeViewClasses}>
                            Select Students from Previous Class
                        </Checkbox>
                    </Form.Item>

                    {viewPreviousClasses && (<>
                        <Form.Item label={"Select the previous class"}>
                            <Select
                                placeholder="Select previous class"
                                size="large"
                                options={previousClasses}
                                onChange={getStudentsByClass}
                                mode="multiple"
                                allowClear
                            />
                        </Form.Item>
                    </>)
                    }

                    <Button
                        icon={<PlusOutlined/>}
                        type="primary"
                        size="large"
                        loading={loading}
                        disabled={disabled}
                        block
                        htmlType="submit"
                    >
                        Add students to class
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default AddStudentsToClass;
