import {StartGame} from './StartGame'

describe('Test get sum', function () {
    function getSuiteCard() {
        let randomSuit = Math.floor((Math.random() * 4) + 1);
        let suite;
        switch(randomSuit) {
            case 1:
                suite ='♠'
                break;
            case 2:
                suite ='♥'
            break;
            case 3:
                suite ='♣'
                break;
            case 4:
                suite ='♦'
                break;
        }
        return suite;
    }

    it('cards [1, 1, 1] to equal 13', () => {
        const game = new StartGame();

        const cards = [{rank:1, suite: getSuiteCard()}, {rank:1, suite: getSuiteCard()}, {rank:1, suite: getSuiteCard()}]  
        expect(game.getMaxSum(cards)).toEqual(13);

    });

    it('cards [1, Q] to equal BJ', () => {

        const game = new StartGame();

        const cards = [{rank:1, suite: getSuiteCard()}, {rank:12, suite: getSuiteCard()}];
        expect(game.getMaxSum(cards)).toEqual(21);

    });
});