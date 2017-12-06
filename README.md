[![Sneak peak](https://d3vv6lp55qjaqc.cloudfront.net/items/2F452s0P2e0p3p213K42/Screen%20Recording%202017-05-24%20at%2002.21%20PM.gif)](https://cl.ly/0L1I0U1e0N0K)

It's a WIP.

## Terms

* Highlight: A visual representation of a selection of text.
* Boundary: The edge of a highlight. There are two in each highlight.
* Active boundary: The boundary that is currently selected.
* Knob: The visual representation of a boundary.
* Caret: An insertion point within text.

* [Selection](https://developer.mozilla.org/en-US/docs/Web/API/Selection) (Web
  API)
* [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) (Web API)

## Ideas

* Use Node.compareDocumentPosition to avoid unintentional collapsed state
* Use partialContainment
* TextMetrics polyfill?
  * Nope
    * https://github.com/FormidableLabs/measure-text
    * https://www.npmjs.com/package/text-metrics
  * Maybe
    * https://github.com/motiz88/canvas-text-metrics-polyfill (!)
    * https://opentype.js.org/
    * https://github.com/Pomax/fontmetrics.js
    * https://github.com/soulwire/FontMetrics
* Is https://opentype.js.org/font-inspector.html useful?
