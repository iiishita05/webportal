const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
require("dotenv").config();



router.post("/summarize", async (req, res) => {
  const { text } = req.body;
  console.log("Received text:", text);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You summarize leave applications in 1-2 lines.",
        },
        {
          role: "user",
          content: `Summarize this leave application:\n\n${text}`,
        },
      ],
    });

    const summary = completion.choices[0].message.content.trim();
    res.json({ summary });
  } catch (err) {
    // Add this line to get full error info in the logs:
    console.error(
      "OpenAI error details:",
      JSON.stringify(err.response?.data || err, null, 2)
    );
    res.status(500).json({ message: "Summarization failed" });
  }
});


module.exports = router;