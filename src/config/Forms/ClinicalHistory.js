export const IdentificationForm = {
    form_one:[{
        className: 'col-12',
        label: 'Tipo de documento',
        type: 'text',
        required: true,
        name: 'type-document',
    }],
    form_two:[{
        className: 'col-12',
        label: 'Número de documento',
        type: 'text',
        required: true,
        name: 'number-document',
    }],
    form_tree:[{
        className: 'col-12',
        label: 'Fecha de nacimiento',
        type: 'date',
        required: true,
        name: 'birthday-day',
    }],
}

export const EpsSelect = {
    select:[{
        className: 'col-12',
        label: 'Entidad Promotora de Salud',
        required: true,
        name: 'eps',
    }]
}

export const AdminSelect = {
    select:[{
        className: 'col-12',
        label: 'Administrador',
        required: true,
        name: 'admin',
    }]
}

export const LinkTypeSelect = {
    select:[{
        className: 'col-12',
        label: 'Tipo de vinculación',
        required: true,
        name: 'type_vinculation',
    }]
}

export const TerritorialEntitySelect = {
    select:[{
        className: 'col-12',
        label: 'Entidad Territorial',
        required: true,
        name: 'territorial_entity',
    }]
}

export const DisabilitySelect = {
    select:[{
        className: 'col-12',
        label: 'Categoria de discapacidad',
        required: true,
        name: 'disability_category',
    }]
}

export const TerritorialZoneSelect = {
    select:[{
        className: 'col-12',
        label: 'Zona territorial',
        required: true,
        name: 'territorial_zone',
    }]
}

export const PaternSelect = {
    select:[{
        className: 'col-12',
        label: 'Parentesco',
        required: true,
        name: 'relationship_emergency_contact',
    }]
}

export const ResidenceAddressForm = {
    form_one:[{
        className: 'col-12',
        label: 'Dirección de residencia',
        type: 'text',
        required: true,
        name: 'residence_address',
    },{
        className: 'col-12',
        label: 'Teléfono',
        type: 'text',
        required: true,
        name: 'phone_number',
    },{
        className: 'col-12',
        label: 'Nombre de contacto de emergencia',
        type: 'text',
        required: true,
        name: 'name_emergency_contact',
    },{
        className: 'col-12',
        label: 'Número de teléfono',
        type: 'text',
        required: true,
        name: 'phone_emergency_contact', 
    }],
}

export const CountrySelect = {
    select:[{
        className: 'col-12',
        label: 'País de residencia',
        required: true,
        name: 'country_of_residence',
    }]
}

export const CitySelect = {
    select:[{
        className: 'col-12',
        label: 'Municipio',
        required: true,
        name: 'municipality',
    }]
}

export const ReasonMedicalForm = {
    form_tree:[{
        className: 'col-12',
        label: 'Objetivo',
        type: 'text',
        required: true,
        name: 'bodytech_objective',
    }],
}

export const SportsHistoryForm = {
    frequency: [
        {
            className: 'col-6',
            label: 'Frecuencia',
            type: 'text',
            required: true,
            name: 'frecuency'
        }
    ],
    intensity: [
        {
            className: 'col-6',
            label: 'Intencidad',
            type: 'text',
            required: true,
            name: 'intensity'
        }
    ],
    hour: [
        {
            className: 'col-6',
            label: 'Hora',
            type: 'time',
            required: true,
            name: 'hour-activity'
        }
    ],
    duration: [
        {
            className: 'col-6',
            label: 'Duración',
            type: 'text',
            required: true,
            name: 'time-activity'
        }
    ]     
};

export const PhysicalExaminationForm = {
    select_one:[{
        className: 'col-6',
        label: 'Equilibrio unipodal',
        type: 'number',
        required: false,
        name: "one-foot-balance",
    }], 
    select_two:[{
        className: 'col-6',
        label: 'Marcha',
        type: 'text',
        required: true,
        name: 'march',
    }],
    select_tree:[{
        className: 'col-6',
        label: 'Marcha Estacionaria',
        type: 'text',
        required: true,
        name: 'stationary-gear',
    }],
    form_one:[{
        className: 'col-6',
        label: 'Riesgo caidas',
        type: 'text',
        required: true,
        name: "risk-of-falls",
    }],
    select_four:[{
        className: 'col-12',
        label: 'Resultado riesgo OM',
        type: 'text',
        required: true,
        name: "risk-result",
    }],
    form_two:[{
        className: 'col-12',
        label: 'Observaciones',
        type: 'text',
        required: true,
        rows: 4,
        name: 'observation',
    }]
}

export const PhysicalMovementsForm = {
    select_one:[{
        className: 'col-12',
        label: 'Movilidad del tren superior',
        type: 'text',
        required: false,
        name: 'up-body',
    }],
    select_two:[{
        className: 'col-12',
        label: 'Espalda',
        type: 'text',
        required: false,
        name: 'back',
    }],
    select_tree:[{
        className: 'col-12',
        label: 'Cadena cinética Superior',
        type: 'text',
        required: false,
        name: 'superior-kinetic-chain',
    }],
    select_four:[{
        className: 'col-12',
        label: 'Cadena cinetica Inferior',
        type: 'text',
        required: false,
        name: 'lower-kinetic-chain',
    }],
    form_one:[{
        className: 'col-12',
        label: 'Descripcion de los hallazgos de postura',
        type: 'text',
        required: true,
        name: 'posture-findings',
        rows: 4
    },
    {
        className: 'col-12',
        label: 'Streching de isquiotibia',
        type: 'text',
        required: true,
        name: 'stretching',
    },
    {
        className: 'col-12',
        label: 'Observaciones',
        type: 'text',
        required: true,
        name: 'observations-stretching',
        rows: 4
    }],
    form_two:[{
        className: 'col-12',
        label: 'Test de 1.5 millas / Test de los 6 min',
        type: 'text',
        required: true,
        name: 'mile-test',
        rows: 4
    },
    {
        className: 'col-12',
        label: 'Descripción de los hallazgos',
        type: 'text',
        required: true,
        name: 'description-findings',
        rows: 4
    },
    {
        className: 'col-12',
        label: 'Observaciones',
        type: 'text',
        required: true,
        name: 'observations-findings',
        rows: 4
    }],
    select_five:[{
        className: 'col-12',
        label: 'Cabeza',
        type: 'text',
        required: false,
        name: 'head',
    }],
    form_tree:[{
        className: 'col-12',
        label: 'Observaciones',
        type: 'text',
        required: true,
        name: "observations-head",
        rows: 3
    }],
    select_six:[{
        className: 'col-12',
        label: 'Cuello',
        type: 'text',
        required: false,
        name: 'neck',
    }],
    form_four:[{
        className: 'col-12',
        label: 'Observaciones',
        type: 'text',
        required: true,
        name: "observations-neck",
        rows: 3
    }],
    select_seven:[{
        className: 'col-12',
        label: 'Torax',
        type: 'text',
        required: false,
        name: "torax",
    }],
    form_five:[{
        className: 'col-12',
        label: 'Observaciones',
        type: 'text',
        required: true,
        name: "observations-torax",
        rows: 3
    }],
    select_eight:[{
        className: 'col-12',
        label: 'Extremidades',
        type: 'text',
        required: false,
        name: 'extremities',
    }],
    form_six:[{
        className: 'col-12',
        label: 'Observaciones',
        type: 'text',
        required: true,
        name: "observations-extremities",
        rows: 3
    }],
    select_nine:[{
        className: 'col-12',
        label: 'Neurologico',
        type: 'text',
        required: false,
        name: 'neurological',
    }],
    form_seven:[{
        className: 'col-12',
        label: 'Observaciones',
        type: 'text',
        required: true,
        name: "observations-neurological",
        rows: 3
    }]
}

