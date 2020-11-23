import queryString from 'querystring';
import axios from 'axios';

export type LUIS_config = {
    appId: string
    predictionKey: string
    endpoint: string
}

export type LUIS_Query_Params = {
    verbose: boolean
    query: string
    'subscription-key': string
    'show-all-intents': boolean
}

class LUIS {
    private config = {
        appId: '',
        predictionKey: '',
        endpoint: '',
    }

    private utterance: string = 'I want two large pepperoni pizzas on thin crust please'

    private queryParams: Partial<LUIS_Query_Params> = {
        verbose: true,
        'show-all-intents': true
    }

    constructor(config: LUIS_config, params?: LUIS_Query_Params) {
        this.setConfig(config)

        if (params) {
            this.setQueryParams(params);
        }
    }

    private getURI(): string {
        const queryParams: LUIS_Query_Params = {
            verbose: true,
            query: this.utterance,
            'subscription-key': this.config.predictionKey,
            'show-all-intents': true
        }

        const URI = `${this.config.endpoint}luis/prediction/v3.0/apps/${this.config.appId}/slots/production/predict?${queryString.stringify(queryParams)}`;

        return URI;
    }

    setUtterance(utterance: string) {
        this.utterance = utterance ?? '';

        return this;
    }

    setVerboseMode(flag: boolean) {
        this.queryParams.verbose = flag;

        return this;
    }

    getUtterance(): string {
        return this.utterance;
    }

    setConfig(config: Partial<LUIS_config>) {
        this.config = {
            ...this.config,
            ...config
        }

        return this;
    }

    setQueryParams(params: Partial<LUIS_Query_Params>) {
        this.queryParams = {
            ...this.queryParams,
            ...params
        }

        return this;
    }

    async getIntent() {
        return await axios.get(this.getURI());
    }

}

export default LUIS;
