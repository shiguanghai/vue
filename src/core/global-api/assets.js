/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  // 遍历 ASSET_TYPES 数组，为 Vue 定义相应方法
  // ASSET_TYPES 包括了directive、 component、filter
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        // 没有传定义 直接取出定义好的 directives、components、filters 并返回
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        // 环境判断
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        // Vue.component('comp', { template: '' })
        // 类型(type)是否是组件 如果是 判断传递的对象(definition)是否是原始对象([object Object])
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          // 把组件配置转换为组件的构造函数
          // _base == Vue
          definition = this.options._base.extend(definition)
        }
        // 类型(type)是否是指令 如果是 判断传递的函数(definition) 将function设置给bind update
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // 指令 - 传对象 或 组件 - 直接传构造函数：则直接存储
        // 全局注册，存储资源并赋值
        // this.options['components']['comp'] = definition
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
