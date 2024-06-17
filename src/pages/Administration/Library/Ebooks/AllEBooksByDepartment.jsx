import LibraryEbooksService from "../../../../services/library-ebooks.service";
import {useLoaderData, useParams} from "react-router-dom";
import EBooksList from "./EBooksList";
import {Divider} from "antd";
import BackButton from "../../../../common/BackButton";
import DepartmentService from "../../../../services/department.service";
import AuthenticationService from "../../../../services/authentication.service";

export async function allEBooksByDepartmentLoader({params}) {
    try {
        const booksResponse = await LibraryEbooksService.getAllByDepartment(params.department, AuthenticationService.getUserTenantId());
        const departmentResponse = await DepartmentService.getDepartment(params.department);
        return {books: booksResponse?.data, department: departmentResponse?.data};
    } catch (e) {
        console.log(e);
        return {books: []};
    }
}

const ALlEBooksByDepartment = () => {
    const { books, department } = useLoaderData();

    return (
        <>
            <BackButton />

            <h3>All Books for {department?.name}</h3>

            <Divider />

            <EBooksList books={books} />
        </>
    )
}

export default ALlEBooksByDepartment