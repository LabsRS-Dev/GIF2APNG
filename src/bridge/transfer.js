import { BS, Observable, Util, _ } from 'dove.max.sdk'
import { ToolsMap, ToolsType } from './tools_map.js'

// -----------------------------------------------------------------
// 交互处理
const AgentClient = BS.b$.AgentClient
const AgentServer = BS.b$.AgentServer

const __$p$ = {


  // 通用方式来配置单一的服务器模式, 你可以在后端服务覆盖已有的配置信息
  serverConfig: {
    ip: '127.0.0.1', // 127.0.0.1
    port: '8888',
    protocol: 'http://'
  },

  // 获取WWW指定的动态文件的方式
  getWWWAssetsUrlPrefix: function () {
    var that = this
    const sr = that.serverConfig
    // eg. http://127.0.0.1:8888/tmp_assets/f6c4a7ea-0d48-4cbb-9d45-9e452c9fb0cd.jpg
    return sr.protocol + sr.ip + ':' + sr.port + '/tmp_assets/'
  },

  // 针对前端使用者，我要启动后端服务 {启动后，所有数据信息都转向后端服务编码来处理}
  backAgent: new AgentServer(),
  startBackAgent: function () {
    var that = this
    const agent = this.backAgent
    agent.active({
      dropDragConfig: {
        enable: true,
        enableDir: true,
        allowTypes: ['*'],
        handler: function (data) {
          that.trigger('onDropDragFiles', { data: data })
        }
      }
    })
  },

  // 针对前端使用者，我要启动前端服务，{启动后，可以根据发送信息、接收信息方式与后端服务来交互}
  isRunning: false,
  frontAgent: new AgentClient(),
  startFrontAgent: function () {
    var that = this
    const agent = that.frontAgent
    agent.debug = false

    const ac = new agent.Chancel()

    /**
     * Note: 注意这里影响配置前端的处理方式。
     */
    const ac_build_type = agent.ChancelType.nativeFork // agent.ChancelType.websocketForNode

    if (agent.ChancelType.websocketForNode === ac_build_type) {
      ac.build({
        type: agent.ChancelType.websocketForNode,
        ip: that.serverConfig.ip,
        port: that.serverConfig.port,
        protocol: that.serverConfig.protocol,
        reqUrl: '',
        clientIOType: 'Socket.io.client',
        debug: false // 是否开启日志功能
      })
    } else if (agent.ChancelType.nativeFork === ac_build_type) {
      ac.build({
        type: agent.ChancelType.nativeFork,
        debug: true // 是否开启日志功能
      })
    }

    agent.registerOnFinishBuildChannel(function () {
      console.log('frontAgent is finish build')
      that.isRunning = true
      console.log('__$p$.isRunning = ', that.isRunning)
    })
    agent.appendChancel(ac)
  },
  run: function (startBackAgent = false) {
    console.log('start transfer.js ....')
    if (startBackAgent) {
      this.startBackAgent()
    }
    this.startFrontAgent()
    return this
  },

  send: function (message, handler, one = true) {
    handler && this.frontAgent.registerOnReceiveFromServer(handler, one)
    this.frontAgent.noticeToServer(message)
    return this
  }
}

//  绑定工具
__$p$.Common = {
  sendMessage: (options = {}, handler, one = false) => {
    __$p$.send({ data: 'Hello' }, function (data) {
      handler && handler(data)
    }, one)
  },
  runWSTask: (cli = '', action = '', options = {}, handler, one = false) => {
    const debugMode = false
    if (debugMode === false) {
      const taskInfo = {
        task_id: options.taskID,                    // 任务ID
        cli: cli,                                   // 动态调用的模块
        reload: false,                              // 默认是false, 支持热部署, 是否重新加载动态模块
        command: [                                  // 命令
          { action: action, data: options.data, lang: options.lang || 'en' }
        ]
      }

      const info = {
        taskInfo: taskInfo,
        msg_type: 'c_task_exec'
      }

      __$p$.send(info, data => {
        if (data.task_id === options.taskID) { // 只处理本任务的返回数据
          handler && handler(data)
        }
      }, one)
    } else {
      handler && handler()
    }
  },
  runNativeTask: (cli = '', mainThread = false, options = {}, handler, one = false) => {
    const debugMode = false
    if (debugMode === false) {
      const info = {
        task_id: options.taskID || _.uniqueId('native-fork-task-'),
        commands: [{
          appPath: cli,
          command: options.command || [],
          mainThread: mainThread
        }]
      }

      __$p$.send(info, data => {
        try{
          if (data.queueInfo.id === options.taskID) { // 只处理本任务的返回数据
            handler && handler(data)
          }
        }catch(e){
          console.error(e)
        }
      }, one)
    } else {
      handler && handler()
    }
  },
  stopNativeTask: (taskID, command, handler, one = false) => {
    console.assert(taskID)
    const debugMode = false
    if (debugMode === false) {
      const info = {
        task_id: taskID || _.uniqueId('native-fork-task-'),
        commands: command,
        taskMethodWay: 'sendEvent'
      }

      __$p$.send(info, data => {
        if (data.task_id === taskID) { // 只处理本任务的返回数据
          handler && handler(data)
        }
      }, one)
    } else {
      handler && handler()
    }
  }
}

__$p$.Tools = {
  /**
   * @argument {String} toolKey 工具唯一标识
   * @argument {Object} options 工具传入的参数
   * @argument {Function} handler 回调函数
   * @argument {Boolean} one 回调函数的处理是否运行后，删除
   */
  call: (toolKey, options = {}, handler = () => {}, one = false) => {
    const cfg = ToolsMap[toolKey]
    if (cfg) {
      if (cfg.type === ToolsType.WS) {
        __$p$.Common.runWSTask(cfg.cli, cfg.action, options, handler, one)
      } else if (cfg.type === ToolsType.NTASK) {
        __$p$.Common.runNativeTask(cfg.cli, cfg.mainThread, options, handler, one)
      } else if (cfg.type === ToolsType.STOP_NTASK) {
        __$p$.Common.stopNativeTask(options.taskID, cfg.command, handler, one)
      }
    } else {
      console.warn('Error: Not found the \'' + toolKey + '\' config tool...')
    }
  }
}

var TransferClass = Observable.extend(__$p$)
var Transfer = new TransferClass()

/**
 * 初始化启动
 */
var $ = Util.util.getJQuery$()
$(document).ready(function () {
  Transfer.run(true)
  window.Transfer = Transfer
})

export {
  Transfer
}

