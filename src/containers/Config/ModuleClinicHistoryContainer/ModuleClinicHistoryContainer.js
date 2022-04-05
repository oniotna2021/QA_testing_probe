import React from "react";

//Redux
import { connect } from "react-redux";

// ROUTE
import { useRouteMatch, Link as RouterLink } from "react-router-dom";

// external dependencies
import clsx from "clsx";

//UI
import Drawer from "@material-ui/core/Drawer";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

//App Container
import { drawerStyles, ContentItems } from "containers/Config/index.styles";

import { ConfigRootNameConfigClinicHistory } from "utils/routes";

//Components
import NavigateBack from "components/Shared/NavigateBack/NavigateBack";

// HOCS
import ActionSubmoduleWithPermission from "hocs/ActionSubmoduleWithPermission";
import RouterValidatePermissions from "router/RouterValidatePermissions";

const ModuleClinicHistoryContainer = ({
  openDrawerPrimary,
  routes,
  permissionsModule,
}) => {
  const classes = drawerStyles();
  let { url } = useRouteMatch();

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
          }),
        }}
      >
        <NavigateBack label={"Configuraciones"} path={"/config"} />
        <ContentItems
          style={{ overflowX: "hidden", maxHeight: "76vh", paddingBottom: 100 }}
        >
          <List>
            {ConfigRootNameConfigClinicHistory.map((menuItem) => (
              <ActionSubmoduleWithPermission
                permissions={permissionsModule}
                path={menuItem.path}
                key={menuItem.path}
              >
                <ListItem
                  key={"link-" + menuItem.path}
                  button
                  component={RouterLink}
                  to={`${url}/${menuItem.path}`}
                >
                  <Tooltip title={true ? "" : menuItem.title} placement="right">
                    <ListItemIcon className={classes.iconMenu}></ListItemIcon>
                  </Tooltip>
                  <ListItemText
                    style={{ opacity: true ? 1 : 0 }}
                    className={classes.listItemText}
                    primary={menuItem.title}
                  />
                </ListItem>
              </ActionSubmoduleWithPermission>
            ))}
          </List>
        </ContentItems>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: true,
        })}
      >
        <main className={classes.container}>
          <RouterValidatePermissions
            permissionsModule={permissionsModule}
            routes={routes}
          />
        </main>
      </main>
    </div>
  );
};

const mapStateToProps = ({ common }) => ({
  openDrawerPrimary: common.openDrawerPrimary,
});

export default connect(mapStateToProps)(ModuleClinicHistoryContainer);
