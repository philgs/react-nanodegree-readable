import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Author from './Author';
import CommentData from './CommentData';
import EditDeleteButtons from '../Shared/EditDeleteButtons';
import Title from './Title';
import FlexRow from '../Shared/FlexRow';
import Score from '../Shared/Score';

// TODO (1) Listed posts are displayed with ... (f) buttons or links for editing ... the post

const summaryBodyStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};

const summarySectionStyle = {
    fontSize: '120%',
    marginTop: 10
};

class Summary extends PureComponent {
    static propTypes = {
        author: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        commentCount: PropTypes.number.isRequired,
        deleteFunction: PropTypes.func.isRequired,
        downVoteFunction: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        timestamp: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        upVoteFunction: PropTypes.func.isRequired,
        voteScore: PropTypes.number.isRequired
    };

    render() {
        const {
            author,
            body,
            category,
            commentCount,
            deleteFunction,
            downVoteFunction,
            id,
            title,
            upVoteFunction,
            voteScore
        } = this.props;
        return (
            <section className="row" style={ summarySectionStyle }>
                <FlexRow>
                    <Title category={ category } postId={ id } title={ title } />
                    <div style={ summaryBodyStyle }>{ body }</div>
                </FlexRow>
                <FlexRow>
                    <Score
                        downVoteFunction={ downVoteFunction }
                        score={ voteScore }
                        targetId={ id }
                        upVoteFunction={ upVoteFunction }
                    />
                    <Author author={ author } />
                    <CommentData commentCount={ commentCount } />
                    <EditDeleteButtons
                        deleteFunction={ deleteFunction }
                        targetId={ id }
                    />
                </FlexRow>
            </section>
        );
    }
}

export default Summary;
