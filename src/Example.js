import React, { Component } from 'react'
import TextSelection from './TextSelection'
import Boundary from './Boundary'

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

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleKnobMouseMove)
  }

  handleMouseDown = () => {
    this.setState({ isHighlighting: true })
  }

  handleHighlightStart = boundaryType => {
    this.setState({ isHighlighting: true, activeBoundary: boundaryType })
  }

  handleMouseMove = event => {
    if (!this.state.isHighlighting) {
      return
    }

    const range = document.caretRangeFromPoint(event.clientX, event.clientY)
    if (this.state.activeBoundary === 'start') {
      this.handleStartKnobMove(range)
    } else if (this.state.activeBoundary === 'end') {
      this.handleEndKnobMove(range)
    }
  }

  handleHighlightEnd = event => {
    console.debug('handleHighlightEnd', this.state.activeBoundary)
    this.setState({ isHighlighting: false })
  }

  handleChange = selection => {
    if (
      !selection.retainedRects.length &&
      !selection.addedRects.length &&
      !selection.removedRects.length
    ) {
      return
    }
    // console.debug(selection)
    this.setState({ selection })
  }

  handleStartKnobMove = startRange => {
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
          text: this.state.selection.range &&
            this.state.selection.range.toString(),
          retainedRects: this.state.selection.retainedRects &&
            this.state.selection.retainedRects.map(rectToPrettyJson),
          removedRects: this.state.selection.removedRects &&
            this.state.selection.removedRects.map(rectToPrettyJson),
          addedRects: this.state.selection.addedRects &&
            this.state.selection.addedRects.map(rectToPrettyJson),
          range: undefined
        }),
        null,
        2
      )
        .replace(/"---/g, '')
        .replace(/---"/g, '')

    const retainedRects = (this.state.selection.retainedRects || [])
      .map(rect => {
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
      })

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
    // const anchorRect =

    const firstRect = allRects.reduce((state, rect) => {
      if (!state) {
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

    const lastRect = allRects.reduce((state, rect) => {
      if (!state) {
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

    const boundary1 =
      firstRect &&
      <Boundary
        kind="start"
        isActive={this.state.activeBoundary === 'start'}
        isHighlighting={this.state.isHighlighting}
        onHighlightStart={this.handleHighlightStart}
        left={firstRect.left - 1}
        top={firstRect.top}
        height={firstRect.height}
      />

    const boundary2 =
      lastRect &&
      lastRect.left !== lastRect.right &&
      <Boundary
        kind="end"
        isActive={this.state.activeBoundary === 'end'}
        isHighlighting={this.state.isHighlighting}
        onHighlightStart={this.handleHighlightStart}
        left={lastRect.right}
        top={lastRect.top}
        height={lastRect.height}
      />

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
          <TextSelection onChange={this.handleChange} color="#FFF794">
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
  return `---{ left: ${rect.left}, top: ${rect.top}, right: ${rect.right}, bottom: ${rect.bottom} }---`
}
