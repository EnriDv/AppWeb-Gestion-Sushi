const express = require('express');
const router = express.Router();
const { 
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog 
} = require('../controllers/blog.controller');

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
