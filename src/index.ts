import LUIS, { LUIS_config } from './components/luis.js';
import dotenv from 'dotenv';

// importing environment variables
dotenv.config();

const config: LUIS_config = {
    appId: process.env.APPID ?? '',
    predictionKey: process.env.PREDICTIONKEY ?? '',
    endpoint: process.env.ENDPOINT ?? '',
}

new LUIS(config)
    .getIntent()
    .then(response => {
        console.log(JSON.stringify(response.data, null, 2))
    })
    .catch(({ response }) => {
        console.log(`${response.status}: ${response.statusText}`);
        console.log(response.data?.error?.message)

    });
