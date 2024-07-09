import { Hono } from "hono";
import { protectRoute } from "../middleware/protectRoute";
import { zValidator } from "@hono/zod-validator";
import { createRatingSchema } from "../schemas/rating.schema";
import type { Variables } from "./address.routes";
import Restaurant from "../models/restaurant.model";
import Rating from "../models/rating.model";

const ratingRoutes = new Hono<{ Variables: Variables }>();

ratingRoutes.post(
  "/:restaurantId",
  protectRoute,
  zValidator("json", createRatingSchema),
  async (c) => {
    const ratingForm = c.req.valid("json");
    const user = c.get("user");
    const restaurantId = c.req.param("restaurantId");

    try {
      if (restaurantId.length !== 24) {
        return c.json({ error: "Invalid restaurant id" }, 400);
      }

      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return c.notFound();
      }

      const existingRating = await Rating.findOne({ userId: user._id, restaurantId: restaurant._id });
      if (existingRating) {
        return c.json({ error: "Rating already exists" }, 403);
      }

      const newRating = new Rating({
        userId: user._id,
        restaurantId: restaurant._id,
        rating: ratingForm.rating
      });

      if (newRating) {
        await newRating.save();
        return c.json(newRating, 201);
      } else {
        return c.json({ error: "Invalid data" }, 400);
      }
    } catch (err: any) {
      console.error(`Error in create rating handler: ${err.message}`);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });

ratingRoutes.get("/average/:restaurantId", async (c) => {
  const restaurantId = c.req.param("restaurantId");

  try {
    if (restaurantId.length !== 24) {
      return c.json({ error: "Invalid restaurant id" }, 400);
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return c.notFound();
    }

    const ratings = await Rating.find({ restaurantId: restaurant._id });
    const averageRating = ratings.reduce((accumulator, rating) => accumulator + rating.rating, 0) / ratings.length;


    return c.json({ averageRating }, 200);
  } catch (err: any) {
    console.error(`Error in get average rating handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

ratingRoutes.get("/", protectRoute, async (c) => {
  const user = c.get("user");

  try {
    const ratings = await Rating.find({ userId: user._id }).populate("restaurantId");
    return c.json(ratings, 200);
  } catch (err: any) {
    console.error(`Error in get all user's ratings handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

ratingRoutes.get("/:id", protectRoute, async (c) => {
  const user = c.get("user");
  const ratingId = c.req.param("id");

  try {
    if (ratingId.length !== 24) {
      return c.json({ error: "Invalid rating id" }, 400);
    }

    const rating = await Rating.findOne({ _id: ratingId, userId: user._id }).populate("restaurantId");
    if (!rating) {
      return c.notFound();
    }

    return c.json(rating, 200);
  } catch (err: any) {
    console.error(`Error in get all user's ratings handler: ${err.message}`);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export default ratingRoutes;
