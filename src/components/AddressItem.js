import React, {Component} from 'react';

export class AddressItem extends Component {

   render() {
      const {address} = this.props.address
      return(
             <React.Fragment>
             <tr>
                <div>test</div>
                <th>{address}</th>
             </tr>
             </React.Fragment>
      )
   }
}



export default AddressItem