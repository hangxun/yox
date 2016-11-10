
import Node from './Node'

import * as nodeType from '../nodeType'
import * as object from '../../util/object'

/**
 * 属性节点
 *
 * @param {string|Expression} name 属性名
 */
module.exports = class Attribute extends Node {

  constructor(name) {
    super()
    this.type = nodeType.ATTRIBUTE
    this.name = name
  }

  render(data) {

    let { name } = this
    if (name.type === nodeType.EXPRESSION) {
      name = name.execute(data.context)
    }

    let node = new Attribute(name)
    node.keypath = data.keys.join('.')
    data.parent.addAttr(node)

    this.renderChildren(
      object.extend({ }, data, { parent: node })
    )

  }

}