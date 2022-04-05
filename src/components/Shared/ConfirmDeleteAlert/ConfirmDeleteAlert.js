import React, { useState } from 'react'

import { useStyles } from "utils/useStyles";
import { useTranslation } from "react-i18next";

//UI
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

const ConfirmDeleteAlert = ({ handleClose, textDetail, label }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [valueTextConfirm, setValueTextConfirm] = useState("");


    return (
        <div className='row m-0'>

            <div className="col-12">
                <Typography variant='body2' dangerouslySetInnerHTML={{ __html: textDetail }}></Typography>
            </div>

            <div className="col-12 mt-4">
                <TextField
                    fullWidth
                    type="text"
                    label={label}
                    rows={1}
                    variant="outlined"
                    onChange={(e) => setValueTextConfirm(e.target.value)}
                />
            </div>

            <div className="col-6 d-flex justify-content-center mt-5">
                <Button onClick={handleClose} className={classes.buttonCancel}>{t("Btn.Cancel")}</Button>
            </div>


            <div className="col-6 d-flex justify-content-end mt-5">
                <ButtonSave
                    fullWidth={true}
                    text={t("Btn.delete")}
                />
            </div>

        </div>
    )
}

export default ConfirmDeleteAlert