import * as Rest from "typescript-rest";
import { FoobyDataProvider } from "../FoobyDataProvider";

@Rest.Path("/recipes")
export class RecipeService {
    @Rest.POST
    getRecipe(@Rest.FormParam('url') url: string): Promise<string[]> {
        const provider = new FoobyDataProvider()
        return provider.getRecipe(url)
    }
}