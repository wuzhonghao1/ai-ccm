import React from 'react';
import PropTypes from 'prop-types';

class Head extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    setInputValue = (event) => {
        this.props.setInputValue(event.target.value);
    };

    update = () => {
        this.props.update().then(res => console.log(res));
    };

    render() {
        return (
            <div>
                我是foot～~
                <input
                    value={this.props.inputValue}
                    onChange={(e) => this.props.setInputValue(e.target.value)}/>
                <button onClick={this.update}/>
            </div>
        );
    }
}

Head.propTypes = {
    inputValue: PropTypes.string,
    setInputValue: PropTypes.func
}
export default Head;