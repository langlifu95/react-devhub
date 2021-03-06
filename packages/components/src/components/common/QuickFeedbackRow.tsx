import { constants } from '@devhub/core'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { batch } from 'react-redux'

import { useReduxState } from '../../hooks/use-redux-state'
import { bugsnag } from '../../libs/bugsnag'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { getDefaultDevHubHeaders } from '../../utils/api'
import { ThemedText } from '../themed/ThemedText'
import { ThemedTextInput } from '../themed/ThemedTextInput'
import { Link } from './Link'
import { defaultTextInputHeight } from './TextInput'

export interface QuickFeedbackRowProps {}

export const quickFeedbackRowHeight = defaultTextInputHeight

export function QuickFeedbackRow(_props: QuickFeedbackRowProps) {
  const isMountedRef = useRef(true)

  const [feedbackText, setFeedbackText] = useState('')
  const [message, setMessage] = useState<React.ReactNode>('')
  const [placeholder, setPlaceholder] = useState('')

  const appToken = useReduxState(selectors.appTokenSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  async function trySendFeedback() {
    const response = await axios.post(
      `${constants.API_BASE_URL}/feedback`,
      {
        feedback: feedbackText || '',
        location:
          (currentOpenedModal && currentOpenedModal.name) ||
          (appToken ? 'MAIN_SCREEN' : 'LOGIN_SCREEN'),
      },
      { headers: getDefaultDevHubHeaders({ appToken }) },
    )

    if (!isMountedRef.current) return

    const { data, status } = await response // eslint-disable-line

    if (status !== 200) {
      throw new Error(
        typeof data === 'string' ? data : 'Failed to send feedback.',
      )
    }
  }

  async function handleSubmit() {
    if (!isMountedRef.current) return

    if (!(feedbackText && feedbackText.trim())) return

    try {
      setMessage('Sending...')

      await trySendFeedback()
      if (!isMountedRef.current) return

      if (feedbackText.toLowerCase().includes('expensive')) {
        setMessage('Got it...')

        setTimeout(() => {
          setMessage('How much would you pay?')
          setTimeout(() => {
            batch(() => {
              setMessage('')
              setFeedbackText('')
              setPlaceholder('How much would you pay?')
            })
          }, 2000)
        }, 1000)

        return
      }
      if (feedbackText.toLowerCase().includes(' caro')) {
        setMessage('Entendi...')
        setTimeout(() => {
          setMessage('Quanto voc?? pagaria?')
          setTimeout(() => {
            batch(() => {
              setMessage('')
              setFeedbackText('')
              setPlaceholder('Quanto voc?? pagaria?')
            })
          }, 2000)
        }, 1000)

        return
      }

      setTimeout(() => {
        setMessage('Thanks for your feedback!')

        setTimeout(() => {
          setMessage(
            <View
              style={[
                sharedStyles.flex,
                sharedStyles.flexWrap,
                sharedStyles.horizontal,
                sharedStyles.alignSelfCenter,
                sharedStyles.justifyContentCenter,
              ]}
            >
              <Link
                analyticsLabel="send_feedback_via_twitter"
                enableUnderlineHover
                forceOpenOutsideApp
                href={`https://twitter.com/messages/compose?recipient_id=1013342195087224832&text=${
                  typeof encodeURIComponent === 'function'
                    ? encodeURIComponent(feedbackText)
                    : feedbackText
                }`}
                openOnNewTab
                textProps={{
                  color: 'foregroundColorMuted65',
                }}
              >
                Send via Twitter
              </Link>
              {/*
              <ThemedText color="foregroundColorMuted65">{' or '}</ThemedText>
              <Link
                analyticsLabel="join_slack_after_feedback"
                enableUnderlineHover
                href={constants.DEVHUB_LINKS.SLACK_INVITATION}
                openOnNewTab
                textProps={{
                  color: 'foregroundColorMuted65',
                }}
              >
                Slack
              </Link>
              */}
              <ThemedText color="foregroundColorMuted65">
                {' to get a response.'}
              </ThemedText>
            </View>,
          )

          setTimeout(() => {
            batch(() => {
              setMessage('')
              setFeedbackText('')
              setPlaceholder('')
            })
          }, 8000)
        }, 2000)
      }, 1000)
    } catch (error) {
      console.error(error)
      bugsnag.notify(error)

      setMessage(`Failed to send feedback. Please contact us.`)

      setTimeout(() => {
        batch(() => {
          setMessage('')
          setFeedbackText('')
          setPlaceholder('')
        })
      }, 3000)
    }
  }

  return (
    <View
      style={[
        sharedStyles.fullWidth,
        sharedStyles.horizontalAndVerticallyAligned,
        { height: quickFeedbackRowHeight },
      ]}
    >
      {message ? (
        typeof message === 'string' ? (
          <ThemedText
            color="foregroundColorMuted65"
            style={[sharedStyles.flex, sharedStyles.textCenter]}
          >
            {message}
          </ThemedText>
        ) : (
          message
        )
      ) : (
        <ThemedTextInput
          textInputKey="quick-feedback-text-input"
          onChangeText={(text) => {
            setFeedbackText(text)
          }}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder || 'Send quick feedback'}
          style={[sharedStyles.flex, sharedStyles.textCenter]}
        />
      )}
    </View>
  )
}
