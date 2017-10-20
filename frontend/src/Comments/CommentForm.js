import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

const formLabelStyle = {
    fontSize: 14
};

// TODO Make reset button work
class CommentForm extends PureComponent {
    static propTypes = {
        author: PropTypes.string,
        body: PropTypes.string,
        id: PropTypes.string,
        parentId: PropTypes.string.isRequired,
        submitFunction: PropTypes.func.isRequired,
        timestamp: PropTypes.number,
        voteScore: PropTypes.number
    };

    constructor( props ) {
        super( props );
        this.state = {
            author: props.author || '',
            body: props.body || ''
        };

        this.handleAuthorInput = this.handleAuthorInput.bind( this );
        this.handleBodyInput = this.handleBodyInput.bind( this );
        this.handleSubmit = this.handleSubmit.bind( this );
    }

    handleAuthorInput( event ) {
        this.setState( { author: event.target.value } );
    }

    handleBodyInput( event ) {
        this.setState( { body: event.target.value } );
    }

    handleSubmit( event ) {
        event.preventDefault();
        // If an ID was passed in as props, assume we are editing
        const newComment = !this.props.id;
        const commentData = newComment ? {
            author: this.state.author,
            body: this.state.body,
            parentId: this.props.parentId
        } : {
            body: this.state.body,
            id: this.props.id,
            timestamp: this.props.timestamp
        };
        this.props.submitFunction( commentData, newComment );
    }

    render() {
        const { author, body } = this.state;
        return (
            <form className="form-horizontal" onSubmit={ this.handleSubmit }>
                <div className="form-group">
                    <label
                        className="col-xs-2 control-label"
                        style={ formLabelStyle }
                        htmlFor="comment-author-name"
                    >
                        Your name
                    </label>
                    <div className="col-xs-10">
                        <input
                            className="form-control"
                            id="comment-author-name"
                            onChange={ this.handleAuthorInput }
                            placeholder="Name"
                            type="text"
                            value={ author }
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label
                        className="col-xs-2 control-label"
                        style={ formLabelStyle }
                        htmlFor="comment-body"
                    >
                        Comment
                    </label>
                    <div className="col-xs-10">
                        <input
                            className="form-control"
                            id="comment-body"
                            onChange={ this.handleBodyInput }
                            placeholder="Something insightful and constructive..."
                            type="text"
                            value={ body }
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-xs-12 text-right">
                        <button type="button" className="btn btn-default">Reset</button>
                        &nbsp;&nbsp;
                        <button type="submit" className="btn btn-primary">Post</button>
                    </div>
                </div>
            </form>
        );
    }
}

export default CommentForm;
