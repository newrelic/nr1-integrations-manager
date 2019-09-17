
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'semantic-ui-react'

export default class InstanceModal extends React.Component {

    static propTypes = {
        entity: PropTypes.object.isRequired,
        name: PropTypes.string.isRequired
    }

    constructor(props){
        super(props)
    }

    render(){
        const ordered = {};
        Object.keys(this.props.entity).sort().forEach((key)=>{
            ordered[key] = this.props.entity[key];
        });
        return ( 
            <Modal trigger={<Button inverted>{this.props.name}</Button>}>
                <Modal.Header>{this.props.name}</Modal.Header>
                <Modal.Content>
                    <textarea readOnly name="statusSample" style={{width:"100%", height:"500px"}} value={JSON.stringify(ordered,null,2)} />
                </Modal.Content>
            </Modal>
        )
    }
}