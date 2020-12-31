import React from 'react'

class VbrDropdown extends React.Component {
    render() {
        return (
            <div id="fdk_vbr_div">
                <label htmlFor="fdk_vbr_value">VBR mode:</label>
                <select id="fdk_vbr_value" onChange={this.props.onVbrModeChange} value={this.props.vbrMode}>
                    <option disabled value>Select VBR mode</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select><br></br>
                <i>Quality range is from 1 (lowest) to 5 (highest).</i>
            </div>
        )
    }
}

export default VbrDropdown;