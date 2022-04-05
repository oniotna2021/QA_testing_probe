import React from 'react';


//Redux
import { connect } from 'react-redux';

//Route
import {
    useRouteMatch,
    Route, Link as RouterLink, Switch
} from 'react-router-dom';


// external dependencies
import clsx from 'clsx';

//UI
import Drawer from '@material-ui/core/Drawer';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';


//App Container
import {
    drawerStyles,
    ContentItems
} from 'containers/Config/index.styles';

import { ConfigProfessional } from 'utils/routes';

//Components
import Loading from 'components/Shared/Loading/Loading';
import NavigateBack from 'components/Shared/NavigateBack/NavigateBack';

const ModuleProfessionalContainer = ({ openDrawerPrimary }) => {

    const classes = drawerStyles();
    let { path, url } = useRouteMatch();

    return (
        <div className={classes.root}>
            <Drawer
                variant="permanent"
                anchor="left"
                open={true}
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: true,
                    [classes.drawerClose]: !openDrawerPrimary,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: true,
                        [classes.drawerClose]: !openDrawerPrimary,
                    })
                }}>

                <NavigateBack label={'Configuraciones'} path={'/config'} />
                <ContentItems style={{ overflowX: 'hidden'}}>
                    <List>
                        {ConfigProfessional.map(item => {
                            return (
                                <ListItem key={'link-' + item.path} button component={RouterLink} to={`${url}/${item.path}`}>
                                    <Tooltip title={true ? '' : item.title} placement="right">
                                        <ListItemIcon className={classes.iconMenu}>
                                        </ListItemIcon>
                                    </Tooltip>
                                    <ListItemText style={{ opacity: true ? 1 : 0 }} className={classes.listItemText} primary={item.title} />
                                </ListItem>
                            )
                        })}
                    </List>
                </ContentItems>
            </Drawer>
            <main className={clsx(classes.content, {
                [classes.contentShift]: true,
            })}>
                <main className={classes.container}>
                    <Switch>
                        <Route exact path={path} component={ConfigProfessional[0].component}>
                        </Route>
                        <React.Suspense fallback={<Loading />}>
                            {ConfigProfessional.map(route =>
                                <Route key={route.path} path={`${path}/${route.path}`} component={route.component} />
                            )}
                        </React.Suspense>
                    </Switch>

                </main>
            </main>
        </div>
    );
}



const mapStateToProps = ({ common }) => ({
    openDrawerPrimary: common.openDrawerPrimary
});


export default connect(
    mapStateToProps,
)(ModuleProfessionalContainer);
