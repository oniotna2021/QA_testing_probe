import React from 'react';

//UI
import Avatar from '@material-ui/core/Avatar';
import Typography from "@material-ui/core/Typography";


const AvatarTraining = ({
  imgUrl,
  name
}) => {
  return (
    <div className='row d-flex justify-content-between align-items-center' style={{ padding: '10px 20px' }}>
      <div className='col-2'>
        {
          imgUrl ? <Avatar src={imgUrl} /> : <Avatar>{name.slice(0, 2)}</Avatar>
        }
      </div>
      <div className='col-10'>
        <Typography className="ms-1 me-1" variant="body2"><b>{name} </b></Typography>
      </div>
    </div>
  )
}

export default AvatarTraining;
