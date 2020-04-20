import * as express from "express";
import { Server } from "typescript-rest";

import { RecipeService } from './rest/RecipeService'
import { RecipeUrlService } from './rest/RecipeUrlService'

let app: express.Application = express();
Server.buildServices(app, RecipeService, RecipeUrlService);

app.use(express.static('public'))

app.listen(3001, function () {
    console.log('Rest Server listening on port 3001!');
});
