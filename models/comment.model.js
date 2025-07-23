import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    text: {
        type: String,
        required: true,
        maxlength: 200,
        minlength: 1,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},
 { timestamps: true}
);
export const Comment = mongoose.model('Comment',commentSchema);