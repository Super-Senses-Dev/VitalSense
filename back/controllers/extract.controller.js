
const axios = require('axios');
require('dotenv').config();
const { isValidJsonString } = require('../services/index.js');
/**
 * Extract the measurements from the uploaded file
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function extractMeasurements(req, res) {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        // Call the openAI API to extract the measurements
        const base64EncodedImage = file.buffer.toString('base64')
        const openAIUrl = "https://api.openai.com/v1/chat/completions";
        const requestBody = {
            "model": "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that responds in this json format: `{\"unit\": \"<temperature unit>\", \"temp\": \"<temperature value>\"}`. Help me extract the temperature from this thermometer"
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: { url: `data:image/jpeg;base64,${base64EncodedImage}` }
                        }
                    ]
                }
            ]
        };
        const response = await axios.post(openAIUrl, requestBody, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        const responseBody = response.data;
        let resultContent = responseBody.choices[0].message.content;

        // Remove the ```json```
        resultContent = resultContent.replaceAll('```json', '');
        resultContent = resultContent.replaceAll('```', '');

        // Find out if the response is a valid json string
        if (!isValidJsonString(resultContent)) {
            // The model has responded with something like this: "I'm unable to extract..."
            return res.status(400).json('Unable to extract temperature from the image');
        }

        return res.status(response.status).json(JSON.parse(resultContent));

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    extractMeasurements
}