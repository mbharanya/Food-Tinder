import * as WebRequest from 'web-request'
import * as cheerio from 'cheerio'
export default class App {
    private static readonly QUERY_REPLACE_STRING = "$searchQuery"
    private static readonly START_INDEX_REPLACE_STRING = "$start"
    private static readonly API_URL = "https://fooby.ch/hawaii_search.sri?query="
        + App.QUERY_REPLACE_STRING + "&lang=de&treffertyp=rezepte&start="
        + App.START_INDEX_REPLACE_STRING + "&num=1"

    async display(): Promise<any> {
        const keyword = "vegan"

        const searchQuery = App.API_URL.replace(App.QUERY_REPLACE_STRING, keyword).replace(App.START_INDEX_REPLACE_STRING, "0");
        const response = await WebRequest.get(searchQuery)
        const foobyResults = <FoobySearchResponse>JSON.parse(response.content)
        const randomIndex = Math.floor(Math.random() * foobyResults.resultcounts.all)
        console.debug(randomIndex)

        const randomResponse = await WebRequest.get(searchQuery.replace("0", String(randomIndex)))
        const randomUri = (<FoobySearchResponse>JSON.parse(randomResponse.content)).results.find(res => !!res.url).url
        console.debug(randomUri)

        const recipeSite = await WebRequest.get(randomUri)

        const $ = cheerio.load(recipeSite.content)
        const ingredientResponse = <IngredientResponse> $('[data-portion-calculator-initial-all-ingredients]').data().portionCalculatorInitialAllIngredients
        console.log(ingredientResponse.ingredients.map(ing => ing.desc).join("\n"));
        console.log($('meta[property="og:title"]').attr('content'))
        console.log($('meta[property="og:image"]').attr('content'))
    }
}

const app = new App()

app.display().then()

interface IngredientResponse{
    ingredients: Ingredient[]
}

interface Ingredient{
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