import React, { Component } from 'react';
import SearchBox from './SearchBox'
import './App.css';
import RecipeStack from './RecipeStack';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { availableUrls: [] }
    }

    render() {
        return (
            <div>
                <SearchBox handleUrlsReceived={(urls) => this.setState({ availableUrls: urls })}></SearchBox>
                <RecipeStack value={this.state.availableUrls}></RecipeStack>
            </div>
        );
    }
}

export default App;
