import { Path, POST, FormParam } from "typescript-rest";
import { FoobyDataProvider } from "../FoobyDataProvider";

@Path("/recipe-urls")
export class RecipeUrlService {
    @POST
    getRecipeUrls(@FormParam('keyword') keyword: string): Promise<string[]> {
        const provider = new FoobyDataProvider()
        return provider.getRecipeUrls(keyword)
    }
}
