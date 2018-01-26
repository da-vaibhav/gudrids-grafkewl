const promisify = require('util').promisify;
const fetch = require('node-fetch');
const key = require('./keys').key;
const parseXML = promisify(require('xml2js').parseString);
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} = require('graphql');

const baseURL = `https://www.goodreads.com/author/show/`;
const endPart = `?format=xml&key=${key}`;

const BookType = new GraphQLObjectType({
  name: 'book',
  description: '...',
  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: (book) => {
        return book.title[0];
      }
    },
    isbn: {
      type: GraphQLString,
      resolve: (book) => {
        return book.isbn[0];
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: '...',
  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: xml => {
        return xml.GoodreadsResponse.author[0].name[0];
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: xml => {
        return xml.GoodreadsResponse.author[0].books[0].book;
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
      author: {
        type: AuthorType,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (root, args) => fetch(`${baseURL}${args.id}${endPart}`)
          .then(response => response.text())
          .then(parseXML)
      }
    })
  })
});
