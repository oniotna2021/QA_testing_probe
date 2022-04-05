import React from 'react'

//UI
import { Card, CardContent, IconButton } from "@material-ui/core";


//Icons
import { IconAddNnew, IconEditPencil } from 'assets/icons/customize/config';

//UTILS
import { formatCurrency } from 'utils/misc'


const GridPrices = ({ header = [], data = [] }) => {

    return (
        <Card>

            <CardContent>


                <table className="table">
                    <thead style={{ marginBottom: 20 }}>
                        <tr>
                            <th scope="col" width="12%">
                                <p>Subsegmento</p>
                            </th>
                            <th scope="col" width="12%">
                                <p>Canal</p>
                            </th>
                            {header.map((item) => (
                                <th scope="col" width="12%">
                                    <p>{item.name}</p>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr>
                                <th className='headPriceTable' scope="row"><div className='optionSubsegment'>{item.sub_segment}</div></th>
                                <td className='headPriceTable'><div className='optionChannel'>{item.channel}</div></td>
                                {header.map((itemHeader) => {
                                    let resultFind = item.data.find(x => x.id_category === itemHeader.id_category);
                                    return resultFind ? (
                                        <th scope="col" className='headPriceItem' >
                                            <div className='optionPrice'>
                                                ${formatCurrency(resultFind.value)}
                                                <IconButton style={{ padding: 9 }}>
                                                    <IconEditPencil color='#3C3C3B' />
                                                </IconButton>
                                            </div>
                                        </th>
                                    ) : <div className='d-flex justify-content-center mt-4'>
                                        <IconButton>
                                            <IconAddNnew />
                                        </IconButton>
                                    </div>
                                })}
                            </tr>
                        ))}

                    </tbody>
                </table>


            </CardContent>
        </Card>
    )
}

export default GridPrices