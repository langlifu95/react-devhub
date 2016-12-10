// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Column from '../components/Column';

import {
  columnIsLoadingSelector,
  makeColumnSelector,
  makeColumnSubscriptionsSelector,
  makeDenormalizedColumnEventsSelector,
} from '../selectors';

import * as actionCreators from '../actions';
import type {
  ActionCreators,
  Column as ColumnType,
  GithubEvent,
  Subscription,
  State,
} from '../utils/types';

const makeMapStateToProps = () => {
  const columnSelector = makeColumnSelector();
  const denormalizedColumnEventsSelector = makeDenormalizedColumnEventsSelector();
  const columnSubscriptionsSelector = makeColumnSubscriptionsSelector();

  return (state: State, ownProps: { columnId: string }) => ({
    column: columnSelector(state, ownProps),
    events: denormalizedColumnEventsSelector(state, ownProps),
    subscriptions: columnSubscriptionsSelector(state, ownProps),
    loading: columnIsLoadingSelector(state, ownProps),
  });
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(makeMapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    column: ColumnType,
    events: Array<GithubEvent>,
    loading: boolean,
    subscriptions: Array<Subscription>,
  };

  render() {
    const { actions, column, events, loading, subscriptions, ...props } = this.props;

    return (
      <Column
        actions={actions}
        column={column}
        events={events}
        loading={loading}
        subscriptions={subscriptions}
        {...props}
      />
    );
  }
}
