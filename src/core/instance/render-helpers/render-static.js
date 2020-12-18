/* @flow */

/**
 * Runtime helper for rendering static trees.
 */
// 用于渲染静态树的运行时帮助程序。
export function renderStatic (
  index: number,
  isInFor: boolean
): VNode | Array<VNode> {
  const cached = this._staticTrees || (this._staticTrees = [])
  let tree = cached[index]
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  // 如果已经渲染了静态树，并且不在v-for里面，我们可以重用同样的树。
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  // 如果没有，从staticRenderFns这个数组中获取静态根节点对应的render函数调用
  // 此时就生成vnode节点，把结果缓存
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  )
  // 把当前返回的vnode节点标记为静态的
  // 将来调用patch函数的时候，内部会判断如果当前vnode为静态，则不再对比节点差异
  markStatic(tree, `__static__${index}`, false)
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
export function markOnce (
  tree: VNode | Array<VNode>,
  index: number,
  key: string
) {
  markStatic(tree, `__once__${index}${key ? `_${key}` : ``}`, true)
  return tree
}

function markStatic (
  tree: VNode | Array<VNode>,
  key: string,
  isOnce: boolean
) {
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], `${key}_${i}`, isOnce)
      }
    }
  } else {
    markStaticNode(tree, key, isOnce)
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true
  node.key = key 
  node.isOnce = isOnce
}
