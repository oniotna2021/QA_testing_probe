import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';


//UI
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";


import { logIn } from 'modules/auth';
import { emailRegex } from 'utils/misc';

/**
 * Log in form component
 * @param {function} logIn log in function from the store
 * @param {boolean} isLoggingIn log in loader variable from the store
 * @param {function} handleLogin function to execute on login success
 */
const SignInForm = ({ logIn, isLoggingIn, onLogin }) => {
    const { t } = useTranslation();
    const [loadingLoginForm, setLoadingLoginForm] = useState(false);
    const [messageError, setMessageError] = useState('');
    const { handleSubmit, control, formState: { errors } } = useForm();

    // Add these variables to your component to track the state
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);


    const handleLoginError = (message) => {
        setMessageError(message);
        setLoadingLoginForm(false);
    };

    const onSubmit = (data) => {
        setLoadingLoginForm(true);
        logIn(data.email, data.password, onLogin, handleLoginError)
    };

    return (
        <Card elevation={0} style={{ margin: 20 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    <FormControl
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    >
                        <Controller
                            render={({ field }) =>
                                <TextField {...field}
                                    id="outlined-email"
                                    label={t('LogIn.email')}
                                    variant="outlined"
                                    onChange={(e) => { field.onChange(e.target.value.trim()) }}
                                />
                            }
                            control={control}
                            defaultValue=""
                            error={errors.email ? true : false}
                            name="email"
                            rules={{ required: true, pattern: emailRegex }}
                        />
                        <FormHelperText error={errors.email ? true : false}>{errors.email ? t('LogIn.emailError') : ''}</FormHelperText>
                    </FormControl>
                    <FormControl
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    >
                        <Controller
                            render={({ field }) =>
                                <TextField {...field}
                                    id="outlined-password"
                                    label={t('LogIn.password')}
                                    type={showPassword ? "text" : "password"} // <-- This is where the magic happens
                                    InputProps={{ // <-- This is where the toggle button is added.
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    variant="outlined"
                                    onChange={(e) => { field.onChange(e.target.value.trim()) }}
                                />
                            }
                            control={control}
                            defaultValue=""
                            error={errors.password ? true : false}
                            name="password"
                            rules={{ required: true }}
                        />
                        <FormHelperText error={errors.password ? true : false}>{errors.password ? t('LogIn.passwordError') : ''}</FormHelperText>
                    </FormControl>
                    {messageError && <Alert severity="error">{messageError}</Alert>}
                </CardContent>
                <CardActions style={{ justifyContent: 'center' }}>
                    <Button
                        color="black"
                        size="large"
                        className="btnLogin"
                        disabled={isLoggingIn}
                        type="submit"
                        variant="contained">
                        {loadingLoginForm ?
                            <CircularProgress
                                size={30}
                                color="secondary" /> :
                            t('LogIn.Btn')
                        }
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
};

const mapStateToProps = ({ auth }) => ({
    isLoggingIn: auth.isLoggingIn
});

const mapDispatchToProps = dispatch => bindActionCreators({ logIn }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignInForm);
