// lista de cards
let card = document.getElementsByClassName("card");
let cards = [...card];

// popup parabens
const popup = document.getElementById("popup-parabens");

// abre array para cartão
let openedCards = [];

let moves = 0;

// variavvel matchedCards
let matchedCard = document.getElementsByClassName("match");

let refreshHTML = function(target, value) {
	return target.innerHTML = value;
};

// counter
let CounterSet = function(moves) {
	this.target = document.querySelector(".counter");
	refreshHTML(this.target, moves);
};

CounterSet.prototype.add = function() {
	moves++;
	refreshHTML(this.target, moves);
};

CounterSet.prototype.restart = function() {
	moves = 0;
	refreshHTML(this.target, moves);
};

// conta quantidade movimento
let counter = new CounterSet(moves);

// stars and StarRating
let StarRating = function() {
	this.stars = document.querySelectorAll(".fa-star");
};

//Classificação por estrelas
StarRating.prototype.rate = function() {
	if(moves > 12 && moves < 18) {
		this.stars[2].classList.remove("shine");
	} else if(moves > 18) {
		this.stars[1].classList.remove("shine");
	}
};

StarRating.prototype.restart = function() {
	for(var i=0; i<this.stars.length; i++) {
		this.stars[i].classList.add("shine");
	}
};

let stars = new StarRating();

// timer
const timer = document.querySelector(".timer");


// segundos e minutos
let second = {
	value: 0,
	label: " segs"
};

let minute = {
	value: 0,
	label: " mins "
};

let interval;

//Embaralha quando a pagina e atualizada
window.onload = startGame();

// loop to add event listeners to each card
for(var i = 0; i < cards.length; i++) {
	cards[i].addEventListener("click", displayCard);
	cards[i].addEventListener("click", cardOpen);
	cards[i].addEventListener("click", congratulations);
}

// Botao restart
document.querySelector(".restart").addEventListener("click", startGame);

// shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// inicia o game
function startGame() {
	cards = shuffle(cards);
	for(var i=0; i<cards.length; i++) {
		document.querySelector(".deck").innerHTML = "";
		[].forEach.call(cards, function(item) {
			document.querySelector(".deck").appendChild(item);
		});
		cards[i].classList.remove("show", "open", "match", "disabled");
	}
	counter.restart();
	stars.restart();
	resetTimer();
}

function displayCard() {
	this.classList.toggle("open");
	this.classList.toggle("show");
	this.classList.toggle("disabled");
}

// adicionar cartões abertos à lista openCards e verificar se os cartões são correspondentes ou não
function cardOpen() {
	openedCards.push(this);
	if(openedCards.length === 2) {
		counter.add();
		stars.rate();
		startTimer();
		if(openedCards[0].type === openedCards[1].type) {
			matched();
		} else {
			unmatched();
		}
	}
}

// when cards match
function matched() {
	for(var i=0; i<openedCards.length; i++) {
		openedCards[i].classList.add("match", "disabled");
		openedCards[i].classList.remove("show", "open", "no-event");
	}
	openedCards = [];
}

// quando as cartas não coincidem
function unmatched() {
	for(var i=0; i<openedCards.length; i++) {
		openedCards[i].classList.add("unmatched");
	}
	disable();
	setTimeout(function() {
		for(var i=0; i<openedCards.length; i++) {
			openedCards[i].classList.remove("show", "open", "no-event", "unmatched");
		}
		enable();
		openedCards = [];
	}, 1100);
}

// disable cards
function disable() {
	for(var i = 0; i < cards.length; i++) {
		cards[i].classList.add("disabled");
	}
}

// ativar todos os cartões, exceto os combinados
function enable() {
	for(var i = 0; i < cards.length; i++) {
		if(!cards[i].classList.contains("match")) {
			cards[i].classList.remove("disabled");
		};
	}
}

// refresh timer
function refreshTimer() {
	timer.innerHTML = minute.value + minute.label + second.value + second.label;
}

// reset timer
function resetTimer() {
	second.value = 0;
	minute.value = 0;
	refreshTimer();
}

// start timer
function startTimer() {
	if(moves == 1) {
		interval = setInterval(function() {
			second.value++;
			if(second.value == 60) {
				minute.value++;
				second.value = 0;
			}
			refreshTimer();
		}, 1000);
	}
}

// parabéns quando todos os cartões coincidem
function congratulations() {
	if(matchedCard.length == 16) {
		clearInterval(interval);
		popup.classList.add("show");
		document.getElementById("total-moves").innerHTML = moves;
		document.getElementById("total-time").innerHTML = timer.innerHTML;
		document.getElementById("star-rating").innerHTML = document.querySelector(".stars").innerHTML;
		closePopup();
	};
}

// fechar a função popup no botão play again
function closePopup() {
	document.getElementById("jogar-de-novo").addEventListener("click", function() {
		popup.classList.remove("show");
		startGame();
	});
}
