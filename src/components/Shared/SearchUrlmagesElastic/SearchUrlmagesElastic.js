import React, { useState, useEffect } from 'react'

//UI
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';



//Service
import { searchElastic } from 'services/_elastic';



const SearchUrlmagesElastic = ({ label, defaultValue, setValue }) => {

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (defaultValue) setFilterValue(defaultValue.name)
    }, [defaultValue]);

    const setFilterValue = (value) => {
        setLoading(true);
        if (value) {
            searchElastic('exercises_images',
                {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "multi_match": {
                                        "query": value,
                                        "fields": [
                                            "name"
                                        ],
                                        "fuzziness": "1"
                                    }
                                }
                            ]
                        }
                    }
                }
            ).then(({ data }) => {
                if (data && data.data) {
                    setOptions(data.data.hits.hits.map(x => x._source));
                }
                setLoading(false);
            }).catch((err) => {
            })
        } else {
            setLoading(false);
        }
    }



    return (
        <React.Fragment>

            <Autocomplete
                id="asynchronous-url-videos"
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                onChange={(event, value) => {
                    if (setValue && value) {
                        setFilterValue(value.name);
                        setValue(value.name)
                    }
                }}
                defaultValue={defaultValue}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => `${option.name}`}
                options={options}
                renderOption={(option) => (
                    <React.Fragment>
                        <div className="d-flex">
                            <img style={{ objectFit: 'cover', height: 50, width: 50, verticalAlign: 'midle', marginRight: 10 }} src={process.env.REACT_APP_IMAGES_EXERCICES + option.name} alt="elastic" />
                            <p>
                                {option.name}
                            </p>
                        </div>
                    </React.Fragment>
                )}
                onInputChange={(event, value, reason) => {
                    if (reason === 'input') {
                        setFilterValue(value);
                    }
                }}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} style={{ position: 'absolute', right: '11px' }} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
        </React.Fragment>

    )
}

export default React.memo(SearchUrlmagesElastic)



