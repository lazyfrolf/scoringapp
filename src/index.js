import React from 'react';
import ReactDOM from 'react-dom';
import Switch from 'react-switch';
import './index.css';
import fs from 'fs';


function Scorebutton(props){
  return(
    <select className="scorebutton" value={props.value} onChange={props.onChange}>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
  );
}



class Player extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
         <h3>{this.props.playername}</h3>
         <Scorebutton value={this.props.value} onChange={event => this.props.onChange(event)}/>
         <p>Total: {this.props.playerscore}</p>
      </div>
    );
  }
}

class HoleScreen extends React.Component {
  constructor(props) {
    super(props);
    const playerlis  = this.props.players;
    this.state = {
       players: playerlis  
    };
  }
  
  handleChange(event,index){
     const playerscorelis = this.state.playerscores.slice()
     playerscorelis[index] = event.target.value;
     this.setState({
         playerscores: playerscorelis
     });
  }  


  render() {
    const players1 = this.state.players.slice();
    const playersbuttons = players1.map((player,index) =>
            <li><Player 
                   playername = {player}
                   key={index} 
                   playerscore={this.props.totalscores[index]}
                   value={this.props.playerscores[index]}
                   onChange={(event) => this.props.scoreChange(event,index)}
                 /></li>
    );

    return(
      <div>
        <div>
          <h2>Hole {this.props.holenum}</h2>
          <h4>Par {this.props.holepar}</h4>
          <ul className="scoring-list">{playersbuttons}</ul>
        </div>
        <br/>
        <div>
          <button onClick={this.props.submitHole}>{this.props.nexthole}</button>
        </div>
      </div>
    );
  }
}


class EndPlayer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
         <h3>{this.props.playername}</h3>
         <p>Total: {this.props.playertotal}</p>
         <p>Scores: {this.props.playerscore}</p>
      </div>
    );
  } 
}
class EndScreen extends React.Component {
  constructor(props) {
    super(props);
    const playerlis  = this.props.players;
    this.state = {
       players: playerlis
    };
  }


  render() {
    const players1 = this.state.players.slice();
    const playersbuttons = players1.map((player,index) =>
            <li><EndPlayer
                   playername = {player}
                   key={index}
                   playertotal={this.props.totalscores[index]}
                   playerscore={this.props.playerscores[index]}
                 /></li>
    );

    return(
      <div>
        <div>
          <h2>Results</h2>
          <ul className="scoring-list">{playersbuttons}</ul>
        </div>
        <br/>
        <div>
          <button onClick={this.props.exportexcel}>Export to spreadsheet</button>
        </div>
        <button>Play Again</button>
      </div>
    );
  }

}

class GameForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
       inReverse: false,
       players: ['',''],
       singleScores: ['3','3'],
       totals: ['0','0'],
       isBeginning: true,
       isStarted: false,
       isEnded: false,
       holeindex: 0,
       holenumber: "1",
       holepar: "3",
       nexthole: "2",
       holenumbers: ["1","2","3","4","5","6","7","8","9"],
       frontpar: ["3","2","3","2","2","3","3","2","3"],
       backpar: ["2","3","3","2","2","3","3","2","4"]
       
    };
  }

  toggleSwitch = () => {
    this.setState(prevState => {
      return {
        inReverse: !prevState.inReverse
      };
    });
  };
 
  
  holeNext() {
     const nindex = this.state.holeindex;
     const uindex = nindex + 1;
     var i;
     var nscores = [];
     const nplayers = this.state.players.slice();
     for (i = 0; i < nplayers.length; i++){
         nscores.push("3");
     }
     const ntotal = this.state.totals.slice();
     const ncurrscores = this.state.singleScores.slice()
     const ngamescores = this.state.gamescoreslist.slice()
     var numtotals = [];
     var j;
     for (j=0; j< nplayers.length; j++){
          var onetotalstr = ntotal[j];
          var onetotalnum = Number(onetotalstr);
          var onecurrscorestr = ncurrscores[j];
          ngamescores[j] = ngamescores[j] + onecurrscorestr + (nindex === 8 ? "" : ",") 
          var onecurrscorenum = Number(onecurrscorestr);
          var newTotal = onetotalnum + onecurrscorenum;
          numtotals.push(newTotal.toString());
          
     }
     
     if(nindex === 8){
        this.setState({
             ...this.state,
             singleScores: nscores,
             totals: numtotals,
             gamescoreslist: ngamescores,
             isStarted: false,
             isEnded: true

        });
     }
     else{
        this.setState({
             ...this.state,
             holeindex: uindex,
             singleScores: nscores,
             totals: numtotals,
             gamescoreslist: ngamescores
        });
     }
  }

  handleChange(event,key) {
    const nplayers = this.state.players.slice();
    nplayers[key] = event.target.value;
    this.setState({
        players: nplayers
    });
  }

  addPlayer() {
    const nplayers = this.state.players.slice();
    nplayers.push("");
    const nscores = this.state.singleScores.slice();
    nscores.push("3");
    const ntotal = this.state.totals.slice();
    ntotal.push("0");
    this.setState({
       players: nplayers,
       singleScores: nscores,
       totals: ntotal 
    });
  }

  submitPlayers(){
     var scorelis = [];
     var nplayers = this.state.players.slice();
     for(var key in nplayers){
          scorelis.push('');
     }
     this.setState({
         isBeginning: false,
         isStarted: true,
         gamescoreslist: scorelis
     });
  }

  trackScore(event,index) {
     const nscores = this.state.singleScores.slice();
     nscores[index] = event.target.value;
     this.setState({
          ...this.state,
          singleScores: nscores 
     });
     
  }

  exportgame() {
    let data = "Put this in a file, please";
  }

  render() {
    const players1 = this.state.players;
    const playersbuttons = players1.map((player,index) => 
            <li><input 
                   type="text"
                   key={index} 
                   onChange={(event) => this.handleChange(event,index)}
                   value={player}
                 /></li>
    );
    const parlist = (this.state.inReverse ? this.state.backpar : this.state.frontpar);
    const currindex = this.state.holeindex;
    const currholenum = this.state.holenumbers[currindex];
    const currholepar = parlist[currindex];
    const nexhole = (currindex === 8 ?  "End Game" : "Hole " + this.state.holenumbers[currindex+1]);
    return (
      <div>
        {this.state.isBeginning &&
          <div>
            <h1>Working Title</h1>
            <ol>{playersbuttons}</ol>
            <button className="add-player-button" onClick={() => this.addPlayer()}>Add Player</button>
            <br/>
            <label className="toggle-space">
              <span>Front 9</span>
              <Switch 
                  className="toggle-switch"
                  onChange={this.toggleSwitch} 
                  checked={this.state.inReverse}
                  onColor="#223a5e"
                  onHandleColor="#8fabd6"
                  offColor="#8fabd6"
                  offHandleColor="#223a5e"
                  handleDiameter={15}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 5px rgba(255, 255, 255, 0.6)"
                  activeBoxShadow="0px 0px 1px 10px rgba(255, 255, 255, 0.2)"
                  height={24}
                  width={40}
                  id="small-radius-switch"
              />
              <span>Back 9</span>
            </label>
            <br/>
            <button className="start-game-button" onClick={() => this.submitPlayers()}>Start Game</button>
          </div>}
          {this.state.isStarted && <HoleScreen totalscores={this.state.totals} playerscores={this.state.singleScores} submitHole={() => this.holeNext()} scoreChange={(event,index) => this.trackScore(event,index)}   holenum={currholenum} holepar={currholepar} nexthole={nexhole} players={this.state.players}/>}
          {this.state.isEnded && <EndScreen  exportexcel = {() => this.exportgame()}players={this.state.players} totalscores={this.state.totals} playerscores={this.state.gamescoreslist}/>}
       </div>
    );
  }
}


ReactDOM.render(
   <GameForm />,
   document.getElementById('root')
);
