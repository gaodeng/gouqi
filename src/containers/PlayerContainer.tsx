import * as React from 'react'
import { IPlayerProps as IProps } from '../interfaces'
import Player from '../components/player'
import { connect } from 'react-redux'
import { IPlayerState, IPlayerStatus } from '../reducers/player'
import {
  changeStatusAction,
  nextTrackAction,
  prevTrackAction,
  currentTimeAction,
  durationAction
} from '../actions'
import {
  View,
  ViewStyle,
  StyleSheet,
  Image,
  Text,
  TextStyle,
  TouchableOpacity
} from 'react-native'
import { centering } from '../styles'
import { get } from 'lodash'
import Icon from 'react-native-vector-icons/MaterialIcons'

class PlayerContainer extends React.Component<IProps, any> {

  constructor(props: IProps) {
    super(props)
  }

  render () {
    const {
      track
    } = this.props
    const picUrl = get(track, 'album.picUrl', '')
    const trackName = get(track, 'name', '')
    const albumName = get(track, 'album.name', '')
    return (
      <View style={styles.container}>
        <Player {...this.props} />
        <View style={styles.wrapper}>
          {this.renderImage(picUrl)}
          {this.renderText(trackName, albumName)}
          {this.renderBtns()}
        </View>
      </View>
    )
  }

  renderImage = (picUrl: string) => {
    const uri = picUrl || 'http://p4.music.126.net/YhnGyy3LtMFhoCvDI59JNA==/2589349883413112.jpg?param=50y50'
    return (
      <View style={centering}>
        <Image
          source={{ uri }}
          resizeMode='contain'
          style={[styles.component, { borderRadius: 20 }]}
        />
      </View>
    )
  }

  renderText = (title: string, subtitle: string) => {
    return (
      <View style={styles.titleContainer}>
        <View>
          <Text style={styles.title}  numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>
    )
  }

  renderBtns = () => {
    const {
      status
    } = this.props
    const playIcon = () => {
      return status === 'PLAYING'
        ? <Icon name='pause-circle-outline' size={32} color='#ccc'/>
        : <Icon name='play-circle-outline' size={32} color='#ccc'/>
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={[styles.btn, styles.component]} onPress={this.togglePlayPause}>
          {playIcon()}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.component]} onPress={this.nextTrack}>
          <Icon name='skip-next' size={32} color='#ccc'/>
        </TouchableOpacity>
      </View>
    )
  }

  togglePlayPause = () => {
    const { status } = this.props
    if (status === 'PLAYING') {
      this.props.changeStatus('PAUSED')
    } else {
      this.props.changeStatus('PLAYING')
    }
  }

  prevTrack = () => {
    this.props.prev()
  }

  nextTrack = () => {
    this.props.next()
  }

}

const styles = {
  container: {
    padding: 10,
    height: 60,
    borderTopColor: '#ededed',
    backgroundColor: 'rgba(249, 249, 249, 0.9)',
    borderTopWidth: StyleSheet.hairlineWidth
  } as ViewStyle,
  wrapper: {
    flex: 1,
    flexDirection: 'row'
  } as ViewStyle,
  component: {
    width: 40,
    height: 40
  } as ViewStyle,
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  } as ViewStyle,
  btn: {
    ...centering,
    marginLeft: 10
  } as ViewStyle,
  title: {
    marginLeft: 10,
    fontSize: 14
  } as TextStyle,
  subtitle: {
    marginLeft: 10,
    fontSize: 12,
    color: '#777'
  } as TextStyle
}

function mapStateToProps (
  {
    player: {
      playlist,
      playingTrack,
      status,
      mode,
      uri,
      duration,
      currentTime
    }
  }: { player: IPlayerState }
) {
  const track = playlist.find(t => t.id === playingTrack)
  return {
    mode,
    status,
    track,
    uri,
    duration,
    currentTime
  }
}

export default connect(
  mapStateToProps,
  (dispatch) => ({
    prev() {
      return dispatch(prevTrackAction())
    },
    next() {
      return dispatch(nextTrackAction())
    },
    changeStatus(status: IPlayerStatus) {
      return dispatch(changeStatusAction(status))
    },
    setCurrentTime(currentTime) {
      return dispatch(currentTimeAction(currentTime))
    },
    setDuration(duration) {
      return dispatch(durationAction(duration))
    }
  })
)(PlayerContainer)
