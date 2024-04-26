const router = require('express').Router();

const {
    getThoughts,
    getSingleThoughtById,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction,
} = require('../../controllers/thoughtController.js');

router.route('/').get(getThoughts).post(createThought);

router
    .route('/:thoughtId')
    .get(getSingleThoughtById)
    .put(updateThought)
    .delete(deleteThought);

router
    .route('/:thoughtId/reactions')
    .post(createReaction)
    .delete(deleteReaction);

module.exports = router;