import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// redux
import { connect } from "react-redux";

// ui
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import Pagination from "@material-ui/lab/Pagination";

// components
import Loading from "components/Shared/Loading/Loading";
import PartnersCard from "../ModulePartnersJourney/PartnersCard/PartnersCard";

// styled
import { CardsInfo } from "./Partners.style";

// icons
import { IconSearch } from "../../../assets/icons/customize/config";

// services
import {
  getMembersControlTower,
  getMembersByUser,
} from "services/VirtualJourney/Afiliates";

// hooks
import usePagination from "hooks/usePagination";

const PartnersJourney = ({ userType }) => {
  // Rol
  const isTrainner = userType === 29 || userType === 30;
  const isControlTower = userType === 39;
  const isVirtualAdmin = userType === 37;

  //queryparams
  const { user_id } = useParams();

  //General member_data
  const [dataMembers, setDataMembers] = useState([]);

  // states QueryParams
  const [statusUserPlan, setStatusUserPlan] = useState("");
  const [userDocument, setUserDocument] = useState("");
  const [withoutCoach, setWithoutCoach] = useState("");
  const [withoutPlan, setWithoutPlan] = useState("");
  const [itemsPage, setItemsPage] = useState(20);

  // states Count
  const [totalItems, setTotalItems] = useState(0);
  const [totalWithOutTrainer, setTotalWithOutTrainer] = useState(0);
  const [totalWithOutPlan, setTotalWithOutPlan] = useState(0);
  const [totalWithPlan, setTotalWithPlan] = useState(0);

  // usePagination
  const itemsPerPage = itemsPage;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  // Loading
  const [loading, setLoading] = useState(false);

  // coach is carterization ?
  const [isCarterization, setIsCarterization] = useState(false);

  useEffect(() => {
    setDataMembers([]);
    // if ControlTower
    if ((isControlTower && !user_id) || isVirtualAdmin) {
      setLoading(true);
      getMembersControlTower(
        statusUserPlan,
        withoutCoach,
        userDocument,
        itemsPerPage,
        currentPage
      )
        .then(({ data }) => {
          if (data && data.data) {
            setTotalItems(data.data.total_members);
            setTotalWithOutTrainer(data.data.without_trainer);
            if (data.data.items.length > 0) {
              setDataMembers(data.data.items);
              setPages(data.data.total_items);
            }
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setLoading(false);
        });
    }
    // if isTrainner
    else if (isTrainner || user_id) {
      setLoading(true);
      getMembersByUser(
        statusUserPlan,
        withoutPlan,
        userDocument,
        user_id,
        itemsPerPage,
        currentPage
      )
        .then(({ data }) => {
          if (data && data.data) {
            setTotalItems(data.data.total_items);
            setTotalWithPlan(data.data.with_plan);
            setTotalWithOutPlan(data.data.without_plan);
            if (data.data.items.length > 0) {
              setDataMembers(data.data.items);
              setPages(data.data.total_items);
            }
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [
    statusUserPlan,
    userDocument,
    withoutCoach,
    withoutPlan,
    currentPage,
    itemsPerPage,
    isCarterization,
  ]);

  const handleAllMembers = () => {
    setStatusUserPlan("");
    setUserDocument("");
    setWithoutCoach("");
    setWithoutPlan("");
  };

  return (
    <>
      <div className="container">
        <Typography variant="h5" className="mb-3">
          Afiliados
        </Typography>
        <div className="row m-0">
          <div className="col-6 d-flex">
            {isTrainner && (
              <>
                <CardsInfo onClick={handleAllMembers}>
                  <p>Nº Afiliados</p>
                  <p>{totalItems}</p>
                </CardsInfo>
                <CardsInfo
                  onClick={() => setWithoutPlan(false)}
                  className="mx-3"
                >
                  <p>Sin plan </p>
                  <p>{totalWithOutPlan}</p>
                </CardsInfo>
                <CardsInfo
                  onClick={() => setWithoutPlan(true)}
                  className="mx-3"
                >
                  <p>Con plan </p>
                  <p>{totalWithPlan}</p>
                </CardsInfo>
              </>
            )}

            {isVirtualAdmin || isControlTower ? (
              <>
                <CardsInfo onClick={handleAllMembers}>
                  <p>Nº Afiliados</p>
                  <p>{totalItems}</p>
                </CardsInfo>
                <CardsInfo
                  onClick={() => setWithoutCoach(false)}
                  className="mx-3"
                >
                  <p>Sin entrenador </p>
                  <p>{totalWithOutTrainer}</p>
                </CardsInfo>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="col-6 d-flex justify-content-end p-0">
            <div className="d-flex justify-content-center mx-3">
              <FormControl variant="outlined" style={{ width: "10rem" }}>
                <InputLabel id="document_type_id">Afiliado</InputLabel>
                <Select
                  variant="outlined"
                  label="Afiliado"
                  onChange={(e) => {
                    setStatusUserPlan(e.target.value);
                  }}
                >
                  <MenuItem value="0">Todos</MenuItem>
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="d-flex justify-content-end">
              <TextField
                fullWidth
                label={"Nª de Documento"}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconSearch color={"#3C3C3B"} />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  setUserDocument(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Cards */}
      <div className="container">
        {loading ? (
          <Loading />
        ) : dataMembers.length > 0 ? (
          dataMembers.map((member) => (
            <PartnersCard
              key={member.user_id}
              data={member}
              is360
              setIsCarterization={setIsCarterization}
              isControlTower={isControlTower}
              isVirtualAdmin={isVirtualAdmin}
              isTrainner={isTrainner}
              statusUserPlan={statusUserPlan}
            />
          ))
        ) : (
          ""
        )}
      </div>

      {/* Pagination */}
      <div className="container">
        <div className="d-flex justify-content-between">
          <div className="d-flex mt-3">
            <p>Items por página:</p>
            <FormControl
              variant="outlined"
              style={{ width: "6rem", margin: "0em .8em" }}
            >
              <InputLabel id="document_type_id">Items</InputLabel>
              <Select
                variant="outlined"
                label="Items"
                onChange={(e) => {
                  setItemsPage(e.target.value);
                }}
              >
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={16}>16</MenuItem>
                <MenuItem value={24}>24</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="d-flex mt-3">
            <Pagination
              shape="rounded"
              count={pages}
              page={currentPage}
              onChange={handleChangePage}
              size="large"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  userType: auth.userType,
});

export default connect(mapStateToProps)(PartnersJourney);
