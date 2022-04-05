import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";

// COMPONENTS
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import FormUploadImage from "components/Common/ModuleImages/UploadImage/FormUploadImage";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// SERVICE
import { searchElastic } from "services/_elastic";

const ListImages = ({ permissionsActions }) => {
  const { t } = useTranslation();

  const [term, setTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedImage, setSelectedImage] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    searchElastic("image_of_recipes", {
      from: 0,
      size: 20,
      query: {
        match_all: {},
      },
    }).then(({ data }) => {
      if (data && data.data) {
        setOptions(data.data.hits.hits);
      } else {
        setOptions([]);
      }
    });
  }, []);
  //Search
  useEffect(() => {
    if (term) {
      setFilterValue(term);
    }
  }, [term]);

  const setFilterValue = (value) => {
    setOptions([]);
    if (value) {
      searchElastic("image_of_recipes", {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: value,
                  fields: ["tags.tag"],
                },
              },
            ],
          },
        },
      }).then(({ data }) => {
        if (data && data.data) {
          setOptions(data.data.hits.hits);
        } else {
          setOptions([]);
        }
      });
    } else {
      setOptions([]);
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  return (
    <div className="container">
      <div className="row gx-3">
        <div className="row">
          <div className="col-8">
            <Typography variant="h4">{t("ListImages.Gallery")}</Typography>
          </div>

          <div className="col d-Flex justify-content-end">
            <TextField
              className="mt-4"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={({ target }) => setTerm(target.value)}
              value={term}
              label="Buscar"
            />
          </div>
        </div>

        {/* LISTADO DE IMAGENES Y BOTON MODAL */}
        <div className="row mt-4">
          {/* BOTON PARA ABRIR LA MODAL */}
          <ActionWithPermission isValid={permissionsActions.create}>
            <div className="col-auto d-flex justify-content-center align-items-center">
              <Button
                style={{
                  width: "100px",
                  height: "120px",
                  backgroundColor: "rgba(15, 41, 48, 0.04)",
                }}
                onClick={() => {
                  handleOpenModal();
                  setIsEdit(false);
                }}
              >
                <div className="row d-flex justify-content-center align-items-center">
                  <div>
                    <AddIcon
                      variant="outlined"
                      size="small"
                      style={{ color: "#38447E" }}
                    />
                  </div>
                  <Typography variant="p">
                    {t("ListImages.UploadImage")}
                  </Typography>
                </div>
              </Button>
            </div>
          </ActionWithPermission>

          {options.map((image) => (
            <>
              <div className="col-auto d-flex justify-content-center align-items-center">
                <CardMedia
                  className="cursor"
                  onClick={() => {
                    handleOpenModal();
                    setSelectedImage(image._source);
                    setIsEdit(true);
                  }}
                  image={image._source.urlImage}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    width: "100px",
                    height: "120px",
                    backgroundColor: "rgba(15, 41, 48, 0.04)",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </>
          ))}
        </div>
      </div>
      <ShardComponentModal
        fullWidth={true}
        width={"xs"}
        body={
          <FormUploadImage
            setIsOpen={setIsOpen}
            data={selectedImage}
            isEdit={isEdit}
            permissionsActions={permissionsActions}
          />
        }
        isOpen={isOpen}
      />
    </div>
  );
};

export default ListImages;
