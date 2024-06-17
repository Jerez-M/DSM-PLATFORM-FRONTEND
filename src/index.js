import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import bootstrap from 'bootstrap'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layout/Root";
import 'bootstrap/dist/css/bootstrap.css';
import NewStudent, { newStudentLoader } from "./pages/Administration/StudentManagement/NewStudent";
import StudentsList, { studentsLoader } from "./pages/Administration/StudentManagement/StudentsList";
import StudentInformation, {
    studentInformationLoader
} from "./pages/Administration/StudentManagement/StudentInformation";
import UpdateStudent, { updateStudentLoader } from "./pages/Administration/StudentManagement/UpdateStudent";
import NewTeacher from "./pages/Administration/StaffManagement/Teachers/NewTeacher";
import TeachersList, { teachersLoader } from "./pages/Administration/StaffManagement/Teachers/TeachersList";
import TeacherInformation, {
    teacherInformationLoader
} from "./pages/Administration/StaffManagement/Teachers/TeacherInformation";
import UpdateTeacher, { teacherUpdateLoader } from "./pages/Administration/StaffManagement/Teachers/UpdateTeacher";
import SchoolInformationManagementIndex
    from "./pages/Administration/SchoolInformationManagement/SchoolInformationManagementIndex";
import StudentClassesList, {
    classesLoader
} from "./pages/Administration/ClassroomManagement/StudentClass/StudentClassesList";
import { ConfigProvider } from "antd";
import DashboardIndexDecider from "./DashboardIndexDecider";
import ClientsList, { clientsListLoader } from "./pages/Superuser/ClientsManagement/ClientsList";
import InstitutionsList, { institutionsListLoader } from "./pages/Superuser/InstitutionsManagement/InstitutionsList";
import InstitutionListByClient, {
    institutionsByClientListLoader
} from "./pages/Superuser/InstitutionsManagement/InstitutionListByClient";
import StudentProfile, { studentProfileLoader } from "./pages/Student/StudentProfile/StudentProfile";
import StudentCLassStudentsList, {
    classStudentsLoader
} from "./pages/Administration/ClassroomManagement/StudentClass/students/StudentClassStudentsList";
import TeacherProfile, { teacherProfileLoader } from "./pages/Teacher/TeacherProfile/TeacherProfile";
import InstitutionAdministratorsList
, {
    administratorsListLoader
} from "./pages/Superuser/InstitutionAdministratorsManagement/InstitutionAdministratorsList";
import SubjectAllocationsList
    from './pages/Administration/ClassroomManagement/SubjectAllocation/SubjectAllocationsList';

import ExaminationsList, { examinationsListLoader } from "./pages/Administration/ExaminationManagement/ExaminationsList";
// import EndTermPapersList, {
//     examinationPapersListLoader
// } from "./pages/Administration/ExaminationManagement/EndTermPapersList";
import EndTermPapersList, {
    examinationPapersListLoader
} from "./pages/Administration/ExaminationManagement/EndTermPapersList.tsx";
import TeacherSubjectAllocationsList, {
    subjectAllocationsListLoader
} from "./pages/Teacher/ExaminationManagement/TeacherSubjectAllocationsList";
import TeacherClassList, { teacherClassLoader } from "./pages/Teacher/ExaminationManagement/TeacherClassList";

import TeacherClassroom, {
    teacherClassStudentsLoader
} from "./pages/Teacher/Classroom/TeacherClassroom";
import TeacherClassroomList, { teacherClassroomLoader } from "./pages/Teacher/Classroom/TeacherClassroomList";
import Teachersubjects from "./pages/Teacher/Subjects/SubjectList";
import SchoolProfile, { schoolProfileLoader } from "./pages/Administration/SchoolProfile/SchoolProfile";
import TeacherDashboard from "./pages/Teacher/Dashboard/TeacherDashboard";
import AdministrationStudentAcademicInformation
, {
    studentAcademicInformationLoader
} from "./pages/Administration/StudentManagement/AdministrationStudentAcademicInformation";
import StudentReports from './pages/Student/StudentReports/Reports.jsx';
import StudentDashboard from './pages/Student/Dashboard/StudentDashboard.jsx';
import StudentAccountReport from "./pages/Administration/Reports/StudentReports/StudentAccountReport";
import TeacherAccountReport from "./pages/Administration/Reports/TeacherReports/TeacherAccountReport";
import StudentSubjectsList, { fetchSubjects } from './pages/Student/StudentSubjects/StudentSubjectList.jsx';
import CurrentReport from './pages/Teacher/StudentReports/CurrentReport.jsx';
import PreviousReport from './pages/Teacher/StudentReports/PreviousReport.jsx';
import SubjectClassStudentsList, { subjectClassStudentsLoader } from "./pages/Teacher/Subjects/SubjectClassStudentsList";
import AuthenticationService from "./services/authentication.service";
import DemoRequestsList, { demoRequestsLoader } from "./pages/Superuser/Demos/DemoRequestsList";

import StudentsWithoutClasses, {
    StudentsWithoutclassesLoader
} from './pages/Administration/ClassroomManagement/StudentClass/StudentsWithoutClasses.jsx';
import StudentsWithoutLevels, {
    StudentsWithoutLevelsLoader
} from './pages/Administration/ClassroomManagement/StudentClass/StudentsWithoutLevels.jsx';

import PageNotFoundError from "./pages/Errors/404";
import UnauthorizedAccessErrorPage from "./pages/Errors/403";
import NewInstitutionAdministrator
    from "./pages/Superuser/InstitutionAdministratorsManagement/NewInstitutionAdministrator";
import UpdateProfile, { updateStudentProfileLoader } from "./pages/Student/StudentProfile/UpdateProfile";
import AllStudentsList, { allStudentsLoader } from './pages/Administration/StudentManagement/AllStudentsList.jsx';
import SmsManagementIndex from './pages/Administration/SmsManagement/SmsManagementIndex.jsx';
import NewsletterList, { newslettersLoader } from "./pages/Administration/Newsletter/NewsletterList";
import NewsletterDetail, { newsletterLoader } from "./pages/Administration/Newsletter/NewsletterDetail";
import TeacherNewsletterList, { teacherNewslettersLoader } from "./pages/Teacher/Newsletters/TeacherNewslettersList";
import StudentsNewsletterList, { studentNewslettersLoader } from "./pages/Student/Newsletters/StudentNewslettersList";
import InstitutionInformation, {
    institutionInformationLoader
} from "./pages/Superuser/InstitutionsManagement/InstitutionInformation";
import BulkDeleteStudents, {
    bulkDeleteClassStudentsLoader
} from "./pages/Administration/ClassroomManagement/StudentClass/students/BulkDeleteStudents";
import ParentDashboard from "./pages/Parent/Dashboard/ParentDashboard";
import ParentsNewsletterList, { parentsNewslettersLoader } from "./pages/Parent/Newsletters/ParentNewslettersList";
import ParentChildrenReport, { parentChildrenLoader } from "./pages/Parent/ChildReports/ParentChildrenReport";
import ChildReport from "./pages/Parent/ChildReports/ChildReport";
import SystemLogs, { auditTrailsByInstitutionLoader } from "./pages/Administration/Settings/SystemLogs";
import ParentProfile, { parentProfileLoader } from "./pages/Parent/ParentProfile/ParentProfile";
import VehiclePage, { vehiclePageLoader } from "./pages/Administration/AssetManagement/VehicleManagement/VehiclePage";
import VehicleTabs, { vehicleTabsLoader } from "./pages/Administration/AssetManagement/VehicleManagement/VehicleTabs";
import ElectronicsTabs, {
    electronicsTabsLoader
} from "./pages/Administration/AssetManagement/Elelctronics/ElectronicsTabs";
import ElectronicGadgetPage, {
    electronicGadgetLoader
} from "./pages/Administration/AssetManagement/Elelctronics/ElectronicGadgetPage";
import AncillaryStaffList, {
    retrieveAncillaryStaffLoader
} from "./pages/Administration/AncillaryStaffManagement/AncillaryStaffList";
import NewAncillaryStaffMember from "./pages/Administration/AncillaryStaffManagement/NewAncillaryStaffMember";
import AncillaryStaffMemberProfile, {
    retrieveAncillaryStaffMemberLoader
} from "./pages/Administration/AncillaryStaffManagement/AncillaryStaffMemberProfile";
import EditAncillaryStaffMemberProfileInformation
, {
    editAncillaryStaffMemberProfileLoader
} from "./pages/Administration/AncillaryStaffManagement/EditAncillaryStaffMemberProfileInformation";
import PayrollRecords, {
    retrieveAllPayrollRecordsLoader
} from "./pages/Administration/AncillaryStaffManagement/PayrollRecords";
import PayslipsListByPayrollRecord, {
    retrieveAllPayslipsByPayrollRecordLoader
} from "./pages/Administration/AncillaryStaffManagement/PayslipsListByPayrollRecord";
import ParentChildrenClasses from "./pages/Parent/ChildClasses/ParentChildrenClasses";
import ChildClassroom, { childClassroomLoader } from "./pages/Parent/ChildClasses/ChildClassroom";
import AssetCategoryList
    from './pages/Administration/AssetManagement/GeneralAssets/AssetCategory/AssetCategoryList.jsx';
import AssetItemsList, {
    fetchAssetCategoryLoader
} from './pages/Administration/AssetManagement/GeneralAssets/AssetItems/AssetItemsList.jsx';
import LibrariesList, { librariesLoader } from "./pages/Administration/Library/Libraries/LibrariesList";
import NewBook, { newBookLoader } from "./pages/Administration/Library/Books/NewBook";
import LibraryPage, { libraryPageLoader } from "./pages/Administration/Library/Libraries/LibraryPage";
import BooksListPage, { booksLoader } from "./pages/Administration/Library/Books/BooksListPage";
import BookLoanListPage, { bookLoanListLoader } from "./pages/Administration/Library/BookLoan/BookLoanListPage";
import NewBookLoan, { newBookLoansLoader } from "./pages/Administration/Library/BookLoan/NewBookLoan";
import BookLoanReturn, { bookLoanReturnLoader } from "./pages/Administration/Library/BookLoan/BookLoanReturn";
import EditBookLoan, { editBookLoanLoader } from "./pages/Administration/Library/BookLoan/EditBookLoan";
import BookLoanPage, { bookLoanLoader } from "./pages/Administration/Library/BookLoan/BookLoanPage";
import BookPage, { bookPageLoader } from "./pages/Administration/Library/Books/BookPage";
import EditBook, { editBookLoader } from "./pages/Administration/Library/Books/EditBook";
import UserBookLoanListPage, { userBookLoanListLoader } from "./pages/Student/Library/UserBookLoanListPage";
import AllElectronicsByCategory
, {
    allElectronicsByCategoryLoader
} from "./pages/Administration/AssetManagement/Elelctronics/Category/AllElectronicsByCategory";
import AllElectronicsBySupplier
, {
    allElectronicsBySupplierLoader
} from "./pages/Administration/AssetManagement/Elelctronics/Supplier/AllElectronicsBySupplier";
import CreateNewsletter from "./pages/Administration/Newsletter/CreateNewsletter";
import UpdateNewsletter, { updateNewsletterLoader } from "./pages/Administration/Newsletter/UpdateNewsletter";
import EBooksListPage, { ebooksLoader } from "./pages/Administration/Library/Ebooks/EBooksListPage";
import NewEBook from "./pages/Administration/Library/Ebooks/NewEBook";
import EBookPage, { ebookPageLoader } from "./pages/Administration/Library/Ebooks/EBookPage";
import ALlEBooksBySubject, { allEBooksBySubjectLoader } from "./pages/Administration/Library/Ebooks/AllEBooksBySubject";
import ALlEBooksByDepartment, {
    allEBooksByDepartmentLoader
} from "./pages/Administration/Library/Ebooks/AllEBooksByDepartment";
import EditEBook, { editEbookLoader } from "./pages/Administration/Library/Ebooks/EditEBook";
import NewCoursework, { newCourseworkLoader } from "./pages/Teacher/Coursework/Coursework/NewCoursework";
import TeacherCourseworkPage, {
    teacherCourseworkPageLoader
} from "./pages/Teacher/Coursework/Coursework/TeacherCourseworkPage.jsx";
import EditCoursework, { editCourseworkLoader } from "./pages/Teacher/Coursework/Coursework/EditCoursework";
import MarkCoursework, { markCourseworkLoader } from "./pages/Teacher/Coursework/Coursework/MarkCoursework";
import TeacherCourseworkTabs from './pages/Teacher/Coursework/TeacherCourseworkTabs.jsx';
import AllTeacherCoursework, {
    allTeacherCourseworkLoader
} from './pages/Teacher/Coursework/Coursework/AllTeacherCourseworkPage.jsx';


import StudentCourseworkTabs from './pages/Student/Coursework/StudentCourseworkTabs.jsx';
import StudentCourseworkPage, {
    StudentCourseworkPageLoader
} from "./pages/Student/Coursework/Coursework/ViewStudentCourseworkPage.jsx";
import StudentAllCoursework, {
    allStudentCourseworkLoader
} from './pages/Student/Coursework/Coursework/AllStudentCourseworkPage.jsx';


import AdminCourseworkTabs from './pages/Administration/CourseworkManagement/AdminCourseworkTabs.jsx';
import ViewAdminCourseworkPage, {
    AdminCourseworkPageLoader
} from './pages/Administration/CourseworkManagement/Coursework/ViewAdminCourseworkPage.jsx';
import {
    allAdminCourseworkLoader
} from './pages/Administration/CourseworkManagement/Coursework/AllAdminCourseworkPage.jsx';
import AdminCourseworkMarks, {
    adminMarkCourseworkLoader
} from "./pages/Administration/CourseworkManagement/Coursework/AdminMarkCoursework.jsx";


import AdminClassroomCourseworkTabs
    from './pages/Administration/ClassroomManagement/CourseworkManagement/AdminClassroomCourseworkTabs.jsx';
import {
    allAdminClassroomCourseworkLoader
} from './pages/Administration/ClassroomManagement/CourseworkManagement/Coursework/AllAdminCourseworkPage.jsx';
import ViewAdminClassroomCourseworkPage, {
    AdminClassroomCourseworkPageLoader
} from './pages/Administration/ClassroomManagement/CourseworkManagement/Coursework/ViewAdminClassroomCourseworkPage.jsx';
import AdminClassroomCourseworkMarks, {
    adminClassromMarkCourseworkLoader
} from "./pages/Administration/ClassroomManagement/CourseworkManagement/Coursework/AdminClassroomCourseworkMarks.jsx";

import ParentCourseworkTabs from './pages/Parent/Coursework/ParentCourseworkTabs.jsx';
import ParentChildrenCoursework, {
    parentCourseworkChildrenLoader
} from './pages/Parent/Coursework/ParentChildrenCoursework.jsx';
import ParentCourseworkPage, {
    ParentCourseworkPageLoader
} from "./pages/Parent/Coursework/Coursework/ViewParentCourseworkPage.jsx";
import ParentAllCoursework, {
    allParentCourseworkLoader
} from './pages/Parent/Coursework/Coursework/AllParentCourseworkPage.jsx';
import LiveClasses from "./pages/Administration/VideoConferencing/LiveClasses";
import StudentLiveClasses from "./pages/Student/StudentVideoConferencing/StudentLiveClasses";
import TeacherLiveClasses from "./pages/Teacher/TeacherVideoConferencing/TeacherLiveClasses";
import { AuthProvider } from "./context/authProvider";
import Video from "./common/Video";
import AccountingTab from './pages/Administration/AccountingRecords/AccountingTab.jsx';
import { IncomePageLoader } from './pages/Administration/AccountingRecords/Incomes/IncomePage.jsx';
import { ExpensePageLoader } from './pages/Administration/AccountingRecords/Expenses/ExpensePage.jsx';
import TransactionPage, { TransactionPageLoader } from './pages/Administration/AccountingRecords/TransactionPage.jsx';
import IncomeStatementTab from './pages/Administration/AccountingRecords/IncomeStatementTab.jsx';
import ParentList, { parentListLoader } from './pages/Administration/ParentsManagement/ParentsList.jsx';
import ParentPage, { parentPageLoader } from './pages/Administration/ParentsManagement/ParentPage.jsx';

const router = createBrowserRouter([
    {
        // this renders on a blank page without any layout
        path: "/meeting/",
        element: <Video />
    },
    {
        path: "/",
        element: <Root />,
        errorElement: <PageNotFoundError />,
        children: [{
            errorElement: <PageNotFoundError />,
            children: [
                {
                    index: true,
                    element: <DashboardIndexDecider />,
                },


                //Adminstrator Routes
                {
                    path: "admin/new-student",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <NewStudent />,
                    loader: newStudentLoader
                },
                {
                    path: "admin/students",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <StudentsList />,
                    loader: studentsLoader
                },
                {
                    path: "admin/students/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <StudentInformation />,
                    loader: studentInformationLoader
                },
                {
                    path: "admin/students/:id/edit",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <UpdateStudent />,
                    loader: updateStudentLoader
                },
                {
                    path: "admin/new-teacher",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <NewTeacher />
                },
                {
                    path: "admin/teachers",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <TeachersList />,
                    loader: teachersLoader
                },
                {
                    path: "admin/teachers/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherInformation />,
                    loader: teacherInformationLoader
                },
                {
                    path: "admin/teachers/:id/edit",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <UpdateTeacher />,
                    loader: teacherUpdateLoader
                },
                {
                    path: "admin/school-information",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <SchoolInformationManagementIndex />
                },
                {
                    path: "admin/student-classes",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <StudentClassesList />,
                    loader: classesLoader
                },
                {
                    path: "admin/student-classes/:classId/students/:className/:level",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <StudentCLassStudentsList />,
                    loader: classStudentsLoader
                },
                {
                    path: "admin/student-classes/:classId/students/bulk-delete",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <BulkDeleteStudents />,
                    loader: bulkDeleteClassStudentsLoader
                },
                {
                    path: "admin/subject-allocations",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <SubjectAllocationsList />
                },
                {
                    path: "/admin/students/:id/academic-information",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <AdministrationStudentAcademicInformation />,
                    loader: studentAcademicInformationLoader
                },
                {
                    path: "/admin/student-reports",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <StudentAccountReport />
                },
                {
                    path: "/admin/teacher-reports",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherAccountReport />
                },
                {
                    path: "/admin/newsletter",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <NewsletterList />,
                    loader: newslettersLoader,

                },
                {
                    path: "/admin/newsletter/create",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <CreateNewsletter />,
                },
                {
                    path: "/admin/newsletter/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <NewsletterDetail />,
                    loader: newsletterLoader
                },
                {
                    path: "/admin/newsletter/:id/update",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <UpdateNewsletter />,
                    loader: updateNewsletterLoader
                },
                {
                    path: "/admin/classes/students-without-classes",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <StudentsWithoutClasses />,
                    loader: StudentsWithoutclassesLoader
                },
                {
                    path: "/admin/classes/students-without-levels",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <StudentsWithoutLevels />,
                    loader: StudentsWithoutLevelsLoader,
                },
                {
                    path: "/admin/students/all",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <h1>Unauthorised</h1> :
                        <AllStudentsList />,
                    loader: allStudentsLoader,
                },
                {
                    path: "admin/sms-information",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <SmsManagementIndex />
                },
                {
                    path: "/admin/system-logs",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <SystemLogs />,
                    loader: auditTrailsByInstitutionLoader
                },
                {
                    path: "admin/ancillary-staff",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <AncillaryStaffList />,
                    loader: retrieveAncillaryStaffLoader
                },
                {
                    path: "admin/ancillary-staff/new",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <NewAncillaryStaffMember />
                },
                {
                    path: "admin/ancillary-staff/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <AncillaryStaffMemberProfile />,
                    loader: retrieveAncillaryStaffMemberLoader
                },
                {
                    path: "admin/ancillary-staff/:id/edit-profile",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <EditAncillaryStaffMemberProfileInformation />,
                    loader: editAncillaryStaffMemberProfileLoader
                },
                {
                    path: "admin/ancillary-staff/payroll-records",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <PayrollRecords />,
                    loader: retrieveAllPayrollRecordsLoader
                },
                {
                    path: "admin/ancillary-staff/payroll-records/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <PayslipsListByPayrollRecord />,
                    loader: retrieveAllPayslipsByPayrollRecordLoader
                },
                {
                    path: "/admin/general-assets",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <AssetCategoryList />
                },
                {
                    path: "/admin/general-assets/asset-items/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <AssetItemsList />,
                    loader: fetchAssetCategoryLoader
                },
                {
                    path: "/admin/parents",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <ParentList />,
                    loader: parentListLoader
                },
                {
                    path: "/admin/parents/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <ParentPage />,
                    loader: parentPageLoader
                },


                //Superadmin Routes
                {
                    path: "superadmin/clients",
                    element: <ClientsList />,
                    loader: clientsListLoader
                },
                {
                    path: "superadmin/institutions",
                    element: <InstitutionsList />,
                    loader: institutionsListLoader
                },
                {
                    path: "superadmin/institutions/:id",
                    element: <InstitutionInformation />,
                    loader: institutionInformationLoader
                },
                {
                    path: "superadmin/clients/:id/institutions",
                    element: <InstitutionListByClient />,
                    loader: institutionsByClientListLoader
                },
                {
                    path: "superadmin/institution-administrators",
                    element: <InstitutionAdministratorsList />,
                    loader: administratorsListLoader
                },
                {
                    path: "superadmin/demo-requests",
                    element: <DemoRequestsList />,
                    loader: demoRequestsLoader
                },
                {
                    path: "admin/account",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <SchoolProfile />,
                    loader: schoolProfileLoader
                },
                // Teacher Routes
                {
                    path: "/teacher/dashboard",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherDashboard />,
                },
                {
                    path: "/teacher/account",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherProfile />,
                    loader: teacherProfileLoader
                },
                {
                    path: "/admin/examinations",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <ExaminationsList />,
                    loader: examinationsListLoader
                },
                {
                    path: "/admin/examinations/:name/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <EndTermPapersList />,
                    loader: examinationPapersListLoader
                },
                {
                    path: "/teacher/examinations",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherSubjectAllocationsList />,
                    loader: subjectAllocationsListLoader
                },
                {
                    path: "/teacher/examinations/:subjectId/:levelId/classroom/:classroomId",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherClassList />,
                    loader: teacherClassLoader
                },
                {
                    path: "/teacher/classes",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherClassroomList />,
                    loader: teacherClassroomLoader
                },
                {
                    path: "/teacher/class/:classId/:className/:level",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherClassroom />,
                    loader: teacherClassStudentsLoader
                },
                {
                    path: "/teacher/subjects",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <Teachersubjects />,
                },
                {
                    path: "/teacher/subjects/classroom/:id/students/",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <SubjectClassStudentsList />,
                    loader: subjectClassStudentsLoader

                },
                {
                    path: "/teacher/newsletter",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherNewsletterList />,
                    loader: teacherNewslettersLoader,

                },
                {
                    path: "/teacher/newsletter/:id",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <NewsletterDetail />,
                    loader: newsletterLoader
                },

                //Adminstrator Routes
                {
                    path: "admin/new-student",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <NewStudent />,
                    loader: newStudentLoader
                },
                {
                    path: "admin/students",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <StudentsList />,
                    loader: studentsLoader
                },
                {
                    path: "admin/students/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <StudentInformation />,
                    loader: studentInformationLoader
                },
                {
                    path: "admin/students/:id/edit",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <UpdateStudent />,
                    loader: updateStudentLoader
                },
                {
                    path: "admin/new-teacher",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <NewTeacher />
                },
                {
                    path: "admin/teachers",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <TeachersList />,
                    loader: teachersLoader
                },
                {
                    path: "admin/teachers/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherInformation />,
                    loader: teacherInformationLoader
                },
                {
                    path: "admin/teachers/:id/edit",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <UpdateTeacher />,
                    loader: teacherUpdateLoader
                },
                {
                    path: "admin/school-information",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <SchoolInformationManagementIndex />
                },
                {
                    path: "admin/student-classes",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <StudentClassesList />,
                    loader: classesLoader
                },
                {
                    path: "admin/student-classes/:classId/students/:className/:level",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <StudentCLassStudentsList />,
                    loader: classStudentsLoader
                },
                {
                    path: "admin/subject-allocations",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <SubjectAllocationsList />
                },
                {
                    path: "/admin/students/:id/academic-information",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <AdministrationStudentAcademicInformation />,
                    loader: studentAcademicInformationLoader
                },
                {
                    path: "/admin/student-reports",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <StudentAccountReport />
                },
                {
                    path: "/admin/teacher-reports",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherAccountReport />
                },
                {
                    path: "/admin/vehicles",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <VehicleTabs />,
                    loader: vehicleTabsLoader
                },
                {
                    path: "/admin/vehicles/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <VehiclePage />,
                    loader: vehiclePageLoader
                },
                {
                    path: "/admin/electronics",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <ElectronicsTabs />,
                    loader: electronicsTabsLoader
                },
                {
                    path: "/admin/electronics/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <ElectronicGadgetPage />,
                    loader: electronicGadgetLoader
                },
                {
                    path: "/admin/electronics/find-electronics-by-category/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <AllElectronicsByCategory />,
                    loader: allElectronicsByCategoryLoader
                },
                {
                    path: "/admin/electronics/find-electronics-by-supplier/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <AllElectronicsBySupplier />,
                    loader: allElectronicsBySupplierLoader
                },
                {
                    path: "/admin/library",
                    element: !AuthenticationService.getIsLibrarian() ? <UnauthorizedAccessErrorPage /> :
                        <LibrariesList />,
                    loader: librariesLoader
                },
                {
                    path: "/admin/library/:libraryId",
                    element: !AuthenticationService.getIsLibrarian() ? <UnauthorizedAccessErrorPage /> :
                        <LibraryPage />,
                    loader: libraryPageLoader
                },
                {
                    path: "/admin/library/books",
                    element: !AuthenticationService.getIsLibrarian() ? <UnauthorizedAccessErrorPage /> :
                        <BooksListPage />,
                    loader: booksLoader
                },
                {
                    path: "/admin/library/books/add",
                    element: !AuthenticationService.getIsLibrarian() ? <UnauthorizedAccessErrorPage /> :
                        <NewBook />,
                    loader: newBookLoader
                },
                {
                    path: "/admin/library/books/view/:id",
                    element: !AuthenticationService.getIsLibrarian() ? <UnauthorizedAccessErrorPage /> :
                        <BookPage />,
                    loader: bookPageLoader
                },
                {
                    path: "/admin/library/books/edit/:id",
                    element: !AuthenticationService.getIsLibrarian() ? <UnauthorizedAccessErrorPage /> :
                        <EditBook />,
                    loader: editBookLoader
                },
                {
                    path: "/admin/library/ebooks/add",
                    element: !AuthenticationService.getIsLibrarian() ? <UnauthorizedAccessErrorPage /> :
                        <NewEBook />
                },
                {
                    path: "/admin/library/ebooks/edit/:id",
                    element: !AuthenticationService.getIsLibrarian() ? <UnauthorizedAccessErrorPage /> :
                        <EditEBook />,
                    loader: editEbookLoader
                },
                {
                    path: "/admin/library/book-loans",
                    element: !AuthenticationService.getIsLibrarian() ? <UnauthorizedAccessErrorPage /> :
                        <BookLoanListPage />,
                    loader: bookLoanListLoader
                },
                {
                    path: "/admin/library/book-loans/add",
                    element: !AuthenticationService.getIsLibrarian() ? <UnauthorizedAccessErrorPage /> :
                        <NewBookLoan />,
                    loader: newBookLoansLoader
                },
                {
                    path: "/admin/library/book-loans/view/:id",
                    element: !AuthenticationService.getIsLibrarian() ? <UnauthorizedAccessErrorPage /> :
                        <BookLoanPage />,
                    loader: bookLoanLoader
                },
                {
                    path: "/admin/library/book-loans/edit/:id",
                    element: !AuthenticationService.getIsLibrarian() ? <UnauthorizedAccessErrorPage /> :
                        <EditBookLoan />,
                    loader: editBookLoanLoader
                },
                {
                    path: "/admin/library/book-loans/return/:id",
                    element: !AuthenticationService.getIsLibrarian() ? <UnauthorizedAccessErrorPage /> :
                        <BookLoanReturn />,
                    loader: bookLoanReturnLoader
                },

                {
                    path: "/admin/coursework",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <AdminCourseworkTabs />,
                    loader: allAdminCourseworkLoader,
                },

                {
                    path: "/admin/coursework/classroom/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <AdminClassroomCourseworkTabs />,
                    loader: allAdminClassroomCourseworkLoader,
                },

                {
                    path: "/admin/coursework/view/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <ViewAdminCourseworkPage />,
                    loader: AdminCourseworkPageLoader,
                },

                {
                    path: "/admin/classroom/coursework/view/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <ViewAdminClassroomCourseworkPage />,
                    loader: AdminClassroomCourseworkPageLoader,
                },

                {
                    path: "/admin/classroom/coursework/marks/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <AdminClassroomCourseworkMarks />,
                    loader: adminClassromMarkCourseworkLoader,
                },

                {
                    path: "/admin/coursework/marks/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <AdminCourseworkMarks />,
                    loader: adminMarkCourseworkLoader,
                },
                {
                    path: "/admin/live-classes",
                    element: <LiveClasses />
                },
                {
                    path: "/admin/accounting/transactions",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <AccountingTab />,
                    loader: IncomePageLoader,
                },
                {
                    path: "/admin/accounting/income-statement",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <IncomeStatementTab />,
                    loader: IncomePageLoader,
                },
                {
                    path: "/admin/accounting/transactions/view/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <TransactionPage />,
                    loader: TransactionPageLoader,
                },


                //Superadmin Routes
                {
                    path: "superadmin/clients",
                    element: <ClientsList />,
                    loader: clientsListLoader
                },
                {
                    path: "superadmin/clients/:id/institutions",
                    element: <InstitutionListByClient />,
                    loader: institutionsByClientListLoader
                },
                {
                    path: "superadmin/institution-administrators",
                    element: <InstitutionAdministratorsList />,
                    loader: administratorsListLoader
                },
                {
                    path: "superadmin/institution-administrators/add",
                    element: <NewInstitutionAdministrator />
                },
                {
                    path: "superadmin/demo-requests",
                    element: <DemoRequestsList />,
                    loader: demoRequestsLoader
                },
                {
                    path: "admin/account",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <SchoolProfile />,
                    loader: schoolProfileLoader
                },
                // Teacher Routes
                {
                    path: "/teacher/dashboard",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherDashboard />,
                },
                {
                    path: "/teacher/account",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherProfile />,
                    loader: teacherProfileLoader
                },
                {
                    path: "/admin/examinations",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <ExaminationsList />,
                    loader: examinationsListLoader
                },
                {
                    path: "/admin/examinations/:id",
                    element: AuthenticationService.getUserRole() !== 'ADMIN' ? <UnauthorizedAccessErrorPage /> :
                        <EndTermPapersList />,
                    loader: examinationPapersListLoader
                },
                {
                    path: "/teacher/examinations",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherSubjectAllocationsList />,
                    loader: subjectAllocationsListLoader
                },
                {
                    path: "/teacher/examinations/subject/:subjectId/level/:levelId/classroom/:classroomId",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherClassList />,
                    loader: teacherClassLoader
                },
                {
                    path: "/teacher/classes",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherClassroomList />,
                    loader: teacherClassroomLoader
                },
                {
                    path: "/teacher/classroom/:classroomId",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherClassroom />,
                    loader: teacherClassStudentsLoader
                },
                {
                    path: "/teacher/subjects",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <Teachersubjects />,
                },
                {
                    path: "/teacher/class/previous-terms-report/:id",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <PreviousReport />,
                },
                {
                    path: "/teacher/coursework",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherCourseworkTabs />,
                    loader: allTeacherCourseworkLoader,
                },
                // {
                //     path: "/teacher/coursework",
                //     element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage/> :
                //         <AllCourseworkPage/>,
                //     loader: allCourseworkLoader,
                // },
                {
                    path: "/teacher/coursework/add",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <NewCoursework />,
                    loader: newCourseworkLoader,
                },
                {
                    path: "/teacher/coursework/view/:id",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <TeacherCourseworkPage />,
                    loader: teacherCourseworkPageLoader,
                },
                {
                    path: "/teacher/coursework/edit/:id",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <EditCoursework />,
                    loader: editCourseworkLoader,
                },
                {
                    path: "/teacher/coursework/mark/:id",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <MarkCoursework />,
                    loader: markCourseworkLoader,
                },


                // Student Routes
                {
                    path: "/student/account",
                    element: AuthenticationService.getUserRole() !== 'STUDENT' ? <UnauthorizedAccessErrorPage /> :
                        <StudentProfile />,
                    loader: studentProfileLoader
                },
                {
                    path: "/student/account/edit",
                    element: AuthenticationService.getUserRole() !== 'STUDENT' ? <UnauthorizedAccessErrorPage /> :
                        <UpdateProfile />,
                    loader: updateStudentProfileLoader
                },
                {
                    path: "/student/end-term-results",
                    element: AuthenticationService.getUserRole() !== 'STUDENT' ? <UnauthorizedAccessErrorPage /> :
                        <StudentReports />,
                },
                {
                    path: "/student/dashboard",
                    element: AuthenticationService.getUserRole() !== 'STUDENT' ? <UnauthorizedAccessErrorPage /> :
                        <StudentDashboard />,
                },
                {
                    path: "/student/subjects",
                    element: AuthenticationService.getUserRole() !== 'STUDENT' ? <UnauthorizedAccessErrorPage /> :
                        <StudentSubjectsList />,
                    loader: fetchSubjects
                },
                {
                    path: "/student/newsletter",
                    element: AuthenticationService.getUserRole() !== 'STUDENT' ? <UnauthorizedAccessErrorPage /> :
                        <StudentsNewsletterList />,
                    loader: studentNewslettersLoader,

                },
                {
                    path: "/student/newsletter/:id",
                    element: AuthenticationService.getUserRole() !== 'STUDENT' ? <UnauthorizedAccessErrorPage /> :
                        <NewsletterDetail />,
                    loader: newsletterLoader
                },
                {
                    path: "/student/live-classes",
                    element: <StudentLiveClasses />
                },
                {
                    path: "/teacher/live-classes",
                    element: <TeacherLiveClasses />
                },
                {
                    path: "/teacher/class/current-term-report/:id",
                    element: AuthenticationService.getUserRole() !== 'TEACHER' ? <UnauthorizedAccessErrorPage /> :
                        <CurrentReport />,
                },

                {
                    path: "/student/coursework",
                    element: AuthenticationService.getUserRole() !== 'STUDENT' ? <UnauthorizedAccessErrorPage /> :
                        <StudentCourseworkTabs />,
                    loader: allStudentCourseworkLoader,
                },

                {
                    path: "/student/coursework/view/:id",
                    element: AuthenticationService.getUserRole() !== 'STUDENT' ? <UnauthorizedAccessErrorPage /> :
                        <StudentCourseworkPage />,
                    loader: StudentCourseworkPageLoader,
                },

                // Parent Routes
                {
                    path: "/parent/dashboard",
                    element: AuthenticationService.getUserRole() !== 'PARENT' ? <UnauthorizedAccessErrorPage /> :
                        <ParentDashboard />,
                },
                {
                    path: "/parent/children-reports",
                    element: AuthenticationService.getUserRole() !== 'PARENT' ? <UnauthorizedAccessErrorPage /> :
                        <ParentChildrenReport />,
                    loader: parentChildrenLoader
                },
                {
                    path: "/parent/children-reports/:childId",
                    element: AuthenticationService.getUserRole() !== 'PARENT' ? <UnauthorizedAccessErrorPage /> :
                        <ChildReport />,
                },
                {
                    path: "/parent/children-classes",
                    element: AuthenticationService.getUserRole() !== 'PARENT' ? <UnauthorizedAccessErrorPage /> :
                        <ParentChildrenClasses />,
                    loader: parentChildrenLoader
                },
                {
                    path: "/parent/children-classes/:childId",
                    element: AuthenticationService.getUserRole() !== 'PARENT' ? <UnauthorizedAccessErrorPage /> :
                        <ChildClassroom />,
                    loader: childClassroomLoader
                },
                {
                    path: "/parent/newsletters",
                    element: AuthenticationService.getUserRole() !== 'PARENT' ? <UnauthorizedAccessErrorPage /> :
                        <ParentsNewsletterList />,
                    loader: parentsNewslettersLoader,
                },
                {
                    path: "/parent/newsletters/:id",
                    element: AuthenticationService.getUserRole() !== 'PARENT' ? <UnauthorizedAccessErrorPage /> :
                        <NewsletterDetail />,
                    loader: newsletterLoader
                },
                {
                    path: "/parent/profile",
                    element: AuthenticationService.getUserRole() !== 'PARENT' ? <UnauthorizedAccessErrorPage /> :
                        <ParentProfile />,
                    loader: parentProfileLoader
                },

                {
                    path: "/parent/children-coursework",
                    element: AuthenticationService.getUserRole() !== 'PARENT' ? <UnauthorizedAccessErrorPage /> :
                        <ParentChildrenCoursework />,
                    loader: parentCourseworkChildrenLoader
                },

                {
                    path: "/parent/children-coursework/child/:childId",
                    element: AuthenticationService.getUserRole() !== 'PARENT' ? <UnauthorizedAccessErrorPage /> :
                        <ParentCourseworkTabs />,
                    loader: allParentCourseworkLoader,
                },

                {
                    path: "/parent/children-coursework/child/:childId/view/:id",
                    element: AuthenticationService.getUserRole() !== 'PARENT' ? <UnauthorizedAccessErrorPage /> :
                        <ParentCourseworkPage />,
                    loader: ParentCourseworkPageLoader,
                },

                // Universal page routes

                {
                    path: "/library/ebooks",
                    element: !AuthenticationService.getUsername() ? <UnauthorizedAccessErrorPage /> :
                        <EBooksListPage />,
                },
                {
                    path: "/library/ebooks/view/:id",
                    element: !AuthenticationService.getUsername() ? <UnauthorizedAccessErrorPage /> :
                        <EBookPage />,
                    loader: ebookPageLoader
                },
                {
                    path: "/library/ebooks/subjects",
                    element: !AuthenticationService.getUsername() ? <UnauthorizedAccessErrorPage /> :
                        <ALlEBooksBySubject />,
                    loader: allEBooksBySubjectLoader
                },
                {
                    path: "/library/ebooks/departments/:department",
                    element: !AuthenticationService.getUsername() ? <UnauthorizedAccessErrorPage /> :
                        <ALlEBooksByDepartment />,
                    loader: allEBooksByDepartmentLoader
                },
                {
                    path: "/library/book-loans",
                    element: !AuthenticationService.getUsername() ? <UnauthorizedAccessErrorPage /> :
                        <UserBookLoanListPage />,
                    loader: userBookLoanListLoader
                },
                {
                    path: "/library/book-loans/view/:id",
                    element: !AuthenticationService.getUsername() ? <UnauthorizedAccessErrorPage /> :
                        <BookLoanPage />,
                    loader: bookLoanLoader
                },

                // Landing page routes
                {
                    path: "/landing-page",
                },
                {
                    path: "/admin/live-classes/video",
                    element: <Video />
                },
            ],
        }]
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#39b54a',
                        colorBgLayout: '#ecebe5'
                    },
                }}
            >
                <RouterProvider router={router} />
            </ConfigProvider>
        </AuthProvider>
    </React.StrictMode>
);
