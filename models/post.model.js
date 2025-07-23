import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    helpfulVotes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            value: {
                type: String,
                enum: ['up', 'down'],
                required: true
            } // 'up' = helpful, 'down' = not helpful
        }
    ]
},
 { timestamps: true}
);
export const Post = mongoose.model('Post',postSchema);