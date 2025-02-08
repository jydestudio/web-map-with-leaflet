const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("Your google API key");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/ask-ai", async (req, res) => {
  const message =  `questions will be based on streets, buildings, or places. 

      data: ${req.query.data} (these are just osm tags)
      Max Response Length: 25 words ( this is very important; no matter what, your response should NOT be more than 25 words)
      Strictly Answer the Question: No explanations, just direct answers
      Multiple Answers: Return the most dominant one and mention others briefly
      Question: ${req.query.message} please be concise
      please be concise.
      please be concise! IT IS VERY IMPORTANT YOU DON'T EXPLAIN

      use this for places:
      if the user asks for anything related to places, give response using the data
      and indicate the color using the color below. (the information below is strictly for amenities along)
      Supermarket → Red
      Restaurant → Orange
      Hospital → Green
      Cafe → Blue
      Tourism → Gold
      Bank → Violet
      Hotel → Cyan
      School → Pink
      Pharmacy → White
      Attraction → Yellow
      any other place = Black.
  `
  
  const result = await model.generateContent(message);
  res.json({ reply: result.response.text() });
  console.log(result.response.text())

})
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
