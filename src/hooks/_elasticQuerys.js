//Query para plan de entramiento.
export const generateQueryElastic = (value) => {
    const dataQueryElastic = [
        {
            "multi_match": {
                "query": 0,
                "fields": ['is_personalized']
            }
        }, {
            "multi_match": {
                "query": 0,
                "fields": ['is_plan_by_goals']
            }
        },
        {
            "multi_match": {
                "query": 0,
                "fields": ['is_daily_training']
            }
        }
    ];
    for (const key in value.goals) {
        dataQueryElastic.push({
            "multi_match": {
                "query": value.goals[key].id,
                "fields": [
                    `${'goals'}.id`
                ]
            }
        })
    }
    for (const key in value.trainingLevel) {
        dataQueryElastic.push({
            "multi_match": {
                "query": value.trainingLevel[key].id,
                "fields": [
                    `${'training_levels'}.id`
                ]
            }
        })
    }

    for (const key in value.placeTraining) {
        dataQueryElastic.push({
            "multi_match": {
                "query": value.placeTraining[key].id,
                "fields": [
                    `${'training_places'}.id`
                ]
            }
        })
    }


    for (const key in value.contrains) {
        dataQueryElastic.push({
            "multi_match": {
                "query": value.contrains[key].id,
                "fields": [
                    `${'contraindications'}.id`
                ]
            }
        })
    }

    return dataQueryElastic;
}


export const generateQueryElasticForNutricion = (value) => {
    const dataQueryElastic = [];
    for (const key in value.nutrition_goals) {
        dataQueryElastic.push({
            "multi_match": {
                "query": value.nutrition_goals[key].id,
                "fields": [
                    `${'nutrition_goals'}.id`
                ],
                "operator": "or",
                "minimum_should_match": 2,
                "type": "cross_fields"
            }
        })
    }

    for (const key in value.type_alimentations_id) {
        dataQueryElastic.push({
            "multi_match": {
                "query": value.type_alimentations_id[key].id,
                "fields": [
                    `${'type_alimentations_id'}.id`
                ],
                "operator": "or",
                "minimum_should_match": 2,
                "type": "cross_fields"
            }
        })
    }

    for (const key in value.food_type) {
        dataQueryElastic.push({
            "multi_match": {
                "query": value.food_type[key].id,
                "fields": [
                    `${'food_type'}.id`
                ],
                "operator": "or",
                "minimum_should_match": 2,
                "type": "cross_fields"
            }
        })
    }
    return dataQueryElastic;
}



export const generateQueryElasticExerciceTags = (tags) => {
    const dataQueryElastic = [{
        "multi_match": {
            "query": "1",
            "fields": "status"
        }
    }];
    for (const key in tags) {
        dataQueryElastic.push({
            "multi_match": {
                "query": tags[key],
                "fields": [
                    "name^10",
                    "muscle_groups.name^9",
                    "muscle_groups.equivalent_names.name",
                    "pathologies.name",
                    "pathologies.equivalent_names.name",
                    "training_elements.equivalent_names.name^6",
                    "training_elements.name^7",
                    "training_levels.name",
                    "training_places.name",
                    "training_steps.name^5",
                    "movements.name",
                    "movements.equivalent_names.name^8"
                ],
                "operator": "or",
                "minimum_should_match": 2,
                "type": "cross_fields"
            }
        })
    }

    return dataQueryElastic;
}



export const generateQueryElasticForNutritionTemplates = (value) => {
    const dataQueryElastic = [];
    for (const key in value.nutrition_goals) {
        dataQueryElastic.push({
            "multi_match": {
                "query": value.nutrition_goals[key].id,
                "fields": [
                    `${'goal_id'}`
                ]
            }
        })
    }

    for (const key in value.type_alimentations_id) {
        dataQueryElastic.push({
            "multi_match": {
                "query": value.type_alimentations_id[key].id,
                "fields": [
                    `${'type_alimentation_id'}`
                ]
            }
        })
    }
    return dataQueryElastic;
}

export const generateQueryElasticForNutritionTemplatesByTags = (tags) => {
    const dataQueryElastic = []
    for (const key in tags) {
        dataQueryElastic.push({
            multi_match: {
                query: tags[key],
                fields: [
                    "name",
                    "goal_name",
                    "type_alimentation_name"
                ],
                operator: "or",
                minimum_should_match: 1,
                type: "cross_fields",
            }
        })
    }
    return dataQueryElastic;
}

