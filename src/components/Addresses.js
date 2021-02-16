import React, {Component}from 'react';
import AddressItem from "./AddressItem"

class Addresses extends Component {

   render(){
       return this.props.addresses.map((address) => (
         <AddressItem key={address.id} address = {address}/>
          )
      );
   }
}



export default Addresses