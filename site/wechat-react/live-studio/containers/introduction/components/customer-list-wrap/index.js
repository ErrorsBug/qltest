import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CustomerList extends Component {
  

    getCustomers(){
        let cus = [];
        
        for (let i = 1; i <= 20; i++){
            cus.push(<div className="curtomer-live" key={'cus_'+i}><img src={require(`./imgs/icon_logo${i}.png`)}  /></div>)
        }
        return cus;
    }

    render() {
        return (
            <div className='customer-list-wrap'>
                <h1 className="org-tip">他们都在用</h1>

                <div className="customer-list">
                    <div className="scrll-bar">
                        {
                            this.getCustomers()
                        }
                    </div>    
                </div>
            </div>
        );
    }
}

CustomerList.propTypes = {

};

export default CustomerList;