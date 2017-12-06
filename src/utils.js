export function getTextNodesInElement(element) {
  const isTextNode = element.nodeType === 3
  if (isTextNode) {
    return [element]
  }
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    true
  )

  let node = walker.nextNode()
  const textNodes = []

  do {
    textNodes.push(node)
  } while ((node = walker.nextNode()))

  return textNodes
}
