import React, {Component}from 'react';
import AddressItem from "./AddressItem"
import PropTypes from 'prop-types'

class Addresses extends Component {

   render(){
      return this.props.addresses.map((address) => (
         <AddressItem key={address.id} address = {address}/>
          )
      );
   }
}



export default Addresses