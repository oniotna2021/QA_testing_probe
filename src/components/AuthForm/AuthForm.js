import React from 'react';


//UI
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import {
    AuthFormContainer,
    AuthFormContent,
    AuthFormImage,
    Footer
} from './AuthForm.style';

export const AuthForm = ({ children, image, title, logo }) => (
    <React.Fragment>
        <AuthFormContainer>
            <AuthFormImage src={image} alt={title} />
            <AuthFormContent>
                <Box
                    style={{ height: '50vh' }}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center">
                    {logo && <img style={{ height: '77px', marginBottom: 60 }} src={logo} alt="Logo"></img>}
                    <Typography variant="h5" component="h1">
                        {title}
                    </Typography>
                    <div>
                        {children}
                    </div>
                </Box>
                <Footer>
                    <p>
                        Si olvidaste tus datos de ingreso, comunicate con el administrador
                        <br></br>
                        © 2021 BodyTech Corp., Todos los derechos reservados.
                    </p>
                </Footer>
            </AuthFormContent>
        </AuthFormContainer>
    </React.Fragment>

);