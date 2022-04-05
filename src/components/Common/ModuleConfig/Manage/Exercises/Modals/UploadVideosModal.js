import React from "react";
import { useTranslation } from "react-i18next";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import DropMedia from "components/Shared/Dropzone/DropMedia";

const UploadVideosModal = ({
  setIsOpen,
  verticalVideo,
  setVerticalVideo,
  horizontalVideo,
  setHorizontalVideo,
}) => {
  const { t } = useTranslation();

  return (
    <div className="col">
      <DropMedia
        files={verticalVideo}
        setFiles={setVerticalVideo}
        type="video"
        legend={t("UploadVideoModal.Vertical")}
      />

      <DropMedia
        files={horizontalVideo}
        setFiles={setHorizontalVideo}
        type="video"
        legend={t("UploadVideoModal.Horizontal")}
      />
      <div className="d-flex justify-content-end">
        <ButtonSave text={t("Btn.save")} onClick={() => setIsOpen(false)} />
      </div>
    </div>
  );
};

export default UploadVideosModal;
