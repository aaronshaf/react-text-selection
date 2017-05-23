import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class BoundaryControl extends Component {
  handleKnobMouseDown = event => {
    // document.body.style.userSelect = 'none'
    event.stopPropagation()
    event.preventDefault()
    this.props.onHighlightStart(this.props.kind)
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
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  isHighlighting: PropTypes.bool
}
