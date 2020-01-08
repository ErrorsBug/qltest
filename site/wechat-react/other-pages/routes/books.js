export const BooksLists = {
  path: 'books-lists',
  getComponent: function(nextState, callback){
      require.ensure([], (require) => {
          callback(null, require('../containers/books-lists'));
      });
  }
};

export const BooksHome = {
  path: 'books-home',
  getComponent: function(nextState, callback){
      require.ensure([], (require) => {
          callback(null, require('../containers/books-home'));
      });
  }
};

export const BooksAll = {
  path: 'books-all',
  getComponent: function(nextState, callback){
      require.ensure([], (require) => {
          callback(null, require('../containers/books-all'));
      });
  }
};

export const BooksRanking = {
  path: 'books-ranking',
  getComponent: function(nextState, callback){
      require.ensure([], (require) => {
          callback(null, require('../containers/books-ranking'));
      });
  }
};

export const BookList = {
  path: 'book-list',
  getComponent: function(nextState, callback){
      require.ensure([], (require) => {
          callback(null, require('../containers/book-list'));
      });
  }
}

export const BookDetails = {
  path: 'book-details',
  getComponent: function(nextState, callback){
      require.ensure([], (require) => {
          callback(null, require('../containers/book-details'));
      });
  }
}

export const BookSecondary = {
  path: 'book-secondary',
  getComponent: function(nextState, callback){
      require.ensure([], (require) => {
          callback(null, require('../containers/book-secondary'));
      });
  }
}