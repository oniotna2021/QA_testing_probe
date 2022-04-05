import { isDate, addMinutes } from "date-fns";

export const daysWeek = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sáb", "Dom"];
export const daysWeekForSession = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export const daysWeekNames = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
  "Festivos",
];

export const dataSourceGetFieldSessions = [
  "name",
  "id",
  "uuid",
  "goals.name",
  "goals.id",
  "pathologies.name",
  "contraindications.name",
  "trainer_name",
  "brand_videos",
  "is_daily_training",
  "is_plan_by_goals",
  "short_description",
  "long_description",
  "training_levels",
  "training_places",
];

export const numbersSessions = [2, 3, 4, 5, 6];
export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const generateUUID = (id) =>
  String(id + "-" + Math.random().toString().slice(2, 5));
export const filterPortFlow = (nodes) =>
  nodes.filter((x) => !x.id.includes("port-add-serie"));
export const maxLenghtOneToSeven = /^[1-7]{0,1}$/;
export const regexNumbersPositive = /^[1-9]+[0-9]*$/;
export const regexOnlyPositiveNumbers = /^[1-9][\.\d]*(,\d+)?$/;
export const regexOnlyPositiveNumbersWithZero = /^[0-9][\.\d]*(,\d+)?$/;
export const regexHTML = /<\/?[a-z][\s\S]*>/i;
export const formatPriceReplace = (value) => parseInt(value.replace('$', '').replace(',', ''));
export const isObjectEmpty = (obj) =>
  typeof obj === "object" ? Object.keys(obj).length === 0 : false;

export const isNumberDownForThree = (numero) => {
  let valid = true;
  switch (numero) {
    case 3:
      valid = false;
      break;

    case 6:
      valid = false;
      break;

    case 9:
      valid = false;
      break;

    case 12:
      valid = false;
      break;

    case 15:
      valid = false;
      break;

    default:
      break;
  }
  return valid;
};

export const reOrderForUpdateSteps = (trainingSteps = [], data) => {
  let arrToSet = [];
  trainingSteps.forEach((step, idx) => {
    let stepToSet = data.data.training_steps.find(
      (p) => p.training_step_id === step.id
    );
    if (stepToSet) {
      arrToSet.push({
        ...step,
        order: stepToSet.order === null ? idx : stepToSet.order,
      });
      return;
    }

    arrToSet.push({ ...step, order: idx });
  });
  return arrToSet;
};

export const typeTimeRepetition = [
  { id: 1, name: "Minutos" },
  { id: 2, name: "Segundos" },
];

export const isNumberDown = (numero) => {
  let valid = [20, 200];
  switch (numero) {
    case 3:
      valid = [20, 300];
      break;

    case 6:
      valid = [20, 400];
      break;

    case 9:
      valid = [20, 500];
      break;

    case 12:
      valid = [20, 600];
      break;

    case 15:
      valid = [20, 750];
      break;

    default:
      break;
  }
  return valid;
};

const hours = [
  // { id: 1, hour: '1:00', realHour: '01:00:00', color: 'rgb(141 51 211 / 30%)' },
  // { id: 2, hour: '2:00', realHour: '02:00:00', color: 'rgb(141 51 211 / 30%)' },
  // { id: 3, hour: '3:00', realHour: '03:00:00', color: 'rgb(141 51 211 / 30%)' },
  { id: 4, hour: "4:00", realHour: "04:00:00", color: "rgb(141 51 211 / 30%)" },
  { id: 5, hour: "5:00", realHour: "05:00:00", color: "rgb(141 51 211 / 30%)" },
  { id: 6, hour: "6:00", realHour: "06:00:00", color: "rgb(141 51 211 / 30%)" },
  { id: 7, hour: "7:00", realHour: "07:00:00", color: "rgb(141 51 211 / 30%)" },
  { id: 8, hour: "8:00", realHour: "08:00:00", color: "rgb(98 149 250 / 30%)" },
  {
    id: 9,
    hour: "9:00",
    realHour: "09:00:00",
    color: "rgb(148 201 122 / 30%)",
  },
  {
    id: 10,
    hour: "10:00",
    realHour: "10:00:00",
    color: "rgb(98 149 250 / 30%)",
  },
  {
    id: 11,
    hour: "11:00",
    realHour: "11:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 12,
    hour: "12:00",
    realHour: "12:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 13,
    hour: "13:00",
    realHour: "13:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 14,
    hour: "14:00",
    realHour: "14:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 15,
    hour: "15:00",
    realHour: "15:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 16,
    hour: "16:00",
    realHour: "16:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 17,
    hour: "17:00",
    realHour: "17:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 18,
    hour: "18:00",
    realHour: "18:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 19,
    hour: "19:00",
    realHour: "19:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 20,
    hour: "20:00",
    realHour: "20:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 21,
    hour: "21:00",
    realHour: "21:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 22,
    hour: "22:00",
    realHour: "22:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 23,
    hour: "23:00",
    realHour: "23:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  // { id: 24, hour: '24:00', realHour: '24:00:00', color: 'rgb(141 51 211 / 30%)' },
];

export const groupByObject = (data, key) =>
  data.reduce((r, a) => {
    r[a[key]] = r[a[key]] || [];
    r[a[key]].push(a);
    return r;
  }, Object.create(null));

export const casteMapArray = (array) =>
  (array || []).map((x) => {
    return { id: x.id };
  });

export const casteMapNameArrayForString = (
  array,
  labelReturn = "Sin información"
) =>
  Array.isArray(array) && array && array.length > 0
    ? array.map((x) => ` ${x.name}`).toString()
    : labelReturn;

export const formatNameDate = (value) => {
  const date = new Date(value);
  return date.toLocaleString("default", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const normalizeDataEditSession = (nodes) => {
  let convertData = {
    nodes: [],
    links: [],
  };
  if (nodes) {
    convertData.nodes = JSON.parse(nodes)[0].nodes.map((x) => {
      return {
        ...x,
        coordinates: [x.coordinates[0] + 50, x.coordinates[1] - 20],
        data: { ...x.data },
      };
    });
    convertData.links = JSON.parse(nodes)[0].links;
  }
  return convertData;
};

export const generateIDForTypeTraining = () => {
  let min = 1718;
  let max = 3429;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const typeIntensityForCardio = [
  {
    id: 1,
    name: "Alto",
  },
  {
    id: 2,
    name: "Moderado",
  },
  {
    id: 3,
    name: "Bajo",
  },
];

export const getNameIntensityForCardio = (value) => {
  return value ? typeIntensityForCardio.find((x) => value === x.id).name : "";
};

export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0,
      v = c === "x" ? r : r && 0x3 | 0x8;
    return v.toString(16);
  });
};

export const generateUUIDConsecutive = (value) => {
  return value + 1;
};

export const findInitFlow = (arr, conectionsArray, getInitSource) => {
  let uniq = arr
    .map((name) => {
      return {
        count: 1,
        name: name,
      };
    })
    .reduce((a, b) => {
      a[b.name] = (a[b.name] || 0) + b.count;
      return a;
    }, {});

  let duplicateData = Object.keys(uniq).filter((a) => uniq[a] > 1);
  let intersection = arr.filter((item) => !duplicateData.includes(item));
  let getInitAndEnd = getInitSource.filter((x) =>
    intersection.includes(x.source)
  );
  const getInit = conectionsArray.filter((p) =>
    getInitAndEnd.some((getAnd) => p.source === getAnd.source)
  );
  return getInit.length > 0 ? getInit[0] : [];
};

//Valida las conexiones de los ejercicios
export const validateLinkSequence = (data) => {
  let validationLinkFilter = data.filter(
    (item) =>
      item.source &&
      item.source.includes("port-exercises") &&
      item.target &&
      item.target.includes("port-exercises")
  );
  let getInitSource = data.filter(
    (item) =>
      item.source &&
      item.source.includes("port-exercises") &&
      item.targetHandle === null
  );
  const validationOrderExercices = [];
  const validationGetExercices = [];

  for (const key in validationLinkFilter) {
    validationGetExercices.push(validationLinkFilter[key].source);
    validationGetExercices.push(validationLinkFilter[key].target);
  }

  const toFindDuplicate = findInitFlow(
    validationGetExercices,
    validationLinkFilter,
    getInitSource
  );
  let arrayInit = [];

  if (toFindDuplicate) {
    arrayInit.push(toFindDuplicate);
  }
  let arrayTargets = [];
  for (const key in arrayInit) {
    validationOrderExercices.push(arrayInit[key].source);
    validationOrderExercices.push(arrayInit[key].target);
    arrayTargets.push(arrayInit[key].target);

    for (let index = 0; index < arrayTargets.length; index++) {
      const element = arrayTargets[index];
      let getNext = validationLinkFilter.find((x) => x.source === element);
      if (getNext) {
        arrayTargets.push(getNext.target);
      }
    }
  }

  if (data.length === 3) {
    return getInitSource.map((x) => x.source);
  } else {
    return validationLinkFilter.length > 0
      ? validationOrderExercices
          .concat(arrayTargets)
          .filter((v, i, a) => a.findIndex((t) => t === v) === i)
      : [];
  }
};

//Valida
export const validateSerie = (data) => {
  let validationLinkFilter = data.filter(
    (item) => item.target && item.target.includes("port-add-serie")
  );
  return validationLinkFilter;
};

export const countElementsExercice = (data) => {
  let validationLinkFilter = data.filter(
    (item) => !item.source && item.id.includes("port-exercises") && !item.target
  );
  return validationLinkFilter;
};

export const normalizeDataNodesSave = (schemaValue) => {
  //Agrupa y busca las que contengan enlance con una serie
  let dataEnd = [];
  const validateConsecutive = validateLinkSequence(schemaValue);
  const validateSeries = validateSerie(schemaValue);

  if (
    validateConsecutive.length > 0 &&
    countElementsExercice(schemaValue).length === validateConsecutive.length
  ) {
    // console.log('validateConsecutive', validateConsecutive);
    //console.log('schemaValue', schemaValue);
    validateConsecutive.forEach((item) => {
      const getSerieUnionId = schemaValue.find(
        (x) =>
          x.source === item && x.target && x.target.includes("port-add-serie")
      );

      if (getSerieUnionId) {
        const serieElement = schemaValue.find(
          (x) => x.id === getSerieUnionId.target
        );
        const result1 = validateSeries.filter(
          (x) => x.target && x.target === getSerieUnionId.target
        );
        let indexInit = validateConsecutive.findIndex(
          (x) => x === result1[0].source
        );
        let indexEnd = 0;
        const getIndexinit = result1[0];
        const arrayPositionsSources = [];
        result1.forEach((item) => {
          arrayPositionsSources.push(
            validateConsecutive.findIndex((x) => x === item.source)
          );
        });

        //    console.log("sources", arrayPositionsSources);

        if (getIndexinit) {
          indexInit = Math.min(...arrayPositionsSources);
        }

        if (result1[0] && result1[1]) {
          indexEnd = Math.max(...arrayPositionsSources);
          let finishEnd = indexEnd + 1;
          for (let index = indexInit; index < finishEnd; index++) {
            const element = validateConsecutive[index];
            const getInfoExercice = schemaValue.find((x) => x.id === element);
            dataEnd.push({
              name: serieElement.id,
              dataExercices: getInfoExercice,
            });
          }
        } else {
          const getInfoExercice = schemaValue.find(
            (x) => x.id === result1[0].source
          );
          dataEnd.push({
            name: serieElement.id,
            dataExercices: getInfoExercice,
          });
        }
      }
    });
  }

  const objLinks = groupByObject(
    dataEnd.filter(
      (v, i, a) =>
        a.findIndex(
          (t) =>
            t.dataExercices &&
            v.dataExercices &&
            t.dataExercices.id === v.dataExercices.id
        ) === i
    ),
    "name"
  );

  const linksArraySeries = normalizeDataObject(objLinks);
  linksArraySeries.forEach((element) => {
    if (element.name.includes("port-add-serie")) {
      const linksSeries = element.data;
      const dataFinedSeries = schemaValue.find(
        (node) => node.id === element.name
      );
      const result = linksSeries.map((x) => {
        const dataFined = x.dataExercices;
        return {
          exercises_id: dataFined.data.data.id,
          id_port: dataFined.id,
          name: dataFined.data.data.name,
          description: dataFined.data.data.description,
          number_repetitions: dataFined.data.data.number_repetitions,
          image_desktop: dataFined.data.data.image_desktop,
          video_url: dataFined.data.data.video_url,
          time_apply: dataFined.data.data.time_apply,
          type_time_apply: dataFined.data.data.type_time_repetition,
          numberDurationApply: dataFined.data.data.numberDurationApply,
          perception_effort: dataFined.data.data.perception_effort,
        };
      });
      element.dataGroup = {
        exercises: result,
        number_series: dataFinedSeries.data.data.number_series,
        time_off: dataFinedSeries.data.data.time_off,
        apply_pyramidal: dataFinedSeries.data.data.apply_pyramidal,
        pyramidal_increase_repetitions: Number(
          dataFinedSeries.data.data.pyramidal_increase_repetitions
        ),
        pyramidal_increase_element_weight: Number(
          dataFinedSeries.data.data.pyramidal_increase_element_weight
        ),
      };
    }
  });

  return linksArraySeries.filter((x) => x.dataGroup).map((x) => x.dataGroup);
};

export const tConv24 = (time24) => {
  var ts = time24;
  var H = +ts.substr(0, 2);
  var h = H % 12 || 12;
  h = h < 10 ? "0" + h : h; // leading 0 at the left for 1 digit hours
  ts = h + ts.substr(2, 3);
  return ts;
};

export const formatPMorAM = (str) => {
  let [hh] = str.split(":");
  return `${hh > 12 ? "PM" : "AM"}`;
};

export const formatDateToHHMMSS = (value) => {
  if (!isDate(value)) return value;

  const hours = value.getHours().toString().padStart(2, "0");
  const minutes = value.getMinutes().toString().padStart(2, "0");
  return hours + ":" + minutes + ":00";
};

// Add days to date
export const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const biological_gender = [
  { value: "Masculino" },
  { value: "Femenino" },
  { value: "No binario" },
];

export const formatToHHMMSS = (duration) => {
  if (duration.length === 8) {
    return duration;
  }
  return `${duration}:00`;
};

export const formatToHHMM = (duration) => {
  if (duration.length === 8) {
    return duration.slice(0, 5);
  }
  return duration;
};

export const normalizeDataObject = (array) => {
  const dataEnd = [];
  Object.keys(array).forEach((k) => {
    if (k !== "undefined") {
      dataEnd.push({
        name: k,
        data: array[k],
      });
    }
  });
  return dataEnd;
};

export const setFormData = (object) =>
  Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
  }, new FormData());

export const actionsLogsMobile = {
  "personalized training": "Programa de entrenamiento personalizado",
  "daily training": "Sesiones diarias",
  "training by goals": "Entrenamiento inteligente",
  "smart training": "Sesiones por objectivos",
};

export const addFormsPercentToLocalStorage = (form) => {
  let arrayForms = [];
  try {
    if (localStorage.getItem("forms")) {
      arrayForms = JSON.parse(localStorage.getItem("forms"));
    }
    arrayForms.forEach((itemForm, idx) => {
      if (itemForm.id === form.id) {
        arrayForms.splice(idx, 1);
        arrayForms.push(form);
      }
    });
    if (!arrayForms.includes(form)) {
      arrayForms.push(form);
      localStorage.setItem("forms", JSON.stringify(arrayForms));
    } else {
      localStorage.setItem("forms", JSON.stringify(arrayForms));
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteKeysLocalStorageClinicalHistory = (user_id, index) => {
  if (window.localStorage.getItem(`form-${user_id}-${index}`)) {
    window.localStorage.removeItem(`form-${user_id}-${index}`);
  }
};

export const addKeyClinicalHistoryForm = (key, percent) => {
  try {
    window.localStorage.setItem(key, percent);
  } catch (err) {
    console.log(err);
  }
};

export const roles = {
  1: "Super usuario",
  2: "Admin Software Medico",
  3: "Profesional Medico",
  4: "Administrador Plan Entrenamiento",
  5: "Entrenador",
  6: "Counter",
};

export const getUniqueListBy = (arr, key) => [
  ...new Map(arr.map((item) => [item[key], item])).values(),
];

export const regexEscape = function (text) {
  return text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
};

export const checkEquivalentNames = (array) =>
  array.length === 0
    ? []
    : array.map((x) => {
        return { name: x };
      });

// a little function to help us with reordering the result
export const reorderList = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const decodeURL = (value) => {
  return decodeURIComponent(String(value).replace(/\+/g, " "));
};

export const mapErrors = (error) => {
  if (error?.message === undefined || null) {
    return "Error desconocido.";
  }

  if (Array.isArray(error?.message)) {
    return error?.message.map((err) => Object.values(err)).join(",");
  } else if (typeof error?.message === "string") {
    return error?.message;
  } else {
    return Object.values(error?.message).join(",");
  }
};

export const concatWithEquivalentNames = (array) => {
  return array.map((item) => {
    if (item.equivalent_names.length !== 0) {
      return {
        ...item,
        name: `${item.name}, ${item.equivalent_names
          .map((i) => i.name)
          .join(", ")}`,
      };
    }
    return item;
  });
};

/**
 * Add two string time values (HH:mm:ss) with javascript
 * @param {String} startTime  String time format
 * @param {String} endTime  String time format
 * @returns {String}
 */
export const sumTimes = (startTime, endTime) => {
  var times = [0, 0, 0];
  var max = times.length;

  var a = (startTime || "").split(":");
  var b = (endTime || "").split(":");

  // normalize time values
  for (var i = 0; i < max; i++) {
    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
    b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
  }

  // store time values
  for (var o = 0; o < max; o++) {
    times[o] = a[o] + b[o];
  }

  var hours = times[0];
  var minutes = times[1];
  var seconds = times[2];

  if (seconds >= 60) {
    var m = (seconds / 60) << 0;
    minutes += m;
    seconds -= 60 * m;
  }

  if (minutes >= 60) {
    var h = (minutes / 60) << 0;
    hours += h;
    minutes -= 60 * h;
  }

  return (
    ("0" + hours).slice(-2) +
    ":" +
    ("0" + minutes).slice(-2) +
    ":" +
    ("0" + seconds).slice(-2)
  );
};

export const convertH2M = (timeInHour) => {
  var timeParts = timeInHour.split(":");
  return Number(timeParts[0]) * 60 + Number(timeParts[1]);
};

export const isRangeHours = (
  hourIni,
  dateStartTime,
  dateEndTime,
  isCountEnd = false
) => {
  const convHourInit = convertH2M(formatDateToHHMMSS(hourIni));
  const convHourStart = convertH2M(formatDateToHHMMSS(dateStartTime));
  const convHourEnd = convertH2M(formatDateToHHMMSS(dateEndTime));

  if (isCountEnd) {
    return convHourInit >= convHourStart && convHourInit <= convHourEnd;
  }

  return convHourStart <= convHourInit && convHourInit < convHourEnd;
};

const eachArraySchedules = (
  dataSchedules,
  realHour,
  hourIni,
  hourFinal,
  item,
  isQuote,
  hash
) => {
  let objectToReturn = {
    ...item,
    is_quote: isQuote,
    status: 0,
    id: null,
    hour_ini: formatDateToHHMMSS(hourIni),
    hour_end: formatDateToHHMMSS(hourFinal),
  };

  dataSchedules.forEach((schedule) => {
    const {
      start_time,
      end_time,
      activity_name,
      activity_id,
      id,
      location_id,
      location_name,
      color,
      is_quote,
      ...restData
    } = schedule;

    const dateStartTime =
      start_time === undefined || null
        ? null
        : start_time?.length === 0
        ? null
        : new Date(`2021-08-18T${start_time}`);

    const dateEndTime =
      end_time === undefined || null
        ? null
        : end_time?.length === 0
        ? null
        : new Date(`2021-08-18T${end_time}`);

    if (isRangeHours(hourIni, dateStartTime, dateEndTime)) {
      var exists = !hash[id];
      hash[id] = true;

      if (exists) {
        objectToReturn = {
          ...item,
          ...restData,
          is_quote,
          color,
          hour_ini: formatDateToHHMMSS(hourIni),
          hour_end: formatDateToHHMMSS(hourFinal),
          activity_name: activity_name,
          activity_id: activity_id,
          id: id,
          location_id: location_id,
          location_name: location_name,
        };
        return;
      }

      objectToReturn = {
        ...item,
        ...restData,
        status: restData.status,
        name_location: null,
        managers: [],
        Booking: null,
        capacity: null,
        is_quote,
        color,
        hour_ini: formatDateToHHMMSS(hourIni),
        hour_end: formatDateToHHMMSS(hourFinal),
        activity_name: "",
        activity_id: activity_id,
        statusBorder: end_time === formatDateToHHMMSS(hourFinal),
        id: id,
        location_id: location_id,
        location_name: "",
      };
      return;
    }

    return;
  });

  return objectToReturn;
};

const isElementsRangeHours = (array, dateRealHour) => {
  return array.some(({ start_time, end_time }) => {
    const dateStartTime =
      start_time === undefined || null
        ? null
        : start_time?.length === 0
        ? null
        : new Date(`2021-08-18T${start_time}`);

    const dateEndTime =
      end_time === undefined || null
        ? null
        : end_time?.length === 0
        ? null
        : new Date(`2021-08-18T${end_time}`);

    if (isRangeHours(dateRealHour, dateStartTime, dateEndTime)) {
      return true;
    } else {
      return false;
    }
  });
};

const setArrayBlockHourUser = (
  { realHour },
  dataSchedules,
  arrayHours,
  dateArraSumInit,
  dateArraSumFinal,
  isQuote,
  hash,
  endTimeSchedule,
  startTimeSchedule
) => {
  const dateRealHour = new Date(`2021-08-18T${realHour}`);
  const endTimeScheduleDate = new Date(`2021-08-18T${endTimeSchedule}`);
  const startTimeScheduleDate = new Date(`2021-08-18T${startTimeSchedule}`);

  if (isRangeHours(dateRealHour, startTimeScheduleDate, endTimeScheduleDate)) {
    if (Array.isArray(dataSchedules) && dataSchedules.length > 0) {
      return arrayHours.map((item, index) => {
        let hourIni = addMinutes(dateRealHour, dateArraSumInit[index]);
        let hourFinal = addMinutes(dateRealHour, dateArraSumFinal[index]);

        return eachArraySchedules(
          dataSchedules,
          realHour,
          hourIni,
          hourFinal,
          item,
          isQuote,
          hash
        );
      });
    }

    return arrayHours.map((item, index) => {
      let hourIni = addMinutes(dateRealHour, dateArraSumInit[index]);
      let hourFinal = addMinutes(dateRealHour, dateArraSumFinal[index]);

      if (isRangeHours(hourIni, startTimeScheduleDate, endTimeScheduleDate)) {
        return {
          ...item,
          is_quote: isQuote,
          status: 1,
          hour_ini: formatDateToHHMMSS(hourIni),
          hour_end: formatDateToHHMMSS(hourFinal),
        };
      }

      return {
        ...item,
        is_quote: isQuote,
        status: 2,
        hour_ini: formatDateToHHMMSS(hourIni),
        hour_end: formatDateToHHMMSS(hourFinal),
      };
    });
  }

  return arrayHours.map((item, index) => {
    let hourIni = addMinutes(dateRealHour, dateArraSumInit[index]);
    let hourFinal = addMinutes(dateRealHour, dateArraSumFinal[index]);

    if (isElementsRangeHours(dataSchedules, hourIni)) {
      return eachArraySchedules(
        dataSchedules,
        realHour,
        hourIni,
        hourFinal,
        item,
        isQuote,
        hash
      );
    }

    if (isRangeHours(hourIni, startTimeScheduleDate, endTimeScheduleDate)) {
      return {
        ...item,
        is_quote: isQuote,
        status: 1,
        hour_ini: formatDateToHHMMSS(hourIni),
        hour_end: formatDateToHHMMSS(hourFinal),
      };
    }

    return {
      ...item,
      is_quote: isQuote,
      status: 2,
      hour_ini: formatDateToHHMMSS(hourIni),
      hour_end: formatDateToHHMMSS(hourFinal),
    };
  });
};

const setArrayBlockHour = (
  { realHour },
  dataSchedules,
  arrayHours,
  dateArraSumInit,
  dateArraSumFinal,
  isQuote,
  hash
) => {
  const dateRealHour = new Date(`2021-08-18T${realHour}`);

  if (Array.isArray(dataSchedules) && dataSchedules.length > 0) {
    return arrayHours.map((item, index) => {
      let hourIni = addMinutes(dateRealHour, dateArraSumInit[index]);
      let hourFinal = addMinutes(dateRealHour, dateArraSumFinal[index]);
      let objectToReturn = {
        ...item,
        is_quote: isQuote,
        status: 0,
        hour_ini: formatDateToHHMMSS(hourIni),
        hour_end: formatDateToHHMMSS(hourFinal),
      };

      dataSchedules.forEach((schedule) => {
        const {
          start_time,
          end_time,
          activity_name,
          activity_id,
          id,
          location_id,
          location_name,
          color,
          is_quote,
          ...restData
        } = schedule;

        const dateStartTime =
          start_time === undefined || null
            ? null
            : start_time?.length === 0
            ? null
            : new Date(`2021-08-18T${start_time}`);

        const dateEndTime =
          end_time === undefined || null
            ? null
            : end_time?.length === 0
            ? null
            : new Date(`2021-08-18T${end_time}`);

        if (isRangeHours(hourIni, dateStartTime, dateEndTime)) {
          var exists = !hash[id];
          hash[id] = true;

          if (exists) {
            objectToReturn = {
              ...item,
              ...restData,
              is_quote,
              color,
              hour_ini: formatDateToHHMMSS(hourIni),
              hour_end: formatDateToHHMMSS(hourFinal),
              activity_name: activity_name,
              activity_id: activity_id,
              id: id,
              location_id: location_id,
              location_name: location_name,
            };
            return;
          }

          objectToReturn = {
            ...item,
            ...restData,
            status: restData.status,
            name_location: null,
            managers: [],
            Booking: null,
            capacity: null,
            is_quote,
            color,
            hour_ini: formatDateToHHMMSS(hourIni),
            hour_end: formatDateToHHMMSS(hourFinal),
            statusBorder: restData.end_date === formatDateToHHMMSS(hourFinal),
            activity_name: "",
            activity_id: activity_id,
            id: id,
            location_id: location_id,
            location_name: "",
          };
          return;
        }

        return;
      });

      return objectToReturn;
    });
  }

  return arrayHours.map((item, index) => {
    let hourIni = addMinutes(dateRealHour, dateArraSumInit[index]);
    let hourFinal = addMinutes(dateRealHour, dateArraSumFinal[index]);

    return {
      ...item,
      is_quote: isQuote,
      status: 1,
      hour_ini: formatDateToHHMMSS(hourIni),
      hour_end: formatDateToHHMMSS(hourFinal),
    };
  });
};

export const createBlockHours = (
  dataSchedules,
  arrayHours,
  dateArraSumInit = [0, 15, 30, 45],
  dateArraSumFinal = [15, 30, 45, 60],
  endTimeSchedule,
  startTimeSchedule,
  isQuote = false
) => {
  const hash = {};

  let blockHour = {};
  hours.forEach((hour) => {
    blockHour[hour.id] =
      endTimeSchedule !== undefined && startTimeSchedule !== undefined
        ? setArrayBlockHourUser(
            hour,
            dataSchedules,
            arrayHours,
            dateArraSumInit,
            dateArraSumFinal,
            isQuote,
            hash,
            endTimeSchedule,
            startTimeSchedule
          )
        : setArrayBlockHour(
            hour,
            dataSchedules,
            arrayHours,
            dateArraSumInit,
            dateArraSumFinal,
            isQuote,
            hash
          );
  });

  return blockHour;
};

export const setArrayWeeksDay = (array) => {
  const names = ["L - J", "L - J", "L - J", "L - J", "V", "S", "D", "F"];
  const daysWeekL_J = [1, 2, 3, 4];
  let arrDayWeek = [];
  let realIndex = 1;

  array &&
    array.forEach((schedule, index) => {
      if (daysWeekL_J.some((day) => day === schedule.day_week_id)) {
        if (realIndex === 1) {
          arrDayWeek.push({
            name: names[index],
            start_time: formatToHHMM(schedule.start_time),
            end_time: formatToHHMM(schedule.end_time),
          });
        }
      } else {
        arrDayWeek.push({
          name: names[index],
          start_time: formatToHHMM(schedule.start_time),
          end_time: formatToHHMM(schedule.end_time),
        });
      }
      realIndex += 1;
    });

  return arrDayWeek;
};

export const setArrayWeeksDayUser = (array) => {
  const names = ["L", "M", "M", "J", "V", "S", "D", "F"];
  let arrDayWeek = [];

  array &&
    array.forEach((schedule) => {
      if (names.some((_, idx) => idx === schedule.day_week_id - 1)) {
        arrDayWeek.push({
          name: names[schedule.day_week_id - 1],
          day_week_id: schedule.day_week_id,
          start_time: formatToHHMM(schedule.start_time),
          end_time: formatToHHMM(schedule.end_time),
        });
      }
    });

  return arrDayWeek;
};

export const checkSchedules = (schedules, shouldFlat = false) => {
  let arrToReturn = [];
  let schedulesToModified = shouldFlat ? [...schedules].flat() : [...schedules];

  schedulesToModified.forEach((schedule) => {
    if (schedule.start_time !== null && schedule.end_time !== null) {
      if (schedule.id) {
        arrToReturn.push({
          id: schedule.id,
          day_week_id: schedule.day_week_id,
          managers: schedule.managers,
          modality: schedule?.modality,
          start_time:
            schedule.start_time === null
              ? ""
              : schedule.start_time === "00:00:00"
              ? ""
              : schedule.start_time,
          end_time:
            schedule.end_time === null
              ? ""
              : schedule.end_time === "00:00:00"
              ? ""
              : schedule.end_time,
        });
        return;
      }

      arrToReturn.push({
        ...schedule,
        day_week_id: schedule.day_week_id,
        managers: schedule.managers,
        modality: schedule?.modality,
        start_time:
          schedule.start_time === null
            ? ""
            : schedule.start_time === "00:00:00"
            ? ""
            : schedule.start_time,
        end_time:
          schedule.end_time === null
            ? ""
            : schedule.end_time === "00:00:00"
            ? ""
            : schedule.end_time,
      });
    }
  });

  return arrToReturn;
};

export const checkDuration = (value) =>
  isDate(value) && value !== null
    ? formatDateToHHMMSS(value) === "00:00:00"
      ? null
      : value
    : null;

export const generateRandomColor = () => {
  const arrayColors = [
    "rgb(141 51 211 / 30%)",
    "rgb(98 149 250 / 30%)",
    "rgb(148 201 122 / 30%)",
    "rgb(237, 220, 210)",
    "rgb(197, 222, 221)",
    "rgb(188, 212, 230)",
    "rgb(156, 173, 206)",
    "rgb(126, 196, 207)",
    "rgb(209, 79, 123)",
  ];
  let colorRandom = Math.round(Math.random() * 6);

  return arrayColors[colorRandom];
};

export const sortStatus = (array) => {
  return (array || []).sort((a, b) => {
    if (a?.status > b?.status) {
      return -1;
    }
    if (a?.status < b?.status) {
      return 1;
    }
    return 0;
  });
};

export const sortAlph = (array) => {
  return (array || [])
    .filter((x) => x.name)
    .sort((a, b) => {
      if (a?.name < b?.name) {
        return -1;
      }
      if (a?.name > b?.name) {
        return 1;
      }
      return 0;
    });
};

export const checkVariable = (value) => (value ? value : "----");

export const successToast = {
  variant: "success",
  autoHideDuration: 2500,
};
export const errorToast = {
  variant: "error",
  autoHideDuration: 2500,
};

export const infoToast = {
  variant: "info",
  autoHideDuration: 2500,
};

export const objectSelectForm = [
  { id: 1, name: "alterado" },
  { id: 2, name: "no alterado" },
];

export const optionsTypesDocument = [
  { id: 10, name: "C.C." },
  { id: 20, name: "C.E." },
  { id: 30, name: "P.S." },
  { id: 50, name: "T.I" },
];

export const defaultBrands = {
  1: "Bodytech Colombia",
  2: "Athletic Colombia",
  3: "Bodytech Peru",
  4: "Bodytech Exterior",
};

export const frecuencyType = [
  {
    id: "hora",
    name: "Hora",
  },
  {
    id: "dia",
    name: "Día",
  },
  {
    id: "mes",
    name: "Mes",
  },
  {
    id: "ano",
    name: "Año",
  },
];

export const productType = [
  {
    id: 1,
    name: "producto",
  },
  {
    id: 2,
    name: "servicio",
  },
];

export const optionFood = [
  {
    id: 1,
    name: "1",
  },
  {
    id: 2,
    name: "2",
  },
  {
    id: 3,
    name: "3",
  },
  {
    id: 4,
    name: "4",
  },
  {
    id: 5,
    name: "5",
  },
  {
    id: 6,
    name: "6",
  },
  {
    id: 7,
    name: "7",
  },
];

export const optionWater = [
  {
    id: 1,
    name: "1",
  },
  {
    id: 2,
    name: "2",
  },
  {
    id: 3,
    name: "3",
  },
  {
    id: 4,
    name: "4",
  },
  {
    id: 5,
    name: "5",
  },
  {
    id: 6,
    name: "6",
  },
  {
    id: 7,
    name: "7",
  },
  {
    id: 8,
    name: "8",
  },
  {
    id: 9,
    name: "9",
  },
  {
    id: 10,
    name: "10",
  },
];

export const optionWaterJourney = [
  { value: "1 a 2" },
  { value: "3 a 5" },
  { value: "6 a 8" },
  { value: "10 +" },
];

export const daysFormAddDate = [
  { id: 1, name: "Lunes" },
  { id: 2, name: "Martes" },
  { id: 3, name: "Miercoles" },
  { id: 4, name: "Jueves" },
  { id: 5, name: "Viernes" },
  { id: 6, name: "Sabado" },
  { id: 7, name: "Domingo" },
  { id: 8, name: "Festivo" },
];

export const formatCurrency = (currency) => {
  return new Intl.NumberFormat().format(currency);
};

// promotions filter products
export const compareFilterOptions = (options, selectedProducts) => {
  return options.filter(
    (option) =>
      !selectedProducts?.some(
        (product) => Number(product.id) === Number(option._source.id)
      ) && option._source.product_prices
  );
};

// Capitalize words
export const capitalize = (word) => {
  const lower = word.toLowerCase();
  return word.charAt(0).toUpperCase() + lower.slice(1);
};

export const returnColorPriority = (priority) =>
  priority === "bajo"
    ? "#64AD88"
    : priority === "medio"
    ? "#F9E78A"
    : "#EC6969";

export const checkDayWeekNameById = (id) => {
  return daysWeekForSession[id - 1];
};

export const groupBy = (arr, criteria, typeReturn) => {
  const newObj = arr.reduce(function (acc, currentValue) {
    if (!acc[currentValue[criteria]]) {
      acc[currentValue[criteria]] = [];
    }
    acc[currentValue[criteria]].push(currentValue);
    return acc;
  }, {});

  return typeReturn === "object" ? newObj : Object.values(newObj);
};

export const testCapacityData = [
  {
    name: "5:00",
    aforo: 50,
  },
  {
    name: "5:30",
    aforo: 100,
  },
  {
    name: "6:00",
    aforo: 250,
  },
  {
    name: "6:30",
    aforo: 300,
  },
  {
    name: "7:00",
    aforo: 200,
  },
];

const calcMinuteForPixel = (eachMinuteCalendar) => {
  const HEIGHT_BLOCK = 41;
  return HEIGHT_BLOCK / eachMinuteCalendar;
  // return 1.36666667;
};

const calcTopPixelsToSub = (
  isHourAvailable,
  isHeaderDate,
  eachMinuteCalendar
) => {
  if (eachMinuteCalendar === 60) {
    return isHourAvailable ? (isHeaderDate ? 164 : 165) : 164;
  }
  return isHourAvailable ? (isHeaderDate ? 328 : 330) : 328;
};

const calcBottomPixelsToSub = (
  isHourAvailable,
  isHeaderDate,
  eachMinuteCalendar
) => {
  if (eachMinuteCalendar === 60) {
    // 164.5
    return isHourAvailable ? (isHeaderDate ? 165.5 : 165.5) : 165;
  }
  return isHourAvailable ? (isHeaderDate ? 329 : 331) : 330;
};

export const calculateInsetSchedules = ({
  initHour,
  finalHour,
  isHourAvailable = false,
  isHeaderDate = false,
  eachMinuteCalendar = 30,
}) => {
  const convHourStart = convertH2M(initHour);
  const convHourEnd = convertH2M(finalHour);

  const calcMinuteForPixelVar = calcMinuteForPixel(eachMinuteCalendar);
  const subTopPixels = calcTopPixelsToSub(
    isHourAvailable,
    isHeaderDate,
    eachMinuteCalendar
  );
  const subBottomPixels = calcBottomPixelsToSub(
    isHourAvailable,
    isHeaderDate,
    eachMinuteCalendar
  );

  const multStart = convHourStart * calcMinuteForPixelVar;
  const mulEnd = convHourEnd * calcMinuteForPixelVar;

  const top = `${multStart - subTopPixels}px`;
  const right = "0%";
  const bottom = `-${mulEnd - subBottomPixels}px`;

  return `${top} ${right} ${bottom}`;
};

export const removeItemFromArr = (arr, id) => arr.filter((e) => e.id !== id);

//Rol type Appoinment
export const DataAppoinmentMycoach = [
  // {
  //   id: 6,
  //   name: "Bienvenida My coach",
  // },
  {
    id: 7,
    name: "Seguimiento My coach",
  },
  {
    id: 8,
    name: "Cierre my coach",
  },
];

export const DataAppoinmentMycoachVirtual = [
  // {
  //   id: 9,
  //   name: "Bienvenida nutrición",
  // },
  {
    id: 10,
    name: "Seguimiento My coach nutrición",
  },
  {
    id: 11,
    name: "Cierre my coach nutrición",
  },
];
