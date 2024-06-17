import React, {useEffect, useState} from 'react';
import {Alert, Button, Checkbox, DatePicker, message, Modal, Table, Tag} from "antd";
import {SaveFilled} from "@ant-design/icons";
import dayjs from "dayjs";
import StudentAttendanceService from "../../../services/student-attendance.service";
import {useParams} from "react-router-dom";
import {refreshPage} from "../../../common";


async function fetchActiveClassroomRegister(classroomId) {
    try {
        const activeRegisterResponse = await StudentAttendanceService.getStudentAttendanceByClassroomId(
            classroomId
        )
        return activeRegisterResponse?.data
    } catch (e) {
        return {}
    }
}

export async function fetchStudentAttendanceRecordsByClassroomIdAndDate(classroomId, date) {
    try {
        const response = await StudentAttendanceService.getStudentAttendanceRecordsByClassroomIdAndDate(
            classroomId,
            date
        )
        return response?.data
    } catch (e) {
        return []
    }
}
const AttendanceMarking = ({studentsList}) => {
    const params = useParams();

    const [isPreviousDayAttendanceModalOpen, setIsPreviousDayAttendanceModalOpen] = useState(false);
    const [selectedDayPreviousAttendance, setSelectedDayPreviousAttendance] = useState([]);
    const [activeClassroomRegister, setActiveClassroomRegister] = useState({});
    const [studentsAttendanceRecordsByDate, setStudentsAttendanceRecordsByDate] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [isSubmitAttendanceBtnLoading, setIsSubmitAttendanceBtnLoading] = useState(false);
    const [isSubmitPreviousAttendanceBtnLoading, setIsSubmitPreviousAttendanceBtnLoading] = useState(false);

    const selectedDayPreviousAttendanceData = selectedDayPreviousAttendance?.map((student, key) => ({
        key: key + 1,
        id: student?.student?.id,
        status: student?.status,
        name: `${student?.student?.user?.firstName} ${student?.student?.user?.lastName}`,
        date: student?.date
    }));

    const studentsAttendanceRecordsByDateData = studentsAttendanceRecordsByDate?.map((student, key) => ({
        key: key + 1,
        id: student?.student?.id,
        status: student?.status,
        name: `${student?.student?.user?.firstName} ${student?.student?.user?.lastName}`,
        date: student?.date
    }));


    const studentsData = studentsList?.map((student, key) => ({
        key: key + 1,
        id: student?.student?.id,
        status: false,
        name: `${student?.student?.user?.firstName} ${student?.student?.user?.lastName}`
    }));

    const [students, setStudents] = useState(studentsData);

    const handleAttendanceChange = (studentId) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.id === studentId ? {...student, status: !student.status} : student
            )
        );
    };


    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are zero-indexed, so we add 1
    const day = today.getDate();
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

    const handleChangeDate = async (date, dateString) => {
        setSelectedDate(dateString);
        if (dateString === formattedDate) {
            setIsPreviousDayAttendanceModalOpen(false);
        } else {
            try {
                const response = await fetchStudentAttendanceRecordsByClassroomIdAndDate(params.classroomId, dateString);
                setSelectedDayPreviousAttendance(response);
            } catch (e) {
                setSelectedDayPreviousAttendance([]);
            }
            setIsPreviousDayAttendanceModalOpen(true);
        }
    }

    const studentsDataTableColumns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Student Full Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Status',
            dataIndex: '',
            key: '',
            align: 'center',
            render: (record) => (
                <center>
                    <Checkbox
                        type="checkbox"
                        checked={record.status}
                        onChange={() => handleAttendanceChange(record.id)}
                    />
                </center>
            )
        }
    ];


    const studentsAttendanceRecordsTableColumns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Student Full Name',
            dataIndex: 'name',
            key: 'name'
        },{
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (record) => {
                if(record === 'PRESENT') {
                    return <Tag className='border-success bg-success text-white'>PRESENT</Tag>
                } else if(record === 'ABSENT') {
                    return <Tag className='border-danger bg-danger text-white'>ABSENT</Tag>
                }
            }
        }
    ];

    useEffect(
        () => {
            fetchActiveClassroomRegister(params.classroomId).then(
                (data) => {
                    setActiveClassroomRegister(data)
                }
            )

            fetchStudentAttendanceRecordsByClassroomIdAndDate(params.classroomId, formattedDate).then(
                (data) => {
                    setStudentsAttendanceRecordsByDate(data)
                }
            )
        }, []
    )

    function compareDates(inputDate, todayDate) {
        const inputDateObj = new Date(inputDate);
        const givenTodayDateObj = new Date(todayDate);

        if (inputDateObj > givenTodayDateObj) {
            return -1;
        } else if (inputDateObj < givenTodayDateObj) {
            return 1;
        } else {
            return 0;
        }
    }


    const submitAttendance = async (i) => {
        if(i !== null) {
            const checkDates = compareDates(i, formattedDate);
            if(checkDates === -1) {
                message.error('You cannot mark attendance for a future date.');
                return;
            }
        }

        const data = {
            classroom: params.classroomId,
            date: i === null ? formattedDate : i,
            students: students.map((student) => ({
                student: student.id,
                status: student.status === true ? 'PRESENT' : 'ABSENT'
            }))
        }

        try {
            setIsSubmitPreviousAttendanceBtnLoading(true);
            setIsSubmitAttendanceBtnLoading(true);
            const response = await StudentAttendanceService.bulkCreateStudentAttendanceRecords(data)
            if(response?.status === 201) {
                message.success('Attendance marked successfully.');
                refreshPage();
            }
        } catch (e) {
            setIsSubmitPreviousAttendanceBtnLoading(false);
            setIsSubmitAttendanceBtnLoading(false);
            if(e?.response?.status === 400) {
                message.error(e?.response?.data?.error);
                return;
            }
            message.error('An error occurred while marking attendance.');
        }
    };

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Mark Attendance</h3>
                <DatePicker
                    defaultValue={() => dayjs(formattedDate, 'YYYY-MM-DD')}
                    onChange={handleChangeDate}
                />
            </div>
            <Alert
                message='Please note'
                description='Mark attendance for students in the class.'
                type='info'
                size='small'
                className='mb-3'
                closable
                showIcon
            >
                Click the checkbox to mark a student as present or absent.
            </Alert>

            {
                studentsAttendanceRecordsByDate?.length > 0 ? (
                    <Table
                        dataSource={studentsAttendanceRecordsByDateData}
                        columns={studentsAttendanceRecordsTableColumns}
                    />
                ) : (
                    <Table
                        dataSource={students}
                        columns={studentsDataTableColumns}
                        bordered
                        footer={
                            () => (
                                <Button
                                    className='px-4 bg-primary text-light border-primary'
                                    icon={<SaveFilled/>}
                                    loading={isSubmitAttendanceBtnLoading}
                                    disabled={isSubmitAttendanceBtnLoading}
                                    onClick={() => submitAttendance(null)}
                                    type='primary'
                                    ghost
                                >
                                    Save
                                </Button>
                            )
                        }
                    />
                )
            }

            <Modal
                open={isPreviousDayAttendanceModalOpen}
                cancelButtonProps={{style: {display: 'none'}}}
                okButtonProps={{style: {display: 'none'}}}
                width={720}
                onCancel={() => setIsPreviousDayAttendanceModalOpen(false)}
                title={`Attendance for ${selectedDate}`}
                destroyOnClose
            >
                {
                    selectedDayPreviousAttendance?.length === 0 ? (
                        <div>
                            <Alert
                                message='No attendance records found.'
                                description='No attendance records were found for the selected date.'
                                type='info'
                                className='mb-3'
                                showIcon
                            />
                            <Table
                                dataSource={students}
                                columns={studentsDataTableColumns}
                                bordered
                                footer={
                                    () => (
                                        <Button
                                            className='px-4 bg-primary text-light border-primary'
                                            icon={<SaveFilled/>}
                                            loading={isSubmitPreviousAttendanceBtnLoading}
                                            disabled={isSubmitPreviousAttendanceBtnLoading}
                                            onClick={() => submitAttendance(selectedDate)}
                                            type='primary'
                                            ghost
                                        >
                                            Save
                                        </Button>
                                    )
                                }
                            />
                        </div>
                    ) : <Table
                        dataSource={selectedDayPreviousAttendanceData}
                        columns={studentsAttendanceRecordsTableColumns}
                    />
                }
            </Modal>
        </div>
    );
};

export default AttendanceMarking;
