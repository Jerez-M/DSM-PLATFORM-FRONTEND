import {Avatar, Button, Card, Divider} from "antd";
import {PrinterOutlined, UserOutlined} from "@ant-design/icons";
import {useRef} from "react";
import {useReactToPrint} from "react-to-print";
import {capitaliseFirstLetters, toHumanDate} from "../../../../common";

const FoundStudentAccount = ({student, subjects, previousClasses}) => {
    const currentComponentRef = useRef();
    const handlePrintCurrentResults = useReactToPrint({
        content: () => currentComponentRef.current,
        documentTitle: `Report for ${student && student?.user?.regNumber }`,
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
                                            {student.student.user?.firstName} {" "}
                                            {student.student.user?.middleNames} {" "}
                                            {student.student.user?.lastName}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Divider type="horizontal" style={{backgroundColor: "#fff"}}/>

                            <h6 style={{textDecoration: "underline", textUnderlineOffset: "4px"}}>User Details</h6>
                            <div className="mt-2">
                                <div className="">
                                    <span className="fw-bold">Registration Number: </span>
                                    {student.student.user?.username}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="">
                                    <span className="fw-bold">Gender: </span>
                                    {capitaliseFirstLetters(student.student.user?.gender)}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="">
                                    <span className="fw-bold">Birth Certificate Number: </span>
                                    {student.student.birthCertNumber}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="">
                                    <span className="fw-bold">Date Of Birth: </span>
                                    {student.student.user?.dateOfBirth}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="">
                                    <span className="fw-bold">Nationality: </span>
                                    {capitaliseFirstLetters(student.student.nationality)}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="">
                                    <span className="fw-bold">Religion: </span>
                                    {capitaliseFirstLetters(student.student.religion)}
                                </div>
                            </div>

                            <h6 className="mt-4"
                                style={{textDecoration: "underline", textUnderlineOffset: "4px"}}>Contact
                                Information</h6>
                            <div className="mt-2">
                                <div className="">
                                    <span className="fw-bold">Address: </span>
                                    {student.student.address}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="">
                                    <span className="fw-bold">Province: </span>
                                    {capitaliseFirstLetters(student.student.province)}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="">
                                    <span className="fw-bold">Phone Number: </span>
                                    {student.student.user?.phoneNumber}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="">
                                    <span className="fw-bold">Email: </span>
                                    {student.student.user?.email}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>


                <div className="col-md-7 col-lg-8 mt-4 mt-md-0">
                    <Card title="School Information">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="mt-2">
                                    <div className="">
                                        <span className="fw-bold">Current Academic Year: </span>
                                        {student.classroom?.academicYear?.name}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="">
                                        <span className="fw-bold">Enrollment Date: </span>
                                        {toHumanDate(student.student.enrollmentDate)}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="">
                                        <span className="fw-bold">Residence Type: </span>
                                        {capitaliseFirstLetters(student.student.residenceType)}
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="mt-2">
                                    <div className="">
                                        <span className="fw-bold">Class Teacher: </span>
                                        {capitaliseFirstLetters(student.classroom?.classroom?.class_teacher?.title)} {" "}
                                        {student.classroom?.classroom?.class_teacher?.user?.lastName}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="">
                                        <span className="fw-bold">Class Name: </span>
                                        {capitaliseFirstLetters(student.classroom?.classroom?.name)}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="">
                                        <span className="fw-bold">Level: </span>
                                        {capitaliseFirstLetters(student.student.level + "")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Academic Information" className="mt-4">
                        <div className="row">
                            <div className="mt-2">
                                <div className="">
                                    <span className="fw-bold">Number Of Classes being taken: </span>
                                    {subjects?.length}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="">
                                    <span className="fw-bold">Subjects Enrolled In: </span>
                                    {subjects?.map(subject => {
                                        return (
                                            <span key={subject.id}>
                                                {subject.name}{", "}
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Medical Information" className="mt-4">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="mt-2">
                                    <div className="">
                                        <span className="fw-bold">Allergies: </span>
                                        {student.student.allergies}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="">
                                        <span className="fw-bold">Inclusive Needs: </span>
                                        {student.student.inclusiveNeeds}
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="mt-2">
                                    <div className="">
                                        <span className="fw-bold">Medical Aid Provider: </span>
                                        {student.student.medicalAidName}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="">
                                        <span className="fw-bold">Medical Aid Number: </span>
                                        {student.student.medicalAidNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="School Records" className="mt-4">
                        <h5 className="fw-bold">Previous Classes: </h5>
                        {(!previousClasses || previousClasses?.length === 0) &&
                            "Student did not take any other classes at this school"}

                        {(previousClasses?.length >= 0) && previousClasses.map((previousClass) => (
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="">
                                            <span className="fw-bold">Classname: </span>
                                            {previousClass.classroom?.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="">
                                            <span className="fw-bold">Academic Year: </span>
                                            {previousClass.academicYear}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="mt-2">
                                        <div className="">
                                            <span className="fw-bold">Class Teacher: </span>
                                            {previousClass.classroom?.class_teacher?.title} {" "}
                                            {previousClass.classroom?.class_teacher?.user?.lastName}
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

export default FoundStudentAccount;