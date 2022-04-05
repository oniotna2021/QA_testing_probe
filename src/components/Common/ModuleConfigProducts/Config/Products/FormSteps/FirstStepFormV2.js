import { Button, Chip, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";

// utils
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormSailAvailable from "../FormSaleAvailable";
import { IconUploadImageProduct } from 'assets/icons/customize/config'
import ModalNewProductInfo from "../ModalNewProductInfo";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import { SwitchCustom } from "components/Shared/SwitchCustom/SwitchCustom";
//UI
import TextField from "@material-ui/core/TextField";
import { getAllDurations } from "services/GeneralConfig/Durations";
import { getAllSegments } from "services/GeneralConfig/Segments";
import { useTranslation } from "react-i18next";

const FirstStepForm = ({
    Controller,
    control,
    defaultValue,
    userType,
    errors,
    getValues,
    channels,
    organizations,
    expandedForSale,
    setExpandedForSale
}) => {
    const { t } = useTranslation();
    const [modalStateProduct, setModalStateProduct] = useState(false)
    const [modalStateCustom, setModalStateCustom] = useState(false)
    const [allDurationData, setAllDurationData] = useState(false);
    const [segmentData, setSegmentData] = useState(false);


    useEffect(() => {
        getAllDurations()
            .then(({ data }) => {
                if (
                    data &&
                    data.status === "success" &&
                    data.data &&
                    data.data.length >= 0
                ) {
                    setAllDurationData(data.data);
                }
            })
        getAllSegments()
            .then(({ data }) => {
                if (
                    data &&
                    data.status === "success" &&
                    data.data &&
                    data.data.length >= 0
                ) {
                    setSegmentData(data.data);
                }
            })
    }, [])
    return (
        <>
            <div className="row" >
                <div className="col-6 ">
                    <div className="col-12 pt-1">
                        <div className="row mx-0 ">
                            <Chip label="SKU  BT-TRI2022" style={{ borderRadius: '8px', height: '42px' }} />

                        </div>
                    </div>
                    <div className="col-12">
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            error={errors.external_reference}
                            name="external_reference"
                            defaultValue={
                                defaultValue?.external_reference
                            }
                            render={({ field }) => (
                                <TextField
                                    className="mt-4"
                                    error={errors.external_reference}
                                    {...field}
                                    type="text"
                                    label={t("FormProduct.ExternalReference")}
                                    variant="outlined"
                                />
                            )}
                        />
                    </div>



                </div>

                <div className="col-6 my-auto ">
                    <div className="row pt-1">


                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="type"
                            defaultValue={defaultValue?.type}
                            render={({ field }) => (
                                <FormControl
                                    variant="outlined"
                                    error={errors.type ? true : false}
                                >
                                    <RadioGroup
                                        {...field}
                                        row
                                        name="type"
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                    >
                                        <FormControlLabel
                                            value="producto"
                                            control={<Radio color="primary" />}
                                            label="Producto"
                                        />
                                        <FormControlLabel
                                            value="servicio"
                                            control={<Radio color="primary" />}
                                            label="Servicio"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            )}
                        />
                    </div>
                    <div className="col-12">
                        <Controller
                            rules={{ required: true }}
                            defaultValue={defaultValue?.name}
                            control={control}
                            name="name"
                            error={errors.name}
                            render={({ field }) => (
                                <TextField
                                    className="mt-4"
                                    {...field}
                                    type="text"
                                    error={errors.name}
                                    label={t("FormProduct.ProductName")}
                                    variant="outlined"
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="col-12">
                    <Controller
                        rules={{ required: true }}
                        control={control}
                        name="service_agreements"
                        error={errors.service_agreements}
                        defaultValue={defaultValue?.service_agreements}
                        render={({ field }) => (
                            <TextField
                                className="mt-3"
                                {...field}
                                multiline
                                error={errors.service_agreements}
                                rows={6}
                                variant="outlined"
                                label={t("Acuerdo de servicios")}
                            />
                        )}
                    />
                </div>
                <div className="col-12">
                    <Controller
                        rules={{ required: true }}
                        control={control}
                        name="long_description"
                        error={errors.long_description}
                        defaultValue={defaultValue?.long_description}
                        render={({ field }) => (
                            <TextField
                                className="mt-3"
                                {...field}
                                error={errors.long_description}
                                multiline
                                rows={6}
                                variant="outlined"
                                label={t("Descripción")}
                            />
                        )}
                    />
                </div>
                <div className="col-6">
                    <div className="col-12">
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="slug"
                            error={errors.slug}
                            defaultValue={defaultValue?.slug}
                            render={({ field }) => (
                                <TextField
                                    className="mt-3"
                                    {...field}
                                    error={errors.slug}
                                    variant="outlined"
                                    label={t("Slug para URL")}
                                />
                            )}
                        />
                    </div>

                </div>
                <div className="col-6">
                    <div className="col-12">
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="short_description"
                            error={errors.short_description}
                            defaultValue={defaultValue?.product_details[0]?.short_description}
                            render={({ field }) => (
                                <TextField
                                    className="mt-3"
                                    {...field}
                                    error={errors.short_description}
                                    variant="outlined"
                                    label={t("DetailDescription.DescriptionShort")}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="col-12 ">
                    <CommonComponentAccordion
                        color="primary"
                        expanded={expandedForSale}
                        setExpanded={setExpandedForSale}
                        title_no_data={'Disponible para la venta'}
                        isSailAvailable={true}
                        form={
                            <FormSailAvailable
                                Controller={Controller}
                                control={control}
                                defaultValue={defaultValue}
                                userType={userType}
                                errors={errors}
                                getValues={getValues}
                                channels={channels}
                                organizations={organizations}
                                allDurationData={allDurationData}
                                segmentData={segmentData}
                            />
                        }
                    />
                </div>
                <div className="col-12 ">
                    <div className='row mx-0 py-2' style={{ borderBottom: '1px solid #ECECEB', }} >
                        <div className='col-6 px-0' style={{ textAlign: 'start', alignSelf: 'center' }}><Typography style={{ fontWeight: 'bold' }}>Disponible para compra </Typography> </div>
                        <div className='col-6  px-0' style={{ textAlign: 'end' }}>

                            <SwitchCustom
                                checked={''}
                                onChange={() => { }}
                                name="checkedB"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />

                        </div>
                    </div>
                </div>

                <div className="col-6 pt-2 mt-1">
                    <div className="col-12">
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="code_sales"
                            error={errors.code_sales}
                            defaultValue={defaultValue?.code_sales}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    error={errors.code_sales}
                                    variant="outlined"
                                    label='Cód. contable Ventas'
                                    defaultValue='---' />
                            )}
                        />
                    </div>
                    <div className="col-12 pt-2 mt-1">
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="code_purchase"
                            error={errors.code_purchase}
                            defaultValue={defaultValue?.code_purchase}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    error={errors.code_purchase}
                                    variant="outlined"
                                    label='Cód. contable Compra'
                                    defaultValue='---' />
                            )}
                        />
                    </div>
                    <div className="col-12 d-flex pt-2 mt-1">
                        <div className="row mx-0">
                            <Button
                                variant="contained"
                                color="#ECECEB"
                                onClick={() => {
                                    setModalStateCustom(true)
                                }}
                            >
                                <div className="col-11 p-2" style={{ textAlign: 'left' }}>Agenda personalizada</div>
                                <div className="col-1 pt-2"><ArrowForwardIosIcon fontSize="small" style={{ color: '#3C3C3B' }} /></div>

                            </Button>
                        </div>

                    </div>
                </div>
                <div className="col-6 pt-2 mt-1">
                    <div className="col-12">
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="export_accounting_code"
                            error={errors.export_accounting_code}
                            defaultValue={defaultValue?.export_accounting_code}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    error={errors.export_accounting_code}
                                    variant="outlined"
                                    label='Cód. contable de exportación'
                                    defaultValue='---' />
                            )}
                        />
                    </div>
                    <div className="col-12 pt-2 mt-1">
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="code_import_purchase"
                            error={errors.code_import_purchase}
                            defaultValue={defaultValue?.code_import_purchase}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    error={errors.code_import_purchase}
                                    variant="outlined"
                                    label='Cód. contable compra importación'
                                    defaultValue='---'
                                />
                            )}
                        />
                    </div>
                    <div className="col-12 d-flex pt-2 mt-1">
                        <div className="row mx-0">
                            <Button
                                variant="contained"
                                color="#ECECEB"
                                className={''}
                                onClick={() => {
                                    setModalStateProduct(true)
                                }}

                            >
                                <div className="col-11 p-2" style={{ textAlign: 'left' }}>Agenda de producto</div>
                                <div className="col-1 pt-2"><ArrowForwardIosIcon fontSize="small" style={{ color: '#3C3C3B' }} /></div>

                            </Button>
                        </div>

                    </div>

                </div>
                <div className="col-12 mt-3">
                    <div className="row mx-0">
                        <Button
                            variant="contained"
                            color="#ECECEB"
                            style={{ height: '135px' }}
                        >
                            <div className="row ">
                                <div className="col-12 "><IconUploadImageProduct /></div>
                                <div className="col-12 "> <Typography style={{ fontSize: '14px', color: '#9D9D9D' }}>Cargar imágenes</Typography> </div>

                            </div>

                        </Button>
                    </div>
                </div>
                <ShardComponentModal
                    fullWidth={true}
                    isOpen={modalStateCustom || modalStateProduct}
                    title={`${!!modalStateCustom ? 'Agenda Personalizada' : 'Agenda de producto'}`}
                    width="sm"
                    handleClose={() => !!modalStateCustom ? setModalStateCustom(!modalStateCustom) : setModalStateProduct(!modalStateProduct)}
                    viewButtonClose={true}
                    body={
                        <ModalNewProductInfo
                            modalCustom={modalStateCustom}
                            control={control}
                            error={errors.short_description}
                            defaultValue={defaultValue?.product_details[0]?.short_description}
                        />
                    }
                />

            </div>

        </>
    );
};

export default FirstStepForm;
