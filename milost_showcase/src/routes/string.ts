import express from "express";
import stringApi from "../api/string.js";

const router = express.Router();

/**
 * GET /api/string/info?text=example
 * Get information about a string
 */
router.get("/info", (req, res) => {
  const text = (req.query.text as string) || "";
  const result = stringApi.getInfo(text);
  res.json(result);
});

/**
 * POST /api/string/uppercase
 * Convert a string to uppercase
 */
router.post("/uppercase", (req: any, res: any) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing required field: text" });
  }

  const result = stringApi.toUpperCase(text);
  res.json(result);
});

/**
 * POST /api/string/lowercase
 * Convert a string to lowercase
 */
router.post("/lowercase", (req: any, res: any) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing required field: text" });
  }

  const result = stringApi.toLowerCase(text);
  res.json(result);
});

export default router;
