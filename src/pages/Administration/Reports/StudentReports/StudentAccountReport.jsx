import {Divider, Table} from "antd";
import Search from "antd/es/input/Search";
import {useEffect, useState} from "react";
import StudentService from "../../../../services/student.service";
import FoundStudentAccount from "./FoundStudentAccount";
import {FrownOutlined, LoadingOutlined, SearchOutlined} from "@ant-design/icons";
import {useSearchParams} from "react-router-dom";
import {toInputUppercase} from "../../../../common";
import SubjectAllocationService from "../../../../services/subject-allocation.service";
import StudentClassService from "../../../../services/student-class.service";
import studentClassService from "../../../../services/student-class.service";

const StudentAccountReport = () => {
    const [userNotFound, setUserNotFound] = useState(false)
    const [student, setStudent] = useState()
    const [subjects, setSubjects] = useState(null)
    const [previousClasses, setPreviousClasses] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();

    function searchStudent(value) {
        let regNumber = searchParams.get("regNumber")
        if(value) {
            regNumber = value
        }

        if(regNumber) {
            setLoading(true)
            StudentService.searchUserByRegNumber(regNumber)
                .then(res => {
                    if (res.data) {
                        setStudent(res.data)
                        getStudentsPreviousClasses(res.data?.student?.user?.id)
                        getStudentSubjects(res.data?.student?.user?.id)
                    }
                    setLoading(false)
                })
                .catch(e => {
                    console.log({e})
                    setLoading(false)
                    setUserNotFound(true)
                })
        }
    }

    const getStudentSubjects = (id) => {
        studentClassService.getStudentSubjectsByStudentUserId(id)
            .then(res => {
                if(res.data) {
                    setSubjects(res.data)
                }
            })
            .catch(e => {
                console.log({e})
            })
    }

    const getStudentsPreviousClasses = (id) => {
        StudentClassService.getStudentPreviousClasses(id)
            .then(res => {
                if(res.data) {
                    console.log("prevClasses ", res.data)
                    setPreviousClasses(res.data)
                }
            })
            .catch(e => {
                console.log({e})
            })
    }

    const onSearch = (value) => {
        setSearchParams({regNumber: value})
        setUserNotFound(false)
        setStudent(null)
        searchStudent(value);
    }

    useEffect(() => {
        searchStudent()
    }, []);

    return (
        <div className="mx-4 mt-3">
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Search Student</h3>
                <Search
                    placeholder="Enter Student RegNumber..."
                    size="large"
                    onInput={toInputUppercase}
                    onSearch={onSearch}
                    style={{maxWidth: "300px"}}
                    enterButton
                />
            </div>

            <Divider type={"horizontal"}/>

            {loading && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{minHeight: "70vh"}}
                >
                    <div className="text-center">
                        <LoadingOutlined style={{fontSize: "130px", color: "#39b54a"}} />
                    </div>
                </div>
            )}

            {(!student && !userNotFound) && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{minHeight: "70vh"}}
                >
                    <div className="text-center">
                        <SearchOutlined style={{fontSize: "130px", color: "#80857a"}} />
                        <p className="lead mt-4">Please search a student to continue</p>
                    </div>
                </div>
            )}

            {(student && !loading) && (
                <FoundStudentAccount
                    student={student}
                    subjects={subjects}
                    previousClasses={previousClasses}
                />
            )}

            {userNotFound && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{minHeight: "70vh"}}
                >
                    <div className="text-center">
                        <FrownOutlined style={{fontSize: "130px", color: "#8d8a53"}} />
                        <p className="lead mt-4 mb-0">Student Not Found</p>
                        <p className="fw-light mt-1">Please check their Registration Number and try again</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StudentAccountReport;