import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class BoundaryControl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDragging: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.state.isDragging
  }

  handleKnobMouseDown = event => {
    // document.body.style.userSelect = 'none'
    event.stopPropagation()
    event.preventDefault()
    this.props.onHighlightStart(event)
    this.setState({ isDragging: true }, () => {
      document.addEventListener('mousemove', this.handleKnobMouseMove)
      document.addEventListener('mouseup', this.handleKnobMouseUp)
    })
  }

  handleKnobMouseMove = event => {
    event.stopPropagation()
    if (!this.props.isHighlighting) {
      return
    }
    const range = document.caretRangeFromPoint(event.clientX, event.clientY + 8)
    if (this.props) {
      this.props.onMove(range)
    }
  }

  handleKnobMouseUp = () => {
    this.setState({ isDragging: false })
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
        const range = document.createRange()
        range.setStart(
          caretRange.startContainer,
          caretRange.startOffset > 0 ? caretRange.startOffset - 1 : 0
        )
        this.props.onMove(range)
        break
      }
      case 'ArrowRight': {
        const divRect = this.div.getBoundingClientRect()
        const caretRange = document.caretRangeFromPoint(
          divRect.left - 3 - 1,
          divRect.top + 8
        )
        const range = document.createRange()
        range.setStart(
          caretRange.startContainer,
          caretRange.startOffset > 0 ? caretRange.startOffset + 2 : 0
        )
        this.props.onMove(range)
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        break
      }
      case 'ArrowDown': {
        event.preventDefault()
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
        className="BoundaryControl"
        tabIndex="0"
        ref={this.setDiv}
        onKeyDown={this.handleKeyPress}
        onMouseDown={this.handleKnobMouseDown}
        style={{
          display: this.props.isHighlighting ? 'none' : 'block',
          position: 'absolute',
          left: `${this.props.left - 1}px`,
          top: `${this.props.top - 1}px`,
          height: `${this.props.height}px`,
          backgroundColor: this.props.isHighlighting ? 'green' : 'purple'
        }}
      />
    )
  }
}

BoundaryControl.propTypes = {
  isHighlighting: PropTypes.bool
}
