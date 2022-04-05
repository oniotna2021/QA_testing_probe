import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// UI
import { Button, Tooltip } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

// components
import SelectFilter from "./SelectFilter";

// icons
import {
  StateTrue,
  StateFalse,
  StateWaiting,
} from "assets/icons/customize/config";

const data = [
  {
    user: "Lola Mentos",
    document: 10124412442,
    plan: "Elite Gold",
    expiration_date: "12-11-21",
    last_visit: "12-12-21",
    state: "true",
  },
  {
    user: "Lola Mentos",
    document: 10124412442,
    plan: "Año",
    time_plan: 2,
    title_plan: "Nutrición",
    expiration_date: "12-11-21",
    last_visit: "12-12-21",
    state: "false",
  },
  {
    user: "Lola Mentos",
    document: 10124412442,
    plan: "Elite Gold",
    expiration_date: "12-11-21",
    last_visit: "12-12-21",
    state: "waiting",
  },
  {
    user: "Lola Mentos",
    document: 10124412442,
    plan: "Trimestre",
    time_plan: 1,
    title_plan: "Nutrición",
    expiration_date: "12-11-21",
    last_visit: "12-12-21",
    state: "waiting",
  },
  {
    user: "Lola Mentos",
    document: 10124412442,
    plan: "Premium",
    expiration_date: "12-11-21",
    last_visit: "12-12-21",
    state: "true",
  },
];

export default function BasicTable() {
  const { control, reset } = useForm();

  //items
  const [planItems, setPlanItems] = useState([]);
  const [expirationItems, setExpirationItems] = useState([]);
  const [lastVisitItems, setlastVisitItems] = useState([]);
  const [stateItems, setStateItems] = useState([]);
  // filter
  const [filter, setFilter] = useState(data);

  useEffect(() => {
    const plans = [];
    const expirations = [];
    const last_visits = [];
    const states = [];

    data.forEach((row) => {
      if (!plans.includes(row.plan)) plans.push(row.plan);
      if (!expirations.includes(row.expiration_date))
        expirations.push(row.expiration_date);
      if (!last_visits.includes(row.last_visit))
        last_visits.push(row.last_visit);
      if (!states.includes(row.state)) states.push(row.state);
    });

    setPlanItems(plans);
    setExpirationItems(expirations);
    setlastVisitItems(last_visits);
    setStateItems(states);
  }, []);

  const handlePlansFilter = (e, type) => {
    setFilter(data.filter((value) => value[type] === e.target.value));
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>
                <SelectFilter
                  items={planItems}
                  label={"Plan"}
                  onChange={handlePlansFilter}
                  type="plan"
                  control={control}
                />
              </TableCell>
              <TableCell>
                <SelectFilter
                  items={expirationItems}
                  label={"Vencimiento"}
                  onChange={handlePlansFilter}
                  type="expiration_date"
                  control={control}
                />
              </TableCell>
              <TableCell>
                <SelectFilter
                  items={lastVisitItems}
                  label={"Última visita"}
                  onChange={handlePlansFilter}
                  type="last_visit"
                  control={control}
                />
              </TableCell>
              <TableCell>
                <SelectFilter
                  items={stateItems}
                  label={"Estado"}
                  onChange={handlePlansFilter}
                  type="state"
                  control={control}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filter.map((row) => (
              <TableRow key={row.document}>
                <TableCell component="th" scope="row">
                  {row.user}
                </TableCell>
                <TableCell>CC {row.document}</TableCell>
                <TableCell style={{ position: "relative" }}>
                  {row.plan}
                  {row.time_plan && (
                    <Tooltip title={row.title_plan}>
                      <div
                        style={{
                          backgroundColor: "#8D33D3",
                          borderRadius: "50%",
                          color: "white",
                          width: 30,
                          height: 30,
                          position: "absolute",
                          left: "120px",
                          top: "10px",
                          cursor: "pointer",
                        }}
                        className="d-flex align-items-center justify-content-center"
                      >
                        +{row.time_plan}
                      </div>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>{row.expiration_date}</TableCell>
                <TableCell>{row.last_visit}</TableCell>
                <TableCell>
                  {row.state === "true" ? (
                    <StateTrue />
                  ) : row.state === "false" ? (
                    <StateFalse />
                  ) : (
                    <StateWaiting />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        style={{
          backgroundColor: "#F3F3F3",
          padding: "10px 20px 10px 20px",
          marginRight: 20,
          marginTop: 20,
        }}
        onClick={() => {
          setFilter(data);
          reset({});
        }}
      >
        Limpiar filtros
      </Button>
    </>
  );
}
