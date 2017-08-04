/**
 * @author Ian
 * @created 2017-04-28 16:48:21
 */
import { BS } from 'dove.max.sdk'
import { SysConfig } from '../data/sys-config'


const ToolsType = {
  WS: 'websocket-server',
  NTASK: 'native-task',
  STOP_NTASK: 'stop-native-task'
}


const ToolsMap = {
  // common
  'get.image.thumb': { type: ToolsType.WS, cli: 'aiexifcool/common/index', action: 'getImageThumb' },

  // fix
  'start.fix.image': { type: ToolsType.WS, cli: 'aiexifcool/fix.image/index', action: 'startFix' },
  'stop.fix.image': { type: ToolsType.WS, cli: 'aiexifcool/fix.image/index', action: 'stopFix' },

  // remove
  'start.remove.exif': { type: ToolsType.WS, cli: 'aiexifcool/remove.exif/index', action: 'removeExif' },
  'stop.remove.exif': { type: ToolsType.WS, cli: 'aiexifcool/remove.exif/index', action: 'stopRemove' },

  // modify
  'get.exif': { type: ToolsType.WS, cli: 'aiexifcool/edit.image/index', action: 'getExifInfo' },
  'start.modify.exif': { type: ToolsType.WS, cli: 'aiexifcool/edit.image/index', action: 'modifyExifInfo' },
  'stop.modify.exif': { type: ToolsType.WS, cli: 'aiexifcool/edit.image/index', action: 'stopModify' },


  // ////////////////////////////////////////////////////////////////////////////////////////////////////
  'gif2apng': { type: ToolsType.NTASK, cli: BS.b$.App.getAppPluginDir() + '/CLIgif2apng', command: [], mainThread: false },
  'stop.gif2apng': { type: ToolsType.STOP_NTASK, command: ['stop', 'calltask'] }
}

//
const ServerAPIType = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT'
}
const ServerAPIMap = {
  'get.data_categories':{api: SysConfig.apiHost + '/v1.0.0/data_categories',type: ServerAPIType.GET},
  'get.data_categories_item':{api: SysConfig.apiHost + '/v1.0.0/get_all_categories_for_item',type: ServerAPIType.GET},
  'get.data_categories_set':{api: SysConfig.apiHost + '/v1.0.0/get_all_categories_for_set',type: ServerAPIType.GET},
  'get.data_categories_tags_item':{api: SysConfig.apiHost + '/v1.0.0/get_all_categories_tags_for_item',type: ServerAPIType.GET},
  'get.data_categories_tags_set':{api: SysConfig.apiHost + '/v1.0.0/get_all_categories_tags_for_set',type: ServerAPIType.GET},
  'get.data_tags':{api: SysConfig.apiHost + '/v1.0.0/data_tags',type: ServerAPIType.GET},
  'get.data_sets':{api: SysConfig.apiHost + '/v1.0.0/data_sets',type: ServerAPIType.POST},
  'get.data_items':{api: SysConfig.apiHost + '/v1.0.0/data_items',type: ServerAPIType.POST},

  'get.items':{api: SysConfig.apiHost + '/v1.0.0/items',type: ServerAPIType.POST},
  'get.items_tag_id':{api: SysConfig.apiHost + '/v1.0.0/items_by_tag_id/',type: ServerAPIType.POST},


  'get.sets':{api: SysConfig.apiHost + '/v1.0.0/sets',type: ServerAPIType.POST},
  'get.sets_tag_id':{api: SysConfig.apiHost + '/v1.0.0/sets_by_tag_id/',type: ServerAPIType.POST},
///////获取图集内单个图片的数据
  'get.sets_items_order':{api: SysConfig.apiHost + '/v1.0.0/sets_items_order/',type: ServerAPIType.GET},
///////获取轮播图数据
  'get.data_sys_push':{api: SysConfig.apiHost + '/v1.0.0/data_sys_push',type: ServerAPIType.POST},

//////记录图片数据
  'get.items_download':{api: SysConfig.apiHost + '/v1.0.0/items_download',type: ServerAPIType.POST},
  'get.items_preview':{api: SysConfig.apiHost + '/v1.0.0/items_preview',type: ServerAPIType.POST},
  'get.items_collection':{api: SysConfig.apiHost + '/v1.0.0/items_collection',type: ServerAPIType.POST},
  'get.items_share':{api: SysConfig.apiHost + '/v1.0.0/items_share',type: ServerAPIType.POST},

//////记录图集数据
  'get.sets_download':{api: SysConfig.apiHost + '/v1.0.0/sets_download',type: ServerAPIType.POST},
  'get.sets_preview':{api: SysConfig.apiHost + '/v1.0.0/sets_preview',type: ServerAPIType.POST},
  'get.sets_collection':{api: SysConfig.apiHost + '/v1.0.0/sets_collection',type: ServerAPIType.POST},
  'get.sets_share':{api: SysConfig.apiHost + '/v1.0.0/sets_share',type: ServerAPIType.POST}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

// export
export { ToolsMap, ToolsType, ServerAPIMap, ServerAPIType }
