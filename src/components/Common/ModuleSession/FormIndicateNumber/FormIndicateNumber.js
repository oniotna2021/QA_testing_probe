import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

//UI
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

//Internal dependencies
import { typeIntensityForCardio, typeTimeRepetition, regexNumbersPositive } from 'utils/misc';

const FormIndicateNumber = ({
    itemAddTemporary,
    numberSeries, numberBreak, timeApply,
    setTimeApply, manageUpdateItemDiagram,
    setNumberSeries, setDataPiramidal,
    setNumberDurationApply, isSerieAdd = false,
    setNumberBreak, onClose, isRepetitions = false, setDataExercicesAditional, training_step_id_selected
}) => {

    const { handleSubmit, control, formState: { errors }, watch } = useForm({
        defaultValues: {
            type_time_repetition: itemAddTemporary ? itemAddTemporary._source.type_time_repetition : ''
        }
    });
    const watchShowTypeTime = watch("type_time_repetition", itemAddTemporary ? itemAddTemporary._source.type_time_repetition : '');

    const { t } = useTranslation();
    const [isPiramidal, setIsPiramidal] = useState(false);


    const onSubmit = (data) => {
        if (onClose) {
            if (timeApply && itemAddTemporary && !isSerieAdd) {

                let timeForCalculate = data.timeCalculate * 60;
                if (data.type_time_repetition === 2) {
                    //                    timeForCalculate = data.timeCalculate % 60;

                    timeForCalculate = data.timeCalculate;
                }
                data.numberRepeat = Math.round((timeForCalculate) / Number(itemAddTemporary._source.duration));

                if (!manageUpdateItemDiagram) {
                    setNumberDurationApply(data.timeCalculate);
                }
            }
            if (manageUpdateItemDiagram) {
                data.time_apply = timeApply;
                manageUpdateItemDiagram(data);
            } else {
                if (setNumberSeries) {
                    setNumberSeries(Number(data.numberRepeat));
                }
                if (setDataExercicesAditional) {
                    setDataExercicesAditional(data);
                }
                if (setNumberBreak) {
                    setNumberBreak(Number(data.numberBreak));
                    if (setDataPiramidal) {
                        setDataPiramidal({ ...data, apply_pyramidal: isPiramidal });
                    }
                }
            }
            onClose();
        }
    }

    const toggleCheckedTimeApply = () => {
        setTimeApply((prev) => !prev);
    };

    const toggleCheckedPiramidal = () => {
        setIsPiramidal((prev) => !prev);
    };


    return (
        <React.Fragment>
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="container">

                    <Typography variant="body2" component="p" style={{ width: 250 }}>{isRepetitions ? t('Repetitions.descriptionTitle') : t('Series.descriptionTitle')}</Typography>



                    {isRepetitions &&
                        <div className="mt-4">
                            <FormControlLabel
                                checked={timeApply} onChange={toggleCheckedTimeApply}
                                control={<Switch color="primary" />}
                                label={t('CreateRepeat.Fortime')}
                                labelPlacement="start"
                            />
                        </div>
                    }

                    {(!timeApply || isSerieAdd) &&
                        <div className="mt-4">
                            <Controller
                                control={control}
                                name='numberRepeat'
                                defaultValue={numberSeries}
                                rules={{ required: true, pattern: regexNumbersPositive }}
                                render={({
                                    field
                                }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onKeyUp={(e) => {
                                            if (regexNumbersPositive.test(e.target.value)) {
                                                field.onChange(e.target.value)
                                            } else {
                                                e.target.value = ''
                                                field.onChange('')
                                            }
                                        }}
                                        id='numberRepeat'
                                        variant="outlined"
                                        label={t('NumberTextField.indicate')}
                                    />
                                )}
                            />
                            <FormHelperText error={errors.numberRepeat && errors.numberRepeat.type === "required" ? true : false}>{errors.numberRepeat ? t('Field.required') : ''}</FormHelperText>
                        </div>
                    }


                    {timeApply !== 0 && timeApply && !isSerieAdd && <div className="mt-4 row m-0">
                        <div className='col-6'>
                            <Controller
                                control={control}
                                name='type_time_repetition'
                                defaultValue={itemAddTemporary ? itemAddTemporary._source.type_time_repetition : ''}
                                rules={{ required: true }}
                                render={({
                                    field
                                }) => (
                                    <FormControl variant="outlined" className="my-2">
                                        <InputLabel id='select'>{t('Title.TypeTime')}</InputLabel>
                                        <Select labelId='select' label={t('Title.TypeTime')}
                                            {...field}
                                            onChange={(e) => { field.onChange(e.target.value); }}
                                        >
                                            {typeTimeRepetition.map((res) => (
                                                <MenuItem key={res.name} value={res.id}>
                                                    {res.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </div>
                        <div className='col-6 mt-2'>
                            <Controller
                                control={control}
                                name='timeCalculate'
                                defaultValue={
                                    itemAddTemporary && itemAddTemporary._source ?
                                        itemAddTemporary._source.numberDurationApply : ''
                                }
                                rules={{ required: true, pattern: regexNumbersPositive }}
                                type="number"
                                render={({
                                    field
                                }) => (
                                    <TextField
                                        {...field}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onKeyUp={(e) => {
                                            if (regexNumbersPositive.test(e.target.value)) {
                                                field.onChange(e.target.value)
                                            } else {
                                                e.target.value = ''
                                                field.onChange('')
                                            }
                                        }}
                                        type="number"
                                        id='timeCalculate'
                                        variant="outlined"
                                        label={t('NumberTextField.calculateTime') + (watchShowTypeTime === 2 ? ' (Segundos)' : ' (Minutos)')}
                                    />
                                )}
                            />
                        </div>

                        <FormHelperText error={errors.timeCalculate && errors.timeCalculate.type === "required" ? true : false}>{errors.timeCalculate ? t('Field.required') : ''}</FormHelperText>
                    </div>
                    }

                    {training_step_id_selected && training_step_id_selected === 3 && isRepetitions &&
                        <Controller
                            control={control}
                            name='perception_effort'
                            rules={{ required: true }}
                            render={({
                                field
                            }) => (
                                <FormControl variant="outlined" className="my-2">
                                    <InputLabel id='select'>{t('Title.Intensity')}</InputLabel>
                                    <Select labelId='select' label={t('Title.Intensity')}
                                        {...field}
                                        onChange={(e) => { field.onChange(e.target.value); }}
                                    >
                                        {typeIntensityForCardio.map((res) => (
                                            <MenuItem key={res.name} value={res.id}>
                                                {res.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />

                    }




                    {!isRepetitions &&
                        <React.Fragment>

                            <div className="mt-4">
                                <Controller
                                    control={control}
                                    name='numberBreak'
                                    defaultValue={numberBreak}
                                    rules={{ required: true, pattern: regexNumbersPositive }}

                                    render={({
                                        field
                                    }) => (
                                        <TextField
                                            {...field}
                                            type="number"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onKeyUp={(e) => {
                                                if (regexNumbersPositive.test(e.target.value)) {
                                                    field.onChange(e.target.value)
                                                } else {
                                                    e.target.value = ''
                                                    field.onChange('')
                                                }
                                            }}
                                            id='numberBreak'
                                            variant="outlined"
                                            label={t('Break.title')}
                                        />
                                    )}
                                />
                                <FormHelperText error={errors.numberBreak && errors.numberBreak.type === "required" ? true : false}>{errors.numberBreak ? t('Field.required') : ''}</FormHelperText>
                            </div>




                            <div className="mt-4">
                                <FormControlLabel
                                    checked={isPiramidal} onChange={toggleCheckedPiramidal}
                                    control={<Switch color="primary" />}
                                    label="Es piramidal?"
                                    labelPlacement="start"
                                />
                            </div>



                            {isPiramidal &&
                                <React.Fragment>
                                    {/*   <div className="mt-4">
                                        <Controller
                                            control={control}
                                            name='pyramidal_increase_element_weight'
                                            rules={{ required: true }}
                                            render={({
                                                field
                                            }) => (
                                                <TextField
                                                    {...field}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    type="number"
                                                    id='pyramidal_increase_element_weight'
                                                    variant="outlined"
                                                    label={t('Weight.Title')}
                                                />
                                            )}
                                        />
                                        <FormHelperText error={errors.pyramidal_increase_element_weight && errors.pyramidal_increase_element_weight.type === "required" ? true : false}>{errors.pyramidal_increase_element_weight ? t('Field.required') : ''}</FormHelperText>
                                    </div>*/
                                    }

                                    <div className="mt-4">
                                        <Controller
                                            control={control}
                                            name='pyramidal_increase_repetitions'
                                            rules={{ required: true, pattern: regexNumbersPositive }}
                                            render={({
                                                field
                                            }) => (
                                                <TextField
                                                    {...field}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    type="number"
                                                    onKeyUp={(e) => {
                                                        if (regexNumbersPositive.test(e.target.value)) {
                                                            field.onChange(e.target.value)
                                                        } else {
                                                            e.target.value = ''
                                                            field.onChange('')
                                                        }
                                                    }}
                                                    id='pyramidal_increase_repetitions'
                                                    variant="outlined"
                                                    label={t('Increments.title')}
                                                />
                                            )}
                                        />
                                        <FormHelperText error={errors.pyramidal_increase_repetitions && errors.pyramidal_increase_repetitions.type === "required" ? true : false}>{errors.pyramidal_increase_repetitions ? t('Field.required') : ''}</FormHelperText>
                                    </div>

                                </React.Fragment>
                            }
                        </React.Fragment>
                    }


                    <FormHelperText error={watchShowTypeTime === 2 ? true : false}>{errors.pyramidal_increase_repetitions ? t('Field.required') : ''}</FormHelperText>




                    <div className="mt-4 mb-2">
                        <Button variant="contained" color="primary" fullWidth type="submit">Asignar</Button>
                    </div>
                </div>
            </form>

        </React.Fragment >
    )
}

export default FormIndicateNumber
