import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { contextTypes } from 'lib/context'
import PrimaryGrid from 'app/elements/grids/PrimaryGrid'
import PageForm from 'app/elements/forms/PageForm'
import Frames from './Frames'

class Home extends Component {
  static contextTypes = contextTypes;
  render() {
    const { title, subtitle, username, organization, email, full, packageName } = this.props
    const { style } = this.context.theme
    const pageFormInit =  { title
                          , subtitle
                          , username
                          , organization
                          , email
                          , full
                          , packageName
                          }
    return (
      <div>
        <Frames />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { visual } = state
  const { text } = visual
  return  { title: text.get('title')
          , subtitle: text.get('subtitle')
          , username: text.get('username')
          , organization: text.get('organization')
          , email: text.get('email')
          , full: text.get('full')
          , packageName: text.get('packageName')
          }
}

export default connect(mapStateToProps)(Home)
