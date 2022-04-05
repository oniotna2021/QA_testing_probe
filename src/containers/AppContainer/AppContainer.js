import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@material-ui/core/styles";

//Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

//Route
import { useHistory, NavLink as RouterLink } from "react-router-dom";

// external dependencies
import clsx from "clsx";

//UI
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

//Icons
import {
  IconProfile,
  IconConfig,
  IconTraining,
  IconCalendar,
  IconMonthCalendar,
  IconQuotations,
  IconPromotions,
  IconNotificationHeader,
  IconOvalo,
  IconHome,
  IconConfigReservations,
  IconMenuCollaborators,
  IconRecipes,
  IconDiaryGeneral,
  IconConfigProducts,
  IconMedical,
  IconCalendarJourney,
  IconDashboardJourney,
} from "assets/icons/customize/config";

//App Container
import {
  drawerStyles,
  TopBar,
  ContentItems,
  FooterBar,
  Actions,
} from "./AppContainer.styles";

//internal dependencies
import AvatarUser from "components/Shared/AvatarUser/AvatarUser";
import { setOpenDrawerPrimary, setDataReusable } from "modules/common";
import { logOut, changeVenueDefault } from "modules/auth";

//Hooks
import { useFecthDataRecursibe } from "hooks/fetchDataSelect";

// HOCS
import ActionWithPermissions from "hocs/ActionWithPermissions";

//Routes
import { ConfigNameRoutes } from "router/constants";

//Components
import SelectedMenu from "components/Common/AppContainer/SelectedMenu";
import SelectedMenuBrand from "components/Common/AppContainer/SelectedMenuBrand";
import LogoDynamic from "components/Shared/LogoDynamic/LogoDynamic";
import MenuUsersRol from "components/Common/AppContainer/MenuUsersRol";
import CheckIsVirtualUser from "components/Common/AppContainer/CheckIsVirtualUser";

// String version App
import versionApp from "versionApp";

const AppContainer = ({
  userEmail,
  listVenues,
  currentIdVenue,
  userType,
  openDrawerPrimary,
  setOpenDrawerPrimary,
  setDataReusable,
  logOut,
  changeVenueDefault,
  venueName,
  children,
  routes,
}) => {
  const theme = useTheme();
  const classes = drawerStyles();
  const { t } = useTranslation();
  const history = useHistory();
  // State variables
  const [anchorEl, setanchorEl] = useState(null);

  //Seto de estados globales
  setDataReusable(useFecthDataRecursibe());

  useEffect(() => {
    toggleDrawer();
  }, [userType]);

  //Menu user
  const handleUserMenuClick = (event) => setanchorEl(event.currentTarget);
  const handleClose = () => setanchorEl(null);

  const currentPathName =
    history.location.pathname.slice(
      0,
      history.location.pathname.lastIndexOf("/")
    ) || history.location.pathname;

  const goPageMenuBar = (value) => {
    switch (value) {
      case "config":
        history.push(ConfigNameRoutes.config);
        break;

      case "help":
        break;

      default:
        break;
    }
  };

  const logoutAndGoHome = () => {
    logOut();
    history.push("/auth/login");
  };

  const toggleDrawer = () => {
    setOpenDrawerPrimary(userType === 6 ? false : !openDrawerPrimary);
  };

  const handleChangeVenue = (option) => {
    changeVenueDefault({
      venueNameDefaultProfile: option.name,
      venueIdDefaultProfile: option.id,
      venueCityIdDefault: option.city_id,
      venueCityNameDefault: option.city_name,
      venueCountryIdDefault: option.country_id ? option.country_id : 1,
    });
  };

  const isVirtualUser =
    Number(userType) === 25 ||
    Number(userType) === 29 ||
    Number(userType) === 30;

  const dataMenu = [
    {
      name: t("Home.Title"),
      url: ConfigNameRoutes.homeTraining,
      icon: <IconHome color={theme.palette.primary.light} />,
      isPublic: true,
    },
    {
      name: t("Affiliates.Title"),
      url: ConfigNameRoutes.afiliates,
      icon: <IconProfile color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Affiliates.Title"),
      url: ConfigNameRoutes.virtualAfiliates,
      icon: <IconProfile color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.Quotes"),
      url: ConfigNameRoutes.quotes,
      icon: <IconCalendar color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.ModuleNutrition"),
      url: ConfigNameRoutes.recipes,
      icon: <IconRecipes color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.Training"),
      url: ConfigNameRoutes.manageTraining,
      icon: <IconTraining color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.Reservations"),
      url: ConfigNameRoutes.configReservations,
      icon: <IconConfigReservations color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.Products"),
      url: ConfigNameRoutes.products,
      icon: <IconConfigProducts color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.ConfigProducts"),
      url: ConfigNameRoutes.configProducts,
      icon: <IconConfig color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.Collaborators"),
      url: ConfigNameRoutes.collaborators,
      icon: <IconMenuCollaborators color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.Locations"),
      url: ConfigNameRoutes.locations,
      icon: <IconConfigReservations color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.DiaryGeneral"),
      url: ConfigNameRoutes.diaryGeneral,
      icon: <IconDiaryGeneral color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("ListActivities.Container"),
      url: ConfigNameRoutes.activitiesCalendar,
      icon: <IconMonthCalendar color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("ListQuotations.Title"),
      url: ConfigNameRoutes.quotation,
      icon: <IconQuotations color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.Promotions"),
      url: ConfigNameRoutes.promotions,
      icon: <IconPromotions color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.Carterization"),
      url: ConfigNameRoutes.carterization,
      icon: <IconPromotions color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.Reports"),
      url: ConfigNameRoutes.reports,
      icon: <IconMedical color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.Calendar"),
      url: ConfigNameRoutes.calendarJourney,
      icon: <IconCalendarJourney color={theme.palette.primary.light} />,
      isPublic: false,
    },
    {
      name: t("Menu.Title.Dashboard"),
      url: ConfigNameRoutes.dashboardJourney,
      icon: <IconDashboardJourney color={theme.palette.primary.light} />,
      isPublic: false,
      style: { marginLeft: 15 },
    },
    {
      name: t("Menu.Title.Agents"),
      url: ConfigNameRoutes.agents,
      icon: <IconDashboardJourney color={theme.palette.primary.light} />,
      isPublic: false,
      style: { marginLeft: 15 },
    },
    {
      name: t("Menu.Title.Tickets"),
      url: ConfigNameRoutes.tickets,
      icon: <IconDashboardJourney color={theme.palette.primary.light} />,
      isPublic: false,
      style: { marginLeft: 15 },
    },
    {
      name: "Carterizados",
      url: ConfigNameRoutes.partnersJourney,
      icon: <IconProfile color={theme.palette.primary.light} />,
      isPublic: false,
      style: { marginLeft: 20 },
    },
  ];

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        elevation={0}
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openDrawerPrimary,
        })}
        style={{
          paddingLeft: openDrawerPrimary ? 0 : "100px",
          paddingBottom: 0,
          paddingTop: 0,
          border: "none !important",
        }}
      >
        <TopBar color="transparent" style={{ justifyContent: "space-between" }}>
          <div className={clsx(classes.headerActions)}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              style={{ marginRight: 16 }}
              className={clsx(classes.menuButton)}
            >
              <MenuIcon
                style={{
                  color: isVirtualUser ? "#007771" : "black",
                }}
              />
            </IconButton>
            {/* <Typography
              component="h1"
              variant="h6"
              style={{ color: theme.palette.primary.light }}
              noWrap
            >
              {t("Home.Title")}
            </Typography> */}
          </div>

          <Actions>
            <div className="me-2">
              <SelectedMenuBrand
                options={listVenues || []}
                value={currentIdVenue}
                defaultValue={currentIdVenue}
                handleChangeVenue={handleChangeVenue}
                inputValue={venueName}
              />
            </div>
            <CheckIsVirtualUser />

            {listVenues && listVenues.length !== 0 && (
              <SelectedMenu
                options={listVenues || []}
                value={currentIdVenue}
                defaultValue={currentIdVenue}
                handleChangeVenue={handleChangeVenue}
                inputValue={venueName}
              />
            )}

            <div className={classes.contentNotifications}>
              <IconNotificationHeader color={theme.palette.primary.light} />
              <IconOvalo color={theme.palette.black.light} />
            </div>

            {userType === 1 && (
              <MenuUsersRol colorIcon={theme.palette.primary.light} />
            )}

            <AvatarUser
              handleUserMenuClick={handleUserMenuClick}
              anchorEl={anchorEl}
              userEmail={userEmail}
            />

            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              style={{ top: 55 }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {/* {[1, 4, 3, 7, 8, 9, 10].some((p) => p === userType) && (
                <MenuItem onClick={() => goPageMenuBar("config")}>
                  {t("Menu.Title.Config")}
                </MenuItem>
              )} */}
              <MenuItem onClick={() => goPageMenuBar("help")}>
                {t("Menu.help")}
              </MenuItem>
              <MenuItem onClick={logoutAndGoHome}>{t("Logout")}</MenuItem>
            </Menu>
          </Actions>
        </TopBar>
      </AppBar>
      <Drawer
        variant="permanent"
        anchor="left"
        open={openDrawerPrimary}
        className={clsx(classes.openDrawerPrimary, {
          [classes.drawerOpen]: openDrawerPrimary,
          [classes.drawerClose]: !openDrawerPrimary,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: openDrawerPrimary,
            [classes.drawerClose]: !openDrawerPrimary,
          }),
        }}
      >
        <div className={classes.drawerHeader}>
          <LogoDynamic
            userType={userType}
            openDrawerPrimary={openDrawerPrimary}
          />
        </div>

        <ContentItems style={{ overflowX: "hidden" }}>
          {/* TODO */}

          <List>
            {routes &&
              dataMenu.map((menuItem, idx) => (
                <ActionWithPermissions
                  permissions={routes}
                  path={menuItem.url}
                  isPublic={menuItem.isPublic}
                  key={idx}
                >
                  <ListItem
                    button
                    component={RouterLink}
                    to={menuItem.url}
                    exact={menuItem.url === "/" ? true : false}
                    activeStyle={{
                      borderRight: `3px solid ${theme.palette.primary.light}`,
                    }}
                  >
                    <Tooltip
                      title={openDrawerPrimary ? "" : menuItem.name}
                      placement="right"
                    >
                      <ListItemIcon
                        style={menuItem.style}
                        className={classes.iconMenu}
                      >
                        {menuItem.icon}
                      </ListItemIcon>
                    </Tooltip>
                    <ListItemText
                      style={{ opacity: openDrawerPrimary ? 1 : 0 }}
                      className={classes.listItemText}
                      primary={menuItem.name}
                    />
                  </ListItem>
                </ActionWithPermissions>
              ))}
          </List>
        </ContentItems>

        <FooterBar>
          <Typography style={{ fontSize: 10, textAlign: "center" }}>
            Versión: {versionApp}
          </Typography>

          {routes && (
            <ActionWithPermissions
              permissions={routes}
              path={"/config"}
              isPublic={false}
              key={"/config"}
            >
              <ListItem
                button
                component={RouterLink}
                to={ConfigNameRoutes.config}
                className={classes.listItem}
                exact={true}
                activeStyle={{
                  borderRight: `3px solid ${theme.palette.primary.light}`,
                }}
                style={{ textDecoration: "none" }}
              >
                <Tooltip
                  title={openDrawerPrimary ? "" : t("Menu.Title.Config")}
                  placement="right"
                >
                  <ListItemIcon className={classes.iconMenu}>
                    <IconConfig color={theme.palette.primary.light} />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  style={{ opacity: openDrawerPrimary ? 1 : 0 }}
                  className={classes.listItemText}
                  primary={t("Menu.Title.Config")}
                />
              </ListItem>
            </ActionWithPermissions>
          )}
        </FooterBar>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: openDrawerPrimary,
        })}
      >
        <main
          className={
            currentPathName !== "/tickets"
              ? classes.container
              : classes.fullContainer
          }
        >
          <div
            className={`${
              currentPathName !== "/create-session" ? "container" : ""
            }`}
          >
            {children}
          </div>
        </main>
      </main>
    </div>
  );
};

const mapStateToProps = ({ auth, common }) => ({
  isLoggingOut: auth.isUserAuthenticated,
  userEmail: auth.userEmail,
  venueName: auth.venueNameDefaultProfile,
  userType: auth.userType,
  listVenues: auth.venuesProfile,
  currentIdVenue: auth.venueIdDefaultProfile,
  colorTheme: common.colorTheme,
  openDrawerPrimary: common.openDrawerPrimary,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setOpenDrawerPrimary,
      setDataReusable,
      logOut,
      changeVenueDefault,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
