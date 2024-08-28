import Blog from "../models/blog.model.js";

export const createBlog = async (request, response) => {
  const { content, title } = request.body;

  // Check empty fields
  if (!title || !content) {
    return response
      .status(400)
      .json({ message: "Email and password are required" });
  }

  // Create Blog
  const blog = await Blog.create({
    content,
    title,
    author: request.id,
    coverImage: request.file ? request.file.path : null,
  });

  response.status(201).send({ blog, message: "Blog created successfully" });
};

export const getBlogs = async (request, response) => {
  const { limit = 6, page = 1, sort = "oldest" } = request.query;

  let sortCriteria;

  if (sort === "latest") {
    sortCriteria = { createdAt: -1 };
  } else if (sort === "oldest") {
    sortCriteria = { createdAt: 1 };
  }

  const blogs = await Blog.find()
    .populate("author", "fullName userName profilePic")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sortCriteria);

  const totalCount = await Blog.countDocuments();

  response.status(200).send({
    blogs,
    pages: Math.ceil(totalCount / parseInt(limit)),
  });
};

export const getBlogById = async (request, response) => {
  const { id } = request.params;

  const blog = await Blog.findById(id).populate(
    "author",
    "fullName userName profilePic"
  );

  response.status(200).send(blog);
};
