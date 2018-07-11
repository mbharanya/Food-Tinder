import React, { Component } from 'react'
import * as axios from 'axios'

class SearchBox extends Component {
    props
    constructor(props) {
        super(props)
        this.props = props
        this.getUrls()
    }

    state = {
        query: '',
    }

    handleInputChange = () => {
        this.setState({
            query: this.search.value
        })
    }

    getUrls = () => {
        let self = this
        axios({
            url: '/recipe-urls',
            method: "post",
            data: "keyword=" + this.state.query,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        })
            .then(function (response) {
                self.props.handleUrlsReceived(response.data)
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    render() {
        return (
            <form>
                <input
                    placeholder="Search for..."
                    ref={input => this.search = input}
                    onChange={this.handleInputChange}
                    defaultValue="vegetarisch"
                />
                <button type="button" onClick={this.getUrls}>Search</button>
            </form>
        )
    }
}

export default SearchBox
