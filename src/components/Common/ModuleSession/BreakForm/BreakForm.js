import React from 'react'
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

//UI
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const BreakForm = ({ setNumberTime, onClose }) => {
    const { handleSubmit, control } = useForm();
    const { t } = useTranslation();

    const onSubmit = (data) => {
        if (onClose) {
            setNumberTime(Number(data.time));
            onClose();
        }
    }

    return (
        <React.Fragment>
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="container">
                    <div className="mt-4">
                        <Controller
                            control={control}
                            name='time'
                            render={({
                                field
                            }) => (
                                <TextField
                                    {...field}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    id='time'
                                    variant="outlined"
                                    label={t('Label.Time')}
                                />
                            )}
                        />
                    </div>
                    <div className="mt-4 mb-2">
                        <Button variant="contained" color="primary" fullWidth type="submit">Asignar</Button>
                    </div>
                </div>
            </form>
        </React.Fragment>
    )
}

export default BreakForm

