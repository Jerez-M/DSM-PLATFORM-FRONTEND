import AuthenticationService from "../../../../services/authentication.service";
import {useEffect, useState} from "react";
import {BOOK_CATEGORIES} from "../../../../utils/library-book";
import {Link, useNavigate} from "react-router-dom";
import {Card, Input} from "antd";
import DepartmentService from "../../../../services/department.service";

const BooksSubjectsPage = () => {
    const [departments, setDepartments] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const response = await DepartmentService.getAllDepartments(AuthenticationService.getUserTenantId());
            setDepartments(response.data)
        }
        fetchData()
    }, []);

    return <>
        <Card title="Filter by subject">
            <Input.Search
                placeholder="Subject"
                className="mb-4"
                style={{ width: 500 }}
                onSearch={value => navigate(`subjects?subject=${value}`)}
                size="large"
                enterButton
                allowClear
            />
            <ul className="list-unstyled card-columns" style={{columnCount: 4}}>
                {BOOK_CATEGORIES?.map((category, index) => (
                    <div className={index !== 0 ? "mt-3" : ""} key={index}>
                        <h5>{category.title}</h5>
                        <ul className="pl-0 w-100">
                            {category.subjects?.map((subject, index) => (
                                <li className="w-100" key={index}>
                                    <Link to={`subjects?subject=${subject}`}>{subject}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="mt-5">
                    <h5>Departments</h5>
                    <ul className="pl-0 w-100">
                        {departments?.map((department, index) => (
                            <li className="w-100" key={index}>
                                <Link to={`departments/${department.id}`}>{department.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </ul>
        </Card>
    </>
}

export default BooksSubjectsPage;