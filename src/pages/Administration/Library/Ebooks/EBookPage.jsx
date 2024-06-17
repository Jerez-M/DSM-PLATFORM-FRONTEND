import {Button, Card, Divider, Tooltip} from "antd";
import {toHumanDate} from "../../../../common";
import {useLoaderData, useNavigate} from "react-router-dom";
import {
    FullscreenExitOutlined,
    FullscreenOutlined,
    PlusOutlined
} from "@ant-design/icons";
import Link from "antd/es/typography/Link";
import LibraryEbooksService from "../../../../services/library-ebooks.service";
import PDFViewer from "../../../../common/PdfViewer";
import {useState} from "react";
import AuthenticationService from "../../../../services/authentication.service";
import BackButton from "../../../../common/BackButton";

export async function ebookPageLoader({params}) {
    try {
        const bookResponse = await LibraryEbooksService.getById(params.id);
        return {book: bookResponse.data};
    } catch (e) {
        console.log(e);
        return {books: null};
    }
}

const EBookPage = () => {
    const { book } = useLoaderData();
    const navigate = useNavigate();
    const [fullscreen, setFullscreen] = useState(false)

    const options = [
        { label: 'Full Screen', value: true },
        { label: 'None full screen', value: false },
    ];

    const bookName = book?.file ? book.file.split('/').pop() : null;


    return (
        <div className="px-4">
        
            <BackButton/>
            

            <div className='d-flex justify-content-between align-items-center'>
                <h3>EBook</h3>
                {AuthenticationService.getIsLibrarian() &&
                    <Button
                        icon={<PlusOutlined />}
                        className='border-0 px-3 text-white'
                        type="primary"
                        onClick={() => navigate(`/admin/library/ebooks/edit/${book?.id}`)}
                    >
                        Edit
                    </Button>
                }
            </div>

            <Divider />

            <div className="mb-4">
                <Card>
                    <h5 className="mb-2">{book?.tittle}</h5>

                    <div className="row">
                        <div className="col-md-6">
                            <p className="table-row">
                                <span>Book Author/s:</span>
                                <strong>{book?.authors}</strong>
                            </p>
                            <p className="table-row">
                                <span>ISBN:</span>
                                <strong>{book?.isbn}</strong>
                            </p>
                            <p className="table-row">
                                <span>Publisher:</span>
                                <strong>{book?.publisher}</strong>
                            </p>
                            <p className="table-row">
                                <span>Publication Date:</span>
                                <strong>{toHumanDate(book?.publication_date)}</strong>
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p className="table-row">
                                <span>Language:</span>
                                <strong>{book?.language}</strong>
                            </p>
                            <p className="table-row">
                                <span>Subject:</span>
                                <strong>{book?.subject}</strong>
                            </p>
                            <p className="table-row">
                                <span>Department:</span>
                                <strong>{book?.department?.name}</strong>
                            </p>
                            <p className="table-row">
                                <span>Page numbers:</span>
                                <strong>{book?.page_numbers}</strong>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {book?.file && (
                <Card className="mt-3 mb-3">
                    <h3 className="text-strong">{book?.tittle} FILE</h3>
                    <div className="d-flex justify-content-between align-items-center">

                        {/* <PDFViewer file={coursework?.file}/> */}

                        <h6>
                            <strong>{bookName}</strong>
                        </h6>
                        <Link href={`${book?.file}`} target="_blank">
                            <Button type="primary">Open file externally</Button>
                        </Link>
                    </div>
                </Card>
            )}

            <div className="col mt-4 mt-md-0">
                <Card className={fullscreen && "fill-window"}>
                    <div className="mb-4 d-flex justify-content-between align-items-center">
                        <h3>Ebook Internal Document Reader</h3>
                        <Tooltip title={fullscreen ? "Remove fullscreen" : "Make fullscreen"}>
                            <Button
                                ghost
                                type="primary"
                                onClick={() => setFullscreen(!fullscreen)}
                                icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                            />
                        </Tooltip>
                    </div>
                    <div>
                        <PDFViewer file={book?.file}/>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default EBookPage;