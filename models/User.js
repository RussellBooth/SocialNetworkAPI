//const { assert } = require('console');
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trimmed: true,
        },
        email: {
            type: String,
            required: [true, 'User email required.'],
            unique: true,
            validate: {
                validator: function (v) {
                    return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v);
                },
                message: emailMessage => `${emailMessage.value} is not a valid email.`
            }     
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

userSchema
    .virtual('friendCount')
    .get(function () {
        return `${this.friends.length}`;
    });

const User = model('user', userSchema);
//const user = new User();

// let error;

// user.email = 'testingtest.com';
// error = user.validateSync();
// assert.equal(error.errors['email'].message,
//     'testingtest.com is not a valid email.');

// user.email = ' ';
// error = user.validateSync();
// assert.equal(error.errors['email'].message,
//     'User email required.');

// user.email = 'testing@test.com';
// error = user.validateSync();
// assert.equal(error,null);

module.exports = User;