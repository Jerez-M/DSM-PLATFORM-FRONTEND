import {PlusOutlined} from "@ant-design/icons";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Button, Divider} from "antd";
import AuthenticationService from "../../../../services/authentication.service";
import LibraryBooksService from "../../../../services/library-books.service";
import BooksList from "./BooksList";

export async function booksLoader({request}) {
    try {
        const url = new URL(request.url);
        const libraryId = url.searchParams.get("libraryId");

        if(libraryId) {
            const booksResponse = await LibraryBooksService.getAllByLibrary(libraryId);
            return {books: booksResponse.data};
        } else {
            const booksResponse = await LibraryBooksService.getAllByInstitution(AuthenticationService.getUserTenantId());
            return {books: booksResponse.data};
        }
    } catch (e) {
        console.log(e);
        return {books: []};
    }
}

const BooksListPage = () => {
    const { books } = useLoaderData();
    const navigate = useNavigate();

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>School Books</h3>
                <Button
                    icon={<PlusOutlined />}
                    className='border-0 px-3 text-white'
                    type="primary"
                    onClick={() => navigate("/admin/library/books/add")}
                >
                    Add Book
                </Button>
            </div>

            <Divider type={"horizontal"}/>

            <BooksList books={books} hasLibrary={true}/>
        </>
    );
}

export default BooksListPage;