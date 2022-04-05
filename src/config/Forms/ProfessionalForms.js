export const SkillsMedicalForm = [
    {
        className: 'col-12',
        label: 'Nombre',
        required: true,
        name: 'name'
    },
    {
        className: 'col-12',
        label: 'Descipción',
        required: false,
        name: 'description',
        rows: 4
    }
];

export const TypeMedicalPracticeForm = [
    {
        className: 'col-12',
        label: 'Nombre',
        required: true,
        name: 'name'
    }
];

export const MedicalProfileForm = {
    form:[{
        className: 'col-12',
        label: 'Nombre',
        required: true,
        name: 'name'
    },
    {
        className: 'col-12',
        label: 'Objetivo',
        required: true,
        name: 'objectives',
        rows: 4
    }],
    skills:[{
        className: 'col-12',
        label: 'Habilidad Medicas',
        required: true,
        name: 'skills_medical_profiles_id',
        rows: 4
    }],
    practice:[{
        className: 'col-12',
        label: 'Practica Medica',
        required: true,
        name: 'type_medical_practice_id',
        rows: 4
    }]
};

export const ProfessionalMedialForm = {
    form_one:[{
        className: 'col-4',
        label: 'Nombre',
        required: true,
        name: 'first_name'
    },
    {
        className: 'col-4',
        label: 'Apellido',
        required: true,
        name: 'last_name'
    },
    {
        className: 'col-4',
        label: 'Tarjeta Profesional',
        required: true,
        name: 'professional_card'
    }],
    typeDocuments:[{
        className: 'col-4',
        label: 'Tipo',
        required: true,
        name: 'document_type'
    }],
    form_two:[{
        className: 'col-4',
        label: 'Número de documento',
        required: true,
        name: 'document_number'
    }],
    form_four:[{
        className: 'col-4',
        label: 'Perfil Medico',
        required: true,
        name: 'medical_profiles_id'
    }],
    form_five:[{
        className: 'col-4',
        label: 'Correo corporativo',
        required: true,
        name: 'corporate_email'
    },
    {
        className: 'col-4',
        label: 'Número de teléfono',
        required: true,
        name: 'phone_number'
    }]
}

export const selectDayWeek = [
    {
        className: 'col-12',
        label: 'Dia de la semana',
        required: true,
        name: 'day_week_id'
    }
]

export const venueSchedulesForm = {
    venue:[{
        className: 'col-12',
        label: 'Seleccionar Sede',
        required: true,
        name: 'venue_id',
    }],
    medicalProfile:[{
        className: 'col-12',
        label: 'Perfil Medico',
        required: true,
        name: 'medical_profile',
    }],
    professionalCard:[{
        className: 'col-12',
        label: 'Número profesional',
        required: true,
        name: 'professional_card',
    }],
    form:[{
        className: 'col-6',
        label: 'Hora Inicio',
        required: true,
        name: 'start_time',
        type:'time'
    },
    {
        className: 'col-6',
        label: 'Hora Final',
        required: true,
        name: 'end_time',
        type:'time'
    },
    ],
}

