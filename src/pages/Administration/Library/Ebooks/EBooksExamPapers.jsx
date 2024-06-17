import {Spin} from "antd";
import EBooksList from "./EBooksList";
import {useEffect, useState} from "react";
import LibraryEBooksService from "../../../../services/library-ebooks.service";
import AuthenticationService from "../../../../services/authentication.service";

const EBooksExamPapers = () => {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([])

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await LibraryEBooksService.getAllPastExamPapersByInstitution(AuthenticationService.getUserTenantId());
            setBooks(response.data);
        } catch (e) {
            setBooks([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Spin spinning={loading} size="large" fullscreen="true" >
                <EBooksList books={books} type="EXAM_PAPER" />
            </Spin>
        </>
    )
}

export default EBooksExamPapers
