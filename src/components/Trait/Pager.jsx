import React from 'react'
import { connect } from 'react-redux'

import * as I from 'immutable'

import * as Q from '../../queries'

import Icon      from '../Icon'
import Filter    from '../Filter'
import Limiter   from '../Limiter'
import Tex       from '../Tex'
import TraitItem from './Item'

class TraitPager extends React.Component {
  static tabs = [
    { name: 'Asserted', icon: 'pencil' },
    { name: 'Deduced',  icon: 'search' },
  ]

  constructor() {
    super()

    this.state = {
      limit: 10,
      tabs: {
        'Asserted': true,
        'Deduced': false
      },
      filtered: I.List()
    }
  }

  componentWillMount() {
    this.display(this.all())
  }

  all() {
    this._all = this._all || this.props.allTraits

    return this._all
  }

  display(traits) {
    this.setState({ traits: I.List(traits) })
  }

  toggleTab(name) {
    const tabs = this.state.tabs
    tabs[name] = !tabs[name]
    this.setState({ tabs: tabs })
  }

  toggleShowAll() {
    const limit = this.state.limit ? false : 10
    this.setState({ limit: limit })
  }

  limited(seq) {
    if (this.state.limit) {
      return seq.take(this.state.limit)
    } else {
      return seq
    }
  }

  tabbed(seq) {
    const asserted = this.state.tabs.Asserted
    const deduced  = this.state.tabs.Deduced

    if (asserted && deduced) {
      return seq
    } else if (asserted) {
      return seq.filter(t => !t.deduced)
    } else if (deduced) {
      return seq.filter(t => t.deduced)
    } else {
      return seq
    }
  }

  render() {
    const { space } = this.props

    const all     = this.all()
    const tabbed  = this.tabbed(this.state.traits)
    const limited = this.limited(tabbed)

    const tab = ({ name, icon }) => {
      const active = this.state.tabs[name] ? 'active' : ''

      return <button key={name}
        className={`btn btn-default ${active}`}
        onClick={() => this.toggleTab(name)}
      >
        <Icon type={icon}/>
        {' '}
        {name}
      </button>
    }


    return (
      <Tex className="traitFilter">
        <div className="btn-group">
          {TraitPager.tabs.map(tab)}
        </div>

        <Filter
          collection={all}
          onField={t => t.property.name}
          onChange={(ts) => this.display(ts)}
        />

        <table className="table table-condensed">
          <thead></thead>
          <tbody>
            {limited.map(trait =>
              <TraitItem key={trait.property.name} space={space} property={trait.property} trait={trait}/>
            )}
          </tbody>
        </table>

        <Limiter
          limit={this.state.limit}
          found={limited.size}
          total={tabbed.size}
          onClick={() => this.toggleShowAll()}
        />
      </Tex>
    )
  }
}

export default connect(
  (state, ownProps) => ({
    allTraits: Q.spaceTraits(state, ownProps.space)
  })
)(TraitPager)