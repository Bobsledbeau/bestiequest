require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

function getFallbackStory(items, themeName, subThemeName, protagonist) {
  const heroes = protagonist || items.join(' and ');
  return {
    title: "The Cozy Forest Picnic",
    story: `Once upon a time, in a sunny green meadow, ${heroes} decided to have a lovely picnic together. They shared sandwiches, laughed at funny stories, and watched butterflies dance in the warm sunlight. Everyone felt happy and safe. They promised to meet again soon. The end.`
  };
}

app.post('/generate-story', async (req, res) => {
  try {
    const { 
      items = [], 
      themeName, 
      subThemeName, 
      length, 
      childName = '', 
      childGender 
    } = req.body;

    const targetWords = length === 'Short' ? 800 : length === 'Medium' ? 1200 : 2000;

    const protagonist = childName.trim() 
      ? (childGender ? `${childName}, a ${childGender}` : childName)
      : null;

    const themeGuidance = subThemeName 
      ? `Focus on ${themeName} with special attention to ${subThemeName}. Teach gentle values through warm examples.`
      : `Create a beautiful story about ${themeName.toLowerCase()}.`;

    const prompt = `You are a professional children's bedtime storyteller for ages 3-9.

**STRICT WORD COUNT**:
Write exactly around ${targetWords} words.
- Short: 750-850
- Medium: 1150-1250
- Long: 1900-2100

**TITLE RULE**:
Cute, funny, magical or endearing ORIGINAL title. 
NEVER include child's name, gender, theme, length, "adventure", "journey", "lesson".

**Story Inputs**:
${protagonist ? `- Protagonist: ${protagonist}` : `- Main heroes: ${items.join(', ')}`}
- Include ALL: ${items.join(', ')}
- Theme: ${themeName}${subThemeName ? ` (${subThemeName})` : ''}

**Rules**:
- Start exactly with "Once upon a time..."
- End exactly with "The end."
- Simple read-aloud language.
- Wholesome, positive, happy ending.
- Grounded and realistic — no pooping rainbows, sneezing glitter, bodily humor, or wildly abstract concepts.
- Magic gentle and believable.

Output ONLY valid JSON:
{
  "title": "Cute title here",
  "story": "Full story text..."
}`;

    const completion = await openai.chat.completions.create({
      model: "grok-4-1-fast-non-reasoning",
      messages: [
        { role: "system", content: "Always respond with valid JSON only. Safe, positive bedtime stories for ages 3-9." },
        { role: "user", content: prompt }
      ],
      temperature: 0.82,
      max_tokens: length === 'Long' ? 4500 : 3200,
    });

    let responseText = completion.choices[0].message.content.trim();
    if (responseText.startsWith('```json')) responseText = responseText.slice(7, -3).trim();

    const result = JSON.parse(responseText);

    // Safety trim
    const words = result.story.split(/\s+/).length;
    if (words > (length === 'Short' ? 850 : length === 'Medium' ? 1250 : 2100)) {
      result.story = result.story.split(/\s+/).slice(0, length === 'Short' ? 800 : length === 'Medium' ? 1200 : 2000).join(' ') + ' The end.';
    }

    res.json(result);
  } catch (error) {
    console.error('Story generation error:', error);
    const fallback = getFallbackStory(
      req.body.items || [], 
      req.body.themeName, 
      req.body.subThemeName, 
      req.body.childName ? `${req.body.childName}, a ${req.body.childGender}` : null
    );
    res.status(500).json(fallback);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ BestieQuest Backend running on http://localhost:${PORT}`);
});
