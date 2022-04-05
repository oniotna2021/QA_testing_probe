import React from "react";
import { useTranslation } from "react-i18next";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import DropMedia from "components/Shared/Dropzone/DropMedia";

const UploadImagesModal = ({
  setIsOpen,
  desktopImage,
  setDesktopImage,
  mobileImage,
  setMobileImage,
}) => {
  const { t } = useTranslation();

  return (
    <div className="col">
      <DropMedia
        files={desktopImage}
        setFiles={setDesktopImage}
        type="image"
        legend={t("UploadImageModal.DesktopImage")}
      />

      <DropMedia
        files={mobileImage}
        setFiles={setMobileImage}
        type="image"
        legend={t("UploadImageModal.MobileImage")}
      />
      <div className="d-flex justify-content-end">
        <ButtonSave text={t("Btn.save")} onClick={() => setIsOpen(false)} />
      </div>
    </div>
  );
};

export default UploadImagesModal;
