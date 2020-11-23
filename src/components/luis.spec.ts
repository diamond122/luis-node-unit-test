import chai from 'chai';
const expect = chai.expect;
import dotenv from 'dotenv';
import LUIS, { LUIS_config } from './luis.js';

dotenv.config();

describe('LUIS internals', async function () {
    let config: LUIS_config;
    let luis: LUIS;

    before(() => {
        config = {
            appId: '',
            predictionKey: '',
            endpoint: '',
        }
    })

    beforeEach(() => {
        luis = new LUIS(config);
    })

    it('should create LUIS instance', async function () {
        expect(luis).to.be.instanceOf(LUIS);
        expect(luis.setUtterance('balbalba')).to.be.instanceOf(LUIS);
        expect(luis.setQueryParams({})).to.be.instanceOf(LUIS);
        expect(luis.setVerboseMode(false)).to.be.instanceOf(LUIS);
        expect(luis.setConfig({})).to.be.instanceOf(LUIS);

    });

    it('should correctly set utterance', function () {
        const newString = 'New utterance string';
        luis.setUtterance(newString);

        expect(luis.getUtterance()).to.equal(newString);
    })

});


describe('LUIS real servers', async function () {
    let config: LUIS_config;
    let luis: LUIS;

    before(function () {
        config = {
            appId: process.env.APPID ?? '',
            predictionKey: process.env.PREDICTIONKEY ?? '',
            endpoint: process.env.ENDPOINT ?? '',
        }
        luis = new LUIS(config);
    });

    it('should get default intent', async function () {
        const result = await luis.getIntent();

        expect(result.data.query).to.equal('I want two large pepperoni pizzas on thin crust please');
    });

    it('should get custom intent', async function () {
        const result = await luis.setUtterance('I want one pizza and no more').getIntent();

        expect(result.data.query).to.equal('I want one pizza and no more');
    });

    it('should return 400 for bad tokens', async function () {
        const appId = 'blablbalba';
        try {
            await luis.setConfig({ appId }).getIntent();
        } catch (e) {
            expect(e.response.status).to.equal(400);
        }
    });
});

