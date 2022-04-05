import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import slugify from "slugify";
import { useTranslation } from "react-i18next";
import { useTheme } from "@material-ui/core/styles";
import { connect } from "react-redux";

//UI
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";

//Components
import DropzoneImage from "components/Shared/DropzoneImage/DropzoneImage";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import ButtonModalForm from "components/Shared/ButtonModalForm/ButtonModalForm";
import { ShardComponentModal } from "components/Shared/Modal/Modal";

// Hooks
import useFetch from "hooks/useFetch";
import useAutocomplete from "hooks/useAutocomplete";

// Components Form
import {
  FormVenueSchedule,
  FormsVenueActivities,
  FormVenueLocation,
  FormVenueTurnsWorking,
} from "components/Common/ModuleConfigReservations/Venues/FormsVenue";

//Services
import { postVenue, putVenue } from "services/Reservations/venues";
import { getAllVenueCategory } from "services/Reservations/venuesCategory";
import { getCitiesByCountryCrud } from "services/MedicalSoftware/Countries";
import { getAllCompanies } from "services/GeneralConfig/Company";
import { getAllOrganizations } from "services/GeneralConfig/Organization";
import { getZoneByCityId } from "services/GeneralConfig/Zones";
import { getRegionsByCountryId } from "services/GeneralConfig/Regions";
import { getAllMarks } from "services/GeneralConfig/Marks";
import { getLocalityByCity } from "services/GeneralConfig/Localities";

//utils
import { successToast, errorToast, mapErrors, setFormData } from "utils/misc";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "xs",
};

const FormVenue = ({
  listCountries,
  isEdit,
  setIsEdit,
  dataItem,
  defaultValue,
  setExpanded,
  setLoad,
  files,
  setFiles,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [modalID, setModalId] = useState(0);
  const [idVenue, setIdVenue] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditForm, setIsEditSchedule] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [zones, setZones] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(
    dataItem?.id_country ? dataItem?.id_country : 0
  );
  const [idCity, setIdCity] = useState(defaultValue?.id_city || null);
  const [valueCity] = useAutocomplete(cities, idCity);

  const [dataCategories, setDataCategories] = useState([]);

  const [organizations] = useFetch(getAllOrganizations);
  const [companies] = useFetch(getAllCompanies);
  const [brands] = useFetch(getAllMarks);

  useEffect(() => {
    getAllVenueCategory()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.length > 0
        ) {
          setDataCategories(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar]);

  useEffect(() => {
    const listCities = (selectedCountry) => {
      getCitiesByCountryCrud(selectedCountry)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data.data.length > 0
          ) {
            setCities(data.data);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    };

    const listRegions = (selectedCountry) => {
      getRegionsByCountryId(selectedCountry)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data.data.length > 0
          ) {
            setRegions(data.data);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    };

    if (selectedCountry) {
      listCities(selectedCountry);
      listRegions(selectedCountry);
    }
  }, [selectedCountry, enqueueSnackbar]);

  useEffect(() => {
    const getList = (idCity) => {
      getLocalityByCity(idCity)
        .then(({ data }) => {
          if (data.status === "success") {
            setLocalities(data.data);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    };

    const getListZones = (idCity) => {
      getZoneByCityId(idCity)
        .then(({ data }) => {
          if (data.status === "success") {
            setZones(data.data);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    };

    if (idCity) {
      getList(idCity);
      getListZones(idCity);
    }
  }, [enqueueSnackbar, idCity]);

  useEffect(() => {
    if (dataItem) {
      if (Object.keys(dataItem).length !== 0) {
        setIsCreated(true);
        setIdVenue(dataItem?.id);
      }
    }
  }, [dataItem]);

  const onSubmit = (data) => {
    if (idVenue && !isEdit) {
      setExpanded(false);
      setLoad(true);
      return;
    }

    let dataForm = {
      ...data,
      neighborhood: null,
      manager_name: null,
      email: null,
      video_url: null,
      name: data.name,
      phone_number: data.phone_number,
      image: files[0] ? files[0] : null,
      check_capacity: 1,
      capacity: Number(data.capacity),
    };

    setLoadingFetch(true);
    const functionCall = isEdit ? putVenue : postVenue;
    functionCall(setFormData(dataForm), dataItem?.uuid)
      .then(({ data }) => {
        if (data && data.status === "success") {
          setIsCreated(true);
          setIdVenue(data.data.id);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          if (isEdit) {
            setExpanded(false);
            setLoad(true);
          }
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
        setLoadingFetch(false);
      });
  };

  const handleClickModal = (id) => {
    setIsEditSchedule(isEdit);
    setIsOpen(true);
    setModalId(id);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setModalId(0);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div class="row">
            {!isEdit && (
              <div class="col-2 d-flex align-items-start">
                <DropzoneImage files={files} setFiles={setFiles} />
              </div>
            )}

            <div className="col justify-content-center p-0">
              <div className="row row-cols-2">
                <div className="col">
                  <div>
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="name"
                      defaultValue={defaultValue?.name}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <TextField
                            {...field}
                            fullWidth
                            id={slugify("name", { lower: true })}
                            type="text"
                            label={t("ListVenues.InputName")}
                            rows={1}
                            variant="outlined"
                          />
                          {errors.name && (
                            <FormHelperText error>
                              Campo requerido
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <div className="d-flex">
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="id_country"
                        defaultValue={defaultValue?.id_country}
                        render={({ field }) => (
                          <FormControl variant="outlined" className="me-2">
                            <InputLabel>
                              {t("ListVenues.InputCountry")}
                            </InputLabel>
                            <Select
                              {...field}
                              fullWidth
                              id={slugify("id_country", { lower: true })}
                              label={t("ListVenues.InputCountry")}
                              variant="outlined"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setSelectedCountry(e.target.value);
                              }}
                            >
                              {listCountries &&
                                listCountries.map((country) => (
                                  <MenuItem value={country.id} key={country.id}>
                                    {country.name}
                                  </MenuItem>
                                ))}
                            </Select>
                            {errors.id_country && (
                              <FormHelperText error>
                                Campo requerido
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />

                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="id_city"
                        defaultValue={defaultValue?.id_city}
                        render={({ field }) => (
                          <FormControl variant="outlined">
                            <Autocomplete
                              {...field}
                              placeholder={t("FormZones.City")}
                              value={valueCity}
                              onChange={(_, value) => {
                                field.onChange(value.id);
                                setIdCity(value.id);
                              }}
                              disableClearable={true}
                              getOptionLabel={(option) => `${option.name}`}
                              getOptionSelected={(option, value) =>
                                Number(value) === option.id
                              }
                              aria-label="seleccionar ciudad"
                              id="controllable-select-venue"
                              options={cities}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label={t("FormZones.City")}
                                  variant="outlined"
                                />
                              )}
                            />
                            {errors.id_city && (
                              <FormHelperText error>
                                Campo requerido
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="address"
                      defaultValue={defaultValue?.address}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <TextField
                            {...field}
                            fullWidth
                            id={slugify("address", { lower: true })}
                            type="text"
                            label={t("DetailVenue.Address")}
                            rows={1}
                            variant="outlined"
                          />
                          {errors.name && (
                            <FormHelperText error>
                              Campo requerido
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="organization_id"
                      defaultValue={defaultValue?.organization_id}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel>
                            {t("FormProfessional.InputOrganization")}
                          </InputLabel>
                          <Select
                            {...field}
                            fullWidth
                            id={slugify("organization_id", { lower: true })}
                            label={t("FormProfessional.InputOrganization")}
                            variant="outlined"
                          >
                            {organizations &&
                              organizations.map((city) => (
                                <MenuItem value={city.id} key={city.id}>
                                  {city.name}
                                </MenuItem>
                              ))}
                          </Select>
                          {errors.organization_id && (
                            <FormHelperText error>
                              Campo requerido
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="brand_id"
                      defaultValue={defaultValue?.brand_id}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel>
                            {t("FormProfessional.InputBrand")}
                          </InputLabel>
                          <Select
                            {...field}
                            fullWidth
                            id={slugify("brand_id", { lower: true })}
                            label={t("FormProfessional.InputBrand")}
                            variant="outlined"
                          >
                            {brands &&
                              brands.map((brand) => (
                                <MenuItem value={brand.id} key={brand.id}>
                                  {brand.name}
                                </MenuItem>
                              ))}
                          </Select>
                          {errors.brand_id && (
                            <FormHelperText error>
                              Campo requerido
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="zone_id"
                      defaultValue={defaultValue?.zone_id}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel>
                            {t("FormProfessional.InputZone")}
                          </InputLabel>
                          <Select
                            {...field}
                            fullWidth
                            id={slugify("zone_id", { lower: true })}
                            label={t("FormProfessional.InputZone")}
                            variant="outlined"
                          >
                            {zones &&
                              zones.map((city) => (
                                <MenuItem value={city.id} key={city.id}>
                                  {city.name}
                                </MenuItem>
                              ))}
                          </Select>
                          {errors.zone_id && (
                            <FormHelperText error>
                              Campo requerido
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="phone_number"
                      defaultValue={defaultValue?.phone_number}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <TextField
                            {...field}
                            fullWidth
                            id={slugify("phone_number", { lower: true })}
                            type="number"
                            label={t("ListVenues.InputTelephone")}
                            rows={1}
                            variant="outlined"
                          />
                          {errors.name && (
                            <FormHelperText error>
                              Campo requerido
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>

                {/* COL 6 */}
                <div className="col">
                  <div>
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="id_category"
                      defaultValue={defaultValue?.id_category}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel>{t("EditPriceForm.Category")}</InputLabel>
                          <Select
                            {...field}
                            fullWidth
                            id={slugify("id_category", { lower: true })}
                            label={t("EditPriceForm.Category")}
                            variant="outlined"
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}
                          >
                            {dataCategories &&
                              dataCategories.map((category) => (
                                <MenuItem
                                  value={`${category.id}`}
                                  key={category.id}
                                >
                                  {category.name}
                                </MenuItem>
                              ))}
                          </Select>
                          {errors.type_activity_id && (
                            <FormHelperText error>
                              Campo requerido
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                    {errors.id_category && (
                      <FormHelperText error>Campo requerido</FormHelperText>
                    )}
                  </div>

                  <div className="mt-4"></div>

                  <div className="d-flex justify-content-between mt-4">
                    <div className="me-2">
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="latitude"
                        defaultValue={defaultValue?.latitude}
                        render={({ field }) => (
                          <FormControl variant="outlined">
                            <TextField
                              {...field}
                              fullWidth
                              id={slugify("latitude", { lower: true })}
                              type="number"
                              label={t("ListVenues.InputLongitude")}
                              rows={1}
                              variant="outlined"
                            />
                            {errors.latitude && (
                              <FormHelperText error>
                                Campo requerido
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </div>

                    <div className="">
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="longitude"
                        defaultValue={defaultValue?.longitude}
                        render={({ field }) => (
                          <FormControl variant="outlined">
                            <TextField
                              {...field}
                              fullWidth
                              id={slugify("longitude", { lower: true })}
                              type="number"
                              label={t("ListVenues.InputLatitude")}
                              rows={1}
                              variant="outlined"
                            />
                            {errors.longitude && (
                              <FormHelperText error>
                                Campo requerido
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="company_id"
                      defaultValue={defaultValue?.company_id}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel>{t("EditPriceForm.Company")}</InputLabel>
                          <Select
                            {...field}
                            fullWidth
                            id={slugify("company_id", { lower: true })}
                            label={t("EditPriceForm.Company")}
                            variant="outlined"
                          >
                            {companies &&
                              companies.map((city) => (
                                <MenuItem value={city.id} key={city.id}>
                                  {city.name}
                                </MenuItem>
                              ))}
                          </Select>
                          {errors.company_id && (
                            <FormHelperText error>
                              Campo requerido
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="region_id"
                      defaultValue={defaultValue?.region_id}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel>
                            {t("FormProfessional.InputRegion")}
                          </InputLabel>
                          <Select
                            {...field}
                            fullWidth
                            id={slugify("region_id", { lower: true })}
                            label={t("FormProfessional.InputRegion")}
                            variant="outlined"
                          >
                            {regions &&
                              regions.map((region) => (
                                <MenuItem value={region.id} key={region.id}>
                                  {region.name}
                                </MenuItem>
                              ))}
                          </Select>
                          {errors.region_id && (
                            <FormHelperText error>
                              Campo requerido
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <Controller
                      control={control}
                      name="enabling_code"
                      defaultValue={defaultValue?.enabling_code}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <TextField
                            {...field}
                            fullWidth
                            id={slugify("enabling_code", { lower: true })}
                            type="text"
                            label={t("ListVenues.InputEnablingCode")}
                            rows={1}
                            variant="outlined"
                          />
                          {errors.enabling_code && (
                            <FormHelperText error>
                              Campo requerido
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="locality_id"
                      defaultValue={defaultValue?.locality_id}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel>
                            {t("FormVenue.SelectLocality")}
                          </InputLabel>
                          <Select
                            {...field}
                            fullWidth
                            id={slugify("locality_id", { lower: true })}
                            label={t("FormVenue.SelectLocality")}
                            variant="outlined"
                          >
                            {localities &&
                              localities.map((locality) => (
                                <MenuItem value={locality.id} key={locality.id}>
                                  {locality.name}
                                </MenuItem>
                              ))}
                          </Select>
                          {errors.company_id && (
                            <FormHelperText error>
                              Campo requerido
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </div>

                  <div className={"mt-4"}>
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="capacity"
                      defaultValue={defaultValue?.capacity}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <TextField
                            {...field}
                            fullWidth
                            id={slugify("capacity", { lower: true })}
                            type="number"
                            label={t("ListVenues.InputCapacity")}
                            rows={1}
                            variant="outlined"
                            inputProps={{
                              min: 1,
                            }}
                          />
                          {errors.capacity && (
                            <FormHelperText error>
                              Campo requerido
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </div>

              {isCreated && (
                <div className="row row-cols-2">
                  <div className="col">
                    <ButtonModalForm
                      color={theme.palette.black.light}
                      isEdit={isEdit}
                      idM={1}
                      onClick={handleClickModal}
                      title={t("ListVenues.InputCreateVenueSchedule")}
                    />
                  </div>

                  <div className="col">
                    <ButtonModalForm
                      color={theme.palette.black.light}
                      isEdit={isEdit}
                      idM={3}
                      onClick={handleClickModal}
                      title={t("ListVenues.InputCreateVenueTurnsWorking")}
                    />
                  </div>

                  <div className="col">
                    <ButtonModalForm
                      color={theme.palette.black.light}
                      isEdit={isEdit}
                      idM={2}
                      onClick={handleClickModal}
                      title={t("ListVenues.InputCreateVenueLocation")}
                    />
                  </div>

                  <div className="col">
                    <ButtonModalForm
                      color={theme.palette.black.light}
                      isEdit={isEdit}
                      idM={4}
                      onClick={handleClickModal}
                      title={t("ListVenues.InputSelectActivities")}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end mt-3">
              <ButtonSave text={t("Btn.save")} loader={loadingFetch} />
            </div>
          </div>
        </div>
      </form>

      {modalID === 1 && (
        <ShardComponentModal
          {...modalProps}
          body={
            <FormVenueSchedule
              idVenue={idVenue}
              isEdit={isEditForm}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
          handleClose={handleCloseModal}
          title={t("ListVenues.InputCreateVenueSchedule")}
        />
      )}
      {modalID === 2 && (
        <ShardComponentModal
          {...modalProps}
          body={
            <FormVenueLocation
              idVenue={idVenue}
              isEdit={false}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
          handleClose={handleCloseModal}
          title={t("ListVenues.InputCreateVenueLocation")}
        />
      )}
      {modalID === 3 && (
        <ShardComponentModal
          {...modalProps}
          body={
            <FormVenueTurnsWorking
              idVenue={idVenue}
              isEdit={false}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
          handleClose={handleCloseModal}
          title={t("ListVenues.InputCreateVenueTurnsWorking")}
        />
      )}
      {modalID === 4 && (
        <ShardComponentModal
          {...modalProps}
          body={
            <FormsVenueActivities
              idVenue={idVenue}
              isEdit={false}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
          handleClose={handleCloseModal}
          title={t("ListVenues.InputSelectActivities")}
        />
      )}
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  listCountries: global.countries,
});

export default connect(mapStateToProps)(FormVenue);
