$("#search").on("keyup", function () {
    getRecipe($(this).val())
});

$("#no").click(function () {
    updateFromSearchValue();
})

function updateFromSearchValue() {
    getRecipe($("#search").val());
}

function getRecipe(keyword) {
    $.get("random-recipe/" + keyword, function (recipeCard) {
        $('#title').html('<a href="' + recipeCard.url + '" target="_blank">' + recipeCard.title + '</a>')
        $('#recipe-image').attr("src", recipeCard.imageUrl)
        $('#ingredients').html(recipeCard.ingredients.map((i) => i.desc).join("<br>"))
    })
}

updateFromSearchValue()