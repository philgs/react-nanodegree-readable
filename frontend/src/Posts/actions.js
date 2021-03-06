import * as api from '../api';
import { thunkPromiseChainErrorHandler } from '../utils';
import {
    DOWNLOAD_POSTS_COMPLETE,
    ERROR_SOURCE_API,
    POST_DELETE_COMPLETE,
    POST_START_EDIT,
    POST_SUBMIT_MODIFIED_COMPLETE,
    POST_SUBMIT_NEW_COMPLETE,
    POST_VOTE_COMPLETE,
    SET_LIST_VIEW_SORT_MODE
} from '../constants';

export const deletePost = function( postId ) {
    return function( dispatch ) {
        return api.deletePost( postId )
            .then( payload => dispatch( deletePostComplete( payload ) ) )
            .catch( thunkPromiseChainErrorHandler( ERROR_SOURCE_API ) );
    };
};

export const deletePostComplete = function( postData ) {
    return {
        type: POST_DELETE_COMPLETE,
        data: postData
    };
};

export const downloadPostsComplete = function( postsList ) {
    return {
        type: DOWNLOAD_POSTS_COMPLETE,
        data: { posts: postsList }
    };
};

export const downloadPostsStart = function() {
    return function( dispatch ) {
        return api.fetchPosts()
            .then( payload => dispatch( downloadPostsComplete( payload ) ) )
            .catch( thunkPromiseChainErrorHandler( ERROR_SOURCE_API ) );
    };
};

export const downVotePost = function( postId ) {
    return function( dispatch ) {
        return api.sendPostDownVote( postId )
            .then( payload => dispatch( postVoteComplete( payload ) ) )
            .catch( thunkPromiseChainErrorHandler( ERROR_SOURCE_API ) );
    };
};

export const editPost = function( postId ) {
    return {
        type: POST_START_EDIT,
        data: postId
    };
};

export const postVoteComplete = function( postData ) {
    return {
        type: POST_VOTE_COMPLETE,
        data: postData
    };
};

export const setListViewSortMode = function( newSortMode ) {
    return {
        type: SET_LIST_VIEW_SORT_MODE,
        data: newSortMode
    };
};

export const submitNewPost = function( postData ) {
    // `postData` is an object with the following fields: author, body, category, id, timestamp, title
    return function( dispatch ) {
        return api.sendNewPost( postData )
            .then( payload => dispatch( submitNewPostComplete( payload ) ) )
            .catch( thunkPromiseChainErrorHandler( ERROR_SOURCE_API ) );
    };
};

export const submitNewPostComplete = function( postData ) {
    return {
        type: POST_SUBMIT_NEW_COMPLETE,
        data: postData
    };
};

export const submitModifiedPost = function( postData ) {
    // `postData` is an object with the following fields: body, ID, title
    return function( dispatch ) {
        const { body, id, title } = postData;
        return api.sendUpdatedPost( { body, title }, id )
            .then( payload => dispatch( submitModifiedPostComplete( payload ) ) )
            .catch( thunkPromiseChainErrorHandler( ERROR_SOURCE_API ) );
    };
};

const submitModifiedPostComplete = function( postData ) {
    return {
        type: POST_SUBMIT_MODIFIED_COMPLETE,
        data: postData
    };
};

export const upVotePost = function( postId ) {
    return function( dispatch ) {
        return api.sendPostUpVote( postId )
            .then( payload => dispatch( postVoteComplete( payload ) ) )
            .catch( thunkPromiseChainErrorHandler( ERROR_SOURCE_API ) );
    };
};
