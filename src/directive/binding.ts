import isDef from '../../../yox-common/src/function/isDef'
import execute from '../../../yox-common/src/function/execute'

import * as env from '../../../yox-common/src/util/env'
import * as keypathUtil from '../../../yox-common/src/util/keypath'

import * as domApi from '../../../yox-dom/src/dom'

import * as type from '../../../yox-type/src/type'
import Yox from '../../../yox-type/src/interface/Yox'
import VNode from '../../../yox-type/src/vnode/VNode'
import Directive from '../../../yox-type/src/vnode/Directive'

export const once = env.TRUE

export function bind(node: HTMLElement | Yox, directive: Directive, vnode: VNode) {

  // binding 可能是模糊匹配
  // 比如延展属性 {{...obj}}，这里 binding 会是 `obj.*`
  let binding = directive.binding as string,

  // 提前判断好是否是模糊匹配，避免 watcher 频繁执行判断逻辑
  isFuzzy = keypathUtil.isFuzzy(binding),

  watcher: type.watcher | void = function (newValue: any, _: any, keypath: string) {

    if (watcher) {
      const name = isFuzzy
        ? keypathUtil.matchFuzzy(keypath, binding) as string
        : directive.name

      if (vnode.isComponent) {
        const component = node as Yox
        component.checkProp(name, newValue)
        component.set(name, newValue)
      }
      else {
        const element = node as HTMLElement
        if (isDef(directive.hint)) {
          domApi.prop(element, name, newValue)
        }
        else {
          domApi.attr(element, name, newValue)
        }
      }
    }

  }

  vnode.context.watch(binding, watcher as type.watcher)

  vnode.data[directive.key] = function () {
    vnode.context.unwatch(binding, watcher as type.watcher)
    watcher = env.UNDEFINED
  }

}

export function unbind(node: HTMLElement | Yox, directive: Directive, vnode: VNode) {
  execute(vnode.data[directive.key])
}

