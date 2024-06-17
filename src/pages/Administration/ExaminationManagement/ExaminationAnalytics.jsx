import {useEffect, useState} from "react";
import StudentMarkService from "../../../services/student-mark.service";
import AuthenticationService from "../../../services/authentication.service";
import {Divider, Select} from "antd";

import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Pie} from 'react-chartjs-2';
import SchoolTermServices from "../../../services/schoolTerm.services";



ChartJS.register(ArcElement, Tooltip, Legend);

const ExaminationAnalytics = () => {
    const [analytics, setAnalytics] = useState({});
    const [terms, setTerms] = useState([]);

    const termsSelectOptions = terms?.map(
        term => ({
            label: `${term?.name} ${term?.academicYear?.name}`,
            value: term?.id
        })
    )

    useEffect(() => {
        async function fetchExaminationAnalytics() {
            try {
                const analyticsResponse = await StudentMarkService.examAnalysis(AuthenticationService.getUserTenantId());
                const termsResponse = await SchoolTermServices.getAllTermsByInstitution(AuthenticationService.getUserTenantId());
                const termsResponseData = termsResponse.data;
                const analyticsResponseData = analyticsResponse.data;
                return {analyticsResponseData, termsResponseData}
            } catch (e) {
                return {};
            }
        }

        fetchExaminationAnalytics()
            .then(data => {
                setAnalytics(data?.analyticsResponseData);
                setTerms(data?.termsResponseData)
            })
    }, [])

    const handleChangeTerm = async (value) => {
        try {
            const analysisResponse = await StudentMarkService.examAnalysisByTermId(
                AuthenticationService.getUserTenantId(),
                value
            )
            setAnalytics(analysisResponse.data)
        } catch (e) {
            setAnalytics({})
        }
    }

    return (
        <div>
            <div className='mb-3 d-flex justify-content-between align-items-center'>
                <h4 className='mb-3 text-decoration-underline'>{analytics?.term}</h4>
                <Select
                    style={{width: '375px'}}
                    placeholder='Select term to view analytics for that particular term'
                    options={termsSelectOptions}
                    onChange={handleChangeTerm}
                />
            </div>

            {
                analytics?.items?.map((i, key) => (
                    <div key={key} className='row'>
                        {
                            key === 0 ? <></> : <Divider type={"horizontal"} />
                        }
                        <div className='col-md-6'>
                            <h5>
                                <span className='fs-6 text-muted'>Examination</span> &nbsp;
                                {i?.level} {i?.subject}
                            </h5>
                            <p className='small my-1'>
                            <span>
                                Number of students who sat for the examination
                            </span> &nbsp; &nbsp; &nbsp;
                                <span className='display-6 fw-bolder'>
                                {i?.sits}
                            </span>
                            </p>
                            <p className='small my-1'>
                            <span>
                                Number of students who scored above 50%
                            </span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                <span className='display-6 fw-bolder'>
                                {i?.above_half} &nbsp;
                            </span>
                                <span className='fs-4'>{i?.above_half_percentage}%</span>
                            </p>
                            <p className='small my-1'>
                            <span>
                                Number of students who scored below 50%
                            </span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                <span className='display-6 fw-bolder'>
                                {i?.below_half} &nbsp;
                            </span>
                                <span className='fs-4'>{i?.below_half_percentage}%</span>
                            </p>
                            <p className='small my-1'>
                            <span>
                                Number of students who scored exact 50%
                            </span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                <span className='display-6 fw-bolder'>
                                {i?.half} &nbsp;
                            </span>
                                <span className='fs-4'>{i?.half_percentage}%</span>
                            </p>
                        </div>

                        <div className='col-md-6'>
                            <div
                                style={{
                                    maxHeight: '250px',
                                    maxWidth: '100%'
                                }}
                            >
                                <Pie
                                    data={{
                                        labels: ['Scored above 50%', 'Scored below 50%', 'Scored exact  50%'],
                                        datasets: [
                                            {
                                                label: '',
                                                data: [i?.above_half, i?.below_half, i?.half],
                                                backgroundColor: [
                                                    '#8FDB90',
                                                    '#F28B82',
                                                    '#FFF68F'
                                                ],
                                                borderColor: [
                                                    '#8FDB90',
                                                    '#F28B82',
                                                    '#FFF68F'
                                                ],
                                                borderWidth: 1,
                                            },
                                        ]
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                ))
            }
        </div>
    )
}

export default ExaminationAnalytics;