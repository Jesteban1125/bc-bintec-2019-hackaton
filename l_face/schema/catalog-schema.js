function getSchema(){
    return{
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title" : "Empty Schema",
        "type" : "object",
        "properties":{
            "catalogName":{"type":"string"},
            "items":{
                "type":"array",
                "items":{"type":"object"}
            }
        },
        "additionalProperties":false,
        "required":["catalogName","items"]
    }
}

module.exports.getSchema = getSchema;