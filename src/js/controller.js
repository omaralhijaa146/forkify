import 'core-js/actual';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from "./model.js";
import recipeView from "./views/recipe.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipe.js";
import {MODAL_CLOSE_SEC} from "./config.js";

const  controlRecipes= async function () {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;
        recipeView.renderSpinner();
        resultsView.update(model.getSearchResultPage());
        await model.loadRecipe(id);
        recipeView.render(model.state.recipe);
        bookmarksView.update(model.state.bookmarks);
    } catch (err) {
        console.log(err.message);
    }
};

const controlSearchResults = async function () {
  try{
      resultsView.renderSpinner();
      const query=searchView.getQuery();
      if(!query) return;

      await model.loadSearchResult(query);

      resultsView.render(model.getSearchResultPage());

      paginationView.render(model.state.search);
  } catch (err){
      console.error(err.message);
  }
};

const controlPagination=function(goTo){
    resultsView.render(model.getSearchResultPage(goTo));
    paginationView.render(model.state.search);

}

const controlServings=function(newServings){
    model.updateServings(newServings);
    recipeView.update(model.state.recipe);
};

const controlAddBookmark= function(){
    if(!model.state.recipe.bookmarked)
        model.addBookmark(model.state.recipe);
    else
        model.deleteBookmark(model.state.recipe.id);
    recipeView.update(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks=function(){
    bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe= async function(newRecipe){
    try{
        addRecipeView.renderSpinner();
        await model.uploadRecipe(newRecipe);
        console.log(model.state.recipe);
        recipeView.render(model.state.recipe);
        addRecipeView.renderMessage();
        bookmarksView.render(model.state.bookmarks);
        window.history.pushState(null,'',`#${model.state.recipe.id}`);
        setTimeout(function(){
            //addRecipeView._toggleWindow();
        },MODAL_CLOSE_SEC);

    }catch(err){
        addRecipeView.renderError(err.message);
    }
};

const init=function (){
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    bookmarksView.addHandlerRender(controlBookmarks);
    addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////
