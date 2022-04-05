import React from 'react';

import { useTranslation } from 'react-i18next';

import { AuthForm } from 'components/AuthForm/AuthForm';
import SignInForm from 'components/SignInForm/SignInForm';

import signInImg from 'assets/images/default/login-01.jpg';
import Logos from 'assets/icons/allogosmybodytech.svg';

const LoginPage = () => {
    const { t } = useTranslation();
    const handleLogin = () => {
        console.log("login")
    };

    return (
        <AuthForm
            isLogin={true}
            image={signInImg}
            title={t('LogIn.title')}
            logo={Logos}
        >
            <SignInForm onLogin={handleLogin} />
        </AuthForm>
    );
}


export default LoginPage;