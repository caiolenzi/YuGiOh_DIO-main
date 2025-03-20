const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    actions: {
        button: document.getElementById("next-duel")
    },
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector(".card-box.framed#computer-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector(".card-box.framed#player-cards"),
    }
};

const pathImage = "./src/assets/icons/";

const cardData = [
    { id: 0, name: "Blue Eye White Dragon", type: "Paper", img: `${pathImage}dragon.png`, WinOf: [1], LoseOf: [2] },
    { id: 1, name: "Dark Magician", type: "Stone", img: `${pathImage}magician.png`, WinOf: [2], LoseOf: [0] },
    { id: 2, name: "Exodia", type: "Scissors", img: `${pathImage}exodia.png`, WinOf: [0], LoseOf: [1] }
];

async function hideCardDetails() {
    state.cardSprites.name.innerText = '';
    state.cardSprites.type.innerText = '';
    state.cardSprites.avatar.src = '';
}

async function playAudio(status) {
    try {
        const audioPath = new Audio(`./src/assets/audios/${status}.wav`);
        audioPath.play();
    } catch (error) {
        console.log(error);
    }
}

function resetDuel() {
    state.cardSprites.avatar.src = '';
    state.actions.button.style.display = "none";
    state.fieldCards.player.src = '';
    state.fieldCards.computer.src = '';
    hideCardDetails();
    iniciar();
}

async function removeAllCardsImages() {
    let { computerBox, player1Box } = state.playerSides;

    computerBox.querySelectorAll("img").forEach(img => img.remove());
    player1Box.querySelectorAll("img").forEach(img => img.remove());
}

async function checkDuel(playerCardId, computerCardID) {
    let duelResult = "Empate";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardID)) {
        duelResult = "win";
        state.score.playerScore++;
    } else if (playerCard.LoseOf.includes(computerCardID)) {
        duelResult = "lose";
        state.score.computerScore++;
    }

    await playAudio(duelResult);
    return duelResult;
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function drawCardsInField(playerCardId, computerId) {
    state.fieldCards.player.src = cardData[playerCardId].img;
    state.fieldCards.computer.src = cardData[computerId].img;
}

async function setCardFields(cardId) {
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();
    drawCardsInField(cardId, computerCardId);
    let duelResult = await checkDuel(cardId, computerCardId);
    await updateScore();
    await drawButton(duelResult);
}

function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute: " + cardData[index].type;
}

async function getRandomCardId() {
    return Math.floor(Math.random() * cardData.length);
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => drawSelectCard(IdCard));
        cardImage.addEventListener("click", () => setCardFields(cardImage.getAttribute("data-id")));
    }
    return cardImage;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

function iniciar() {
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
}

iniciar();
