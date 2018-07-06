$("#searchButton").on("click", function () {
    updateFromSearchValue()
});

$("#no").click(function () {
    getNextRandomRecipe()
})

function updateFromSearchValue() {
    updateRecipeUrls($("#search").val())
}

let urls = []

function updateRecipeUrls(keyword) {
    $.post("recipe-urls/", "keyword=" + keyword, function (foundUrls) {
        urls = foundUrls
        getNextRandomRecipe()
    })
}

function getNextRandomRecipe() {
    if (!urls.length) {
        updateRecipeUrls()
        return
    }

    const randomIndex = Math.floor(Math.random() * (urls.length + 1))

    $.post("recipes/", "url=" + urls[randomIndex], function (recipeCard) {
        $('#title').html('<a href="' + recipeCard.url + '" target="_blank">' + recipeCard.title + '</a>')
        $('#recipe-image').attr("src", recipeCard.imageUrl)
        $('#ingredients').html(recipeCard.ingredients.map((i) => i.desc).join("<br>"))
        $('#yes').wrap('<a href="' + recipeCard.url + '" target="_blank"></a>')
    })

}

updateFromSearchValue()