
export const MainForms = [
    {
        className: 'col-12',
        label: 'Nombre',
        type: 'text',
        required: true,
        name: 'name'
    },
    {
        className: 'col-12',
        label: 'Descripción',
        type: 'text',
        required: true,
        name: 'description',
        rows: 5
    },
];


export const NewMainForms = [
    {
        className: 'col-4',
        label: 'Nombre',
        type: 'text',
        required: true,
        name: 'name'
    },
    {
        className: 'col-4',
        label: 'Nombre de sistema',
        type: 'text',
        required: true,
        name: 'slug',
    }
];

export const NewTypeMainForms = [
    {
        className: 'col-4',
        label: 'Tipo de campo',
        required: true,
        name: 'input_field_type_id'
    }
]

export const NewEntityMainForms = [
    {
        className: 'col-4',
        label: 'Entidad',
        required: true,
        name: 'entity'
    }
]

export const NewMainFormsTwo = [
    {
        className: 'col-4',
        label: 'Valor Predeterminado',
        type: 'text',
        required: false,
        name: 'default_value'
    }
]

export const NewEntityMedicalProfileForms = [
    {
        className: 'col-12',
        label: 'Perfiles Medicos',
        required: true,
        name: 'medical_profiles'
    }
]