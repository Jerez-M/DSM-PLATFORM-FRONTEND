import {Button, Card, Checkbox, DatePicker, Divider, Form, Input, message, Select} from "antd";
import {useEffect, useState} from "react";
import InstitutionService from "../../../services/institution.service";
import AdministratorService from "../../../services/administrator.service";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import PERMISSIONS from "./permissions";
import {phoneNumberPrefix} from "../../../common";

const CheckboxGroup = Checkbox.Group;

const NewInstitutionAdministrator = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [newInstitutionAdminBtnLoader, setNewInstitutionAdminBtnLoader] = useState(false);
    const [newInstitutionAdminBtnDisabledState, setNewInstitutionAdminBtnDisabledState] = useState(false);

    const [dateOfBirth, setDateOfBirth] = useState('');
    const [institution, setInstitution] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleNames, setMiddleNames] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');

    const [institutionsList, setInstitutionsList] = useState([]);

    const _institutionList = institutionsList.map(
        i => ({
            label: i?.institution_name,
            value: i?.tenant_id
        })
    )

    async function institutionsListLoader() {
        try {
            const response = await InstitutionService.getAll();
            if (response?.status === 200) {
                const institutionsResponse = response.data;
                setInstitutionsList(institutionsResponse);
            }
        } catch (e) {
            return []
        }
    }

    const handleClearNewInstitutionAdminForm = () => {
        form.resetFields();
    }

    const handleDateOfBirthChange = (date, dateString) => {
        setDateOfBirth(dateString);
    }

    const handleInstitutionChange = (value) => {
        setInstitution(value);
    }

    const handleGenderChange = (value) => {
        setGender(value);
    }

    const handleCreateNewInstitutionAdmin = async (values) => {
        let phoneNumber
        if(values.phoneNumber) phoneNumber = values.countryCode + values.phoneNumber;

        setNewInstitutionAdminBtnDisabledState(true);
        setNewInstitutionAdminBtnLoader(true);

        try {
            await AdministratorService.create({
                user: {
                    firstName,
                    lastName,
                    middleNames,
                    role: 'ADMIN',
                    gender,
                    email,
                    phoneNumber,
                    dateOfBirth,
                    tenant: institution,
                    password: 'ADMIN',
                    user_permissions: [
                        ...authCheckedList,
                        ...termsCheckedList,
                        ...academicYearCheckedList,
                        ...adminCheckedList,
                        ...bankingDetailCheckedList,
                        ...classroomsCheckedList,
                        ...departmentCheckedList,
                        ...endOfTermExamsCheckedList,
                        ...expulsionsCheckedList,
                        ...gradingScaleCheckedList,
                        ...levelCheckedList,
                        ...parentCheckedList,
                        ...studentClassCheckedList,
                        ...studentEndTermMarksCheckedList,
                        ...studentsCheckedList,
                        ...subjectAllocationCheckedList,
                        ...subjectCheckedList,
                        ...suspensionCheckedList,
                        ...teacherExamCommentCheckedList,
                        ...teacherCheckedList,
                    ]
                }
            })
            message.success("Institution administrator created.")
            form.resetFields();
            setDateOfBirth('');
            setInstitution(null);
            setFirstName('');
            setLastName('');
            setMiddleNames('');
            setEmail('');
            setGender('');
            setStudentsCheckedList( []);
            setAdminCheckedList([]);
            setAcademicYearCheckedList([]);
            setTermsCheckedList([]);
            setAuthCheckedList([]);
            setBankingDetailCheckedList([]);
            setClassroomsCheckedList([]);
            setDepartmentCheckedList([]);
            setEndOfTermExamsCheckedList([]);
            setExpulsionCheckedList([]);
            setGradingScaleCheckedList([]);
            setLevelCheckedList([]);
            setStudentClassCheckedList([]);
            setTeacherCheckedList([]);
            setTeacherExamCommentCheckedList([]);
            setSubjectAllocationCheckedList([]);
            setSubjectCheckedList([]);
            setSuspensionCheckedList([]);
            setParentCheckedList([]);
            setStudentEndTermMarksCheckedList([]);
            handleClearNewInstitutionAdminForm();
            window.location.reload();
        } catch (e) {
            setNewInstitutionAdminBtnDisabledState(false);
            setNewInstitutionAdminBtnLoader(false);
            if (e?.response?.status === 400) {
                const data = e.response.data;
                Object.keys(data).forEach(key => {
                    const value = data[key][0];
                    message.error(`${key}: ${value}`);
                });
            }
            console.clear();
        }
    }

    useEffect(
        () => {
            institutionsListLoader();
        }, []
    )

    // AUTHENTICATION PERMISSIONS

    const [authCheckedList, setAuthCheckedList] = useState([]);
    const checkAllAuthentications = PERMISSIONS.authentication.length === authCheckedList.length;
    const authentication_indeterminate = authCheckedList.length > 0 && authCheckedList.length < PERMISSIONS.authentication.length;

    const onChangeAuthentication = (list) => {
        setAuthCheckedList(list);
    };

    const onCheckAllChangeAuthentication = (e) => {
        setAuthCheckedList(e.target.checked ? PERMISSIONS.authentication : []);
    };

    // TERMS PERMISSIONS
    const [termsCheckedList, setTermsCheckedList] = useState([]);

    const checkAllTerms = PERMISSIONS.terms.length === termsCheckedList.length;
    const terms_indeterminate = termsCheckedList.length > 0 && termsCheckedList.length < PERMISSIONS.terms.length;

    const onChangeTerm = (list) => {
        setTermsCheckedList(list)
    };

    const onCheckAllChangeTerms = (e) => {
        setTermsCheckedList(e.target.checked ? PERMISSIONS.terms : []);
    };

    // ACADEMIC YEARS PERMISSIONS
    const [academicYearCheckedList, setAcademicYearCheckedList] = useState([]);

    const checkAllAcademicYears = PERMISSIONS.academic_years.length === academicYearCheckedList.length;
    const academic_years_indeterminate = academicYearCheckedList.length > 0 && academicYearCheckedList.length < PERMISSIONS.academic_years.length;

    const onChangeAcademicYear = (list) => {
        setAcademicYearCheckedList(list);
    };

    const onCheckAllChangeAcademicYears = (e) => {
        setAcademicYearCheckedList(e.target.checked ? PERMISSIONS.academic_years : []);
    };

    // ADMINISTRATORS PERMISSIONS
    const [adminCheckedList, setAdminCheckedList] = useState([]);

    const checkAllAdministrators = PERMISSIONS.administrators.length === adminCheckedList.length;
    const administrator_indeterminate = adminCheckedList.length > 0 && adminCheckedList.length < PERMISSIONS.administrators.length;

    const onChangeAdministrator = (list) => {
        setAdminCheckedList(list);
    };

    const onCheckAllChangeAdministrators = (e) => {
        setAdminCheckedList(e.target.checked ? PERMISSIONS.administrators : []);
    };

    // BANKING DETAILS PERMISSIONS
    const [bankingDetailCheckedList, setBankingDetailCheckedList] = useState([]);

    const checkAllBankingDetails = PERMISSIONS.banking_details.length === bankingDetailCheckedList.length;
    const banking_details_indeterminate = bankingDetailCheckedList.length > 0 && bankingDetailCheckedList.length < PERMISSIONS.banking_details.length;

    const onChangeBankingDetail = (list) => {
        setBankingDetailCheckedList(list);
    };

    const onCheckAllChangeBankingDetails = (e) => {
        setBankingDetailCheckedList(e.target.checked ? PERMISSIONS.banking_details : []);
    };

    // CLASSROOMS PERMISSIONS
    const [classroomsCheckedList, setClassroomsCheckedList] = useState([]);

    const checkAllClassrooms = PERMISSIONS.classrooms.length === classroomsCheckedList.length;
    const classroom_indeterminate = classroomsCheckedList.length > 0 && classroomsCheckedList.length < PERMISSIONS.classrooms.length;

    const onChangeClassroom = (list) => {
        setClassroomsCheckedList(list);
    };

    const onCheckAllChangeClassrooms = (e) => {
        setClassroomsCheckedList(e.target.checked ? PERMISSIONS.classrooms : []);
    };

    // DEPARTMENTS PERMISSIONS
    const [departmentCheckedList, setDepartmentCheckedList] = useState([]);

    const checkAllDepartments = PERMISSIONS.departments.length === departmentCheckedList.length;
    const department_indeterminate = departmentCheckedList.length > 0 && departmentCheckedList.length < PERMISSIONS.departments.length;

    const onChangeDepartment = (list) => {
        setDepartmentCheckedList(list);
    };

    const onCheckAllChangeDepartments = (e) => {
        setDepartmentCheckedList(e.target.checked ? PERMISSIONS.departments : []);
    };

    // END OF TERM EXAMS PERMISSIONS
    const [endOfTermExamsCheckedList, setEndOfTermExamsCheckedList] = useState([]);

    const checkAllEndOfTermExams = PERMISSIONS.end_of_term_exams.length === endOfTermExamsCheckedList.length;
    const end_term_exams_indeterminate = endOfTermExamsCheckedList.length > 0 && endOfTermExamsCheckedList.length < PERMISSIONS.end_of_term_exams.length;

    const onChangeEndTermExam = (list) => {
        setEndOfTermExamsCheckedList(list);
    };

    const onCheckAllChangeEndTermExam = (e) => {
        setEndOfTermExamsCheckedList(e.target.checked ? PERMISSIONS.end_of_term_exams : []);
    };

    // EXPULSIONS PERMISSIONS
    const [expulsionsCheckedList, setExpulsionCheckedList] = useState([]);

    const checkAllExpulsions = PERMISSIONS.expulsions.length === expulsionsCheckedList.length;
    const expulsions_indeterminate = expulsionsCheckedList.length > 0 && expulsionsCheckedList.length < PERMISSIONS.expulsions.length;

    const onChangeExpulsion = (list) => {
        setExpulsionCheckedList(list);
    };

    const onCheckAllChangeExpulsion = (e) => {
        setExpulsionCheckedList(e.target.checked ? PERMISSIONS.expulsions : []);
    };

    // GRADING SCALES PERMISSIONS
    const [gradingScaleCheckedList, setGradingScaleCheckedList] = useState([]);

    const checkAllGradingScales = PERMISSIONS.grading_scale.length === gradingScaleCheckedList.length;
    const grading_scale_indeterminate = gradingScaleCheckedList.length > 0 && gradingScaleCheckedList.length < PERMISSIONS.grading_scale.length;

    const onChangeGradingScale = (list) => {
        setGradingScaleCheckedList(list)
    };

    const onCheckAllChangeGradingScale = (e) => {
        setGradingScaleCheckedList(e.target.checked ? PERMISSIONS.grading_scale : []);
    };

    // LEVELS PERMISSIONS
    const [levelCheckedList, setLevelCheckedList] = useState([]);

    const checkAllLevelsPermissions = PERMISSIONS.levels.length === levelCheckedList.length;
    const levels_indeterminate = levelCheckedList.length > 0 && levelCheckedList.length < PERMISSIONS.levels.length;

    const onChangeLevel = (list) => {
        setLevelCheckedList(list)
    };

    const onCheckAllChangeLevels = (e) => {
        setLevelCheckedList(e.target.checked ? PERMISSIONS.levels : []);
    };

    // PARENTS PERMISSIONS
    const [parentCheckedList, setParentCheckedList] = useState([]);

    const checkAllParentsPermission = PERMISSIONS.parents.length === parentCheckedList.length;
    const parents_indeterminate = parentCheckedList.length > 0 && parentCheckedList.length < PERMISSIONS.parents.length;

    const onChangeParent = (list) => {
        setParentCheckedList(list)
    };

    const onCheckAllChangeParents = (e) => {
        setParentCheckedList(e.target.checked ? PERMISSIONS.parents : []);
    };

    // STUDENT CLASSES PERMISSIONS
    const [studentClassCheckedList, setStudentClassCheckedList] = useState([]);

    const checkAllStudentClassPermissions = PERMISSIONS.student_classes.length === studentClassCheckedList.length;
    const student_class_indeterminate = studentClassCheckedList.length > 0 && studentClassCheckedList.length < PERMISSIONS.student_classes.length;

    const onChangeStudentClass = (list) => {
        setStudentClassCheckedList(list)
    };

    const onCheckAllChangeStudentClass = (e) => {
        setStudentClassCheckedList(e.target.checked ? PERMISSIONS.student_classes : []);
    };

    // STUDENT END TERM MARKS PERMISSIONS
    const [studentEndTermMarksCheckedList, setStudentEndTermMarksCheckedList] = useState([]);

    const checkAllStudentEndTermMark = PERMISSIONS.student_end_term_marks.length === studentEndTermMarksCheckedList.length;
    const student_end_term_mark_indeterminate = studentEndTermMarksCheckedList.length > 0 && studentEndTermMarksCheckedList.length < PERMISSIONS.student_end_term_marks.length;

    const onChangeStudentEndTermMark = (list) => {
        setStudentEndTermMarksCheckedList(list)
    };

    const onCheckAllChangeStudentEndTermMark = (e) => {
        setStudentEndTermMarksCheckedList(e.target.checked ? PERMISSIONS.student_end_term_marks : []);
    };

    // STUDENTS PERMISSIONS
    const [studentsCheckedList, setStudentsCheckedList] = useState([]);

    const checkAllStudentsPermissions = PERMISSIONS.students.length === studentsCheckedList.length;
    const students_indeterminate = studentsCheckedList.length > 0 && studentsCheckedList.length < PERMISSIONS.students.length;

    const onChangeStudent = (list) => {
        setStudentsCheckedList(list)
    };

    const onCheckAllChangeStudents = (e) => {
        setStudentsCheckedList(e.target.checked ? PERMISSIONS.students : []);
    };

    // SUBJECT ALLOCATIONS PERMISSIONS
    const [subjectAllocationCheckedList, setSubjectAllocationCheckedList] = useState([]);

    const checkAllSubjectAllocation = PERMISSIONS.subjects_allocations.length === subjectAllocationCheckedList.length;
    const subject_allocation_indeterminate = subjectAllocationCheckedList.length > 0 && subjectAllocationCheckedList.length < PERMISSIONS.subjects_allocations.length;

    const onChangeSubjectAllocation = (list) => {
        setSubjectAllocationCheckedList(list)
    };

    const onCheckAllChangeSubjectAllocation = (e) => {
        setSubjectAllocationCheckedList(e.target.checked ? PERMISSIONS.subjects_allocations : []);
    };

    // SUBJECTS PERMISSIONS
    const [subjectCheckedList, setSubjectCheckedList] = useState([]);

    const checkAllSubjects = PERMISSIONS.subjects.length === subjectCheckedList.length;
    const subjects_indeterminate = subjectCheckedList.length > 0 && subjectCheckedList.length < PERMISSIONS.subjects.length;

    const onChangeSubject = (list) => {
        setSubjectCheckedList(list)
    };

    const onCheckAllChangeSubjects = (e) => {
        setSubjectCheckedList(e.target.checked ? PERMISSIONS.subjects : []);
    };

    // SUSPENSIONS PERMISSIONS
    const [suspensionCheckedList, setSuspensionCheckedList] = useState([]);

    const checkAllSuspension = PERMISSIONS.suspensions.length === suspensionCheckedList.length;
    const suspension_indeterminate = suspensionCheckedList.length > 0 && suspensionCheckedList.length < PERMISSIONS.suspensions.length;

    const onChangeSuspension = (list) => {
        setSuspensionCheckedList(list);
    };

    const onCheckAllChangeSuspension = (e) => {
        setSuspensionCheckedList(e.target.checked ? PERMISSIONS.suspensions : []);
    };

    // TEACHER EXAM COMMENTS PERMISSIONS
    const [teacherExamCommentCheckedList, setTeacherExamCommentCheckedList] = useState([]);

    const checkAllTeacherExamCommentsPermissions = PERMISSIONS.teacher_exam_comments.length === teacherExamCommentCheckedList.length;
    const teacher_exam_comment_indeterminate = teacherExamCommentCheckedList.length > 0 && teacherExamCommentCheckedList.length < PERMISSIONS.teacher_exam_comments.length;

    const onChangeTeacherExamComment = (list) => {
        setTeacherExamCommentCheckedList(list)
    };

    const onCheckAllChangeTeacherExamComments = (e) => {
        setTeacherExamCommentCheckedList(e.target.checked ? PERMISSIONS.teacher_exam_comments : []);
    };

    // TEACHERS PERMISSIONS
    const [teacherCheckedList, setTeacherCheckedList] = useState([]);

    const checkAllTeacherPermissions = PERMISSIONS.teachers.length === teacherCheckedList.length;
    const teachers_indeterminate = teacherCheckedList.length > 0 && teacherCheckedList.length < PERMISSIONS.teachers.length;

    const onTeacherChange = (list) => {
        setTeacherCheckedList(list);
    };

    const onCheckAllChangeTeachers = (e) => {
        setTeacherCheckedList(e.target.checked ? PERMISSIONS.teachers : []);
    };

    // SELECT ALL PERMISSIONS CHECKBOX

    const onChangeSelectAllPermissions = (e) => {
        setStudentsCheckedList(e.target.checked ? PERMISSIONS.students : [])
        setAdminCheckedList(e.target.checked ? PERMISSIONS.administrators : [])
        setAcademicYearCheckedList(e.target.checked ? PERMISSIONS.academic_years : [])
        setTermsCheckedList(e.target.checked ? PERMISSIONS.terms : [])
        setAuthCheckedList(e.target.checked ? PERMISSIONS.authentication : [])
        setBankingDetailCheckedList(e.target.checked ? PERMISSIONS.banking_details : [])
        setClassroomsCheckedList(e.target.checked ? PERMISSIONS.classrooms : [])
        setDepartmentCheckedList(e.target.checked ? PERMISSIONS.departments : [])
        setEndOfTermExamsCheckedList(e.target.checked ? PERMISSIONS.end_of_term_exams : [])
        setExpulsionCheckedList(e.target.checked ? PERMISSIONS.expulsions : [])
        setGradingScaleCheckedList(e.target.checked ? PERMISSIONS.grading_scale : [])
        setLevelCheckedList(e.target.checked ? PERMISSIONS.levels : [])
        setStudentClassCheckedList(e.target.checked ? PERMISSIONS.student_classes : [])
        setTeacherCheckedList(e.target.checked ? PERMISSIONS.teachers : [])
        setTeacherExamCommentCheckedList(e.target.checked ? PERMISSIONS.teacher_exam_comments : [])
        setSubjectAllocationCheckedList(e.target.checked ? PERMISSIONS.subjects_allocations : [])
        setSubjectCheckedList(e.target.checked ? PERMISSIONS.subjects : [])
        setSuspensionCheckedList(e.target.checked ? PERMISSIONS.suspensions : [])
        setParentCheckedList(e.target.checked ? PERMISSIONS.parents : [])
        setStudentEndTermMarksCheckedList(e.target.checked ? PERMISSIONS.student_end_term_marks : [])

    };

    return (
        <>
            <div>
                <ArrowLeftOutlined
                    onClick={() => navigate("/superadmin/institution-administrators")}
                    className="mb-1 me-2"
                />
                <h3>Add Institution Administrator</h3>
            </div>
            <Divider type={"horizontal"}/>

            <Form layout={'vertical'} form={form} onFinish={handleCreateNewInstitutionAdmin}>
                <Card className='mb-3'>
                    <Card.Meta
                        title={'Personal information'}
                    />
                    <div className="row mt-3">
                        <div className='col-md-12'>
                            <div className='row'>
                                <div className='col-md-3'>
                                    <Form.Item name="Institution" label="Institution">
                                        <Select
                                            options={_institutionList}
                                            size={"large"}
                                            onChange={handleInstitutionChange}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-3'>
                                    <Form.Item
                                        name='firstName'
                                        label="First name"
                                        rules={[{ required: true, message: 'First name is required!' }]}
                                    >
                                        <Input
                                            size={"large"}
                                            onChange={e => setFirstName(e.target.value)}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-3'>
                                    <Form.Item name="middleNames" label="Middle names">
                                        <Input
                                            size={"large"}
                                            onChange={e => setMiddleNames(e.target.value)}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-3'>
                                    <Form.Item
                                        name="lastName"
                                        label="Last name"
                                        rules={[{ required: true, message: 'Last name is required!' }]}
                                    >
                                        <Input
                                            size={"large"}
                                            onChange={e => setLastName(e.target.value)}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-md-12'>
                            <div className='row'>
                                <div className='col-md-3'>
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
                                <div className='col-md-3'>
                                    <Form.Item name="email" label="Email">
                                        <Input
                                            size={"large"}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-3'>
                                    <Form.Item name="gender" label="Gender">
                                        <Select
                                            onChange={handleGenderChange}
                                            options={[{label: "MALE", value: "MALE"}, {
                                                label: "FEMALE",
                                                value: "FEMALE"
                                            }]}
                                            size={"large"}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-md-3'>
                                    <Form.Item
                                        name="dateOfBirth"
                                        label="Date of birth"
                                        rules={[{ required: true, message: 'Date of birth is required!' }]}
                                    >
                                        <DatePicker
                                            size={"large"}
                                            className="w-100"
                                            onChange={handleDateOfBirthChange}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className='mb-3'>
                    <Card.Meta
                        title={'Permissions'}
                    />

                    <Checkbox
                        className='mt-3'
                        onChange={onChangeSelectAllPermissions}
                    >
                        Select all
                    </Checkbox>

                    <div className='row mt-3'>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Authentication</p>
                                <Checkbox
                                    indeterminate={authentication_indeterminate}
                                    onChange={onCheckAllChangeAuthentication}
                                    checked={checkAllAuthentications}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.authentication}
                                    value={authCheckedList}
                                    onChange={onChangeAuthentication}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Terms</p>
                                <Checkbox
                                    indeterminate={terms_indeterminate}
                                    onChange={onCheckAllChangeTerms}
                                    checked={checkAllTerms}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.terms}
                                    value={termsCheckedList}
                                    onChange={onChangeTerm}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Academic years</p>
                                <Checkbox
                                    indeterminate={academic_years_indeterminate}
                                    onChange={onCheckAllChangeAcademicYears}
                                    checked={checkAllAcademicYears}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.academic_years}
                                    value={academicYearCheckedList}
                                    onChange={onChangeAcademicYear}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Administrators</p>
                                <Checkbox
                                    indeterminate={administrator_indeterminate}
                                    onChange={onCheckAllChangeAdministrators}
                                    checked={checkAllAdministrators}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.administrators}
                                    value={adminCheckedList}
                                    onChange={onChangeAdministrator}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='row mt-3'>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Banking details</p>
                                <Checkbox
                                    indeterminate={banking_details_indeterminate}
                                    onChange={onCheckAllChangeBankingDetails}
                                    checked={checkAllBankingDetails}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.banking_details}
                                    value={bankingDetailCheckedList}
                                    onChange={onChangeBankingDetail}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Classrooms</p>
                                <Checkbox
                                    indeterminate={classroom_indeterminate}
                                    onChange={onCheckAllChangeClassrooms}
                                    checked={checkAllClassrooms}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.classrooms}
                                    value={classroomsCheckedList}
                                    onChange={onChangeClassroom}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Departments</p>
                                <Checkbox
                                    indeterminate={department_indeterminate}
                                    onChange={onCheckAllChangeDepartments}
                                    checked={checkAllDepartments}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.departments}
                                    value={departmentCheckedList}
                                    onChange={onChangeDepartment}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>End of term exams</p>
                                <Checkbox
                                    indeterminate={end_term_exams_indeterminate}
                                    onChange={onCheckAllChangeEndTermExam}
                                    checked={checkAllEndOfTermExams}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.end_of_term_exams}
                                    value={endOfTermExamsCheckedList}
                                    onChange={onChangeEndTermExam}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='row mt-3'>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Expulsions</p>
                                <Checkbox
                                    indeterminate={expulsions_indeterminate}
                                    onChange={onCheckAllChangeExpulsion}
                                    checked={checkAllExpulsions}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.expulsions}
                                    value={expulsionsCheckedList}
                                    onChange={onChangeExpulsion}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Grading scale</p>
                                <Checkbox
                                    indeterminate={grading_scale_indeterminate}
                                    onChange={onCheckAllChangeGradingScale}
                                    checked={checkAllGradingScales}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.grading_scale}
                                    value={gradingScaleCheckedList}
                                    onChange={onChangeGradingScale}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Levels</p>
                                <Checkbox
                                    indeterminate={levels_indeterminate}
                                    onChange={onCheckAllChangeLevels}
                                    checked={checkAllLevelsPermissions}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.levels}
                                    value={levelCheckedList}
                                    onChange={onChangeLevel}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Parents</p>
                                <Checkbox
                                    indeterminate={parents_indeterminate}
                                    onChange={onCheckAllChangeParents}
                                    checked={checkAllParentsPermission}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.parents}
                                    value={parentCheckedList}
                                    onChange={onChangeParent}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='row mt-3'>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Assign student to class</p>
                                <Checkbox
                                    indeterminate={student_class_indeterminate}
                                    onChange={onCheckAllChangeStudentClass}
                                    checked={checkAllStudentClassPermissions}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.student_classes}
                                    value={studentClassCheckedList}
                                    onChange={onChangeStudentClass}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Student end term marks</p>
                                <Checkbox
                                    indeterminate={student_end_term_mark_indeterminate}
                                    onChange={onCheckAllChangeStudentEndTermMark}
                                    checked={checkAllStudentEndTermMark}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.student_end_term_marks}
                                    value={studentEndTermMarksCheckedList}
                                    onChange={onChangeStudentEndTermMark}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Students</p>
                                <Checkbox
                                    indeterminate={students_indeterminate}
                                    onChange={onCheckAllChangeStudents}
                                    checked={checkAllStudentsPermissions}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.students}
                                    value={studentsCheckedList}
                                    onChange={onChangeStudent}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Subject allocation</p>
                                <Checkbox
                                    indeterminate={subject_allocation_indeterminate}
                                    onChange={onCheckAllChangeSubjectAllocation}
                                    checked={checkAllSubjectAllocation}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.subjects_allocations}
                                    value={subjectAllocationCheckedList}
                                    onChange={onChangeSubjectAllocation}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='row mt-3'>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Subjects</p>
                                <Checkbox
                                    indeterminate={subjects_indeterminate}
                                    onChange={onCheckAllChangeSubjects}
                                    checked={checkAllSubjects}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.subjects}
                                    value={subjectCheckedList}
                                    onChange={onChangeSubject}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Suspensions</p>
                                <Checkbox
                                    indeterminate={suspension_indeterminate}
                                    onChange={onCheckAllChangeSuspension}
                                    checked={checkAllSuspension}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.suspensions}
                                    value={suspensionCheckedList}
                                    onChange={onChangeSuspension}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Teacher exam comments</p>
                                <Checkbox
                                    indeterminate={teacher_exam_comment_indeterminate}
                                    onChange={onCheckAllChangeTeacherExamComments}
                                    checked={checkAllTeacherExamCommentsPermissions}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.teacher_exam_comments}
                                    value={teacherExamCommentCheckedList}
                                    onChange={onChangeTeacherExamComment}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div>
                                <p className='text-decoration-underline'>Teachers</p>
                                <Checkbox
                                    indeterminate={teachers_indeterminate}
                                    onChange={onCheckAllChangeTeachers}
                                    checked={checkAllTeacherPermissions}>
                                    Check all
                                </Checkbox>
                                <Divider className='my-2'/>

                                <CheckboxGroup
                                    options={PERMISSIONS.teachers}
                                    value={teacherCheckedList}
                                    onChange={onTeacherChange}
                                />
                            </div>
                        </div>
                    </div>

                </Card>

                <Button
                    size={"large"}
                    className={"text-light border-0"}
                    style={{background: '#39b54a'}}
                    loading={newInstitutionAdminBtnLoader}
                    disabled={newInstitutionAdminBtnDisabledState}
                    htmlType={"submit"}
                >
                    Add new administrator
                </Button>
            </Form>
        </>
    )
}

export default NewInstitutionAdministrator;