const { User, Thought } = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find().populate('username').select('-__v');
            res.json(thoughts);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        } 
    },
    async getSingleThoughtById(req, res) {
        try {
            const thoughts = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');

            if (!thoughts) {
                return res.status(404).json({ message: 'No thoughts found with that Id'});
            }

            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const users = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            );
            
            if (!users) {
                return res
                    .status(404)
                    .json({ message: 'Thought created, but no user with that Id' });
            }

            res.json('Created the thought');
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    async updateThought(req, res) {
        try {
            const thoughts = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thoughts) {
                res.status(404).json({ message: 'No thought with this Id' });
            }

            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteThought(req, res) {
        try {
         const thoughts = await Thought.findOneAndDelete({ _id: req.params.thoughtId});
         
         if (!thoughts) {
            res.status(404).json({ message: 'No thought with that Id' });
         }
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createReaction(req, res) {
        console.log('You are adding a reaction to a thought');
        console.log(req.body);
        try {
            const thoughts = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if (!thoughts) {
                return res
                    .status(404)
                    .json({ message: 'No thought found with that Id' });
            }

            res.json(thoughts);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    async deleteReaction(req, res) {
        try {
            const thoughts = await Thought.findOneAndDelete(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionsId: req.params.reactionsId } } },
                { runValidators: true, new: true }
            );

            if (!thoughts) {
                return res
                    .status(404)
                    .json({ message: 'No thought found with this Id' } );
            }

            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};