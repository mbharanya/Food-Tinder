import React, { Component } from 'react'

class RecipeCard extends Component {
    props
    constructor(props) {
        super(props)
        this.props = props
        console.log(props)
    }

    render() {
        const recipeCard = this.props.recipeCard
        if (!recipeCard) {
            return null
        }
        return (
            <div className={"card" + (this.props.topCard ? "" : " hidden-card")} key={recipeCard.url}>
                <img className="card-img-top" src={recipeCard.imageUrl} />
                <div className="card-body">
                    <a href={recipeCard.url} target="_blank">{recipeCard.title}<h3 className="card-title"></h3></a>
                    <ul className="card-text" >
                        {recipeCard.ingredients.map((i) =>
                            <li>{(i.quantity ? i.quantity + " " : "") + i.measure + " " + i.desc}</li>
                        )}
                    </ul>
                </div>
            </div>
        )
    }
}
export default RecipeCard