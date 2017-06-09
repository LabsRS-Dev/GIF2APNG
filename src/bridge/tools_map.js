/**
 * @author Ian
 * @created 2017-04-28 16:48:21
 */
import { BS } from 'dove.max.sdk'


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

// export
export { ToolsMap, ToolsType }
