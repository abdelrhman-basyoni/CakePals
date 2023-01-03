
import { PipelineStage } from 'mongoose'
export const findCakesByRadiusAndType = (location:[number,number],cakeType:string) :PipelineStage[] => {
    let pipeline : PipelineStage[];
    pipeline =   [
        {
            '$geoNear': {
                'near': {
                    'type': 'Point',
                    'coordinates': [
                        location[0],location[1]
                    ]
                },
                'distanceField': 'distance',
                'maxDistance': 2000,
                'spherical': true
            }
        }, {
            '$lookup': {
                'from': 'cakes',
                'let': {
                    'bakerId': '$_id'
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$baker', '$$bakerId'
                                        ]
                                    }, {
                                        '$eq': [
                                            '$cakeType', cakeType
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                'as': 'cakes'
            }
        }, {
            '$unwind': {
                'path': '$cakes'
            }
        }, {
            '$group': {
                '_id': null,
                'cakes': {
                    '$push': '$cakes'
                }
            }
        }
    ]

    return pipeline
}
