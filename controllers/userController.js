const { User, Thought } = require('../models');

module.exports = {
    //get all Users
    async getUsers(req, res) {
        try {
            const users = await User.find().select('-__v');

            const userObj = {
                users,

            };

            res.json(userObj);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    //get a single student by id
    async getSingleUserById(req,res) {
        try {
            const users = await User.findOne({_id: req.params.userId })
                .populate('thoughts').populate('friends').select('-__v');

            if (!users) {
                return res.status(404).json({ message: 'No user with that Id'})
            }

            res.json({
                users,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    //create new user
    async createUser(req, res) {
        try {
            const users = await User.create(req.body);
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //update user
    async updateUser(req, res) {
        try{
            const users = await User.findOneAndUpdate(
                {_id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true}
            ).select('-__v');

            if (!users) {
                res.status(404).json({ message: 'No user with that Id'});
            }

            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //delete a user
    async deleteUser(req, res) {
        try {
            const users = await User.findOneAndDelete({ _id: req.params.userId});

            if (!users) {
                res.status(404).json({ message: 'No user with that Id'});
            }

            await Thought.deleteMany({ _id: { $in: users.user }});
            res.json({ message: 'User and thoughts deleteed'});
        } catch (err){
            res.status(500).json(err);
        }
    },
    //add friend
    async addFriend(req, res) {
        console.log('You are adding a new friend');
        try {
            const users = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!users) {
                return res
                    .status(404)
                    .json({ message: 'No user found with that Id'});
            }

            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }       
    },
    //delete a friend
    async deleteFriend(req,res) {
        console.log('You are removing a friend');

        try {
            const users = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true },
            );

            if (!users) {
                return res
                    .status(404)
                    .json({ message: 'No user found with that Id'});
            }

            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};