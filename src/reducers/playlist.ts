import { handleActions } from 'redux-actions'
import { assign } from '../utils'

export const initialState = {
  isLoading: false,
  playlists: [],
  offset: 0,
  more: true,
  track: {},
  isRefreshing: false
}

export default handleActions({
  'playlists/sync/start' (state) {
    return assign(state, {
      isLoading: true
    })
  },

  'playlists/refresh/start' (state) {
    return assign(state, {
      isRefreshing: true
    })
  },

  'playlists/sync/end' (state) {
    return assign(state, {
      isLoading: false
    })
  },

  'playlists/refresh/end' (state) {
    return assign(state, {
      isRefreshing: false
    })
  },

  'playlists/sync/save' (state, { payload, meta }) {
    return assign(state, {
      playlists: payload,
      offset: meta.offset,
      more: meta.more
    })
  },
  'playlists/track/save' (state, { payload } ) {
    return {
      ...state,
      track: payload
    }
  }
}, initialState)
