import * as WebRequest from 'web-request'
import * as jQuery from 'jquery'
import * as cheerio from 'cheerio'
import { url } from 'inspector';
export default class RandomRecipeGenerator {
    private static readonly QUERY_REPLACE_STRING = "$searchQuery"
    private static readonly START_INDEX_REPLACE_STRING = "$start"
    private static readonly API_URL = "https://fooby.ch/hawaii_search.sri?query="
        + RandomRecipeGenerator.QUERY_REPLACE_STRING + "&lang=de&treffertyp=rezepte&start="
        + RandomRecipeGenerator.START_INDEX_REPLACE_STRING + "&num=1"

    async getRandomRecipeCard(keyword: string): Promise<any> {
        const defaultStartIndex = "0";
        const searchQuery = RandomRecipeGenerator.API_URL.replace(RandomRecipeGenerator.QUERY_REPLACE_STRING, keyword).replace(RandomRecipeGenerator.START_INDEX_REPLACE_STRING, defaultStartIndex);
        const response = await WebRequest.get(searchQuery)
        const foobyResults = <FoobySearchResponse>JSON.parse(response.content)
        const randomIndex = Math.floor(Math.random() * foobyResults.resultcounts.all)
        console.debug(randomIndex)

        const randomResponse = await WebRequest.get(searchQuery.replace(defaultStartIndex, String(randomIndex)))
        const foundRecipes = (<FoobySearchResponse>JSON.parse(randomResponse.content));
        if (!foundRecipes.resultcounts.all){
            return Promise.reject()
        }
        const randomUri = foundRecipes.results.find(res => !!res.url).url
        console.debug(randomUri)

        const recipeSite = await WebRequest.get(randomUri)

        const cheerioLoaded = cheerio.load(recipeSite.content)
        const ingredientResponse = <IngredientResponse>cheerioLoaded('[data-portion-calculator-initial-all-ingredients]').data().portionCalculatorInitialAllIngredients
        const recipeCard = <RecipeCard>{
            title: cheerioLoaded('meta[property="og:title"]').attr('content'),
            imageUrl: cheerioLoaded('meta[property="og:image"]').attr('content'),
            url: randomUri,
            ingredients: ingredientResponse.ingredients
        }

        console.log(recipeCard.title)
        console.log(recipeCard.imageUrl)
        console.log(recipeCard.ingredients.map(i => i.desc).join("\n"))


        return recipeCard
    }
}
interface RecipeCard {
    title: string
    imageUrl: string
    url: string
    ingredients: Ingredient[]
}

interface IngredientResponse {
    ingredients: Ingredient[]
}

interface Ingredient {
    quantity: number
    measure: string
    desc: string
}

interface ResultCounts {
    all: number
}

interface Result {
    url: string
}

interface FoobySearchResponse {
    resultcounts: ResultCounts
    results: Result[]
}