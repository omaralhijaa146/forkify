import View from "./View";
import icons from 'url:../../img/icons.svg';
import preview from './PreviewView.js';
import previewView from "./PreviewView.js";
class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage='No bookmarks yet. Find a nice recipe and bookmark it';
    _message='';

    addHandlerRender(handler){
        window.addEventListener('load',handler);
    }

    _generateMarkup() {

        return this._data.map(res=>previewView.render(res,false)).join('');

    }
}

export default new BookmarksView();


