import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

// COMPONENTS
import { MessageView } from "components/Shared/MessageView/MessageView";
import ParentComponentEmployee from "components/Common/ModuleProfessional/List/Proffesional/ParentComponentEmployee";
import Loading from "components/Shared/Loading/Loading";

// UI
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import TextField from "@material-ui/core/TextField";

//Hooks
import useDebounce from "hooks/useDebounce";
import usePagination from "hooks/usePagination";

// Services
import { searchElastic } from "services/_elastic";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// Utils
import { errorToast, mapErrors } from "utils/misc";
import { useStyles } from "utils/useStyles";

export const ListProfessional = ({ userProfileId, permissionsActions }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [reload, setReload] = useState(true);
  const [users, setUsers] = useState([]);

  //Search
  const [term, setTerm] = useState("");
  const debouncedFilter = useDebounce(term, 500);

  const itemsPerPage = 10;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  useEffect(() => {
    setReload(true);
  }, [debouncedFilter]);

  useEffect(() => {
    if (reload) {
      setLoading(true);
      let fieldsQuery = [
        {
          multi_match: {
            query: debouncedFilter,
            fields: ["first_name", "last_name", "document_number", "email"],
            fuzziness: "4",
          },
        },
      ];

      if (userProfileId === 2) {
        fieldsQuery.push({ match: { is_medical: "1" } });
      }

      let queryByProfile =
        userProfileId === 2
          ? { bool: { must: [{ match: { is_medical: "1" } }] } }
          : { match_all: {} };

      searchElastic(
        "users_collaborator_all",
        !debouncedFilter
          ? {
              from: currentPage * 10 - 10,
              size: itemsPerPage,
              query: {
                ...queryByProfile,
              },
            }
          : {
              from: currentPage * 10 - 10,
              size: itemsPerPage,
              query: {
                bool: {
                  must: fieldsQuery,
                },
              },
            }
      )
        .then(({ data }) => {
          if (data.data) {
            setPages(data.data.hits.total.value);
            setUsers(data.data.hits.hits.map((x) => x._source));
          } else {
            setPages(0);
            setUsers([]);
          }
          setLoading(false);
          setReload(false);
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [
    debouncedFilter,
    enqueueSnackbar,
    currentPage,
    reload,
    setPages,
    userProfileId,
  ]);

  return (
    <>
      <div className="row">
        <div className="col-8">
          <Typography variant="h5" className="mb-4">
            {t("Menu.Title.Collaborators")}
          </Typography>
        </div>
        <div className="col d-flex justify-content-end">
          <TextField
            variant="outlined"
            onChange={({ target }) => {
              setTerm(target.value);
            }}
            value={term}
            label={t("Search.Placeholder")}
          />
        </div>
      </div>

      <ActionWithPermission isValid={permissionsActions.create}>
        <div className="row mt-4">
          <div className="col">
            <ParentComponentEmployee
              defaultIsEdit={false}
              expanded={expanded}
              setExpanded={setExpanded}
              title_no_data="Crear nuevo colaborador"
              load={reload}
              setLoad={setReload}
              permissionsActions={permissionsActions}
            />
          </div>
        </div>
      </ActionWithPermission>

      {loading && users.length === 0 ? (
        <Loading />
      ) : (
        <>
          <div className="container">
            <div className="row mt-4">
              <div className="col">
                {users.length === 0 ? (
                  <MessageView label="No hay Datos" />
                ) : (
                  users &&
                  users.map((row) => (
                    <ParentComponentEmployee
                      isEmployee={true}
                      defaultIsEdit={true}
                      key={`${row.id}`}
                      expanded={expanded}
                      setExpanded={setExpanded}
                      load={reload}
                      setLoad={setReload}
                      data={row}
                      idDetail={row.id}
                      isDetail={true}
                      permissionsActions={permissionsActions}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <div className={classes.paginationStyle}>
              <Pagination
                shape="rounded"
                count={pages}
                page={currentPage}
                onChange={(e, p) => {
                  handleChangePage(e, p);
                  setReload(true);
                }}
                size="large"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  userProfileId: auth.userProfileId,
});

export default connect(mapStateToProps)(ListProfessional);
