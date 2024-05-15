console.clear();
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
	//activeChatJson = CHAT_JSON.chatBar.replies[0].outcome.chatBar.replies[0].outcome.chatBar.replies[1].outcome;
	loadDialogueStage();
}
fetchChat();

/* ~~~~~~~~~ */

function createHTMLDialogue(jurorName, message) {
	if (jurorName === 'narrator') {
		// create
		const narratorContainer = document.createElement('div');
		narratorContainer.className = 'narratorContainer';
		const textBox = document.createElement('span');
		textBox.className = 'textBox';
		textBox.innerHTML = message;

		// append to chatContainer
		narratorContainer.append(textBox);
		document.getElementById('chatContainer').append(narratorContainer);
	} else {
		// create
		const replyContainer = document.createElement('div');
		//if (jurorName.charAt(5) === '8') replyContainer.className = 'replyContainer mainCharacter';
		//else replyContainer.className = 'replyContainer';
		replyContainer.className = 'replyContainer';

		const profile = document.createElement('div');
		profile.className = 'profile';
		const profileImage = document.createElement('img');
		profileImage.src = `./assets/${jurorName}.png`;

		const dialogueContainer = document.createElement('div');
		dialogueContainer.className = 'dialogueContainer';
		const name = document.createElement('span');
		name.className = 'name';
		if (jurorName === 'foreman') name.innerHTML = 'Foreman';
		else name.innerHTML = 'Juror #' + jurorName.substring(5, jurorName.length);
		const textBox = document.createElement('span');
		textBox.className = 'textBox';
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

function loadDialogueStage() {
	// dialogues
	for (const dialogue of activeChatJson.chatHistory) {
		setTimeout(() => {
			createHTMLDialogue(dialogue.sender, dialogue.message);
		}, dialogue.delay * 1000);
	}

	// MC replies
	if (typeof activeChatJson.chatBar.delay === 'number') {
		setTimeout(() => {
			const title = document.createElement('h4');
			title.id = 'selectTitle';
			title.innerHTML = activeChatJson.chatBar.title;
			document.getElementById('replyBar').append(title);

			for (const [i, reply] of activeChatJson.chatBar.replies.entries()) {
				const div = document.createElement('div');
				div.className = 'select';
				div.innerHTML = reply.message;
				div.dataset.replyId = i;

				console.log(div);
				document.getElementById('replyOptions').append(div);
			}

			document.getElementById('chatScrollBox').className = '';
		}, activeChatJson.chatBar.delay * 1000);
	}
}

document.getElementById('replyOptions').addEventListener('click', function (event) {
	if (event.target.className === 'select') {
		console.log(event);

		document.getElementById('selectTitle').remove();
		document.getElementById('replyOptions').innerHTML = '';
		document.getElementById('chatScrollBox').className = 'hidReplyBar';

		activeChatJson = activeChatJson.chatBar.replies[event.target.dataset.replyId].outcome;
		loadDialogueStage();
	}
});
