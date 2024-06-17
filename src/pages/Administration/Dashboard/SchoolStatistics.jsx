const SchoolStatistics = ({ name, value, icon }) => {
    return (
        <>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="me-2">
                            <span className="text-muted">{name}</span>
                            <h5 className="mb-0 fw-bolder">{value}</h5>
                        </div>
                        <div className="sw-3">
                            {icon}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SchoolStatistics;