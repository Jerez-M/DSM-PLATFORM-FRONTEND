import {ArrowLeftOutlined, PlusOutlined} from "@ant-design/icons";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {Button, Divider, Tag} from "antd";
import LibraryBooksService from "../../../../services/library-books.service";
import LibraryService from "../../../../services/library.service";
import libraryIcon from "../../../../Assets/images/library-icon.svg";
import BooksList from "../Books/BooksList";
import {successColor} from "../../../../common";
import "./library.css"

export async function libraryPageLoader({params}) {
    try {
        const libraryResponse = await LibraryService.getById(params.libraryId);
        const booksResponse = await LibraryBooksService.getAllByLibrary(params.libraryId);
        return {books: booksResponse.data, library: libraryResponse.data};
    } catch (e) {
        console.log(e);
        return {books: [], library: {}};
    }
}

const LibraryPage = () => {
    const { books, library } = useLoaderData();
    const navigate = useNavigate();

    return (
        <>
            <Link to={'..'}
                  onClick={(e) => {
                      e.preventDefault();
                      navigate(-1);
                  }}
                  className='text-muted text-decoration-none mb-2'
            >
                <ArrowLeftOutlined /> Back
            </Link>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Library</h3>
                <Button
                    icon={<PlusOutlined />}
                    className='border-0 px-3 text-white'
                    type="primary"
                    onClick={() => navigate(`/admin/library/books/add?library=${library.id}`)}
                >
                    Add Book
                </Button>
            </div>

            <Divider type={"horizontal"}/>

            <div className="library-info-container mx-auto">
                <div className="d-sm-inline-flex w-100 p-3 mb-4">
                    <img
                        alt="library"
                        className="p-4 card-bg-light"
                        style={{objectFit: "cover", maxWidth: "250px"}}
                        src={libraryIcon}
                    />
                    <div className="mx-sm-4  text-cente text-md-left">
                        <h4 className="text-right">{library.name}</h4>
                        <p>Contact: {library.contact_info}</p>
                        <p>Librarians: {library.librarians?.map((librarian, index) => (
                            <Tag key={index} bordered={false} color="gold">{librarian.firstName} {librarian.lastName}</Tag>
                        ))}</p>
                        <p>All Books: <strong>{books.length}</strong></p>
                        <p>
                            Borrowed Books: {""}
                            <strong style={{color: successColor}}>{books.filter(({availability}) => availability === "BORROWED").length}</strong>
                        </p>
                    </div>
                </div>
            </div>

            <h4>Books:</h4>

            <BooksList books={books} hasLibrary={false}/>
        </>
    );
}

export default LibraryPage;