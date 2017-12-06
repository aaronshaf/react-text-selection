import React, { Component } from 'react'
import TextSelection from './TextSelection'
import Boundary from './Boundary'
import { getTextNodesInElement } from './utils'
import FontMetrics from 'fontmetrics'

export default class Example extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selection: {
        retainedRects: [],
        addedRects: [],
        removedRects: []
      },
      isHighlighting: false,
      activeBoundary: null
    }
  }

  componentDidMount() {}

  componentWillUnmount() {
    // document.removeEventListener('mousemove', this.handleKnobMouseMove)
  }

  handleMouseDown = () => {
    // this.setState({ isHighlighting: true })
  }

  handleHighlightStart = boundaryType => {
    // this.setState({ isHighlighting: true, activeBoundary: boundaryType })
  }

  handleMouseMove = event => {
    if (true || this.state.isHighlighting === false) {
      return
    }
    // console.debug('handleMouseMove')

    const range = document.caretRangeFromPoint(event.clientX, event.clientY)
    if (this.state.activeBoundary === 'start') {
      this.handleStartKnobMove(range)
    } else if (this.state.activeBoundary === 'end') {
      this.handleEndKnobMove(range)
    } else {
      // console.debug('inactive boundary')
    }
  }

  handleHighlightEnd = event => {
    // console.debug('handleHighlightEnd', this.state.selection.range)
    // this.state.selection.range.endContainer.focus()
    // console.log('ok 1')
    const knob = this.div.querySelectorAll('.Boundary')
    // console.debug({ knob })
    this.setState({ isHighlighting: false }, () => {
      // console.log('ok 2')
    })
  }

  handleSelectionChange = selection => {
    const didNothingChange =
      selection.retainedRects.length === 0 &&
      selection.addedRects.length === 0 &&
      selection.removedRects.length === 0
    if (didNothingChange) {
      return
    }
    const nodesInElement = getTextNodesInElement(
      selection.range.commonAncestorContainer
    )

    const zoom =
      parseInt(
        document.defaultView.getComputedStyle(document.documentElement, null)
          .width,
        10
      ) / document.documentElement.clientWidth

    const measurements = [nodesInElement[0]].map(node => {
      //   console.debug(node.parentNode)
      const style = window.getComputedStyle(node.parentNode)
      // console.debug(style)
      const { fontFamily, fontSize, fontWeight } = style

      // const canvas = document.getElementById('canvas')
      // const ctx = canvas.getContext('2d')
      // ctx.font = fontSize + 'px ' + fontFamily
      // const measurement = ctx.measureText(node.nodeValue)

      // console.log({
      //   fontFamily,
      //   fontWeight: 'normal',
      //   fontSize: 200,
      //   origin: 'baseline'
      // })
      const metrics = FontMetrics({
        fontFamily: 'sans-serif',
        fontWeight: fontWeight,
        fontSize: parseInt(fontSize),
        origin: 'baseline'
      })
      console.debug({ fontSize })
      console.debug(metrics)

      return 'measurement'
    })
    // console.debug(measurements)

    this.setState({ selection })
  }

  handleStartKnobMove = startRange => {
    console.debug('handleStartKnobMove')
    const range = document.createRange()
    range.setStart(startRange.startContainer, startRange.startOffset)
    range.setEnd(
      this.state.selection.range.endContainer,
      this.state.selection.range.endOffset
    )
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }

  handleEndKnobMove = endRange => {
    console.debug('handleEndKnobMove')
    const range = document.createRange()
    range.setStart(
      this.state.selection.range.startContainer,
      this.state.selection.range.startOffset
    )
    range.setEnd(endRange.startContainer, endRange.startOffset)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }

  setDiv = node => {
    this.div = node
  }

  render() {
    const stringifiedObject =
      this.state.selection.retainedRects &&
      JSON.stringify(
        Object.assign({}, this.state.selection, {
          isHighlighting: this.state.isHighlighting,
          text:
            this.state.selection.range && this.state.selection.range.toString(),
          retainedRects:
            this.state.selection.retainedRects &&
            this.state.selection.retainedRects.map(rectToPrettyJson),
          removedRects:
            this.state.selection.removedRects &&
            this.state.selection.removedRects.map(rectToPrettyJson),
          addedRects:
            this.state.selection.addedRects &&
            this.state.selection.addedRects.map(rectToPrettyJson),
          range: undefined
        }),
        null,
        2
      )
        .replace(/"---/g, '')
        .replace(/---"/g, '')

    const retainedRects = (this.state.selection.retainedRects || []).map(
      rect => {
        return (
          <div
            key={rectToPrettyJson(rect)}
            className="Example-retained-rect"
            style={{
              left: rect.left,
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
              width: rect.width,
              height: rect.height
            }}
          />
        )
      }
    )

    const addedRects = (this.state.selection.addedRects || []).map(rect => {
      return (
        <div
          key={rectToPrettyJson(rect)}
          className="Example-added-rect"
          style={{
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height
          }}
        />
      )
    })

    const allRects = this.state.selection.retainedRects.concat(
      this.state.selection.addedRects
    )

    // Needed to infer the first boundary
    const firstRect = allRects.reduce((state, rect) => {
      if (state === null) {
        return rect
      }
      if (rect.bottom < state.bottom) {
        return rect
      }
      if (rect.bottom === state.bottom && rect.left < state.left) {
        return rect
      }
      return state
    }, null)

    // Needed to infer the second boundary
    const lastRect = allRects.reduce((state, rect) => {
      if (state === null) {
        return rect
      }
      if (rect.bottom > state.bottom) {
        return rect
      }
      if (rect.bottom === state.bottom && rect.right > state.right) {
        return rect
      }
      return state
    }, null)

    const boundary1 = firstRect && (
      <Boundary
        kind="start"
        isActive={this.state.activeBoundary === 'start'}
        isHighlighting={this.state.isHighlighting}
        onHighlightStart={this.handleHighlightStart}
        left={firstRect.left - 1}
        top={firstRect.top}
        height={firstRect.height}
      />
    )

    const boundary2 = lastRect &&
      lastRect.left !== lastRect.right && (
        <Boundary
          kind="end"
          isActive={this.state.activeBoundary === 'end'}
          isHighlighting={this.state.isHighlighting}
          onHighlightStart={this.handleHighlightStart}
          left={lastRect.right}
          top={lastRect.top}
          height={lastRect.height}
        />
      )

    return (
      <div
        ref={this.setDiv}
        style={{
          marginTop: '12px',
          marginBottom: '12px',
          display: 'flex',
          position: 'relative',
          cursor: this.state.isHighlighting ? 'col-resize' : 'auto'
        }}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleHighlightEnd}
      >
        <div
          style={{
            width: '50%',
            clear: 'both'
            // pointerEvents: this.isDraggingKnob ? 'none' : 'auto'
          }}
        >
          <TextSelection onChange={this.handleSelectionChange} color="#FFF794">
            {this.props.children}
          </TextSelection>
        </div>
        <pre>{stringifiedObject}</pre>
        <div
          style={{
            position: 'absolute'
          }}
        >
          {retainedRects}
          {addedRects}
          {boundary1}
          {boundary2}
        </div>
      </div>
    )
  }
}

function rectToPrettyJson(rect) {
  return `---{ left: ${rect.left}, top: ${rect.top}, right: ${
    rect.right
  }, bottom: ${rect.bottom} }---`
}
