require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Create OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body; 
    // messages: [{role: 'user', content: 'Hi!'}] and possibly conversation history

    const response = await openai.createChatCompletion({
      model: process.env.MODEL_NAME, // Custom model name
      messages: messages,
      temperature: 0.7,
      max_tokens: 300,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const completion = response.data.choices[0].message.content;
    res.json({ response: completion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating response' });
  }
});

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
