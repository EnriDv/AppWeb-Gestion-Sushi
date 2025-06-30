const { Blog } = require('../models');

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        res.json(blogs);
    } catch (err) {
        console.error(`Error fetching all Blogs:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ error: `Blog not found` });
        }
    } catch (err) {
        console.error(`Error fetching Blog by ID:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const createBlog = async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.status(201).json(newBlog);
    } catch (err) {
        console.error(`Error creating Blog:`, err);
        res.status(400).json({ error: err.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const [updatedRowsCount] = await Blog.update(req.body, {
            where: { id: req.params.id },
        });
        if (updatedRowsCount > 0) {
            const updatedBlog = await Blog.findByPk(req.params.id);
            res.json(updatedBlog);
        } else {
            res.status(404).json({ error: `Blog not found or no changes made` });
        }
    } catch (err) {
        console.error(`Error updating Blog:`, err);
        res.status(400).json({ error: err.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const deletedRowsCount = await Blog.destroy({
            where: { id: req.params.id },
        });
        if (deletedRowsCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: `Blog not found` });
        }
    } catch (err) {
        console.error(`Error deleting Blog:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
};
