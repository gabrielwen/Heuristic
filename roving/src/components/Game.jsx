'use strict';

var _lo = require('lodash');
var util = require('util');
var React = require('react');
var Input = require('react-bootstrap').Input;
var ButtonInput = require('react-bootstrap').ButtonInput;
var Button = require('react-bootstrap').Button;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Panel = require('react-bootstrap').Panel;

var constants = require('../common/constants');
var GameActions = require('../actions/GameActions');
var GameStores = require('../stores/GameStores');

var SettingForm = require('../common/SettingForm.jsx');

var Game = React.createClass({
  getInitialState: function() {
    return GameStores.getState();
  },
  componentDidMount: function() {
    GameStores.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    GameStores.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(GameStores.getState());
  },
  test: function() {
    console.log('Game TEST');
  },
  handleCellClick: function(i, j) {
    console.log(util.format('handleCellClick: %s %s', i, j));
  },
  render: function() {
    var title = this.state.gameInit ? util.format('Game Playing: %s x %s with %s bombs and %s rovers',
                                      this.state.gameConfig.numRows, this.state.gameConfig.numCols,
                                      this.state.gameConfig.numBombs, this.state.gameConfig.numRovers) :
                                      'Please choose configurations';

    //TODO: onClick here
    var button = this.state.gameInit ? (
      <ButtonGroup>
        <Button bsStyle="primary">Play</Button>
        <Button bsSylte="danger">Reset</Button>
      </ButtonGroup>
    ) : null;

    return (
      <div>
        <Panel header={title}>
          {this.state.gameInit ? null : <SettingForm handleSubmit={GameActions.handleGameInit}/>}
          {button}
        </Panel>
        <Grid grid={this.state.grid} gameInit={this.state.gameInit} gameStart={this.state.gameStart}
              gameConfig={this.state.gameConfig} handleClick={this.handleCellClick}/>
      </div>
    );
  }
});

var Grid = React.createClass({
  render: function() {
    if (!this.props.gameInit || _lo.isEmpty(this.props.grid)) {
      return null;
    }

    var ret = [];
    _lo.times(this.props.gameConfig.numRows, function(i) {
      _lo.times(this.props.gameConfig.numCols, function(j) {
        ret.push(
          <div onClick={_lo.partial(this.props.handleClick, i, j)}>
            <Cell state={this.props.grid[i][j]} gameStart={this.props.gameStart}/>
          </div>
        );
      }, this);
    }, this);

    return <div>{ret}</div>;
  }
});

var Cell = React.createClass({
  render: function() {
    var img = '';
    switch(this.props.state) {
      case constants.State.CLEAR:
        img = constants.Figures.dot;
        break;
      case constants.State.BOMB:
        img = this.props.gameStart ? constants.dot : constants.Figures.bombs;
        break;
      case constants.State.BURST:
        img = constants.Figures.burst;
        break;
      case constants.State.ROVER:
        img = constants.Figures.rover;
        break;
      case constants.State.PLAYER:
        img = constants.Figures.player;
        break;
      case constants.State.DEST:
        //TODO
        break;
      default:
    }

    return <img src={img}/>;
  }
});

module.exports = Game;
