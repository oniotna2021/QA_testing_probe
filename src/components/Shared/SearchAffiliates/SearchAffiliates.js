import React, { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack';

//UI
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';

//Service
import { searchAfiliatesService } from 'services/affiliates';

// Utils
import { errorToast, mapErrors } from 'utils/misc';

const SearchAffiliates = ({ label, setValue }) => {

    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) setOptions([])
    }, [open]);

    const setFilterValue = (value) => {
        setLoading(true);
        if (value) {
            searchAfiliatesService(value)
                .then(({ data }) => {
                    if (data && data.data) {
                        setOptions(data.data)
                    }
                    setLoading(false);
                }).catch((err) => {
                    enqueueSnackbar(mapErrors(err), errorToast);
                })
        } else {
            setLoading(false);
        }
    }

    return (
        <Autocomplete
            id="asynchronous-affiliates"
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            onChange={(event, value) => {
                if (setValue) {
                    setValue(value)
                }
            }}
            getOptionLabel={(option) => `${option.document_number} - ${option.first_name} ${option.last_name}`}
            options={options}
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
    )
}

export default SearchAffiliates



