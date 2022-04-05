import React, { Fragment } from 'react';

//UI
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, withStyles } from '@material-ui/core/styles';


const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    fontWeight: 'bold',
    border: `1px solid ${theme.palette.background.paper}`,
    // background: theme.palette.black.main,
    marginLeft: '20px',
    marginBottom: '15px',
    fontSize: 14
  },
}))(Avatar);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    color: '#3C3C3B',
    background: '#F3F3F3',
    width: theme.spacing(3),
    height: theme.spacing(3),
  }
}));

const colors = {
  3: '#6295fa',
  5: '#e68859',
  6: '#89128d',
  7: '#6295fa',
  8: '#6295fa',
  9: '#6295fa',
  10: '#6295fa',
  11: '#6295fa',
}

const colorDefault = '#94c97a'

export default function ItemDoctor({ data, totalQuotes }) {

  const classes = useStyles();

  return (
    <Fragment>
      <Badge
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        badgeContent={<SmallAvatar style={{backgroundColor: `${colors[data.user_profiles_id] || colorDefault}`}}>{totalQuotes}</SmallAvatar>}
      >
        <Avatar src={data.photo} className={classes.small}>{`${data.first_name.charAt(0)}${data.last_name.charAt(0)}`}</Avatar>
      </Badge>
    </Fragment>
  );
}

