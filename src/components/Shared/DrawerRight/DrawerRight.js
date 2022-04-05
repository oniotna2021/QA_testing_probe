import React from 'react'


//Utils
import { colors } from 'utils/colors';

//UI
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';



export const ShardComponentDrawerRight = ({ body, isOpen, onClose, type, width = 450 }) => {

  return (
    <React.Fragment key={'right'}>
      <Drawer anchor={'right'} open={isOpen} onClose={onClose}>
        <div className="pt-0 ps-5 pb-2" style={{ backgroundColor: colors.primary }}>
          <Typography variant="h4" style={{ color: "white", padding: '20px 0px' }}>{type}</Typography>
          <IconButton aria-label="close" color="primary" style={{
            position: 'absolute',
            color: 'white',
            borderRadius: 0,
            right: 20,
            top: 20
          }} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div style={{ width: width }} className="p-4">
          {body}
        </div>
      </Drawer>
    </React.Fragment>
  );
}