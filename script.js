let CHAT_JSON, activeChatJson;

async function fetchChat() {
	await fetch('./chat.json')
		.then((res) => res.json())
		.then((chatFetched) => {
			CHAT_JSON = chatFetched;
			console.log(CHAT_JSON);
		})
		.catch((error) => {
			console.error('Error loading levels JSON:', error);
		});

	activeChatJson = CHAT_JSON;
	loadDialogue();
}
fetchChat();

/* ~~~~~~~~~ */

function createHTMLDialogue(jurorName, message) {
	if (jurorName === 'narrator') {
		// create
		const narratorContainer = document.createElement('div');
		narratorContainer.classList = 'narratorContainer';
		const textBox = document.createElement('span');
		textBox.classList = 'textBox';
		textBox.innerHTML = message;

		// append to chatContainer
		narratorContainer.append(textBox);
		document.getElementById('chatContainer').append(narratorContainer);
	} else {
		// create
		const replyContainer = document.createElement('div');
		if (jurorName.charAt(5) === '8') replyContainer.classList = 'replyContainer mainCharacter';
		else replyContainer.classList = 'replyContainer';

		const profile = document.createElement('div');
		profile.classList = 'profile';
		const profileImage = document.createElement('img');
		profileImage.src = `./assets/${jurorName}.png`;

		const dialogueContainer = document.createElement('div');
		dialogueContainer.classList = 'dialogueContainer';
		const name = document.createElement('span');
		name.classList = 'name';
		if (jurorName === 'foreman') name.innerHTML = 'Foreman';
		else name.innerHTML = 'Juror #' + jurorName.substring(5, jurorName.length);
		const textBox = document.createElement('span');
		textBox.classList = 'textBox';
		for (const [i, slicedMessage] of message.split('*').entries()) {
			const span = document.createElement('span');
			span.innerHTML = slicedMessage.trim();
			if (i % 2 === 1) span.style.fontStyle = 'italic';
			textBox.append(span);
		}

		// append to replyContainer
		dialogueContainer.append(name, textBox);
		profile.append(profileImage);

		replyContainer.append(profile, dialogueContainer);

		// append to the chatContainer
		document.getElementById('chatContainer').append(replyContainer);
	}
}

function loadDialogue() {
	for (const dialogue of activeChatJson.chatHistory) {
		setTimeout(() => {
			createHTMLDialogue(dialogue.sender, dialogue.message);
		}, dialogue.timestamp * 1000);
	}
}
