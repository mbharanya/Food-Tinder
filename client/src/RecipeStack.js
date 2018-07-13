import React, { Component } from 'react'
import Axios from 'axios'
import Swing, { Stack, Card, Direction } from 'react-swing'
import ReactDOM from 'react-dom'
import RecipeCard from './RecipeCard'

class RecipeStack extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recipeCards: [],
            stack: null
        }
    }
    render() {
        const rands = this.getRandomNumbers(5, this.props.value.length)
        const urls = this.props.value.filter((url, index) => rands.includes(index))

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
                                    <div key={index} throwout={this.swipe} ref={"card" + index}>
                                        <RecipeCard recipeCard={recipeCard}/>
                                    </div>
                            )}
                        </Swing>
                    </div>
                </div>
            )
        }

        urls.forEach(url => {
            Axios({
                url: '/recipes',
                method: "post",
                data: "url=" + url,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                const state = this.state
                this.setState({
                    recipeCards: state.recipeCards.concat(response.data)
                })
            })
        });

        return (
            <p> Loading...</p >
        )
    }

    getRandomNumbers(numNumbers, maxValue) {
        const nums = []
        for (let i = 0; i < numNumbers; i++) {
            nums.push(Math.floor(Math.random() * (maxValue + 1)))
        }
        return nums
    }

    swipe(e) {
        console.log(e)
        const el = ReactDOM.findDOMNode(e.target)
        switch (e.throwDirection.toString()) {
            case Symbol.for("LEFT").toString():
                console.log("nay")
                el.className = el.className + " hidden-card"
                break;
            case Symbol.for("RIGHT").toString():

                console.log("yay")
                break;
            default:
                console.log(e)
        }
    }
}

export default RecipeStack