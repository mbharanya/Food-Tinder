import { GET, Path, PathParam } from "typescript-rest";
import { FoobyDataProvider } from "../FoobyDataProvider";

@Path("/recipe-urls")
export class RecipeUrlService {
    @Path(":keyword")
    @GET
    getRecipeUrls(@PathParam('keyword') keyword: string): Promise<string[]> {
        const provider = new FoobyDataProvider()
        return provider.getRecipeUrls(keyword)
    }
}
