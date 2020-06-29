
class Setup extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    return (
      <div id={this.props.type + "-label"} className="d-flex justify-content-between align-items-center p-1 w-100">
        <span className="font-weight-bold">
          {this.props.type.toUpperCase()} Length
        </span>
        <div className="d-flex align-items-center">
          <span id={this.props.type + "-length"} className="d-block text-right px-3">
            {(this.props.length / 60)}
          </span>
          <div className="d-flex flex-column">
            <button id={this.props.type + "-increment"} onClick={this.props.add} type="button" className="btn btn-sm btn-info rounded-0"><i className="fa fa-chevron-up"></i></button>
            <button id={this.props.type + "-decrement"} onClick={this.props.dec} type="button" className="btn btn-sm btn-info rounded-0"><i className="fa fa-chevron-down"></i></button>
          </div>
        </div>
      </div>
    )
  }
}

function Title(props){
  return <h2 className="font-weight-bold text-info mr-auto"><i className="fa fa-clock-o"></i> {props.text}</h2>;
}

class Control extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    return (
      <div className="d-flex justify-content-center">
        <div className="btn-group">
          <button type="button" id="start_stop" onClick={this.props.startStop} className="btn btn-info"><i className="fa fa-play"> <i className="fa fa-pause"></i></i></button>
          <button type="button" id="reset" onClick={this.props.reset} className="btn btn-info"><i className="fa fa-refresh"></i></button>
        </div>
      </div>
    )
  }
}

class Clock extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      time: 1500, //1500
      session: 1500,//1500
      break: 300,//300
      timerStatus: "stopped",
      timerType: "session",
      interval: null
    }
    this.sessionTimeAdd = this.sessionTimeAdd.bind(this);
    this.sessionTimeDec = this.sessionTimeDec.bind(this);
    this.breakTimeAdd = this.breakTimeAdd.bind(this);
    this.breakTimeDec = this.breakTimeDec.bind(this);
    this.reset = this.reset.bind(this);
    this.countDown = this.countDown.bind(this);
    this.startStop = this.startStop.bind(this);
  }
  
  startStop(){
    if(this.state.timerStatus == "stopped"){
      this.countDown();
      this.setState({
        timerStatus: "playing"
      });
    }else{
      this.setState({
        timerStatus: "stopped"
      });
      clearInterval(this.state.interval);
    }
  }
  
  countDown(){
    this.setState({
      interval: setInterval(() => {this.typeControl(), this.timeDec()}, 1000)
    })
  }
  
  typeControl(){
    if(this.state.time === 0){
      document.getElementById("beep").play();
      if(this.state.timerType === "session"){
        this.setState({
          time: this.state.break + 1,
          timerType: "break"
        });
      }else{
        this.setState({
          time: this.state.session + 1,
          timerType: "session"
        })
      }
    }else if(this.state.time < 60){
      document.getElementById("clock-body").classList.add("bg-danger");
      document.getElementById("clock-body").classList.add("text-light");
    }else if(this.state.time < 60){
      document.getElementById("clock-body").classList.remove("bg-danger");
      document.getElementById("clock-body").classList.remove("text-light");
    }
  }
  
  timeDec(){
    this.setState({
      time: this.state.time - 1
    });
  }
  
  clockMeUp(){
    let time = this.state.time;
    let min, sec;
    min = Math.floor(time / 60);
    sec = Math.round(time % 60);
    if(min < 10){ min = "0" + min; }
    if(sec < 10){ sec = "0" + sec; }
    return min + ":" + sec;
  }
  
  sessionTimeAdd(){
    if(this.state.time >= 60 && this.state.time < 3600){
      this.setState({
        session: this.state.session + 60
      });
      if(this.state.timerType === "session"){
        this.setState({
          time: this.state.session + 60,
        })
      }
    }
  }
  
  sessionTimeDec(){
    if(this.state.time > 60 && this.state.time <= 3600){
      this.setState({
        session: this.state.session - 60
      });
      if(this.state.timerType === "session"){
        this.setState({
          time: this.state.session - 60,
        })
      }
    }
  }
  
  breakTimeAdd(){
    if(this.state.break >= 60 && this.state.break < 3600){
      this.setState({
        break: this.state.break + 60
      });
      if(this.state.timerType === "break"){
        this.setState({
          time: this.state.break + 60
        })
      }
    }
  }
  
  breakTimeDec(){
    if(this.state.break > 60 && this.state.break <= 3600){
      this.setState({
        break: this.state.break - 60
      });
      if(this.state.timerType === "break"){
        this.setState({
          time: this.state.break - 60
        })
      }
    }
  }
  
  reset(){
    this.setState({
      time: 1500,
      session: 1500,
      break: 300,
      timerStatus: "stopped",
      timerType: "session",
      interval: null
    });
    document.getElementById("clock-body").classList.remove("bg-danger");
    document.getElementById("clock-body").classList.remove("text-light");
    clearInterval(this.state.interval);
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
  }
  
  render(){
    return(
      <div className="-100 h-100 d-flex justify-content-center">
        <div className="mx-auto my-auto">
          <div className="card border-info mb-3">
            <div className="card-header d-flex flex-column justify-content-around align-items-center">
              <Title text="Pomodoro Clock" />
              <Setup type="break" add={this.breakTimeAdd} dec={this.breakTimeDec} length={this.state.break} />
              <Setup type="session" add={this.sessionTimeAdd} dec={this.sessionTimeDec} length={this.state.session} />
              <div className="p-2">
                <Control startStop={this.startStop} reset={this.reset} />
              </div>
            </div>
            <div id="clock-body" className="card-body">
              <h4 id="timer-label" className="card-title text-center">{this.state.timerType.toUpperCase()}</h4>
              <p id="time-left" className="card-text p-2 text-center display-2">
                {this.clockMeUp()}
              </p>
              <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Clock />, document.getElementById("clock"));
