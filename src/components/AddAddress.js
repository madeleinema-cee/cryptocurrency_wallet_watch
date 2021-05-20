import React, {Component} from 'react';
import {Link} from 'react-router-dom'


export class AddAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      address: '',
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({
      'address': event.target.value,
    })
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.addAddress(this.state.address)
    this.setState({
      address: '',
      isLoaded: true
    })
  }

  render() {

    return (
      <div onSubmit={this.onSubmit}>
        <div>
          <form>
            <input type='text' name='address' placeholder='Add blockchain.com wallet address'
                   value={this.state.address} onChange={this.onChange} required/>

                   <Link to={`/${this.state.address}`}>
            <div className='form-submit'>
              <input type="submit" value="Submit"/>
            </div>
                   </Link>
          </form>
        </div>

      </div>

    )
  }
}


export default AddAddress