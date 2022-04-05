import React from 'react';

//UI
import Card from '@material-ui/core/Card'
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

//icons
import { IconArrowRightMin, IconEyeView } from 'assets/icons/customize/config'

//utils
import { useStyles } from "utils/useStyles";

//components
import { ShardComponentModal } from 'components/Shared/Modal/Modal';
import ModalDetailProduct from './ModalDetailproduct';

const ItemSearchProduct = ({ product, addNewProduct }) => {

    const theme = useTheme();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false)

    return ( 
        <Card className='d-flex align-items-center justify-content-between p-2 mb-2'>
            <Typography variant='body1'>{product.name}</Typography>
            <div>
                <IconButton className={`me-3 ${classes.iconButtonArrow}`} onClick={()=>setOpen(true)}>
                    <IconEyeView color={theme.palette.black.main}/>
                </IconButton>
                <IconButton className={classes.iconButtonArrow} onClick={()=>addNewProduct(product)}>
                    <IconArrowRightMin color={theme.palette.black.main}/>
                </IconButton>
            </div>
            <ShardComponentModal 
                isOpen={open}
                fullWidth
                width='sm'
                backgroundColorButtonClose={theme.palette.black.main}
                body={<ModalDetailProduct setOpen={setOpen} product={product}/>}
            />
        </Card>
     );
}
 
export default ItemSearchProduct;