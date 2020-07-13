const templateAction={
    editAction:{
        title:' 编辑',
        id:'edit_this',
        // image:'../../assets/images/edit.png'
        className:"esri-icon-edit"
    },
    imgAction:{
        title:` 图片`,
        id:'img_this',
        className:'esri-icon-media'
    },
    videoAction:{
        title:'视频',
        id:'video_this',
        className:'esri-icon-play-circled'
    },
    videoAction_SZ:{
        title:'视频',
        id:'video_this_SZ',
        className:'esri-icon-play-circled'
    },
    actions_sz:{
        title:'控制',
        id:'action_this_SZ',
        className:'esri-icon-settings2'
    },
    pipePoint_details:{
        title:"详情",
        id:"pipePoint_details",
        className:'esri-icon-layer-list'
    },
}
const editThisAction = {
    title: "历史轨迹",
    id: "edit-guiji",
    className: "esri-icon-applications"
};

export const markerSyConfig={
    PipePointFeatureLayer_Fields:[{
        name: "OJBEDTID",
        alias: "OJBEDTID",
        // type: "oid"
        type:'string'
    }, {
        name: "name",
        alias: "name",
        type: "string"
    }, {
        name: "address",
        alias: "address",
        type: "string"
    }, {
        name: "lon",
        alias: "lon",
        type: "double"
    }, {
        name: "lat",
        alias: "lat",
        type: "double"
    },
    {
        name: "id",
        alias: "id",
        type: "string"
    },
    {
        name: "companyName",
        alias: "companyName",
        type: "string"
    },
    {
        name: "typeName",
        alias: "typeName",
        type: "string"
    },
    {
        name: "customerName",
        alias: "customerName",
        type: "string"
    },
    {
        name: "code",
        alias: "code",
        type: "string"
    }],
    LabelClass_HDLL : {
        symbol: {
            type: "text",
            color: "#000",
            haloColor: 'white',
            haloSize: 2,
            font: {
                size: 10,
                weight: "bold"
            },
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
            expression: "$feature.name"
        },
        // maxScale: 0,
        // minScale: 50000
    },
    PopupTemplate_HDLL : {
        title: "{name}",
        actions:[templateAction.pipePoint_details],
        content: [{
            type: "fields",
            fieldInfos: [{
                fieldName: "name",
                label: "名称",
                format: {
                    places: 0,
                    digitSeparator: true
                }
            }, {
                fieldName: "lon",
                label: "经度",
                format: {
                    places: 5,
                    digitSeparator: true
                }
            }, {
                fieldName: "lat",
                label: "纬度",
                format: {
                    places: 5,
                    digitSeparator: true
                }
            },
            {
                fieldName: "code",
                label: "编号",
                format: {
                    places: 10,
                    digitSeparator: true
                }
            },
            {
                fieldName: "companyName",
                label: "施工单位",
                format: {
                    places: 10,
                    digitSeparator: true
                }
            },
            {
                fieldName: "customerName",
                label: "设计单位",
                format: {
                    places: 10,
                    digitSeparator: true
                }
            },
            {
                fieldName: "typeName",
                label: "工程类型",
                format: {
                    places: 10,
                    digitSeparator: true
                }
            },
            {
                fieldName: "id",
                label: "id",
                format: {
                    places: 5,
                    digitSeparator: true,
                    show: false
                }
            }
          ]
        }]
    },
    RENDERER_HDLL : {
        type: "unique-value",
        field: 'name',
        defaultSymbol: {
            type: "picture-marker",
            url: "assets/images/project_map/shigong.png",
            width: 28,
            height: 28,
            angle: 0
        }
    }
}

export const AisSymConfig={
    label:{
        symbol: {
            type: "text",
            color: "green",
            haloColor: 'white',
            haloSize: 1,
            font: {
              size: 8,
              weight: "bold"
            },
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
        expression: "$feature.name"
        },
        maxScale: 0,
        minScale: 50000
    },
    popupTemplate: {
        title: "{name}",
        content: [{
            type: "fields",
            fieldInfos: [{
            fieldName: "name",
            label: "名称",
            format: {
                places: 0,
                digitSeparator: true
            }
            }, {
            fieldName: "mmsi",
            label: "MMSI",
            format: {
                places: 0,
                digitSeparator: true
            }
            }, {
            fieldName: "angle",
            label: "  航向",
            format: {
                places: 0,
                digitSeparator: true
            }
            }, {
            fieldName: "rot",
            label: "转速",
            format: {
                places: 0,
                digitSeparator: true
            }
            }, {
            fieldName: "lon",
            label: "经度",
            format: {
                places: 5,
                digitSeparator: true
            }
            }, {
            fieldName: "lat",
            label: "纬度",
            format: {
                places: 5,
                digitSeparator: true
            }
            }, {
            fieldName: "lastestTime",
            label: "时间",
            format: {
                places: 5,
                digitSeparator: true
            }
            },]
        }],
        // actions: [editThisAction]
        },
        shipLayerField :[{
            name: "OJBEDTID",
            alias: "OJBEDTID",
            type: "oid"
            }, {
            name: "name",
            alias: "name",
            type: "string"
            }, {
            name: "angle",
            alias: "angle",
            type: "double"
            }, {
            name: "lon",
            alias: "lon",
            type: "double"
            }, {
            name: "lat",
            alias: "lat",
            type: "double"
            }, {
            name: "type",
            alias: "type",
            type: "string"
            }, {
            name: "lastestTime",
            alias: "lastestTime",
            type: "string"
            }, {
            name: "mmsi",
            alias: "mmsi",
            type: "double"
            }, {
            name: "navigationStatus",
            alias: "navigationStatus",
            type: "string"
            }, {
            name: "rot",
            alias: "rot",
            type: "double"
            }, {
            name: "sog",
            alias: "sog",
            type: "double"
        }]
}