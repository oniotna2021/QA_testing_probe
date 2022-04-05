import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// UI
import { Card, Typography, Tooltip } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";

// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import EditUserModal from "../Modals/EditUserModal";

// icons
import { IconProfile, IconEditPencil } from "assets/icons/customize/config";

const modalProps = {
  fullWidth: true,
  width: "sm",
};

const IdentificationCard = ({
  isLoading,
  userInfo,
  setReloadUserInfo,
  reloadUserInfo,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  return (
    <>
      <Card>
        <div className="d-flex align-items-center p-3">
          <div className="row">
            <div className="col-12 mb-4 d-flex justify-content-between">
              <div className="d-flex">
                <IconProfile
                  width="25"
                  height="25"
                  color={theme.palette.black.main}
                />
                <Typography
                  className="ms-2"
                  style={{ fontWeight: "bold", fontSize: "18px" }}
                >
                  {t("ID")}
                </Typography>
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setIsOpenEditModal(true)}
              >
                <IconEditPencil color="gray" />
              </div>
            </div>
            {isLoading ? (
              <div>
                <Skeleton animation="wave" variant="text" height={25} />
                <Skeleton animation="wave" variant="text" height={25} />
                <Skeleton animation="wave" variant="text" height={25} />
                <Skeleton animation="wave" variant="text" height={25} />
                <Skeleton animation="wave" variant="text" height={25} />
                <Skeleton animation="wave" variant="text" height={25} />
              </div>
            ) : (
              <>
                <div className="col-6">
                  <React.Fragment>
                    <Typography>{t("DetailAfiliate.LabelName")}</Typography>
                    <Typography>{t("DetailAfiliate.LabelLastName")}</Typography>
                    <Typography>
                      {t("FormProfessional.InputDocumentNumber")}
                    </Typography>
                    <Typography>{t("DetailAfiliate.LabelBirthday")}</Typography>

                    <Typography>{t("DetailClinicHistory.Email")}</Typography>
                    <Typography>{"Teléfono"}</Typography>
                  </React.Fragment>
                </div>
                <div className="col-6">
                  <Tooltip title={userInfo?.first_name}>
                    <Typography noWrap style={{ width: 150 }}>
                      {userInfo?.first_name}
                    </Typography>
                  </Tooltip>

                  <Tooltip title={userInfo?.last_name}>
                    <Typography noWrap style={{ width: 150 }}>
                      {userInfo?.last_name}
                    </Typography>
                  </Tooltip>

                  <Tooltip title={userInfo?.document_number}>
                    <Typography noWrap style={{ width: 150 }}>
                      {userInfo?.document_number}
                    </Typography>
                  </Tooltip>

                  <Tooltip title={userInfo?.birthdate}>
                    <Typography noWrap style={{ width: 150 }}>
                      {userInfo?.birthdate}
                    </Typography>
                  </Tooltip>

                  <Tooltip
                    title={
                      reloadUserInfo.email
                        ? reloadUserInfo.email
                        : userInfo?.email
                    }
                    placement="bottom"
                    arrow
                  >
                    <Typography noWrap>
                      {reloadUserInfo.email
                        ? reloadUserInfo.email
                        : userInfo?.email}
                    </Typography>
                  </Tooltip>
                  <Typography noWrap>
                    {reloadUserInfo.mobile_phone
                      ? reloadUserInfo?.mobile_phone
                      : userInfo?.mobile_phone}
                  </Typography>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <ShardComponentModal
        {...modalProps}
        body={
          <EditUserModal
            setIsOpen={setIsOpenEditModal}
            {...userInfo}
            setReloadUserInfo={setReloadUserInfo}
            reloadUserInfo={reloadUserInfo}
          />
        }
        style={{ padding: 20 }}
        isOpen={isOpenEditModal}
        handleClose={() => setIsOpenEditModal(false)}
        title={t("IdentificationCard.Title")}
      />
    </>
  );
};

export default IdentificationCard;
