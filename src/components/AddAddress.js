import React, {Component} from 'react';

export class AddAddress extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      address: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({'address': event.target.value})
  }
   onSubmit = (event) => {
      //在 React 中另一个不同点是你不能通过返回 false 的方式阻止默认行为。你必须显式的使用 preventDefault 。
      event.preventDefault();
      this.props.addAddress(this.state.address)
      //this.state is like self.state
      this.setState({
         address: '',
          isLoaded: true
      })
   }

   render() {
      return(
          <form onSubmit={this.onSubmit}>
             <div>
             <input
                 type='text'
                 name='address'
                 placeholder='Add wallet address'
                 value = {this.state.address}
                 onChange={this.onChange}
             />
             </div>
             <div>
             <input
                 type='submit'
                 value='submit'
                 className='btn'
             />
             </div>
          </form>
      )
   }
}

export default AddAddress