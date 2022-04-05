import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

//UI
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Age from "./RulesOptions/Age";
import Gender from "./RulesOptions/Gender";
import TimeSlot from "./RulesOptions/TimeSlot";

// utils
import { useStyles } from "utils/useStyles";

// services
import { getAllRules } from "services/Comercial/PromotionRules";

// translate
import { useTranslation } from "react-i18next";

const ruleTypes = [
  { id: 1, name: "Edad" },
  { id: 2, name: "Género Biológico" },
  { id: 3, name: "Franja Horaria" },
];

const NewRule = ({ setAddNewRuleModal, promotionRules, setPromotionRules }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [currentTypeOption, setCurrentTypeOption] = useState();
  const [filteredRules, setFilteredRules] = useState([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (values) => {
    let newRuleObject = [];

    if (currentTypeOption === 1) {
      newRuleObject = {
        name: ruleTypes.find((type) => type.id === values.rule_type).name,
        rule_id: values.rule_type,
        value: [
          {
            from: Number(values.from),
            to: Number(values.to),
          },
        ],
      };
    }

    if (currentTypeOption === 2) {
      newRuleObject = {
        name: ruleTypes.find((type) => type.id === values.rule_type).name,
        rule_id: values.rule_type,
        value: {
          gender_id: values.gender_id,
        },
      };
    }

    if (currentTypeOption === 3) {
      newRuleObject = {
        name: ruleTypes.find((type) => type.id === values.rule_type).name,
        rule_id: values.rule_type,
        value: {
          apply_all_days: values.apply_all_days ? true : false,
          hours: [
            { start: "15:00", end: "16:30" },
            { start: "18:00", end: "19:30" },
          ],
        },
      };
    }

    setPromotionRules([...promotionRules, newRuleObject]);
    setAddNewRuleModal(false);
  };

  // get rule types
  useEffect(() => {
    getAllRules().then((data) => console.log(data));
  }, []);

  useEffect(() => {
    setFilteredRules(
      ruleTypes.filter(
        (type) =>
          !promotionRules.some((promotion) => promotion.rule_id === type.id)
      )
    );
  }, [promotionRules]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col">
          <Controller
            rules={{ required: true }}
            control={control}
            name="rule_type"
            render={({ field }) => (
              <div className="col mb-3">
                <FormControl {...field} variant="outlined">
                  <InputLabel>{t("NewRule.TypeRule")}</InputLabel>
                  <Select
                    label={t("NewRule.TypeRule")}
                    variant="outlined"
                    error={errors.rule_type}
                    onChange={(e) => {
                      reset();
                      field.onChange(e.target.value);
                      setCurrentTypeOption(e.target.value);
                    }}
                  >
                    {filteredRules.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
          />

          {currentTypeOption === 1 && <Age control={control} errors={errors} />}

          {currentTypeOption === 2 && (
            <Gender control={control} errors={errors} />
          )}

          {currentTypeOption === 3 && (
            <TimeSlot control={control} errors={errors} />
          )}
        </div>

        <div className="d-flex justify-content-around my-4">
          <Button
            className={classes.buttonCancel}
            onClick={() => setAddNewRuleModal(false)}
          >
            {t("Btn.Cancel")}
          </Button>
          <ButtonSave text={t("Btn.save")}></ButtonSave>
        </div>
      </div>
    </form>
  );
};

export default NewRule;
