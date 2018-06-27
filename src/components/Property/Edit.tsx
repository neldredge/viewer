import * as React from 'react'
import { Field } from 'redux-form'

import { updateProperty } from '../../actions'
import { Id, Property, State } from '../../types'

import Detail from './Detail'
import Citations from '../Citations'
import { Text, Textarea } from '../Form/Labeled'

import form from '../Form'

type Values = {
  uid: Id
  name: string
  description: string
}
type Errors = {
  name?: string
}

// FIXME: share form between create and edit
const Edit = props => {
  const { handleSubmit, submitting, valid, getResult } = props
  const property = getResult()

  return (
    <div className="row">
      <div className="col-sm-6">
        <form onSubmit={handleSubmit}>
          <Field
            name="name"
            label="Name"
            component={Text}
          />
          <Field
            name="description"
            label="Description"
            component={Textarea}
          />
          <Field
            name="references"
            label="References"
            component={Citations}
          />
          <div>
            <h3>Citations</h3>
          </div>
          <button className="btn btn-default" type="submit" disabled={submitting}>
            Save
          </button>
        </form>
      </div>

      <div className="col-sm-6">
        {property ? <Detail property={property} /> : ''}
      </div>
    </div>
  )
}

const build = (state: State, values: Values) => {
  const errors: Errors = {}
  if (!values.name) { errors.name = 'Required' }

  const result: Property = { ...values, references: [] }
  return { result, errors }
}

const save = (dispatch, ownProps, property) => {
  dispatch(updateProperty(property))
  ownProps.history.push(`/properties/${property.uid}`)
}

export default form<Property, Values>({
  build,
  initial: (_, { property }) => property,
  name: 'updateProperty',
  fields: ['name', 'description'],
  save
})(Edit)