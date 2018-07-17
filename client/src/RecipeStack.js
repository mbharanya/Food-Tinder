import React, { Component } from 'react'
import Axios from 'axios'
import Swing, { Stack, Card, Direction } from 'react-swing'
import ReactDOM from 'react-dom'
import RecipeCard from './RecipeCard'

class RecipeStack extends Component {
    constructor(props) {
        super(props)
        this.state = {
            urlIndex: 5,
            urls: [],
            recipeCards: [],
            stack: null
        }
    }

    componentWillReceiveProps() {
        if (this.props.value && this.props.value.length) {
            this.setState({
                urls: this.shuffle(this.props.value)
            }, () => this.loadInitial(5))
        }
    }

    render() {
        if (this.state.recipeCards.length) {
            const recipeCards = this.state.recipeCards

            console.log(recipeCards)

            return (
                <div>
                    <div id="viewport">
                        <Swing
                            className="stack"
                            setStack={(stack) => this.setState({ stack: stack })}
                            // throwout={this.swipe}
                            ref="stack"
                        >
                            {recipeCards.map(
                                (recipeCard, index) =>
                                    <div key={index} throwout={(e) => this.swipe(e, this)} ref={"card" + index}>
                                        <RecipeCard recipeCard={recipeCard} />
                                    </div>
                            )}
                        </Swing>
                    </div>
                </div>
            )
        }
        return (
            <p>Loading...</p >
        )
    }

    loadInitial(amount) {
        if (this.state.recipeCards >= amount) {
            return
        }
        var self = this
        for (let i = 0; i < amount; i++) {
            this.getRecipeCardFromUrl(this.state.urls[i]).then(recipeCard => {
                self.setState(prevState => ({
                    recipeCards: [...prevState.recipeCards, recipeCard]
                }))
            })
        }
    }

    shiftAndUnshift(url) {
        var self = this
        this.setState(prevState => {
            const newRecipeCards = [...prevState.recipeCards]
            newRecipeCards.splice(prevState.recipeCards.length - 1, 1)
            return {
                recipeCards: newRecipeCards
            }
        })

        this.getRecipeCardFromUrl(url)
            .then(newRecipe => {
                self.setState(prevState => ({
                    recipeCards: [newRecipe, ...prevState.recipeCards]
                }))
            })
    }

    getRecipeCardFromUrl(url) {
        return Axios({
            url: '/recipes',
            method: "post",
            data: "url=" + url,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
            return response.data
        })
    }

    swipe(e, self) {
        console.log(e)
        const el = ReactDOM.findDOMNode(e.target)
        switch (e.throwDirection.toString()) {
            case Symbol.for("LEFT").toString():
                self.setState(prevState => ({
                    urlIndex: prevState.urlIndex + 1
                }))
                self.shiftAndUnshift(self.state.urls[self.state.urlIndex])
                break;
            case Symbol.for("RIGHT").toString():
                window.open(self.state.recipeCards[self.state.recipeCards.length - 1].url)
                break;
            default:
                console.log(e)
        }
    }

    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

}

export default RecipeStack