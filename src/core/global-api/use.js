/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  // 通过全局方法 Vue.use() 使用插件 可以传入多个参数 作为 install 参数
  // 如果插件是一个对象，必须提供 install 方法
  // 如果插件是一个函数，它会被作为 install 方法
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    // 把数组中的第一个元素(plugin)去除
    const args = toArray(arguments, 1)
    // 把this(Vue)插入第一个元素的位置
    args.unshift(this)
    // install() 第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    // 保存已安装插件
    installedPlugins.push(plugin)
    return this
  }
}
