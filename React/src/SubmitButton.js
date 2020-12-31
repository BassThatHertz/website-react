import React from 'react'

class SubmitButton extends React.Component {
    submitClicked = () => {
        this.props.onSubmit();
    }

    render () {
        return (
        <button id="convert_btn" className="btn btn-primary" onClick={this.submitClicked}>Submit</button>
        )
    }
}
export default SubmitButton;