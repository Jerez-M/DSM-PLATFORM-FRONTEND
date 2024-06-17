import AuthenticationService from "../../../services/authentication.service";
import StudentService from "../../../services/student.service";
import ChildCard from "./../Dashboard/ChildCard"
import {useLoaderData, useNavigate} from "react-router-dom";
import {Divider} from "antd";
import {useEffect, useState} from "react";

export async function parentChildrenLoader() {
    try {
        const response = await StudentService.getChildrenOfParent(AuthenticationService.getUserId());
        if (response?.status === 200) {
            const students = response.data;
            return {students};
        }
    } catch (e) {
        return []
    }
}

const ParentChildrenReport = () => {
    const {students} = useLoaderData();
    const navigate = useNavigate();
    const [showChildren, setShowChildren] = useState(false);

    useEffect(() => {
        if(students?.length === 1 && students[0].id) {
            navigate(`/parent/children-reports/${students[0]?.user?.id}`)
        } else {
            setShowChildren(true)
        }
    }, [students])

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Choose the child whose report you want to view</h3>
            </div>
            <Divider />

            {showChildren && <div className='d-flex flex-wrap justify-content-evenly justify-content-xxl-between'>
                {students.map((student, index) => (
                    <ChildCard
                        key={index}
                        student={student}
                        onClick={() => navigate(`${student?.user?.id}`)}
                    />
                ))}
            </div>}
        </>
  )
}

export default ParentChildrenReport;