import React, {useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings';
import FormAppointment from 'components/Shared/FormAppointment/FormAppointment';
import {ShardComponentModal} from 'components/Shared/Modal/Modal'
export const CommonComponentSimleTable = ({ data }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [isNew, setIsNew] = useState();
  const [idQuote, setIdQuote] = useState();
  
  const handleOpenEdit = (idx) => {
      setIsOpen(true);
      setIdQuote(idx);
      setIsNew(false);
  }

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow >
          {data.map((row) => (
                <TableCell key={row.id} align="center"> 
                    {`Medico ${row.medical_professional_id}`}
                </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow >
            {data.map((row) => (
              <TableCell align="center" hover>
                {`Fecha: ${row.date}  ${row.hour}`}
                <IconButton onClick={() => handleOpenEdit(row.id)}>
                  <SettingsIcon/>
                </IconButton>
                <ShardComponentModal body={idQuote === row.id && <FormAppointment defaultValue={row} setIsOpen={setIsOpen} isNew={isNew}/>} isOpen={isOpen}/>
              </TableCell>
            ))}
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
