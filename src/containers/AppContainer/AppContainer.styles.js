import styled from "@emotion/styled";
import Toolbar from "@material-ui/core/Toolbar";
import ListItem from "@material-ui/core/ListItem";

import { makeStyles } from "@material-ui/core/styles";
import { colors } from "../../utils/colors";

const drawerWidth = 240;

export const drawerStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    animation: "fadein 0.5s",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    border: "none !important",
    backgroundColor: colors.bgPrimary,
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  contentNotifications: {
    margin: "20px 40px",
    justifyContent: "center",
    display: "flex",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 18px",
    margin: "40px auto",
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    minHeight: "48px",
    justifyContent: "space-between",
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  iconMenu: {
    minWidth: 35,
    marginLeft: 20,
  },
  activeItem: {
    color: "#45C4AA",
  },
  listItem: {
    "& span": {
      color: "inherit",
    },
  },
  nested: {
    textDecoration: "none",
    paddingLeft: theme.spacing(4),
  },
  nameStore: {
    color: "#53627C",
    "& span": {
      marginLeft: "-3px",
    },
  },
  container: {
    marginTop: 67,
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(3),
    },
    borderRadius: "40px 0px 0px 40px",
    background: "#F9F9F9",
    minHeight: "100vh",
  },
  fullContainer: {
    marginTop: 67,
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(1),
    },
    background: "#F9F9F9",
    minHeight: "900px",
  },
  titleSubheader: {
    fontFamily: "Bariol",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 18,
    color: "#53627C",
    transition: "0.5s",
  },
  listItemText: {
    color: colors.bgCounter,
    minWidth: "230px",
    fontWeight: 500,
    lineHeight: 21,
    transition: "0.5s",
  },
  inactiveForPay: {
    opacity: 0.5,
    pointerEvents: "none",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    borderRight: 0,
    overflowX: "hidden",
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    border: "none !important",
    [theme.breakpoints.up("sm")]: {
      width: "100px",
    },
    MuiListSubheader: {
      display: "none",
    },
  },
  headerActions: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "start",
      flexDirection: "row",
    },
  },
}));

export const UserMenu = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  .email {
    margin-right: 1rem;
  }

  &:hover {
    scale: 1.1;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 1rem;
`;

export const NotificationIcon = styled.img`
  height: 22px;
  margin-right: 2rem;
  margin-left: 1rem;
  margin-top: 10px;
`;

export const ImgIconOvalo = styled.img`
  height: 22px;
  margin-right: 14px;
  margin-left: -17px;
  z-index: 99;
  margin-top: -6px;
`;

export const InfoNotification = styled.div`
  position: sticky;
  background: #fcf3ea;
  min-height: 65px;
  ${(props) =>
    props.isTabletOrMobile ? "margin-top: 59px" : "margin-top: 61px"};
  padding: 25px;
`;

export const ContentItems = styled.div`
  overflow: auto;
  max-height: calc(100% - 130px);
`;

export const FooterBar = styled.div`
  position: absolute;
  background: white;
  bottom: 10px;
  width: 100%;
`;

export const TopBar = styled(Toolbar)`
  background-color: white;
  color: black;
`;

export const active = styled(ListItem)`
  background-color: red;
`;
