import './App.css';
import React, {Component}from 'react';
import Addresses from "./components/Addresses";
import AddAddress from "./components/AddAddress";


class App extends Component{
   constructor(props) {
      super(props);
      this.state = {
         isLoaded: false,
         addresses:[],
         error: null,
         balances: []
      }

      this.apiBase = 'https://blockchain.info/rawaddr/'
   }

   fetchBitcoinTranscationDataWithAPI(address){
      fetch('https://api.allorigins.win/raw?url=' + this.apiBase + address)
      .then(res => res.json())
      .then(
          (result) => {
             this.setState({
                isLoaded: true,
                balances: this.formatBalances(result.txs),
             });
             console.log(this.state.balances)
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

   formatBalances(inputData) {
      let data = {}
      for (let i = 0; i < inputData.length; i++) {
         let dateString = new Date(inputData[i]['time'] * 1000).toISOString()
         let convertedCryptoAmount = inputData[i]['result']/ 100000000
         data[dateString] =  convertedCryptoAmount

      }

      return data
   }

   addAddress = (address) => {
      this.fetchBitcoinTranscationDataWithAPI(address)

      // const newAddress = {
      //    address: address,
      // }
      // this.setState({addresses: [...this.state.addresses, newAddress]})

   }

   render() {
      const {isLoaded, address, balances} = this.state;

      if (!isLoaded){
         return (
             <React.Fragment>
               <AddAddress addAddress={this.addAddress}/>

             </React.Fragment>)
          }

      return (
          <React.Fragment>
             <Addresses addresses= {this.state.addresses}/>
             <div>
                {address}
               {
                  Object.keys(this.state.balances).map((key, index)=> (
                 <p>{key} | {balances[key]}</p>
                  ))
               }
            </div>
          </React.Fragment>
      )
   }
}




export default App;