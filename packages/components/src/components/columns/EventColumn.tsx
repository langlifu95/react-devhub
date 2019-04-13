import React from 'react'

import { getColumnHeaderDetails, Omit } from '@devhub/core'
import {
  EventCardsContainer,
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import { ColumnRenderer } from './ColumnRenderer'

export interface EventColumnProps
  extends Omit<EventCardsContainerProps, 'repoIsKnown'> {
  columnIndex: number
  disableColumnOptions?: boolean
  headerDetails: ReturnType<typeof getColumnHeaderDetails>
  pagingEnabled?: boolean
}

export const EventColumn = React.memo((props: EventColumnProps) => {
  const {
    column,
    columnIndex,
    disableColumnOptions,
    headerDetails,
    pagingEnabled,
  } = props

  return (
    <ColumnRenderer
      key={`event-column-${column.id}-inner`}
      avatarRepo={headerDetails.avatarProps && headerDetails.avatarProps.repo}
      avatarUsername={
        headerDetails.avatarProps && headerDetails.avatarProps.username
      }
      column={column}
      columnIndex={columnIndex}
      disableColumnOptions={disableColumnOptions}
      icon={headerDetails.icon}
      owner={headerDetails.owner}
      pagingEnabled={pagingEnabled}
      repo={headerDetails.repo}
      repoIsKnown={headerDetails.repoIsKnown}
      subtitle={headerDetails.subtitle}
      title={headerDetails.title}
    >
      <EventCardsContainer
        key={`event-cards-container-${column.id}`}
        repoIsKnown={headerDetails.repoIsKnown}
        {...props}
        columnIndex={columnIndex}
      />
    </ColumnRenderer>
  )
})
