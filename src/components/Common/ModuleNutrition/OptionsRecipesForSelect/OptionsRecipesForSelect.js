import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useTheme } from "@material-ui/core/styles";
import { useStyles } from "utils/useStyles";

//UI
import Typography from "@material-ui/core/Typography";
import { IconArrowRightMin } from "assets/icons/customize/config";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

//ICONS
import { IconEyeView } from "assets/icons/customize/config";

//COMPONENTS
import ItemResumeNutritionTemplate from "../NutritionTemplates/ItemResumeNutritionTemplate";
import { ShardComponentModal } from "components/Shared/Modal/Modal";

const OptionsRecipesForSelect = ({
  options = [],
  handleSelectionRecipe,
  onBack,
  handleSelectionTemplate,
  infoAfiliate,
  handleSelectionTemplateExchange,
  selectedDataElastic,
  setSelectedDataElastic,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = (e, data) => {
    e.stopPropagation();
    setSelectedDataElastic(data);
    setIsOpen(true);
  };

  return (
    <div>
      {infoAfiliate.length === 0 ? (
        <>
          <KeyboardBackspaceIcon className="cursor" onClick={onBack} />
          <Typography component="h1" variant="h6" color="inherit" noWrap>
            {t("Menu.Title.Recipes")}
          </Typography>{" "}
        </>
      ) : null}

      {options.map((item) => {
        return (
          <Card
            onClick={() => {
              infoAfiliate.length === 0
                ? handleSelectionRecipe(item._source)
                : handleSelectionTemplate(item?._source);
              handleSelectionTemplateExchange(item?._source);
              setSelectedDataElastic(item._source);
            }}
            key={`item-recipe-select` + item._source.id}
            className={classes.cardRecipes}
          >
            {infoAfiliate.length === 0 ? (
              <Avatar src={item._source.urlImage}></Avatar>
            ) : null}
            <Typography variant="p">{item._source.name}</Typography>
            <div className="d-flex">
              {Object.keys(infoAfiliate).length > 0 ? (
                <IconButton
                  className={`${classes.iconButtonArrow} me-2`}
                  onClick={(e) => handleOpenModal(e, item)}
                >
                  <IconEyeView color={theme.palette.black.main}></IconEyeView>
                </IconButton>
              ) : null}
              <IconButton className={classes.iconButtonArrow}>
                <IconArrowRightMin
                  color={theme.palette.black.main}
                ></IconArrowRightMin>
              </IconButton>
            </div>
          </Card>
        );
      })}
      <ShardComponentModal
        isOpen={isOpen}
        body={
          <ItemResumeNutritionTemplate
            setIsOpen={setIsOpen}
            data={selectedDataElastic?._source}
          />
        }
        fullWidth
        width="md"
      />
    </div>
  );
};

export default OptionsRecipesForSelect;
