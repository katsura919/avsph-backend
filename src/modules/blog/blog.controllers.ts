import type { FastifyRequest, FastifyReply } from "fastify";
import { ObjectId } from "@fastify/mongodb";
import { createBlogSchema, updateBlogSchema } from "../../types/blog.types.js";

interface IdParams {
  id: string;
}

interface SlugParams {
  slug: string;
}

interface BusinessIdParams {
  businessId: string;
}

interface BlogQuery {
  businessId?: string;
  status?: "draft" | "published";
}

// Get all blogs
export async function getAllBlogs(
  request: FastifyRequest<{ Querystring: BlogQuery }>,
  reply: FastifyReply,
) {
  const blogs = request.server.mongo.db?.collection("blogs");

  if (!blogs) {
    return reply.status(500).send({ error: "Database not available" });
  }

  const query: any = { isActive: true };

  // Filter by business if provided
  if (request.query.businessId) {
    if (!ObjectId.isValid(request.query.businessId)) {
      return reply.status(400).send({ error: "Invalid business ID format" });
    }
    query.businessId = request.query.businessId;
  }

  // Filter by status if provided
  if (request.query.status) {
    query.status = request.query.status;
  }

  const result = await blogs.find(query).sort({ createdAt: -1 }).toArray();
  return result;
}

// Get blog by ID
export async function getBlogById(
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply,
) {
  const blogs = request.server.mongo.db?.collection("blogs");

  if (!blogs) {
    return reply.status(500).send({ error: "Database not available" });
  }

  const { id } = request.params;

  if (!ObjectId.isValid(id)) {
    return reply.status(400).send({ error: "Invalid blog ID format" });
  }

  const blog = await blogs.findOne({ _id: new ObjectId(id) });

  if (!blog) {
    return reply.status(404).send({ error: "Blog not found" });
  }

  return blog;
}

// Get blog by slug
export async function getBlogBySlug(
  request: FastifyRequest<{ Params: SlugParams }>,
  reply: FastifyReply,
) {
  const blogs = request.server.mongo.db?.collection("blogs");

  if (!blogs) {
    return reply.status(500).send({ error: "Database not available" });
  }

  const { slug } = request.params;

  const blog = await blogs.findOne({
    slug,
    isActive: true,
    status: "published",
  });

  if (!blog) {
    return reply.status(404).send({ error: "Blog not found" });
  }

  return blog;
}

// Get blogs by business ID
export async function getBlogsByBusiness(
  request: FastifyRequest<{ Params: BusinessIdParams }>,
  reply: FastifyReply,
) {
  const blogs = request.server.mongo.db?.collection("blogs");

  if (!blogs) {
    return reply.status(500).send({ error: "Database not available" });
  }

  const { businessId } = request.params;

  if (!ObjectId.isValid(businessId)) {
    return reply.status(400).send({ error: "Invalid business ID format" });
  }

  const result = await blogs
    .find({ businessId, isActive: true, status: "published" })
    .sort({ createdAt: -1 })
    .toArray();

  return result;
}

// Create blog
export async function createBlog(request: FastifyRequest, reply: FastifyReply) {
  const blogs = request.server.mongo.db?.collection("blogs");
  const businesses = request.server.mongo.db?.collection("businesses");

  if (!blogs || !businesses) {
    return reply.status(500).send({ error: "Database not available" });
  }

  const parseResult = createBlogSchema.safeParse(request.body);

  if (!parseResult.success) {
    return reply.status(400).send({
      error: "Validation failed",
      details: parseResult.error.errors,
    });
  }

  const {
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    businessId,
    status = "draft",
    isActive = true,
  } = parseResult.data;

  // Validate business exists
  if (!ObjectId.isValid(businessId)) {
    return reply.status(400).send({ error: "Invalid business ID format" });
  }

  const business = await businesses.findOne({
    _id: new ObjectId(businessId),
    isActive: true,
  });
  if (!business) {
    return reply.status(404).send({ error: "Business not found" });
  }

  // Check if slug already exists
  const existingBlog = await blogs.findOne({ slug });
  if (existingBlog) {
    return reply.status(409).send({ error: "Slug already exists" });
  }

  const now = new Date().toISOString();
  const newBlog = {
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    businessId,
    authorId: request.user.id,
    status,
    publishedAt: status === "published" ? now : undefined,
    isActive,
    createdAt: now,
    updatedAt: now,
  };

  const result = await blogs.insertOne(newBlog);

  return reply.status(201).send({
    _id: result.insertedId,
    ...newBlog,
  });
}

// Update blog
export async function updateBlog(
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply,
) {
  const blogs = request.server.mongo.db?.collection("blogs");
  const businesses = request.server.mongo.db?.collection("businesses");

  if (!blogs || !businesses) {
    return reply.status(500).send({ error: "Database not available" });
  }

  const { id } = request.params;

  if (!ObjectId.isValid(id)) {
    return reply.status(400).send({ error: "Invalid blog ID format" });
  }

  // Get the blog to check business access
  const existingBlog = await blogs.findOne({ _id: new ObjectId(id) });
  if (!existingBlog) {
    return reply.status(404).send({ error: "Blog not found" });
  }

  // Check if admin has access to the blog's business (unless super-admin)
  if (request.user.role !== "super-admin") {
    const business = await businesses.findOne({
      _id: new ObjectId(existingBlog.businessId),
      adminIds: request.user.id,
    });

    if (!business) {
      return reply.status(403).send({
        error: "Forbidden",
        message: "You do not have access to this blog's business",
      });
    }
  }

  const parseResult = updateBlogSchema.safeParse(request.body);

  if (!parseResult.success) {
    return reply.status(400).send({
      error: "Validation failed",
      details: parseResult.error.errors,
    });
  }

  // Check if slug is being updated and already exists
  if (parseResult.data.slug) {
    const existingBlog = await blogs.findOne({
      slug: parseResult.data.slug,
      _id: { $ne: new ObjectId(id) },
    });
    if (existingBlog) {
      return reply.status(409).send({ error: "Slug already exists" });
    }
  }

  const now = new Date().toISOString();
  const updateData: any = {
    ...parseResult.data,
    updatedAt: now,
  };

  // Set publishedAt if publishing for the first time
  if (parseResult.data.status === "published") {
    const currentBlog = await blogs.findOne({ _id: new ObjectId(id) });
    if (currentBlog && !currentBlog.publishedAt) {
      updateData.publishedAt = now;
    }
  }

  const result = await blogs.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" },
  );

  if (!result) {
    return reply.status(404).send({ error: "Blog not found" });
  }

  return result;
}

// Delete blog (soft delete)
export async function deleteBlog(
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply,
) {
  const blogs = request.server.mongo.db?.collection("blogs");
  const businesses = request.server.mongo.db?.collection("businesses");

  if (!blogs || !businesses) {
    return reply.status(500).send({ error: "Database not available" });
  }

  const { id } = request.params;

  if (!ObjectId.isValid(id)) {
    return reply.status(400).send({ error: "Invalid blog ID format" });
  }

  // Get the blog to check business access
  const existingBlog = await blogs.findOne({ _id: new ObjectId(id) });
  if (!existingBlog) {
    return reply.status(404).send({ error: "Blog not found" });
  }

  // Check if admin has access to the blog's business (unless super-admin)
  if (request.user.role !== "super-admin") {
    const business = await businesses.findOne({
      _id: new ObjectId(existingBlog.businessId),
      adminIds: request.user.id,
    });

    if (!business) {
      return reply.status(403).send({
        error: "Forbidden",
        message: "You do not have access to this blog's business",
      });
    }
  }

  const result = await blogs.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { isActive: false, updatedAt: new Date().toISOString() } },
    { returnDocument: "after" },
  );

  if (!result) {
    return reply.status(404).send({ error: "Blog not found" });
  }

  return reply.status(200).send({ message: "Blog deleted successfully" });
}
