const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.querySelector('#score_points'),
    },
    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    filedCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    playerSides: {
        player1: 'player-cards',
        player1Box: document.querySelector('#player-cards'),
        computer: 'computer-cards',
        computerBox: document.querySelector('#computer-cards'),
    },
    actions: {
        button: document.getElementById('next-duel'),
    },
};

const playerSides = {
    player1: 'player-cards',
    computer: 'computer-cards',
} 

const pathImamges = './src/assets/icons/';

const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: `${pathImamges}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: `${pathImamges}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImamges}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    },
];

async function getRandomCardID() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', IdCard);
    cardImage.classList.add('card');

    if(fieldSide === playerSides.player1) {
        cardImage.addEventListener('mouseover', () => {
            drawSelectCard(IdCard);
        });
        cardImage.addEventListener('click', () => {
            setCardsField(cardImage.getAttribute('data-id'));
        });
    }
    return cardImage;
}
async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardID();

    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInfiled(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}
async function showHiddenCardFieldsImages(value) {
    if(value == true) {
        state.filedCards.player.style.display = 'block';
        state.filedCards.computer.style.display = 'block';
    }
    if(value == false) {
        state.filedCards.player.style.display = 'none';
        state.filedCards.computer.style.display = 'none';
    }
}
async function drawCardsInfiled(cardId, computerCardId) {
    state.filedCards.player.src = cardData[cardId].img;
    state.filedCards.computer.src = cardData[computerCardId].img;
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = '';
    state.cardSprites.name.innerText = '';
    state.cardSprites.type.innerText = '';  
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = 'block';
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose:  ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = 'Draw';
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)) {
        duelResults = 'Win';
        state.score.playerScore++;
    } 
    if(playerCard.LoseOf.includes(computerCardId)) {
        duelResults = 'Lose';
        state.score.computerScore++;
    }
    await playAudio(duelResults);

    return duelResults;
}

async function removeAllCardsImages() {
    let {computerBox, player1Box} = state.playerSides;
    let imgElements = computerBox.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(Index) {
    state.cardSprites.avatar.src = cardData[Index].img;
    state.cardSprites.name.innerText = cardData[Index].name;
    state.cardSprites.type.innerText = 'Attibute : ' + cardData[Index].type;
}

async function drawCards(cardsNumber, fieldSide) {
    for (let i = 0; i < cardsNumber; i++) {
        const randomIdCard = await getRandomCardID();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}
async function resetDuel() {
    state.cardSprites.avatar.src = '';
    state.actions.button.style.display = 'none';

    state.filedCards.player.style.display = 'none';
    state.filedCards.computer.style.display = 'none';

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    
    try {
        audio.play();
    } catch {
        console.log('Error to play audio');
    }
}

function init() {
    showHiddenCardFieldsImages(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById('bgm');
    bgm.play();
}

init();