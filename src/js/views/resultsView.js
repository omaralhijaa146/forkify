import View from "./View";
import icons from 'url:../../img/icons.svg';
import previewView from "./PreviewView.js";
class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage='We could not find that recipe. Please try another one!';
    _message='';

    _generateMarkup() {

        return this._data.map(res=>previewView.render(res,false)).join('');

    }
}

export default new ResultsView();


