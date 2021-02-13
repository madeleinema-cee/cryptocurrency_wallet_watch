import React, {Component} from 'react';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      balances: []
    };
  }

  componentDidMount() {
    fetch("https://blockchain.info/rawaddr/1AJbsFZ64EpEfS5UAjAfcUG8pH8Jn3rn1F")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            balances: result.txs
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
    const { error, isLoaded, balances } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {balances.map(balance => (
            <li>
              {balance}
            </li>
          ))}
        </ul>
      );
    }
  }
}


class Form extends React.Component {
  render () {
    return (
      <form ref="form" onSubmit={this.onSubmit} className="form-inline">
        <input type="text" ref="itemName" className="form-control" placeholder="add wallet address"/>
        <button type="submit" className="btn btn-default">Submit</button>
      </form>
    );
  }
}

export default Form;
