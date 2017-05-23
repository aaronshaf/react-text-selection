import React, { Component } from 'react'
import classnames from 'classnames'

export default class Knob extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDragging: false,
      clientX: null,
      clientY: null
    }
  }
  handleKnobMouseDown = event => {
    event.stopPropagation()
    event.preventDefault()
    this.setState(
      {
        isDragging: true,
        clientX: event.clientX,
        clientY: event.clientY
      },
      () => {
        // console.debug('handleKnobMouseDown')
        document.addEventListener('mousemove', this.handleKnobMouseMove)
        document.addEventListener('mouseup', this.handleKnobMouseUp)
      }
    )
    // this.props.onMouseDown()
  }

  handleKnobMouseMove = event => {
    event.stopPropagation()
    if (!this.state.isDragging) {
      return
    }
    // console.debug(range)
    // const textNode = range.startContainer
    // offset = range.startOffset
    this.setState(
      {
        clientX: event.clientX,
        clientY: event.clientY
      },
      () => {
        const range = document.caretRangeFromPoint(
          event.clientX,
          event.clientY + 8
        )
        // console.debug(range)
        if (this.props) {
          this.props.onMove(range)
        }
      }
    )
  }

  handleKnobMouseUp = () => {
    this.setState({ isDragging: false })
    // this.props.onMouseUp()
    document.removeEventListener('mouseup', this.handleKnobMouseUp)
    document.removeEventListener('mousemove', this.handleKnobMouseMove)
  }

  handleKeyPress = event => {
    switch (event.key) {
      case 'ArrowLeft': {
        const divRect = this.div.getBoundingClientRect()
        const caretRange = document.caretRangeFromPoint(
          divRect.left - 3 - 1,
          divRect.top + 8
        )
        console.debug(caretRange)
        const range = document.createRange()
        range.setStart(
          caretRange.startContainer,
          caretRange.startOffset > 0 ? caretRange.startOffset : 0
        )
        this.props.onMove(range)
        break
      }
      case 'ArrowRight': {
        const divRect = this.div.getBoundingClientRect()
        const caretRange = document.caretRangeFromPoint(
          divRect.left + 1,
          divRect.top + 4
        )
        console.debug(caretRange)
        const range = document.createRange()
        range.setStart(
          caretRange.startContainer,
          caretRange.startOffset > 0 ? caretRange.startOffset : 0
        )
        this.props.onMove(range)
        break
      }
      default:
        return
    }
  }

  setDiv = node => {
    this.div = node
  }

  render() {
    return (
      <div
        tabIndex="0"
        onKeyDown={this.handleKeyPress}
        className="Boundary"
        onMouseDown={this.handleKnobMouseDown}
      >
        <div
          className={`Knob ${this.props.isHighlighting ? 'Knob--dragging' : ''}`}
          style={{
            position: 'absolute',
            left: `${this.props.left - 4}px`,
            top: `${this.props.kind === 'start' ? this.props.top - 9 : this.props.bottom}px`
          }}
        />
        <div
          ref={this.setDiv}
          className={`Boundary-caret ${this.props.isHighlighting ? 'Boundary-caret--dragging' : ''}`}
          style={{
            left: `${this.props.left - 1}px`,
            top: `${this.props.top}px`,
            height: `${this.props.height}px`
          }}
        >
          <div
            className="Boundary-caret-inner"
            style={{
              height: `${this.props.height}px`
            }}
          />
        </div>
      </div>
    )
  }
}
