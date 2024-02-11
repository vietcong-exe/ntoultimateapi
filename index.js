const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const url = `https://www.ntoultimate.com.br/characterprofile.php?name=${username}`;
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch data. Status code: ${response.status}`);
    }

    const $ = cheerio.load(response.data);

    const targetElement = $('#right > table > tbody > tr:nth-child(4) > td:nth-child(2)');
    const targetElement2 = $('#right > table > tbody > tr:nth-child(5) > td:nth-child(2)');
    const targetElement3 = $('#right > table > tbody > tr:nth-child(8) > td:nth-child(2) > a');
    const targetElement4 = $('#right > div.card.card-body > ul > li:nth-child(1)');

    const level = targetElement.text().trim();
    const vocation = targetElement2.text().trim();
    const guild = targetElement3.text().trim();
    const lastdeath = targetElement4.text().trim();

    const informations = {
      level: level,
      vocation: vocation,
      guild: guild,
      lastdeath: lastdeath
    };

    res.status(200).json({ informations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while scraping the website.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
