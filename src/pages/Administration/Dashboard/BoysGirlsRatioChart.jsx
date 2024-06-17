import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Pie} from 'react-chartjs-2';
import AuthenticationService from "../../../services/authentication.service";
import StudentService from "../../../services/student.service";
import {useEffect, useState} from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const BoyGirlsRatioChart = () => {
    const [ratio, setRatio] = useState({});
    async function fetchStudentGenderRatio() {
        try {
            const tenantId = AuthenticationService.getUserTenantId();
            const response = await StudentService.getStudentsGenderRatioByInstitutionId(tenantId);
            const data = response.data;
            setRatio(data)
        } catch (e) {
            return {}
        }
    }

    useEffect(
        () => {
            fetchStudentGenderRatio();
        }, []
    )
    const data = {
        labels: ['Boys', 'Girls'],
        datasets: [
            {
                label: '',
                data: [ratio?.males?.total, ratio?.females?.total],
                backgroundColor: [
                    'rgba(243,188,0,0.7)',
                    'rgba(0,117,164,0.7)',
                ],
                borderColor: [
                    'rgba(243,188,0,1)',
                    'rgba(0,117,164,1)',
                ],
                borderWidth: 1,
            },
        ]
    };
    return (
        <>
            <div
                className={"card border-0 shadow p-3 text-center"}
            >
                <div className={"row"}>
                    <div className={"col-md-6"}>
                        <Pie data={data}/>
                    </div>
                    <div className={"col-md-6"}>
                        <p className={"text-muted fw-light"}>
                            Students gender ratio
                        </p>
                        <span className={"text-muted fw-light"}>Boys</span>
                        <h1 className={"fw-bold text-muted display-5"}>{ratio?.males?.total}<span
                            className='h6'
                            style={{color: 'rgba(243,188,0,0.7)'}}
                        >
                            {ratio?.males?.percentage}%
                        </span></h1>

                        <span className={"text-muted fw-light"}>Girls</span>
                        <h1 className={"fw-bold text-muted display-5"}>{ratio?.females?.total}<span
                            className='h6'
                            style={{color: 'rgba(0,117,164,0.7)'}}
                        >
                            {ratio?.females?.percentage}%
                        </span></h1>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BoyGirlsRatioChart;