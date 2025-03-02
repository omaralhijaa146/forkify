import 'core-js/actual';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {API_URL as apiUrl} from "./config.js";
import {KEY} from "./config.js";
import {RES_PER_PAGE as paginationCount} from "./config.js";
import {AJAX, getJSON} from "./helpers.js";
import {sendJSON} from "./helpers.js";

export const state={
    recipe:{},
    search:{
        query:'',
        results:[],
        resultsPerPage:paginationCount,
        page:1
    },
    bookmarks:[]
};

const createRecipeObject=function(data){
    const {recipe} = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key &&{key:recipe.key})
    };

}

export const loadRecipe=async function(id){
    try {
        const data = await AJAX(`${apiUrl}/${id}?key=${KEY}`);
       state.recipe= createRecipeObject(data);
        state.recipe.bookmarked = state.bookmarks.some(x => x.id === id);

    }catch (err){
       throw err;
    }
}

export const loadSearchResult=async function(query){
    try{
        state.search.page=1;
        state.search.query=query;
        const data=await AJAX(`${apiUrl}?search=${query}&key=${KEY}`);
        state.search.results=data.data.recipes.map(rec=>{
           return {
               id: rec.id,
               title: rec.title,
               publisher: rec.publisher,
               image: rec.image_url,
               ...(rec.key &&{key:rec.key})
           };
        });
    }catch (err){
        throw err;
    }

}
export const getSearchResultPage=function(page=state.search.page){

    state.search.page=page;
    const start=(page-1)*state.search.resultsPerPage;
    const end=page*state.search.resultsPerPage;
    return state.search.results.slice(start,end);
};

export const updateServings=function(newServings){

    state.recipe.ingredients.forEach(ingredient=>{
        ingredient.quantity=ingredient.quantity*(newServings/state.recipe.servings);
    });

    state.recipe.servings=newServings;

};

const persistBookmarks=function(){
    localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks));
};

export const addBookmark=function(recipe){
    state.bookmarks.push(recipe);

    if(recipe.id===state.recipe.id)
        state.recipe.bookmarked=true;
    persistBookmarks();
};

export const deleteBookmark=function(id){
    const index=state.bookmarks.findIndex(x=>x.id===id);
    state.bookmarks.splice(index,1);
    if(id===state.recipe.id)
        state.recipe.bookmarked=false;
    persistBookmarks();
};

const init=function(){
    const storage=localStorage.getItem('bookmarks');
    if(storage)
        state.bookmarks=JSON.parse(storage);
}
init();
const clearBookmarks=function(){
    localStorage.clear();
}



export const uploadRecipe=async function(newRecipe){
    try{
        const ingredients= Object.entries(newRecipe).filter(entry=>entry[0].startsWith('ingredient')&&entry[1]!=='').map(ing=>{


            const ingArr=ing[1].replace(/ /g,'').split(',');
            if(ingArr.length!==3)throw new Error('Wrong ingredient format! Please use the correct format');
            const [quantity,unit,description]=ingArr;
            return {
                quantity:quantity?+quantity:null,
                unit,
                description
            };
        });

        const recipe={
            title:newRecipe.title,
            source_url:newRecipe.sourceUrl,
            image_url:newRecipe.image,
            publisher:newRecipe.publisher,
            cooking_time:+newRecipe.cookingTime,
            servings:+newRecipe.servings,
            ingredients: ingredients,
        };
        const data=await AJAX(`${apiUrl}?key=${KEY}`,recipe);
        state.recipe=createRecipeObject(data);
        addBookmark(state.recipe);

    }catch (err){
        console.log(err);
        throw err;
    }

};

//0bd03c79-44f4-4f5c-a987-3545ac2edbae
