import React, { Component } from 'react'
import PropTypes from 'prop-types'

const DEFAULT_STATE = {
  retainedRects: [],
  addedRects: [],
  removedRects: [],
  text: ''
}

export default class TextSelection extends Component {
  constructor(props) {
    super(props)
    this.clientRectsArray = []
  }

  componentDidMount() {
    // this.div.addEventListener('selectstart', this.handleSelectionStart)
    document.addEventListener('selectionchange', this.handleSelectionChange)
  }

  componentWillUnmount() {
    // this.div.removeEventListener('selectstart', this.getSelection)
    document.addEventListener('selectionchange', this.handleSelectionChange)
  }

  handleSelectionChange = event => {
    this.getSelection()
  }

  getSelection = () => {
    const selection = window.getSelection()
    // if (
    //   selection.isCollapsed ||
    //   (!this.div.contains(selection.anchorNode) &&
    //     !this.div.contains(selection.focusNode))
    // ) {
    //   this.clientRectsArray = []
    //   if (this.props.onChange) {
    //     this.props.onChange(DEFAULT_STATE)
    //   }
    //   return
    // }
    if (!selection.rangeCount) {
      return
    }
    const range = selection.getRangeAt(0)
    this.setRange(selection, range)
  }

  setRange = (selection, range) => {
    if (!this.div.contains(range.commonAncestorContainer)) {
      this.clientRectsArray = []
      if (this.props.onChange) {
        this.props.onChange(DEFAULT_STATE)
      }
      return
    }
    // console.debug(range)
    // console.debug(this.div, this.div.getBoundingClientRect())
    const { retainedRects, addedRects } = !range
      ? { retainedRects: [], addedRects: [] }
      : Array.from(range.getClientRects())
          .map(rect => rectToObject(rect))
          .map(relativize(this.div.getBoundingClientRect()))
          .reduce(
            (state, newRect) => {
              const existingRect = this.clientRectsArray.find(existingRect =>
                isSameRect(existingRect, newRect)
              )
              if (existingRect) {
                return Object.assign({}, state, {
                  retainedRects: state.retainedRects.concat(existingRect)
                })
              }
              return Object.assign({}, state, {
                addedRects: state.addedRects.concat(newRect)
              })
            },
            { retainedRects: [], addedRects: [] }
          )

    if (this.props.onChange) {
      const removedRects = this.clientRectsArray.filter(prevRect => {
        return retainedRects.every(newRect => {
          return !isSameRect(prevRect, newRect)
        })
      })
      this.clientRectsArray = retainedRects.concat(addedRects)
      // window.__range = range
      // console.debug({range})
      this.props.onChange({
        retainedRects,
        addedRects,
        removedRects,
        range,
        // selection,
        // type: selection.type,
        // isCollapsed: selection.isCollapsed,
        // anchorNode: selection.anchorNode.nodeName,
        // anchorOffset: selection.anchorOffset,
        // focusNode: selection.focusNode.nodeName,
        // focusOffset: selection.focusOffset
      })
    }
  }

  setDiv = node => {
    this.div = node
  }

  render() {
    return (
      <div
        className="TextSelection"
        ref={this.setDiv}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
      >
        {this.props.children}
      </div>
    )
  }
}

TextSelection.propTypes = {
  onChange: PropTypes.func,
  color: PropTypes.string
}

function rectToObject(rect) {
  return {
    bottom: rect.bottom,
    top: rect.top,
    right: rect.right,
    left: rect.left,
    height: rect.height,
    width: rect.width
  }
}

function isSameRect(rect1, rect2) {
  return (
    rect1.left === rect2.left &&
    rect1.top === rect2.top &&
    rect1.right === rect2.right &&
    rect1.bottom === rect2.bottom
  )
}

function relativize(parentDivRect) {
  return rect => {
    return Object.assign({}, rect, {
      left: rect.left - parentDivRect.left,
      top: rect.top - parentDivRect.top,
      right: rect.right - parentDivRect.left,
      bottom: rect.bottom - parentDivRect.top
    })
  }
}
