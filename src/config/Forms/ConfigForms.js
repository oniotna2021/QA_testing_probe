export const MuscleGroupsForm = [
    {
        className: 'col-8',
        label: 'Nombre',
        type: 'text',
        required: true,
        name: 'name'
    },
];

export const MovementsForm = [
    {
        className: 'col-8',
        label: 'Nombre',
        type: 'text',
        required: true,
        name: 'name'
    },
];

export const ObjetctivesForm = [
    {
        className: 'col-8',
        label: 'Nombre',
        type: 'text',
        required: true,
        name: 'name'
    },
];

export const MedicalConditionsForm = [
    {
        className: 'col-8',
        label: 'Nombre',
        type: 'text',
        required: true,
        name: 'name'
    },
];

export const TrainingLevelsForm = [
    {
        className: 'col-8',
        label: 'Nombre',
        type: 'text',
        required: true,
        name: 'name'
    },
];

export const TrainingStepsForm = [
    {
        className: 'col-8',
        label: 'Nombre',
        type: 'text',
        required: true,
        name: 'name'
    },
];

export const TrainingPlacesForm = [
    {
        className: 'col-8',
        label: 'Nombre',
        type: 'text',
        required: true,
        name: 'name'
    },
];

export const TrainersForm = [
    {
        className: 'col-12',
        label: 'Nombre',
        type: 'text',
        required: true,
        name: 'name'
    },
    {
        className: 'col-12',
        label: 'Número de documento',
        type: 'text',
        required: true,
        name: 'document_number'
    },
];

export const SessionsFormOne = [
    {
        className: 'col-12 mt-1',
        label: 'Objetivos',
        required: true,
        multiple: true,
        dataSelect: [],
        name: 'goals'
    },
    {
        className: 'col-12 mt-1',
        label: 'Descripción',
        type: 'text',
        rows: 8,
        required: true,
        name: 'long_description'
    },
];

export const SessionsFormTwo = [
    {
        className: 'col-12 mb-4',
        label: 'Nivel',
        required: true,
        mT: 5,
        name: 'training_levels',
        dataSelect: [],
        type: 'select'
    },
    {
        className: 'col-12',
        label: 'Recomendado para',
        required: false,
        multiple: true,
        mT: -3,
        name: 'pathologies',
        dataSelect: []
    },
    {
        className: 'col-12',
        label: 'Contraindicaciones',
        multiple: true,
        required: false,
        name: 'contraindications',
        dataSelect: []
    }
]

export const TrainingElementsForm = [
    {
        className: 'col-10 mb-2 ms-3',
        label: 'Nombre',
        type: 'text',
        required: true,
        name: 'name'
    },
];

export const ExercisesForm = {

    form_one: [{
        className: 'col-12',
        label: 'Nombre',
        type: 'text',
        required: true,
        name: 'name'
    },
    {
        className: 'col-12',
        label: 'Duración por segundo',
        type: 'number',
        required: true,
        name: 'duration',
        min: 0
    },
    {
        className: 'col-12',
        label: 'Descripción',
        type: 'text',
        rows: 4,
        required: true,
        name: 'description'
    }],
    form_two: [
        /*{
            className: 'col-6',
            label: 'Url del video',
            type: 'text',
            required: true,
            name: 'video_url'
        },
        {
            className: 'col-6',
            label: 'Url del video horizontal',
            type: 'text',
            required: true,
            name: 'video_url_landscape'
        },*/
        {
            className: 'col-6',
            label: 'Url de la imagen',
            type: 'text',
            required: true,
            name: 'image_desktop'
        },
        {
            className: 'col-6',
            label: 'Url de la imagen movil',
            type: 'text',
            required: true,
            name: 'image_mobile'
        }
    ]
};

export const ObjectivesSelect = [
    {
        className: 'col-12',
        label: 'Objetivos',
        required: true,
        name: 'goals',
    }
]

export const MuscularGroupsSelect = [
    {
        className: 'col-12',
        label: 'Grupos Musculares',
        required: true,
        name: 'muscle_groups',
    }
];

export const MedicalConditionsSelect = [
    {
        className: 'col-12',
        label: 'Condiciones Medicas',
        required: true,
        name: 'pathologies',
    }
];

export const SurgeryTimesSelect = [
    {
        className: 'col-12',
        label: 'Tiempos de Cirugia',
        required: true,
        name: 'time',
    }
];

export const FamilyHistorySelect = [
    {
        className: 'col-12',
        label: 'Atecedentes Familiares',
        required: true,
        name: 'time',
    }
];

export const InterventionDiagnosisProcedureSelect = [
    {
        className: 'col-12',
        label: 'Tecnología en salud',
        required: true,
        name: 'health-technology',
    }
];

export const TrainingElementsSelect = [
    {
        className: 'col-12',
        label: 'Elementos de Entrenamiento',
        required: true,
        name: 'training_elements',
    }
];

export const TrainingStepsSelect = [
    {
        className: 'col-12',
        label: 'Etapas de Entrenamiento',
        required: true,
        name: 'training_steps',
    }
];

export const TrainingLevelsSelect = [
    {
        className: 'col-12',
        label: 'Nivel de Entrenamiento',
        required: true,
        name: 'training_levels',
    }
];

export const TrainingPlacesSelect = [
    {
        className: 'col-12',
        label: 'Lugares de Entrenamiento',
        required: true,
        name: 'training_places',
    }
];

export const LinkTypesForm = [
    {
        className: 'col-6',
        label: 'Código externo',
        type: 'number',
        required: false
    }, {
        className: 'col-6',
        label: 'Descripción',
        type: 'text',
        required: true
    }
];


