import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { deletePost, downloadPostsStart, downVotePost, upVotePost } from './actions';
import PostSummary from './Summary';
import {
    CATEGORY_ALL,
    STORE_CATEGORIES,
    STORE_COMMENTS_BY_POST,
    STORE_POSTS_BY_CATEGORY,
    STORE_POSTS_DATA
} from '../constants';

const categoryNameStyle = {
    color: 'maroon',
    fontSize: '120%',
};

const titleStyle = {
    fontSize: 20,
    fontWeight: 600,
    marginTop: 0,
    textTransform: 'uppercase'
};

// TODO (1) List pages (root or category) include
// TODO     (a) a mechanism for sorting by date or by score (at a minimum)
// TODO     (b) the sort works properly
class ListView extends PureComponent {
    static propTypes = {
        category: PropTypes.string.isRequired,
        categories: ImmutablePropTypes.listOf( ImmutablePropTypes.mapContains( {
            name: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired
        } ) ).isRequired,
        [STORE_COMMENTS_BY_POST]: ImmutablePropTypes.mapOf(
            ImmutablePropTypes.setOf( PropTypes.string )
        ).isRequired,
        [STORE_POSTS_BY_CATEGORY]: ImmutablePropTypes.mapOf(
            ImmutablePropTypes.setOf( PropTypes.string )
        ).isRequired,
        [STORE_POSTS_DATA]: ImmutablePropTypes.mapContains( {
            author: PropTypes.string,
            body: PropTypes.string,
            category: PropTypes.string,
            deleted: PropTypes.bool,
            id: PropTypes.string,
            timestamp: PropTypes.number,
            title: PropTypes.string,
            voteScore: PropTypes.number
        } ).isRequired
    };

    constructor( props ) {
        super( props );
        this.deletePost = this.deletePost.bind( this );
        this.downVotePost = this.downVotePost.bind( this );
        this.upVotePost = this.upVotePost.bind( this );
    }

    deletePost( postId ) {
        this.props.dispatch( deletePost( postId ) );
    }

    downVotePost( postId ) {
        this.props.dispatch( downVotePost( postId ) );
    }

    upVotePost( postId ) {
        this.props.dispatch( upVotePost( postId ) );
    }

    componentDidMount() {
        this.props.dispatch( downloadPostsStart() );
    }

    render() {
        const categoryId = this.props.category;
        const postData = this.props[ STORE_POSTS_DATA ];
        let postIds = null;
        let title = null;

        // Get a title for the page and a list of post IDs to display
        if ( categoryId === CATEGORY_ALL ) {
            postIds = postData.keySeq();
            title = <span><span style={ categoryNameStyle }>All</span> Posts</span>;
        } else {
            postIds = this.props[ STORE_POSTS_BY_CATEGORY ].get( categoryId );
            if ( !postIds ) {
                postIds = Immutable.Set();
            }

            const categoryName = this.props.categories.size === 0 ? '' : this.props.categories
                .find( value => value.get( 'path' ) === categoryId )
                .get( 'name' );
            title = <span>Posts in the <span style={ categoryNameStyle }>{ categoryName }</span> Category</span>;
        }

        const commentsByPost = this.props[ STORE_COMMENTS_BY_POST ];
        const commentsLoaded = commentsByPost.size > 0;   // Assume there is at least one post with at least one comment
        const postSummaries = postIds
            .filter( id => {
                const data = postData.get( id );
                return !data.get( 'deleted' );
            } )
            .map( id => {
                const data = postData.get( id );
                const postId = data.get( 'id' );
                const commentCount = commentsLoaded && commentsByPost.has( postId )
                    ? commentsByPost.get( postId ).size : 0;
                return (
                    <PostSummary
                        key={ postId }
                        author={ data.get( 'author' ) }
                        body={ data.get( 'body' ) }
                        category={ data.get( 'category' ) }
                        commentCount={ commentCount }
                        deleteFunction={ this.deletePost }
                        downVoteFunction={ this.downVotePost }
                        id={ postId }
                        timestamp={ data.get( 'timestamp' ) }
                        title={ data.get( 'title' ) }
                        upVoteFunction={ this.upVotePost }
                        voteScore={ data.get( 'voteScore' ) }
                    />
                );
            } );

        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <h2 style={ titleStyle }>{ title }</h2>
                    </div>
                </div>
                { postSummaries }
            </div>
        );
    }
}

export default connect( state => ({
    categories: state.get( STORE_CATEGORIES ),
    [STORE_COMMENTS_BY_POST]: state.get( STORE_COMMENTS_BY_POST ),
    [STORE_POSTS_BY_CATEGORY]: state.get( STORE_POSTS_BY_CATEGORY ),
    [STORE_POSTS_DATA]: state.get( STORE_POSTS_DATA )
}) )( ListView );