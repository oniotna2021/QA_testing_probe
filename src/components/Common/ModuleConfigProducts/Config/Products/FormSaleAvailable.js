//UI
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';

import NumberFormatField from 'components/Shared/NumberFormatField/NumberFormatField'
import React from 'react';
import { SwitchCustom } from 'components/Shared/SwitchCustom/SwitchCustom';
import { frecuencyType } from "utils/misc";
import { useTranslation } from 'react-i18next';

const FormSailAvailable = ({
    Controller,
    control,
    defaultValue,
    errors,
    allDurationData,
    segmentData
}) => {
    const { t } = useTranslation();

    return (
        <div className='row mx-0'>
            <div className='col-6' style={{ paddingLeft: '0px' }}>
                <div className='col-12'>
                    <Controller
                        rules={{ required: true }}
                        control={control}
                        error={errors.segment}
                        name="segment"
                        defaultValue={defaultValue?.segment}
                        render={({ field }) => (
                            <FormControl variant="outlined">
                                <InputLabel>{'Segmento'}</InputLabel>
                                <Select
                                    {...field}
                                    fullWidth
                                    error={errors.segment}
                                    variant="outlined"
                                    label={t("FormProduct.Frecuency")}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                    }}
                                >
                                    {segmentData.map((item) => (
                                        <MenuItem key={`item-${item.id}`} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                </div>
                <div className='col-12'>
                    <div className='row mt-4 mx-0'>
                        <div className='col-6 my-auto px-0' style={{ textAlign: 'start' }}>Permanencia</div>
                        <div className='col-6 my-auto px-0' style={{ textAlign: 'end' }}>
                            <div>
                                <Controller
                                    control={control}
                                    error={errors.is_permanence}
                                    name="is_permanence"
                                    defaultValue={defaultValue?.is_permanence}
                                    render={({ field }) => (
                                        <SwitchCustom
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e.target.checked);
                                            }}
                                            name="is_permanence"
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-12 pt-2'>
                    <div className='row mt-4 mx-0'>
                        <div className='col-6 my-auto px-0' style={{ textAlign: 'start' }}>Pagos recurrentes</div>
                        <div className='col-6 my-auto px-0' style={{ textAlign: 'end' }}>
                            <Controller
                                control={control}
                                error={errors.is_recurring_payments}
                                name="is_recurring_payments"
                                defaultValue={defaultValue?.is_recurring_payments}
                                render={({ field }) => (
                                    <SwitchCustom
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e.target.checked);
                                        }}
                                        name="is_recurring_payments"
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='row mt-2 mx-0'>
                        <div className='col-6 my-auto px-0' style={{ textAlign: 'start' }}>Nº Pago anticipado</div>
                        <div className='col-6 my-auto px-0' style={{ textAlign: 'end' }}>
                            <Controller
                                rules={{ required: true }}
                                control={control}
                                error={errors.advance_payment_number}
                                name="advance_payment_number"
                                defaultValue={defaultValue?.advance_payment_number}
                                render={({ field }) => (
                                    <FormControl variant="outlined">
                                        <InputLabel>{'Nº Pago '}</InputLabel>
                                        <Select
                                            {...field}
                                            fullWidth
                                            error={errors.advance_payment_number}
                                            variant="outlined"
                                            label={t("FormProduct.Frecuency")}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                            }}
                                        >
                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <MenuItem key={`item-${item}`} value={item}>
                                                    {item}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </div>
                    </div>
                </div>


            </div>
            <div className='col-6' style={{ paddingRight: '0px' }}>
                <div className='col-12'>
                    <div className='row mx-0'>
                        <div className='col-4 my-auto px-0'>Duracion</div>
                        <div className='col-2' style={{ paddingRight: '16px', paddingLeft: '0px' }}>
                            <Controller
                                rules={{ required: true }}
                                control={control}
                                name="time_of_permanence"
                                error={errors.time_of_permanence}
                                defaultValue={defaultValue?.time_of_permanence}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={errors.time_of_permanence}
                                        variant="outlined"
                                        label={'--'}
                                    />
                                )}
                            />
                        </div>
                        <div className='col-6 px-0'>
                            <Controller
                                rules={{ required: true }}
                                control={control}
                                error={errors.frecuency_type}
                                name="frecuency_type"
                                defaultValue={defaultValue?.frecuency_type}
                                render={({ field }) => (
                                    <FormControl variant="outlined">
                                        <InputLabel>{'Un. de tiempo'}</InputLabel>
                                        <Select
                                            {...field}
                                            fullWidth
                                            error={errors.frecuency_type}
                                            variant="outlined"
                                            label={t("FormProduct.Frecuency")}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                            }}
                                        >
                                            {allDurationData.map((item) => (
                                                <MenuItem key={`item-${item.id}`} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='row mt-3 mx-0'>
                        <div className='col-4 my-auto px-0'>Tiempo</div>
                        <div className='col-2' style={{ paddingRight: '16px', paddingLeft: '0px' }}>
                            <Controller
                                rules={{ required: true }}
                                control={control}

                                name="short_description"
                                error={errors.short_description}
                                defaultValue={defaultValue?.product_details[0]?.short_description}
                                render={({ field }) => (
                                    <TextField

                                        style={{ color: 'blue' }}
                                        {...field}
                                        error={errors.short_description}
                                        variant="outlined"
                                        label={'--'}

                                    />
                                )}
                            />
                        </div>
                        <div className='col-6 px-0'>
                            <Controller
                                rules={{ required: true }}
                                control={control}
                                error={errors.frecuency_type}
                                name="frecuency_type"
                                defaultValue={defaultValue?.frecuency_type}
                                render={({ field }) => (
                                    <FormControl variant="outlined">
                                        <InputLabel>{'Un. de tiempo'}</InputLabel>
                                        <Select
                                            {...field}
                                            fullWidth
                                            error={errors.frecuency_type}
                                            variant="outlined"
                                            label={t("FormProduct.Frecuency")}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                            }}
                                        >
                                            {allDurationData.map((item) => (
                                                <MenuItem key={`item-${item.id}`} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-12 pt-1'>
                    <div className='row mx-0 mt-2'>
                        <div className='col-4 my-auto px-0'>Precio Base</div>
                        <div className='col-8 px-0'>
                            <NumberFormatField
                                isRequired={true}
                                labelField={'$  -------'}
                                control={control}
                                defaultValue={''}
                                nameField="price"
                            />
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}


export default FormSailAvailable