//REACT
import React, { useState } from 'react'
import { useParams } from "react-router-dom";
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack';

//TRANSLATE
import { useTranslation } from 'react-i18next';

//COMPONENTS
import { ShardComponentModal } from 'components/Shared/Modal/Modal';
import ButtonSave from 'components/Shared/ButtonSave/ButtonSave'

//UI
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/'
import Button from '@material-ui/core/Button';
import FormNutritionPlan from './FormNutritionPlan';
import FormDeletePlanItem from './FormDeletePlanItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Chip from '@material-ui/core/Chip';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar'

//SERVICES
import { postNutritionalPlanToUser, deleteNutritionalRecipe } from 'services/MedicalSoftware/NutritionalPlan'

//DATE-FNS
import { format } from 'date-fns'

//UTILS
import { successToast, errorToast, mapErrors } from 'utils/misc';

const useStyles = makeStyles({
    boxButton: {
        width: '232px',
        height: '48px',
        background: '#f3f3f3',
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px',
        marginBottom: '20px'
    },
    boxItem: {
        width: '150px',
        height: '180px',
        borderRadius: '15px',
        border: '1px solid #f3f3f3'
    },
    button: {
        minWidth: '48px',
        height: '48px',
        borderRadius: '10px',
        background: '#f3f3f3'
    },
    itemRecipe: {
        width: '192px',
        height: '40px',
        borderRadius: '12px',
        background: 'white',
        border: '1px solid #F3F3F3',
        display: 'flex',
        justifyContent: 'space-between',
        marginRight: '10px'
    }
})

const ModuleNutrition = ({ setIsOpen, fields }) => {
    const { t } = useTranslation()
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()
    const { handleSubmit } = useForm()
    let { quote_id, user_id, medical_professional_id } = useParams();


    const [isOpenForm, setIsOpenForm] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [nutritionalPlan, setNutritionalPlan] = useState({
        nutritional_plan: [
            { id: 1, name: 'Lunes', recipes: [] },
            { id: 2, name: 'Martes', recipes: [] },
            { id: 3, name: 'Miercoles', recipes: [] },
            { id: 4, name: 'Jueves', recipes: [] },
            { id: 5, name: 'Viernes', recipes: [] },
            { id: 6, name: 'Sabado', recipes: [] },
            { id: 7, name: 'Domingo', recipes: [] }
        ]
    })
    const dateFormat = 'yyyy-MM-dd'
    const currentDate = format(new Date(), dateFormat)



    const columns = [
        { id: null, label: '', minWidth: 40, mobile: true, align: 'center' },
        { id: 1, label: '', minWidth: 200, mobile: true, align: 'center' },
    ];


    const handleOpenModal = () => {
        setIsOpenForm(true);
    }

    const onSubmit = () => {
        let dataSubmit = {
            user_id: user_id,
            nutritional_plan_id: nutritionalPlan.nutritional_plan_id,
            medical_professional_id: medical_professional_id,
            quotes_id: parseInt(quote_id)
        }
        postNutritionalPlanToUser(dataSubmit).then((req) => {
            if (req && req.data && req.data.message === 'success') {
                setIsOpen(false)
                enqueueSnackbar(t('ModuleNutrition.PlanToUser'), successToast)
            } 
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
       })

    }

    const handleDelete = async (item, indexDay) => {
        setNutritionalPlan({
            nutritional_plan:
                nutritionalPlan.nutritional_plan.map((x, index) => {
                    if (index === indexDay) {
                        x.recipes = x.recipes.filter(r => r.id !== item.id);
                    }
                    return x;
                })
        })
        await deleteNutritionalRecipe({
            recipe_id: item.id,
            nutritional_plan_id: nutritionalPlan.nutritional_plan_id
        });
    }

    return (
        <div>
            <div className='container'>
                <div className='row d-flex justify-content-between align-items-center mb-3'>
                    <div className='col-9'>
                        <Typography variant='h4'>{t('NutritionPlan.title')}</Typography>
                        <Typography variant='h5'>{`${fields[2]?.value} ${fields[3]?.value}`}</Typography>
                        <Typography variant='p'>{currentDate}</Typography>
                    </div>
                    <div className='col-3'>
                        <div className='d-flex flex-column align-items-end'>
                            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
                            <Button className={`${classes.boxButton}`} onClick={handleOpenModal} endIcon={<AddIcon />}>
                                <Typography variant='p'>{t('NutritionPlan.Create')}</Typography>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    {!nutritionalPlan?.nutritional_plan
                        ?
                        <Typography>{t('ModuleNutrition.NutritionalPlan')}</Typography>
                        :
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                                minWidth: column.minWidth
                                            }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {nutritionalPlan.nutritional_plan.map((day, index) => {
                                    return (
                                        <TableRow role="checkbox" tabIndex={-1} >
                                            <TableCell>
                                                {day.name}
                                            </TableCell>

                                            <TableCell>
                                                <div className='d-flex flex-row'>
                                                    {day.recipes.map((item) => (
                                                        <Chip
                                                            className={classes.itemRecipe}
                                                            avatar={<Avatar alt={item.daily_food_name.slice(0, 1)} src={item.urlImage} />}
                                                            label={item.daily_food_name}
                                                            onDelete={() => handleDelete(item, index)}
                                                        />
                                                    ))}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    }
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='d-flex justify-content-end align-items-end mt-5'>
                        <ButtonSave text={t('Btn.save')} />
                    </div>
                </form>
            </div>
            <ShardComponentModal width='sm' body={<FormNutritionPlan setNutritionalPlan={setNutritionalPlan} nutritionalPlan={nutritionalPlan} setIsOpen={setIsOpenForm} />} isOpen={isOpenForm} />
            <ShardComponentModal body={<FormDeletePlanItem setIsOpen={setIsOpenDelete} />} isOpen={isOpenDelete} />
        </div>
    )
}

export default ModuleNutrition