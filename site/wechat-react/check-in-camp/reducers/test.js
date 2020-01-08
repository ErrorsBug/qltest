import { normalize, schema } from 'normalizr';

const initData = {
    postList: [
        {
            id: 1,
            title: 'post1',
            auther: {
                id: 'u1',
                name: 'dodomon'
            },
            comments: [
                {
                    commenter:{
                        id: 'u1',
                        name: 'dodomon'
                    },
                    value: 'hahahaaha'
                }
            ]
        }, {
            id: 2,
            title: 'post2',
            auther: {
                id: 'u2',
                name: 'wenqi'
            },
            comments: [
                {
                    commenter:{
                        id: 'u1',
                        name: 'dodomon'
                    },
                    value: 'hahahaaha'
                }
            ]
        }, {
            id: 3,
            title: 'post3',
            auther: {
                id: 'u3',
                name: 'xiaoqiang'
            },
            comments: [
                {
                    commenter:{
                        id: 'u1',
                        name: 'dodomon'
                    },
                    value: 'hahahaaha'
                }
            ]
        }
    ]

};


const test2 =  {
    "id": "123",
    "author": {
      "id": "1",
      "name": "Paul"
    },
    "title": "My awesome blog post",
    "comments": [
      {
        "id": "324",
        "commenter": {
          "id": "2",
          "name": "Nicole"
        }
      }
    ]
  }

//   const user = new schema.Entity('users');

//   // Define your comments schema
//   const comment = new schema.Entity('comments', {
//     commenter: user
//   });
  
//   // Define your article 
//   const article = new schema.Entity('articles', { 
//     author: user,
//     comments: [ comment ]
//   });

// const test2Data = normalize(test2,article);

const user = new schema.Entity('users');
const comment = new schema.Entity('comments', {
    commenter: user
});
const post = new schema.Entity('post', { 
    author: user,
    comments: [ comment ]
});

const postList =  {
    postList: [post]
}

const normalizedData = normalize(initData, postList);
const test2Data = normalize(test2, post);
// console.log(test2Data)
// console.log(normalizedData)

// const myData = { users: [ { id: 1 }, { id: 2 } ] };
// const user = new schema.Entity('users');
// const mySchema = { users: [ user ] }
// const normalizedData = normalize(myData, mySchema);

// console.log(normalizedData)

export function test (state = {}, action) {
    switch (action.type) {

        default:
            return state
    }
}
