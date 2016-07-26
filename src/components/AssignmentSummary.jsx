import React, { Component } from 'react'
import { Card, CardActions, CardTitle } from 'material-ui/Card'
import { StyleSheet, css } from 'aphrodite'
import FlatButton from 'material-ui/FlatButton'
import Badge from 'material-ui/Badge'
import moment from 'moment'
import Divider from 'material-ui/Divider'
import Tooltip from 'material-ui/internal/Tooltip'
import { withRouter } from 'react-router'

const inlineStyles = {
  badge: {
    fontSize: 9,
    top: 20,
    right: 20,
    padding: '4px 2px 0px 2px',
    width: 20,
    textAlign: 'center',
    verticalAlign: 'middle',
    height: 20
  }
}

const styles = StyleSheet.create({
  container: {
    margin: '20px 0'
  }
})

class AssignmentSummary extends Component {
  state = {
    badTimezoneTooltipOpen: false
  }

  goToTodos(contactFilter, assignmentId) {
    const { organizationId, router } = this.props

    if (contactFilter) {
      router.push(`/app/${organizationId}/todos/${assignmentId}/${contactFilter}`)
    }
  }
  renderBadgedButton({ assignment, title, count, primary, disabled, contactFilter, tooltip }) {
    const { badTimezoneTooltipOpen } = this.state
    return (count === 0 ? '' :
      <Badge
        key={title}
        badgeStyle={inlineStyles.badge}
        badgeContent={count}
        primary={primary}
        secondary={!primary}
      >
        <FlatButton
          disabled={disabled}
          label={title}
          onTouchTap={() => this.goToTodos(contactFilter, assignment.id)}
          onMouseEnter={() => tooltip ? this.setState({ badTimezoneTooltipOpen: true }) : {}}
          onMouseLeave={() => tooltip ? this.setState({ badTimezoneTooltipOpen: false }) : {}}
        />
        {badTimezoneTooltipOpen ? (
          <Tooltip
            label={tooltip}
            horizontalPosition='right'
            verticalPosition='top'
            touch
          />
        ) : ''}
      </Badge>
    )
  }

  render() {
    const { assignment, unmessagedCount, unrepliedCount, badTimezoneCount } = this.props
    const { title, description } = assignment.campaign
    return (
      <div className={css(styles.container)}>
        <Card
          key={assignment.id}
        >
          <CardTitle
            title={title}
            subtitle={`${description} - ${moment(assignment.dueBy).format('MMM D YYYY')}`}
          />
          <Divider />
          <CardActions>
            {this.renderBadgedButton({
              assignment,
              title: 'Send first texts',
              count: unmessagedCount,
              primary: true,
              disabled: false,
              contactFilter: 'text'
            })}
            {this.renderBadgedButton({
              assignment,
              title: 'Send replies',
              count: unrepliedCount,
              primary: false,
              disabled: false,
              contactFilter: 'reply'
            })}
            {this.renderBadgedButton({
              assignment,
              title: 'Send later',
              count: badTimezoneCount,
              primary: false,
              disabled: true,
              contactFilter: null,
              tooltip: "It's outside texting hours for some contacts. Come back later!"
            })}
          </CardActions>
        </Card>
      </div>
    )
  }
}

AssignmentSummary.propTypes = {
  organizationId: React.PropTypes.string,
  router: React.PropTypes.object,
  assignment: React.PropTypes.object,
  unmessagedCount: React.PropTypes.number,
  unrepliedCount: React.PropTypes.number,
  badTimezoneCount: React.PropTypes.number
}

export default withRouter(AssignmentSummary)
