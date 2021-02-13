import React, {Component} from 'react';


export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      address: '1AJbsFZ64EpEfS5UAjAfcUG8pH8Jn3rn1F',
      balances: [],
      x: null
    };

    this.apiBase = 'https://blockchain.info/rawaddr/'
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({'address': event.target.value})
  }

  onSubmit(event) {
    event.preventDefault();
    fetch(this.apiBase + this.state.address)
      .then(res => res.json())
      .then(
        (result) => {
          this.replaceState({
            isLoaded: true,
            balances: result.txs,
            x: result
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
  }

  render() {
    const {isLoaded, address, balances} = this.state;
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
        {JSON.stringify(this.state.x)}
        {this.state.balances}
      </div>
    )
  }


}


export default App;
