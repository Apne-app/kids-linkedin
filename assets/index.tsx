import { ActivityIndicator, StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import React from 'react'

const ICON_COLOR = 'white'
const CENTER_ICON_SIZE = 36
const BOTTOM_BAR_ICON_SIZE = 30

const style = StyleSheet.create({
  iconStyle: {
    textAlign: 'center',
    color: 'white'
  },
})

export const PlayIcon = () => (
  <Icon
    name='play-arrow'
    type="MaterialIcons"
    size={CENTER_ICON_SIZE}
    color={ICON_COLOR}
    style={style.iconStyle}
  />
)

export const PauseIcon = () => (
  <Icon type="MaterialIcons" name='pause' size={CENTER_ICON_SIZE} color={ICON_COLOR} style={style.iconStyle} />
)

export const Spinner = () => <ActivityIndicator color={ICON_COLOR} size='large' />

export const FullscreenEnterIcon = () => (
  <Icon
  type="MaterialIcons"
    name='fullscreen'
    size={BOTTOM_BAR_ICON_SIZE}
    color={ICON_COLOR}
    style={style.iconStyle}
  />
)

export const FullscreenExitIcon = () => (
  <Icon
  type="MaterialIcons"
    name='fullscreen-exit'
    size={BOTTOM_BAR_ICON_SIZE}
    color={ICON_COLOR}
    style={style.iconStyle}
  />
)

export const ReplayIcon = () => (
  <Icon type="MaterialIcons" name='replay' size={CENTER_ICON_SIZE} color={ICON_COLOR} style={style.iconStyle} />
)