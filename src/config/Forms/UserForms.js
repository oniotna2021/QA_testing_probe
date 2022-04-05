export const MedicalProfessionalForm = [
    {
        className: 'col-6',
        label: 'Nombre',
        type: 'text',
        required: true,
        name: 'first_name'
    },
    {
        className: 'col-6',
        label: 'Apellido',
        type: 'text',
        required: true,
        name: 'last_name'
    },
    
];

export const MedicalProfessionalTwoForm = [

    {
        className: 'col-6',
        label: 'Número de Documento',
        type: 'number',
        required: true,
        name: 'document_number'
    },
    {
        className: 'col-6',
        label: 'Telefono',
        type: 'number',
        required: true,
        name: 'phone_number'
    },
    {
        className: 'col-6',
        label: 'Correo corporativo',
        type: 'text',
        required: true,
        name: 'corporate_email'
    },
];

export const MedicalProfessionalDocumentSelectForm = [
    {
        className: 'col-6',
        label: 'Tipo de documento',
        required: true,
        name: 'document_type'
    }
];

export const MedicalProfessionalSelectSedesForm = [
    {
        className: 'col-12',
        label: 'Sedes',
        required: true,
        name: 'sedes'
    }
]