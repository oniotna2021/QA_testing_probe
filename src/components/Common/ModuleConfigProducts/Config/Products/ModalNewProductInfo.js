import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import { frecuencyType, productType } from "../../../../../utils/misc";

import ControlledAutocompleteChip from 'components/Shared/ControlledAutocompleteChip/ControlledAutocompleteChip';
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';

const ModalNewProductInfo = ({
    control,
    error,
    defaultValue,
    modalCustom
}) => {
    const { t } = useTranslation();
    const [tags, setTags] = useState([])
    return (

        <div className='row mx-0 px-4'>
            {!!modalCustom &&
                <React.Fragment>
                    <div className='col-12 px-0' style={{ marginTop: '-10px' }}>Ingresa los siguientes datos.</div>

                    <div className='col-12 px-0 mt-4'>
                        <div className='row mx-0'>
                            <div className='col-6 px-0 my-auto'>Número total de sesiones</div>
                            <div className='col-6 px-0 '>
                                <Controller
                                    rules={{ required: true }}
                                    control={control}
                                    name="short_description"
                                    error={error}
                                    defaultValue={defaultValue}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={false}
                                            variant="outlined"
                                            placeholder='----'
                                            inputProps={{
                                                style: {
                                                    textAlign: 'center'
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                    </div>

                    <div className='col-12 px-0 mt-3'>
                        <div className='row mx-0'>
                            <div className='col-6  my-auto' style={{ paddingRight: '90px', paddingLeft: '0' }}>Número minimo de sesiones por 30 días</div>
                            <div className='col-6 px-0'>
                                <Controller
                                    rules={{ required: true }}
                                    control={control}
                                    name="short_description"
                                    error={error}
                                    defaultValue={defaultValue}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={false}
                                            variant="outlined"
                                            placeholder='----'
                                            inputProps={{
                                                style: {
                                                    textAlign: 'center'
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                    </div>
                </React.Fragment>
            }
            <div className='col-12 px-0 mt-3 py-0'>
                <ControlledAutocompleteChip
                    setTags={setTags}
                    control={control}
                    name="activities_name"
                    isHomolog={true}
                    options={[{ name: 'Nutricion' }, { name: 'PTON' }]}
                    defaultValue={
                        defaultValue?.equivalent_names.map((i) => i.name) || []
                    }

                />
                {
                    (tags.length > 0 && !!modalCustom) ?
                        tags.map((tag) =>
                            <div className='col-12 px-0 mt-3 '>
                                <Controller
                                    rules={{ required: true }}
                                    control={control}
                                    name="short_description"
                                    error={error}
                                    defaultValue={'Numero de sesiones'}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={false}
                                            variant="outlined"
                                            label={`${tag}`}
                                        />
                                    )}
                                />
                            </div>
                        )
                        : null
                }
            </div>
            <div className='col-12 px-0 mt-3'>
                <div className='row mx-0'>
                    <div className='col-6 my-auto' style={{ paddingLeft: '0px', paddingRight: '20px' }}>
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            error={error}
                            name="frecuency_type"
                            defaultValue={defaultValue?.frecuency_type}
                            render={({ field }) => (
                                <FormControl variant="outlined">
                                    <InputLabel>{'Frecuencia'}</InputLabel>
                                    <Select
                                        {...field}
                                        fullWidth
                                        error={error}
                                        variant="outlined"
                                        label={t("FormProduct.Frecuency")}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                    >
                                        {frecuencyType.map((item) => (
                                            <MenuItem key={`item-${item.id}`} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </div>
                    <div className='col-6 px-0 '>
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="short_description"
                            error={error}
                            defaultValue={defaultValue}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    error={false}
                                    variant="outlined"
                                    label={'Valor de frecuencia'}
                                />
                            )}
                        />
                    </div>
                </div>

            </div>
            <div className='col-12 px-0 mt-3'>
                <div className='row mx-0'>
                    <div className='col-6 my-auto' style={{ paddingRight: !!modalCustom ? '90px' : '0', paddingLeft: '0' }}>{!!modalCustom ? 'Número de reprogramaciones' : 'Número de cancelaciones'}</div>
                    <div className='col-6 px-0 '>
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="short_description"
                            error={error}
                            defaultValue={defaultValue}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    error={false}
                                    variant="outlined"
                                    placeholder='----'
                                    inputProps={{
                                        style: {
                                            textAlign: 'center'
                                        }
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
            <div className='col-12 px-0 my-5 '>
                <div className="row">
                    <div className="col-6">
                        <Button
                            color="#FFFFF"
                            onClick={() => { }}
                        ><div style={{ padding: '5px 50px' }}>{t('Btn.Cancel')}</div></Button>
                    </div>
                    <div className="col-6" style={{ textAlign: 'end' }}>
                        <Button
                            style={{ background: '#CC5667', color: 'white' }}
                            onClick={() => { }}
                        ><div style={{ padding: '5px 50px' }}>{t('Btn.save')}</div></Button>
                    </div>
                </div>
            </div>


        </div>

    )
}

export default ModalNewProductInfo