import {Divider} from "antd";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import Search from "antd/es/input/Search";
import {FrownOutlined, LoadingOutlined, SearchOutlined} from "@ant-design/icons";
import TeacherService from "../../../../services/teacher.service";
import FoundTeacherAccount from "./FoundTeacherAccount";
import {toInputUppercase} from "../../../../common";
import SubjectAllocationService from "../../../../services/subject-allocation.service";
import ClassroomService from "../../../../services/classroom.service";

const TeacherAccountReport = () => {
    const [userNotFound, setUserNotFound] = useState(false)
    const [teacher, setTeacher] = useState()
    const [previousSubjects, setPreviousSubjects] = useState(null)
    const [currentClasses, setCurrentClasses] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();

    function searchTeacher(value) {
        let regNumber = searchParams.get("regNumber")
        if(value) {
            regNumber = value
        }
        console.log({regNumber})

        if(regNumber) {
            setLoading(true)
            TeacherService.searchUserByRegNumber(regNumber)
                .then(res => {
                    if (res.data) {
                        console.log("got: ", res.data)
                        setTeacher(res.data)
                        getPreviousSubjectAllocations(res.data?.teacher?.user?.id)
                        getCurrentClasses(res.data?.teacher?.user?.id)
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

    const getPreviousSubjectAllocations = (id) => {
        SubjectAllocationService.getTeacherPreviousSubjectAllocations(id)
            .then(res => {
                if(res.data) {
                    console.log("prevClasses ", res.data)
                    setPreviousSubjects(res.data)
                }
            })
            .catch(e => {
                console.log({e})
            })
    }
    const getCurrentClasses = (id) => {
        ClassroomService.getClassByTeacherUserId(id)
            .then(res => {
                if(res.data) {
                    console.log("currentClasses ", res.data)
                    setCurrentClasses(res.data)
                }
            })
            .catch(e => {
                console.log({e})
            })
    }

    const onSearch = (value) => {
        console.log({value})
        setSearchParams({regNumber: value})
        setUserNotFound(false)
        setTeacher(null)
        searchTeacher(value);
    }

    useEffect(() => {
        searchTeacher()
    }, []);

    return (
        <div className="mx-4 mt-3">
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Search Teacher</h3>
                <Search
                    placeholder="Enter Teacher RegNumber..."
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

            {(!teacher && !userNotFound) && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{minHeight: "70vh"}}
                >
                    <div className="text-center">
                        <SearchOutlined style={{fontSize: "130px", color: "#80857a"}} />
                        <p className="lead mt-4">Please search a teacher to continue</p>
                    </div>
                </div>
            )}

            {(teacher && !loading) && (
                <FoundTeacherAccount
                    teacher={teacher?.teacher}
                    subjectAllocations={teacher["subject allocations"]}
                    previousClasses={teacher?.classrooms}
                    previousSubjects={previousSubjects}
                    currentClasses={currentClasses}
                />
            )}

            {userNotFound && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{minHeight: "70vh"}}
                >
                    <div className="text-center">
                        <FrownOutlined style={{fontSize: "130px", color: "#8d8a53"}} />
                        <p className="lead mt-4 mb-0">Teacher Not Found</p>
                        <p className="fw-light mt-1">Please check their Registration Number and try again</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherAccountReport;