export default function(nodes, edges) {
  return new Promise((resolve, reject) => {
    try {
      validateNodes(nodes)
      validateEdges(nodes, edges)
      resolve()
    } catch (error) {
      reject(error.message)
    }
  })
}

/**
 * 校验节点 节点参数
 * @param {*} nodes
 */
function validateNodes(nodes) {
  for (const iterator of nodes) {
    if (iterator.inputParams) {
      const node = iterator.inputParams.find(item => item.requireFlag === '1' && !item.value)
      if (node) {
        throw new Error(`${iterator.title ? iterator.title + '节点 ' : ' '} 输入参数【${node.paramDesc}】值不能为空`)
      }
    }
  }
}

/**
 * 校验是否存在孤点
 * @param {*} nodes
 * @param {*} edges
 */
function validateEdges(nodes, edges) {
  const startNode = nodes.find(item => item.shape === 'startShape')
  const endNode = nodes.find(item => item.shape === 'endShape')
  if (!startNode) {
    throw new Error(`未找到开始节点`)
  }
  if (!endNode) {
    throw new Error(`未找到结束节点`)
  }
  for (const iterator of nodes) {
    findRootNode(iterator.id, edges, 'target', 'source', startNode.id)
    findRootNode(iterator.id, edges, 'source', 'target', endNode.id)
  }
}

function findRootNode(nodeId, edges, currentDirection, rootDirection, rootId) {
  console.log(nodeId, edges, currentDirection, rootId)
  const sublingEdge = edges.find(item => item[currentDirection] === nodeId)
  console.log(sublingEdge)
  if (!sublingEdge) {
    if (nodeId !== rootId) {
      throw new Error(`流程图中存在孤点情况`)
    }
  } else {
    findRootNode(sublingEdge[rootDirection], edges, currentDirection, rootDirection, rootId)
  }
}
