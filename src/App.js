import React, {Component} from 'react';


export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      address: null,
      balances: [],
    };

    this.apiBase = 'https://blockchain.info/rawaddr/'
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({'address': event.target.value})
  }

  onSubmit(event) {
    fetch('https://api.allorigins.win/raw?url=' + this.apiBase + this.state.address)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            balances: this.formatBalances(result.txs),
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    event.preventDefault();

  }

  formatBalances(inputData) {
    console.log(inputData)
    let data = {}
    for (let i = 0; i < inputData.length; i++){
      data[inputData[i]['hash']] = {
        'time': inputData[i]['time'],
        'result': inputData[i]['result'],
      }
    }
    return data
  }

  render() {
    const {isLoaded, address, balances} = this.state;
    console.log(balances)
    if (!isLoaded) {
      return (
        <div>
          <div>
            <form ref="form" onSubmit={this.onSubmit} className="form-inline">
              <input type="text" onChange={this.onChange} value={this.state.address} className="form-control"
                     placeholder="add wallet address"/>
              <button type="submit" className="btn btn-default">Submit</button>
            </form>
          </div>
        </div>
      )
    }

    return (
      <div>
        {
          Object.keys(this.state.balances).map((key, index)=> (
              <p>{key} | {balances[key]['time']} | {balances[key]['result']}</p>
          ))
        }
      </div>
    )
  }


}


export default App;
