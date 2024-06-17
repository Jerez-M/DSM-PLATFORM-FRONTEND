import AuthenticationService from "./services/authentication.service";
import {useState} from "react";
import Home from "./pages/Administration/Dashboard/Home";

import SuperuserDashboard from "./pages/Superuser/SuperuserDashboard";
import StudentDashboard from "./pages/Student/Dashboard/StudentDashboard";
import TeacherDashboard from "./pages/Teacher/Dashboard/TeacherDashboard";
import ParentDashboard from "./pages/Parent/Dashboard/ParentDashboard";

const DashboardIndexDecider = () => {
    const [role, setRole] = useState(AuthenticationService.getUserRole());

    if(role === 'ADMIN') {
        return <Home />
    } else if(role === 'STUDENT') {
        return <h1><StudentDashboard/></h1>
    } else if(role === 'TEACHER') {
        return <h1><TeacherDashboard/></h1>
    } else if(role === 'SUPERUSER') {
        return <SuperuserDashboard />
    } else if(role === 'PARENT') {
        return <ParentDashboard />
    }
}

export default DashboardIndexDecider;