import React, { Component } from 'react'

export default class BoundaryControl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDragging: false,
      clientX: null,
      clientY: null
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !this.state.isDragging
  }

  handleKnobMouseDown = event => {
    // document.body.style.userSelect = 'none'
    console.debug('handleKnobMouseDown 1')
    event.stopPropagation()
    event.preventDefault()
    this.setState({ isDragging: true }, () => {
      console.debug('handleKnobMouseDown 2')
      document.addEventListener('mousemove', this.handleKnobMouseMove)
      document.addEventListener('mouseup', this.handleKnobMouseUp)
    })
    // this.props.onMouseDown()
  }

  handleKnobMouseMove = event => {
    console.debug('handleKnobMouseMove')
    event.stopPropagation()
    if (!this.state.isDragging) {
      return
    }
    // console.debug(range)
    // const textNode = range.startContainer
    // offset = range.startOffset
    const range = document.caretRangeFromPoint(event.clientX, event.clientY + 8)
    // console.debug(range)
    if (this.props) {
      this.props.onMove(range)
    }
  }

  handleKnobMouseUp = () => {
    // document.body.style.userSelect = 'auto'
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
        className="BoundaryControl"
        tabIndex="0"
        ref={this.setDiv}
        onKeyDown={this.handleKeyPress}
        onMouseDown={this.handleKnobMouseDown}
        style={{
          position: this.state.isDragging ? 'fixed' : 'absolute',
          left: `${this.state.isDragging ? this.state.clientX : this.props.left - 1}px`,
          top: `${this.state.isDragging ? this.state.clientY : this.props.top - 1}px`,
          height: `${this.props.height}px`
        }}
      />
    )
  }
}
