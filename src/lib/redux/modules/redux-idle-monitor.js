import configure  from 'redux-idle-monitor'
import { push } from 'react-router-redux'

import { packageName, IS_BROWSER } from '../../../config'
import { setText } from '../actions/visual'

export const IDLESTATUS_INACTIVE = 'INACTIVE'

export const IDLE_STATUSES =  [ IDLESTATUS_INACTIVE
                              ]


export const idleStatusDelay = idleStatus => (dispatch, getState) => 30000


export const activeStatusAction = (dispatch, getState) =>  {
  dispatch(setText({ subtitle: 'manager'}))
}

export const idleStatusAction = idleStatus => (dispatch, getState) => {
  dispatch(setText({ subtitle: idleStatus.replace(/_/g, ' ') }))
}

const opts = { appName: packageName, IDLE_STATUSES, idleStatusDelay, activeStatusAction, idleStatusAction }

const { reducer, actions, middleware } = configure(opts)
export { actions, middleware }
export default reducer
