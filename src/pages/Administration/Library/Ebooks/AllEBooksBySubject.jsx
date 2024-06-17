import LibraryEbooksService from "../../../../services/library-ebooks.service";
import {useLoaderData, useParams, useSearchParams} from "react-router-dom";
import EBooksList from "./EBooksList";
import {Divider} from "antd";
import AuthenticationService from "../../../../services/authentication.service";
import BackButton from "../../../../common/BackButton";

export async function allEBooksBySubjectLoader({request}) {
    const url = new URL(request.url);
    const subject = url.searchParams.get("subject");

    if(subject) {
        try {
            const booksResponse = await LibraryEbooksService.getAllBySubject(subject, AuthenticationService.getUserTenantId());
            return {books: booksResponse?.data};
        } catch (e) {
            console.log(e);
            return {books: []};
        }
    } else {
        return {books: []};
    }
}

const ALlEBooksBySubject = () => {
    const{subject} = useParams()
    const { books } = useLoaderData();
    const [searchParams] = useSearchParams();


    return (
        <>
            <BackButton />

            <h3>All Books for {searchParams.get('subject')}</h3>

            <Divider />

            <EBooksList books={books} />
        </>
    )
}

export default ALlEBooksBySubject