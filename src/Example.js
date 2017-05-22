import React, { Component } from 'react'
import TextSelection from './TextSelection'
import Knob from './Knob'
import Caret from './Caret'

export default class Example extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selection: {
        retainedRects: [],
        addedRects: [],
        removedRects: []
      },
      isHighlighting: false
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleKnobMouseMove)
  }

  // componentDidMount () {
  //   this.div =
  // }

  handleMouseDown = event => {
    this.setState({ isHighlighting: true })
  }

  handleMouseMove = event => {
    if (!this.state.isHighlighting) {
      return
    }
  }

  handleMouseUp = event => {
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

    // console.debug(range)
    // console.debug(2, this.state.selection.endContainer, this.state.selection.endOffset)
  }

  setDiv = node => {
    this.div = node
  }

  render() {
    const stringifiedObject =
      this.state.selection.retainedRects &&
      JSON.stringify(
        Object.assign({}, this.state.selection, {
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

    const dragger1 =
      firstRect &&
      <Knob
        isVisible={!this.state.isHighlighting}
        left={firstRect.left}
        top={firstRect.top}
        onMove={this.handleStartKnobMove}
      />
    const dragger2 =
      lastRect &&
      <Knob
        isVisible={!this.state.isHighlighting}
        left={lastRect.right}
        top={lastRect.top}
        onMove={this.handleStartKnobMove}
      />

    const caret1 =
      firstRect &&
      <Caret
        isVisible={!this.state.isHighlighting}
        left={firstRect.left}
        top={firstRect.top}
        height={firstRect.height}
      />

    const caret2 =
      lastRect &&
      <Caret
        isVisible={!this.state.isHighlighting}
        left={lastRect.right}
        top={lastRect.top}
        height={lastRect.height}
      />

    return (
      <div
        ref={this.setDiv}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        style={{
          marginTop: '12px',
          marginBottom: '12px',
          display: 'flex',
          position: 'relative'
        }}
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
          {caret1}
          {caret2}
          {dragger1}
          {dragger2}
        </div>
      </div>
    )
  }
}

function rectToPrettyJson(rect) {
  return `---{ left: ${rect.left}, top: ${rect.top}, right: ${rect.right}, bottom: ${rect.bottom} }---`
}
