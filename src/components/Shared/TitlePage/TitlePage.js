import React from 'react'


//UI
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const TitlePage = ({ title, labelBtn, actionBtn }) => {
    return (
        <div className="row">
            <div className="col-6">
                <Typography variant="h4">{title}</Typography>
            </div>
            {labelBtn &&
                <div className="col d-flex justify-content-end">
                    <Button
                        color="primary"
                        variant="contained"
                    >
                        {labelBtn}
                    </Button>
                </div>
            }
        </div>
    )
}

export default TitlePage
