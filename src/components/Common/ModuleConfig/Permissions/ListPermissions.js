import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";

// Components
import { FormPermissions } from "components/Common/ModuleConfig/Permissions/FormPermissions";
import { MessageView } from "components/Shared/MessageView/MessageView";
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import Loading from "components/Shared/Loading/Loading";
import Permissions from "components/Common/ModuleConfig/Permissions/Permissions";

//Utils
import { errorToast, mapErrors } from "utils/misc";

// Service
import { getPermissions } from "services/SuperAdmin/Permissions";

export const ListPermissions = ({ permissionsActions }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [expanded, setExpanded] = useState(false);
  const [expandedSecond, setExpandedSecond] = useState(false);
  const [reload, setReload] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPermissions = () => {
      getPermissions()
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            setData(data.data.role);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setReload(false);
        });
    };

    if (reload) {
      fetchPermissions();
    }
  }, [reload, enqueueSnackbar]);

  return (
    <div className="container">
      {reload && data.length === 0 ? (
        <Loading />
      ) : (
        <div className="row gx-3">
          <div className="col">
            <div className="row">
              <div className="col-8">
                <Typography variant="h4">
                  {t("ListPermissions.Rolepermissions")}
                </Typography>
              </div>
              <div className="col d-flex justify-content-end">
                {/*<TextField
                                    variant="outlined"
                                    onChange={({ target }) => setTerm(target.value)}
                                    value={term}
                                    label={t('Search.Placeholder')}
                                />*/}
              </div>
            </div>

            <div className="row mt-4">
              <div className="col">
                <div className="row mt-3">
                  {/*<div className="col">
                                    <CommonComponentAccordion
                                            color="primary"
                                            expanded={expanded}
                                            setExpanded={setExpanded}
                                            title_no_data='Crear nuevo permiso'
                                            form={<FormPermissions type='Nuevo'
                                                setExpanded={setExpanded} />
                                            }
                                        />
                                    </div>*/}
                  {data.length === 0 ? (
                    <MessageView label={t("ListPermissions.NoData")} />
                  ) : (
                    <div className="row">
                      <div className="col-12">
                        {data.map((value) => (
                          <CommonComponentAccordion
                            expanded={expanded}
                            setExpanded={setExpanded}
                            key={value.role_name}
                            titlePermission={value.role_name}
                            data={value}
                            isPermission={true}
                            form={
                              <>
                                <div>
                                  {value.module_groups.map((groupModule) =>
                                    groupModule.module_groups_name ===
                                      "Menu lateral" ||
                                    groupModule.module_groups_name === "Footer"
                                      ? null
                                      : groupModule.permissions.map(
                                          (module) => (
                                            <CommonComponentAccordion
                                              expanded={expandedSecond}
                                              setExpanded={setExpandedSecond}
                                              key={module.permission_id}
                                              titlePermission={
                                                module.module_name
                                              }
                                              data={{
                                                id: module.permission_id,
                                              }}
                                              isPermission={true}
                                              form={
                                                <Permissions
                                                  roleId={value.role_id}
                                                  setReload={setReload}
                                                  module={module}
                                                  setData={setData}
                                                  permissionsActions={
                                                    permissionsActions
                                                  }
                                                />
                                              }
                                            />
                                          )
                                        )
                                  )}
                                </div>
                                <FormPermissions
                                  reload={reload}
                                  setReload={setReload}
                                  role_id={value.role_id}
                                  type="Editar"
                                  setExpanded={setExpanded}
                                />
                              </>
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  isLoggingIn: auth.isLoggingIn,
});

export default connect(mapStateToProps)(ListPermissions);
