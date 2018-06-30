import * as express from "express";
import {Server, Path, GET, PathParam} from "typescript-rest";
import RandomRecipeGenerator from "./RandomRecipeGenerator";
 
@Path("/random-recipe ")
class RandomRecipeService {
  @Path(":keyword")
  @GET
  sayHello( @PathParam('keyword') keyword: string): Promise<string> {
    const generator = new RandomRecipeGenerator()
    return generator.getRandomRecipeCard(keyword)
  }
}
 
let app: express.Application = express();
Server.buildServices(app);

app.use(express.static('public'))
 
app.listen(3000, function() {
  console.log('Rest Server listening on port 3000!');
});
