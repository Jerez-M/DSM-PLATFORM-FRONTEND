import {Avatar, Button, Card, Divider} from "antd";
import {PrinterOutlined, UserOutlined} from "@ant-design/icons";
import {useRef} from "react";
import {useReactToPrint} from "react-to-print";
import {capitaliseFirstLetters, toHumanDate, toYear} from "../../../../common";

const FoundTeacherAccount = ({teacher, previousClasses, currentClasses, previousSubjects, subjectAllocations}) => {
    const currentComponentRef = useRef();
    const handlePrintCurrentResults = useReactToPrint({
        content: () => currentComponentRef.current,
        documentTitle: `Report for ${teacher && teacher?.user?.regNumber }`,
    });

    return (
        <div ref={currentComponentRef} className="print-margins">
            <div className="row justify-content-end">
                <Button
                    icon={<PrinterOutlined/>}
                    type="primary"
                    onClick={handlePrintCurrentResults}
                    size="large"
                    style={{maxWidth: "200px"}}
                    className="hide-print"
                >
                    Print Report
                </Button>
            </div>
            <div className="row mt-4">
                <div className="col-md-5 col-lg-4">
                    <Card style={{backgroundColor: "#39b54a", color: "#fff"}}>
                        <div>
                            <div className="text-center">
                                <Avatar size={120} icon={<UserOutlined/>}/>
                                <div className="mt-3">
                                    <div className="mt-1">
                                        <span className="fw-bold">
                                            {teacher?.title} {" "}
                                            {teacher.user?.firstName} {" "}
                                            {teacher.user?.middleNames} {" "}
                                            {teacher.user?.lastName}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Divider type="horizontal" style={{backgroundColor: "#fff"}}/>

                            <h6 style={{textDecoration: "underline", textUnderlineOffset: "4px"}}>User Details</h6>
                            <div className="mt-2">
                                <div className="d-sm-flex d-xl-block flex-column">
                                    <span className="fw-bold">Registration Number: </span>
                                    {teacher.user?.username}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="d-sm-flex d-xl-block flex-column">
                                    <span className="fw-bold">Gender: </span>
                                    {capitaliseFirstLetters(teacher.user?.gender)}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="d-sm-flex d-xl-block flex-column">
                                    <span className="fw-bold">National Id Number: </span>
                                    {teacher.national_id}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="d-sm-flex d-xl-block flex-column">
                                    <span className="fw-bold">Date Of Birth: </span>
                                    {toHumanDate(teacher.user?.dateOfBirth)}
                                </div>
                            </div>

                            <h6 className="mt-4"
                                style={{textDecoration: "underline", textUnderlineOffset: "4px"}}>Contact
                                Information</h6>
                            <div className="mt-2">
                                <div className="d-sm-flex d-xl-block flex-column">
                                    <span className="fw-bold">Address: </span>
                                    {teacher.address}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="d-sm-flex d-xl-block flex-column">
                                    <span className="fw-bold">Phone Number: </span>
                                    {teacher.user?.phoneNumber}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="d-sm-flex d-xl-block flex-column">
                                    <span className="fw-bold">Email: </span>
                                    {teacher.user?.email}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="d-sm-flex d-xl-block flex-column">
                                    <span className="fw-bold">Alternative Email: </span>
                                    {teacher.alt_email}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>


                <div className="col-md-7 col-lg-8 mt-4 mt-md-0">
                    <Card title="Academic Information">
                        <div className="row">
                            <div className="mt-2">
                                <div className="">
                                    <span className="text-success">Number Of Classes being taught: </span>
                                    {subjectAllocations?.length}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="">
                                    <span className="text-success">Subjects Taught: </span>
                                    {teacher?.subjects?.map((subject) => subject.name).join(", ")}
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <h6 className="fw-bold">Classes Being taught: </h6>
                        {(!subjectAllocations || subjectAllocations?.length === 0) &&
                            "Teacher is not teaching any classes at this school"}
                        {(subjectAllocations?.length >= 0) && subjectAllocations.map((subject) => (
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="d-sm-flex d-xl-block flex-column">
                                            <span className="text-success">Subject: </span>
                                            {subject.subject?.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="d-sm-flex d-xl-block flex-column">
                                            <span className="text-success">Classname: </span>
                                            {subject.classroom?.level?.name} {" "} {subject.classroom?.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="d-sm-flex d-xl-block flex-column">
                                            <span className="text-success">Academic Year: </span>
                                            {toYear(subject.created)}
                                        </div>
                                    </div>
                                </div>
                                <Divider type="horizontal" className="d-sm-none" />
                            </div>
                        ))}

                        <Divider type="horizontal" />

                        <h6 className="fw-bold">Classes being managed: </h6>
                        {(!currentClasses || currentClasses?.length === 0) &&
                            "Teacher was not a class teacher for any class right now"}
                        {(currentClasses?.length >= 0) && currentClasses.map((currentClass) => (
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="d-sm-flex d-xl-block flex-column">
                                            <span className="text-success">Level: </span>
                                            {currentClass?.level?.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="d-sm-flex d-xl-block flex-column">
                                            <span className="text-success">Classname: </span>
                                            {currentClass?.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="d-sm-flex d-xl-block flex-column">
                                            <span className="text-success">Stats: </span>
                                            {currentClass.occupied_sits}/{currentClass.capacity}
                                        </div>
                                    </div>
                                </div>
                                <Divider type="horizontal" className="d-sm-none" />
                            </div>
                        ))}
                    </Card>

                    <Card title="School Teaching History" className="mt-4">
                        <h6 className="fw-bold">Previous Subjects: </h6>
                        {(!previousSubjects || previousSubjects?.length === 0) &&
                            "Teacher did not teach any other classes at this school"}
                        {(previousSubjects?.length >= 0) && previousSubjects.map((subject) => (
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="d-sm-flex d-xl-block flex-column">
                                            <span className="text-success">Subject: </span>
                                            {subject.subject?.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="d-sm-flex d-xl-block flex-column">
                                            <span className="text-success">Classname: </span>
                                            {subject.classroom?.level?.name} {" "} {subject.classroom?.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="d-sm-flex d-xl-block flex-column">
                                            <span className="text-success">Academic Year: </span>
                                            {toHumanDate(subject.created)}
                                        </div>
                                    </div>
                                </div>
                                <Divider type="horizontal" className="d-sm-none" />
                            </div>
                        ))}

                        <Divider />

                        <h6 className="fw-bold">Previous Classes: </h6>
                        {(!previousClasses || previousClasses?.length === 0) &&
                            "Teacher was not a class teacher for any class before at this school"}
                        {(previousClasses?.length >= 0) && previousClasses.map((previousClass) => (
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="d-sm-flex d-xl-block flex-column">
                                            <span className="text-success">Level: </span>
                                            {previousClass.level?.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="d-sm-flex d-xl-block flex-column">
                                            <span className="text-success">Classname: </span>
                                            {previousClass.classroom?.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="d-sm-flex d-xl-block flex-column">
                                            <span className="text-success">Academic Year: </span>
                                            {toYear(previousClass.created)}
                                        </div>
                                    </div>
                                </div>
                                <Divider type="horizontal" className="d-sm-none" />
                            </div>
                        ))}
                    </Card>

                    {/*<Card title={"Parent Information"}>*/}

                    {/*</Card>*/}
                </div>
            </div>
        </div>
    );
}

export default FoundTeacherAccount;