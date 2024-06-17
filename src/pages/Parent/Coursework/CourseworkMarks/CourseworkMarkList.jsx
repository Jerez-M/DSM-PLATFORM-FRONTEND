/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Select, Table, message } from "antd";
import { useEffect, useState } from "react";
import authenticationService from "../../../../services/authentication.service";
import courseworkMarksService from "../../../../services/coursework-marks.service";
import schoolTermServices from "../../../../services/schoolTerm.services";
import { useLoaderData, useParams } from "react-router-dom";

export async function allParentCourseworkLoader() {
    try {
        const termsResponse = await schoolTermServices.getAllTermsByInstitution(authenticationService.getUserTenantId());
        let activeCurrentTermId;
        const activeTerm = termsResponse?.data.find((term) => term.is_active);
        if (activeTerm) {
            activeCurrentTermId = activeTerm?.id;
        } else {
            console.log("No active term found.");
        }
        return {
            termsReturned: termsResponse?.data,
            activeTermId: activeCurrentTermId,
        };
    } catch (e) {
        console.log(e);
        return { termsReturned: [], activeTermId: null };
    }
}

const CourseworkMarkList = () => {
    const { termsReturned, activeTermId } = useLoaderData()
    const { childId } = useParams()
    const user_id = childId
    const [coursework, setCoursework] = useState([]);

    const courseworkMarksTableColumns = [
        {
            title: "Coursework Title",
            dataIndex: ["coursework", "title"],
            key: "courseworkTitle",
        },
        {
            title: "Total Mark",
            dataIndex: ["coursework", "total_mark"],
            key: "id",
        },
        {
            title: "Scored Mark",
            dataIndex: "mark",
            key: "mark",
            render: (dataIndex) => (
                <strong>
                    {dataIndex}
                </strong>
            )
        },
        // {
        //     title: "Percentage",
        //     dataIndex: "percentage",
        //     key: "percentage",
        //     render: (dataIndex) => (
        //         <strong>
        //             {dataIndex ? dataIndex : 'NULL'}
        //         </strong>
        //     )
        // },
        {
            title: "Comment",
            dataIndex: "comment",
            key: "comment",
        },
    ];

    useEffect(() => {
        if (activeTermId) {
            fetchCourseworkMarksByTermId(activeTermId);
        }
    }, [activeTermId]);

    const terms = termsReturned?.map(
        term => ({
            label: `${term?.name} ${term?.academicYear.name}`,
            value: term?.id
        })
    )

    const handleChangeTerm = (value) => {
        const term_id = value
        fetchCourseworkMarksByTermId(term_id)
    }

    const fetchCourseworkMarksByTermId = async (term_id) => {
        try {
            const currentCourseworkMark = await courseworkMarksService.getAllByUserId(user_id)
            // const currentCourseworkMark = await courseworkMarksService.getAllByUserIdAndTermId(user_id term_id)

            if (currentCourseworkMark?.status === 200) {
                setCoursework(currentCourseworkMark?.data)
            } else {
                message.error("No coursework marks")
            }

        } catch (error) {
            message.error("No coursework marks")
        }
    }

    return (
        <>
            <Table
                className="table-responsive print-margins"
                rowKey="id"
                title={
                    () => (
                        <div>
                            <Alert
                                message={
                                    `Please select the term for the coursework marks you wish to view.`
                                }
                                type="info"
                                className='mb-3 py-3'
                                showIcon
                                closable
                            />

                            <Select
                                size="large"
                                options={terms}
                                placeholder='Select the term'
                                onChange={handleChangeTerm}
                            />
                        </div>
                    )
                }
                dataSource={coursework}
                columns={courseworkMarksTableColumns} />
        </>
    );
};

export default CourseworkMarkList;
