import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import * as S from '../../selectors'

const EditLink = (props) => {
  const { editing, ...newProps } = props
  if (!editing) { return null }
  return <Link {...newProps} />
}

export default connect(
  (state) => ({
    editing: S.editing(state)
  }),
  () => ({})
)(EditLink)