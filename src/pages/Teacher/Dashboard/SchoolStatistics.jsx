import {Card} from "antd";

const SchoolStatistics = ({name, value, icon, color}) => {
    return (
        <>
            <Card
                className={"w-100 shadow-sm"}
                hoverable={true}
            >
                <div className={'d-flex justify-content-lg-between align-items-center'}>
                    <Card.Meta
                        title={<span className='small fw-lighter' style={{color: color}}>{name}</span>}
                        description={<h4 className='fw-bolder m-0 text-info-emphasis'>{value}</h4>}
                    />
                    {icon}
                </div>
            </Card>
        </>
    )
}

export default SchoolStatistics;