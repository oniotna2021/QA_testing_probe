//REACT
import React, { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack';

//TRANSLATE
import { useTranslation } from 'react-i18next';

//COMPONENTS
import { ShardComponentModal } from 'components/Shared/Modal/Modal';
import FormFoodItem from './FormFoodItem'

//UI
import CloseIcon from '@material-ui/icons/Close'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import Autocomplete from '@material-ui/lab/Autocomplete';
import Avatar from '@material-ui/core/Avatar'
import { useTheme } from '@material-ui/core/styles';

//ICONS
import { IconFood, IconImage } from 'assets/icons/customize/config'

//UTILS
import { useStyles } from 'utils/useStyles'
import { successToast, errorToast, mapErrors } from 'utils/misc';

//SERVICES
import { getDailyFood, getDayWeek } from 'services/MedicalSoftware/DailyFood'
import { postNutritionalPlanModel } from 'services/MedicalSoftware/NutritionalPlan'
import { searchElastic } from 'services/_elastic';

const FormNutritionPlan = ({ setIsOpen, nutritionalPlan, setNutritionalPlan }) => {
    const { control, handleSubmit } = useForm()
    const classes = useStyles()
    const theme = useTheme();
    const { t } = useTranslation()
    const { enqueueSnackbar } = useSnackbar();

    const [ingredients, setIngredients] = useState([])
    const [isOpenForm, setIsOpenForm] = useState(false)
    const [dailyFood, setDailyFood] = useState([])
    const [options, setOptions] = useState([])
    const [urlImage, setUrlImage] = useState('')
    const [dayWeek, setDayWeek] = useState([])
    const [term, setTerm] = useState('');


    useEffect(() => {
        getDailyFood().then(({ data }) => {
            if (data && data.status === 'success' && data.data && data.data.items.length > 0) {
                setDailyFood(data.data.items);
            } else {
                if ( data.status === 'error' ) {
                    enqueueSnackbar(mapErrors(data.data?.message), errorToast);
                }
            }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
        })
        getDayWeek().then(({ data }) => {
            if (data && data.status === 'success' && data.data && data.data.items.length > 0) {
                setDayWeek(data.data.items);
            } else {
                if ( data.status === 'error' ) {
                    enqueueSnackbar(mapErrors(data.data?.message), errorToast);
                }
            }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
        })
    }, [enqueueSnackbar])

    useEffect(() => {
        searchElastic('image_of_recipes',
            {
                "from": 0,
                "size": 20,
                "query": {
                    "match_all": {}
                }
            }
        ).then(({ data }) => {
            if (data && data.data) {
                setOptions(data.data.hits.hits)
            } else {
                setOptions([]);
            }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
        })
    }, [enqueueSnackbar])

    useEffect(() => {
        if (term) {
            setFilterValue(term)
        }
    }, [term]);

    const setFilterValue = (value) => {
        setOptions([]);
        if (value) {
            searchElastic('image_of_recipes',
                {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "multi_match": {
                                        "query": value,
                                        "fields": [
                                            "tags.tag"
                                        ],
                                        "fuzziness": "2"
                                    }
                                }
                            ]
                        }
                    }
                }
            ).then(({ data }) => {
                if (data && data.data) {
                    setOptions(data.data.hits.hits)
                } else {
                    setOptions([]);
                }
            }).catch((err) => {
                enqueueSnackbar(mapErrors(err), errorToast);
            })
        } else {
            setOptions([]);
        }
    }


    const handleOpenModal = () => {
        setIsOpenForm(true);
    }

    const deleteItem = (index) => {
        setIngredients(ingredients.filter((r, i) => i !== index))
    }

    const onSubmit = (value) => {
        if (ingredients.length > 0) {
            let dataSubmit = {
                nutritional_plan_id: nutritionalPlan.nutritional_plan_id,
                recipe: {
                    day_week_id: value.day_week_id,
                    name: value.recipe_name,
                    hour: `${value.hour}:00`,
                    daily_food_id: value.daily_food_id,
                    urlImage: urlImage,
                    ingredients: ingredients
                }
            }
            postNutritionalPlanModel(dataSubmit).then((req) => {
                if (req && req.data && req.data.message === 'success') {
                    setIsOpen(false)
                    enqueueSnackbar(t('PhysicalExamination.NutritionalPlanModel'), successToast)
                }
                else {
                    enqueueSnackbar(req.data.message, errorToast)
                }
                setNutritionalPlan(req.data.data)
            }).catch((err) => {
                enqueueSnackbar(mapErrors(err), errorToast);
            })
            setIsOpen(false)
        }
    }

    return (
        <div>
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='row mb-3'>
                    <div className='col-11'>
                        <Typography variant='h6'>{t('NutritionPlan.Create')}</Typography>
                    </div>
                    <div className='col-1'>
                        <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12 mb-3'>
                        <Controller
                            name='recipe_name'
                            control={control}
                            rules={{ required: true }}
                            render={({
                                field
                            }) => (
                                <TextField
                                    {...field}
                                    variant='outlined'
                                    label={t('PhysicalExamination.TextField')}
                                />
                            )}
                        />
                    </div>
                    <div className='col-6 mb-3'>
                        <div className='d-flex align-items-center'>
                            <Avatar className={`${classes.avatarNutrition} me-2`} src={urlImage} children={<IconImage color={theme.palette.black.main} />} />
                            <Autocomplete
                                style={{ width: '250px' }}
                                onChange={(_, data) => setUrlImage(data?._source.urlImage)}
                                options={options}
                                noOptionsText={t('PhysicalExamination.noOptionsText')}
                                getOptionLabel={(option) => option._source.tags[0].tag}
                                renderOption={(option) => (
                                    <React.Fragment>
                                        <span className='me-3'><Avatar src={option._source.urlImage} /></span>
                                        <Typography variant='body2'>{option._source.tags[0].tag}</Typography>
                                    </React.Fragment>

                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t('FormNutrition.AddImage')}
                                        variant="outlined"
                                        value={term}
                                        onChange={({ target }) => setTerm(target.value)}
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: 'new-password', // disable autocomplete and autofill
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className='col-6'>
                        <Controller
                            name='daily_food_id'
                            control={control}
                            rules={{ required: true }}
                            render={({
                                field
                            }) => (
                                <FormControl variant="outlined" >
                                    <InputLabel id='SelectTypeFood'>{t('NutritionPlan.FormNutrition.SelectTypeFood')}</InputLabel>
                                    <Select
                                        {...field}
                                        labelId='SelectTypeFood'
                                        label={t('NutritionPlan.FormNutrition.SelectTypeFood')}
                                    >
                                        {dailyFood.map((res) => (
                                            <MenuItem key={res.name} value={res.id}>
                                                {res.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </div>

                    <div className='col-6'>
                        <Controller
                            name='day_week_id'
                            control={control}
                            render={({
                                field
                            }) => (
                                <FormControl variant="outlined" >
                                    <InputLabel id='SelectDayWeek'>{t('PhysicalExamination.SelectLabel')}</InputLabel>
                                    <Select
                                        {...field}
                                        labelId='SelectDayWeek'
                                        label={t('PhysicalExamination.SelectLabel')}
                                    >
                                        {dayWeek.map((res) => (
                                            <MenuItem key={res.name} value={res.id}>
                                                {res.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </div>

                    <div className='col-6'>
                        <Controller
                            name='hour'
                            control={control}
                            rules={{ required: true }}
                            render={({
                                field
                            }) => (
                                <TextField
                                    {...field}
                                    variant='outlined'
                                    InputLabelProps={{ shrink: true }}
                                    label={t('NutritionPlan.FormNutrition.InputHour')}
                                    type='time'
                                />
                            )}
                        />
                    </div>
                </div>
                <div className='mt-3'>
                    <Button size='large' className={classes.colorButton} fullWidth={true} onClick={handleOpenModal}>
                        <div className='container d-flex justify-content-between'>
                            <Typography>{t('NutritionPlan.FormNutrition.AddFood')}</Typography>
                            <AddIcon />
                        </div>
                    </Button>
                    <div className='mt-3'>
                        {ingredients.map((ingredient, index) => (
                            <div className={classes.itemFood}>
                                <IconFood />
                                <Typography>{ingredient.foodData?.name}</Typography>
                                <Typography>{`${ingredient.weight_value} ${t('FormNutritionPlan.ItemFood')}`}</Typography>
                                <Button onClick={() => deleteItem(index)}>
                                    <CloseIcon />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='d-flex justify-content-end mt-3'>
                    <Button type='submit' className={classes.button} variant='contained'>{t('NutritionPlan.ButtonSave')}</Button>
                </div>
            </form>
            <ShardComponentModal fullWidth={true} width='sm' body={<FormFoodItem setIngredients={setIngredients} ingredients={ingredients} setIsOpen={setIsOpenForm} />} isOpen={isOpenForm} />
        </div>
    )
}

export default FormNutritionPlan