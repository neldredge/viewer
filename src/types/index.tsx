import * as I from 'immutable'

import * as F from '../models/Formula'
import { Finder } from '../models/PropertyFinder'

export type Id = string

export interface User {
  readonly name: string
  readonly token: string
}

export interface Space {
  readonly uid: Id
  readonly name: string
  readonly aliases?: I.List<string>
  readonly description: string
}

export interface Property {
  readonly uid: Id
  readonly name: string
  readonly aliases?: I.List<string>
  readonly description: string
}

export type Formula = F.Formula<Property>

export interface Trait {
  readonly uid:         Id
  readonly space:       Space
  readonly property:    Property
  readonly description: string
  readonly value:       boolean
  readonly deduced:     boolean
}

export interface Theorem {
  readonly uid:         Id
  readonly if:          Formula
  readonly then:        Formula
  readonly converse:    any // FIXME
  readonly description: string
}

export interface ProofIds {
  readonly traits:   I.List<Id>
  readonly theorems: I.List<Id>
}

export interface Proof {
  readonly traits:   I.List<Trait>
  readonly theorems: I.List<Theorem>
}

export type TraitTable = I.Map<Id, I.Map<Id, Trait>> // spaceId, propertyId => trait

export type Index<P> = I.Map<Id, P>

export interface StoreState {
  // Space data
  version:             string
  spaces:              Index<Space>
  properties:          Index<Property>
  theorems:            Index<Theorem>
  traits:              TraitTable
  'spaces.finder':     Finder<Space>
  'properties.finder': Finder<Property>
  proofs:              Index<ProofIds> // trait id => proof
  // User data
  user?: User
}

// There's probably a cleaner way to handle this, but this gives us an escape
// hatch for props added by the router
export interface RouterProps {
  // tslint:disable no-any
  router?: any
  params?: any
  // tslint:enable no-any
}
