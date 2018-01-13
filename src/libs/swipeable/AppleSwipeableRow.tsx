import React from 'react'
import { Animated, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'
import { RectButton, Swipeable } from 'react-native-gesture-handler'

import BaseSwipeableRow, {
  IBaseAction,
  IBaseProps,
  Placement,
} from './BaseSwipeableRow'

export { defaultWidth } from './BaseSwipeableRow'

export interface IAction extends IBaseAction {
  label: string
}

export interface IProps extends IBaseProps {}

export default class AppleSwipeableRow extends BaseSwipeableRow<IAction> {
  _swipeableRow = null

  renderButtonAction = (
    action: IAction,
    {
      x,
      placement,
      progress,
    }: { x: number; placement: Placement; progress: Animated.Value },
  ) => {
    const transform = {
      translateX:
        placement === 'LEFT'
          ? progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-x, 0],
            })
          : progress.interpolate({
              inputRange: [0, 1],
              outputRange: [x, 0],
            }),
    }

    const pressHandler = () => {
      action.onPress()
      this.close()
    }

    return (
      <Animated.View
        key={`swipeable-button-action-${action.key}`}
        style={{ flex: 1, transform: [transform] }}
      >
        <RectButton
          style={[
            styles.baseActionContainer,
            { backgroundColor: action.color, width: action.width },
          ]}
          onPress={pressHandler}
        >
          <Text
            style={[
              styles.actionText,
              { alignSelf: 'center', color: action.textColor || '#FFFFFF' },
            ]}
          >
            {action.label}
          </Text>
        </RectButton>
      </Animated.View>
    )
  }

  renderFullAction = (
    action: IAction,
    { dragX, placement }: { dragX: Animated.Value; placement: Placement },
  ) => {
    const transform = {
      translateX:
        placement === 'LEFT'
          ? dragX.interpolate({
              inputRange: [0, 50, 100, 101],
              outputRange: [-20, 0, 0, 1],
            })
          : dragX.interpolate({
              inputRange: [-101, -100, -50, 0],
              outputRange: [-1, 0, 0, 20],
            }),
    }

    const pressHandler = () => {
      action.onPress()
      this.close()
    }

    return (
      <RectButton
        key={`swipeable-full-action-${action.key}`}
        style={[
          styles.baseActionContainer,
          { backgroundColor: action.color, minWidth: action.width },
        ]}
        onPress={pressHandler}
      >
        <Animated.Text
          style={[
            styles.actionText,
            {
              alignSelf: placement === 'LEFT' ? 'flex-start' : 'flex-end',
              color: action.textColor || '#FFFFFF',
              transform: [transform],
            },
          ]}
        >
          {action.label}
        </Animated.Text>
      </RectButton>
    )
  }

  render() {
    const { children, ...props } = this.props

    return (
      <Swipeable
        {...props}
        ref={this.updateRef}
        friction={2}
        leftThreshold={30}
        renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
        rightThreshold={40}
      >
        {children}
      </Swipeable>
    )
  }
}

const styles = StyleSheet.create({
  baseActionContainer: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,

  actionText: {
    backgroundColor: 'transparent',
    fontSize: 16,
    padding: 10,
  } as TextStyle,
})
