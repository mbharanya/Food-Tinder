import * as WebRequest from 'web-request'
import * as cheerio from 'cheerio'

export class FoobyDataProvider {
    private static readonly QUERY_REPLACE_STRING = "$searchQuery"
    private static readonly START_INDEX_REPLACE_STRING = "$start"
    private static readonly NUM_REPLACE_STRING = "$num"
    private static readonly API_URL = "https://fooby.ch/hawaii_search.sri?query="
        + FoobyDataProvider.QUERY_REPLACE_STRING + "&lang=de&treffertyp=rezepte&start="
        + FoobyDataProvider.START_INDEX_REPLACE_STRING + "&num=" + FoobyDataProvider.NUM_REPLACE_STRING


    private static readonly MAX_RESULTS = "10000";
    private static readonly DEFAULT_START_INDEX = "0";

    async getRecipeUrls(keyword: string) {
        const searchQuery = FoobyDataProvider.API_URL
            .replace(FoobyDataProvider.QUERY_REPLACE_STRING, keyword)
            .replace(FoobyDataProvider.START_INDEX_REPLACE_STRING, FoobyDataProvider.DEFAULT_START_INDEX)
            .replace(FoobyDataProvider.NUM_REPLACE_STRING, FoobyDataProvider.MAX_RESULTS);

        const response = await WebRequest.get(searchQuery)
        const foobyResults = <FoobySearchResponse>JSON.parse(response.content)
        if (!foobyResults.resultcounts.all) {
            return Promise.reject()
        }

        return foobyResults.results.map(result => result.url)
    }

    async getRecipe(url: string): Promise<any> {
        const recipeSite = await WebRequest.get(url)

        const cheerioLoaded = cheerio.load(recipeSite.content)
        const ingredientResponse = <IngredientResponse>cheerioLoaded('[data-portion-calculator-initial-all-ingredients]').data().portionCalculatorInitialAllIngredients
        const recipeCard = <RecipeCard>{
            title: cheerioLoaded('meta[property="og:title"]').attr('content'),
            imageUrl: cheerioLoaded('meta[property="og:image"]').attr('content'),
            url: url,
            ingredients: ingredientResponse.ingredients
        }

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