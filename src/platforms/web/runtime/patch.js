/* @flow */

import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
// 指令模块应该在所有内置模块被应用后最后应用
const modules = platformModules.concat(baseModules)

// nodeOps 就是一些DOM操作API
export const patch: Function = createPatchFunction({ nodeOps, modules })
