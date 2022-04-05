import React, { useEffect, useState } from 'react'

// styles
import { useStyles } from "utils/useStyles";

// ui
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

// components
import MapAddress from './MapAddress';
import Button from "@material-ui/core/Button";

//Services
import { getVenuesForNear } from 'services/utils';

//Hooks
import useDebounce from 'hooks/useDebounce';

const FormAddress = ({ venueActive, setVenueActive, currentCityId, t, handlerClose }) => {
    const classes = useStyles();

    const [searchAddressInput, setSearchAddressInput] = useState('');
    const debouncedFilter = useDebounce(searchAddressInput, 500);
    const [optionsVenues, setOptionsVenues] = useState([]);

    useEffect(() => {
        if (debouncedFilter && currentCityId) {
            getVenuesForNear({
                "city_id": currentCityId,
                "address": debouncedFilter
            }).then(({ data }) => {
                if (data && data.data) {
                    setOptionsVenues(data.data);
                }
            })
        }
    }, [currentCityId, debouncedFilter])

    return (
        <div>
            <div className="mb-4">
                <p className="m-0">
                    Ingresa la dirección y selecciona la sede mas cercana.
                </p>
            </div>
            <FormControl variant="outlined">
                <TextField
                    fullWidth
                    value={searchAddressInput}
                    onChange={(e) => setSearchAddressInput(e.target.value)}
                    type="text"
                    label={"Ingresar dirección"}
                    variant="outlined"
                />
            </FormControl>
            <div className="my-2">
                <h3>Sedes cercanas</h3>
                <MapAddress points={optionsVenues} />
                <div className="d-flex justify-content-between mt-3">

                    {optionsVenues.map(item => {
                        return <div
                            className={`d-flex align-items-center cursor ${venueActive?.id === item.id
                                ? classes.cardsMapAvenueActive
                                : classes.cardsMapAvenue}`}
                            onClick={() => setVenueActive(item)}
                        >
                            <div className="mx-3">
                                <b className="m-0">{item.name}</b>
                                <p className="m-0">{item.category}</p>
                            </div>
                        </div>
                    })}
                </div>

                <div className="row">
                    <div className="col-6 mt-4">
                        <Button
                            onClick={() => handlerClose()}
                            fullWidth
                        >
                            {t("Btn.Cancel")}
                        </Button>
                    </div>
                    <div className="col-6 mt-4 d-flex justify-content-end">
                        <Button onClick={() => handlerClose()} className={classes.buttonMapSave}>
                            Guardar
                        </Button>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default FormAddress