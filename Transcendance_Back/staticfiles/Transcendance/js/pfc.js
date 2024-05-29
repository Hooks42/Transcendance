const pfc = {

	observer: null,
	queue_observer: null,
	timer_id: null,
	queue_timer_animation_id: null,
	queue_timer_id: null,

	create_svg_scissor: function()
	{
		const svg = create_svg(['icon_scissor']);
		svg.setAttribute('viewBox', "-32 0 512 512");

		const path = document.createElementNS(svgns, 'path');
		path.setAttribute('d',"M362.146 191.976c-13.71-21.649-38.761-34.016-65.006-30.341V74c0-40.804-32.811-74-73.141-74-40.33 0-73.14 33.196-73.14 74L160 168l-18.679-78.85C126.578 50.843 83.85 32.11 46.209 47.208 8.735 62.238-9.571 104.963 5.008 142.85l55.757 144.927c-30.557 24.956-43.994 57.809-24.733 92.218l54.853 97.999C102.625 498.97 124.73 512 148.575 512h205.702c30.744 0 57.558-21.44 64.555-51.797l27.427-118.999a67.801 67.801 0 0 0 1.729-15.203L448 256c0-44.956-43.263-77.343-85.854-64.024zM399.987 326c0 1.488-.169 2.977-.502 4.423l-27.427 119.001c-1.978 8.582-9.29 14.576-17.782 14.576H148.575c-6.486 0-12.542-3.621-15.805-9.449l-54.854-98c-4.557-8.141-2.619-18.668 4.508-24.488l26.647-21.764a16 16 0 0 0 4.812-18.139l-64.09-166.549C37.226 92.956 84.37 74.837 96.51 106.389l59.784 155.357A16 16 0 0 0 171.227 272h11.632c8.837 0 16-7.163 16-16V74c0-34.375 50.281-34.43 50.281 0v182c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16v-28c0-25.122 36.567-25.159 36.567 0v28c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16 0-25.12 36.567-25.16 36.567 0v70z");
		svg.append(path);

		return (svg);
	},

	create_svg_paper: function()
	{
		const svg = create_svg(['icon_paper']);
		svg.setAttribute('viewBox', "-32 0 512 512");

		const path = document.createElementNS(svgns, 'path');
		path.setAttribute('d', "M372.57 112.641v-10.825c0-43.612-40.52-76.691-83.039-65.546-25.629-49.5-94.09-47.45-117.982.747C130.269 26.456 89.144 57.945 89.144 102v126.13c-19.953-7.427-43.308-5.068-62.083 8.871-29.355 21.796-35.794 63.333-14.55 93.153L132.48 498.569a32 32 0 0 0 26.062 13.432h222.897c14.904 0 27.835-10.289 31.182-24.813l30.184-130.958A203.637 203.637 0 0 0 448 310.564V179c0-40.62-35.523-71.992-75.43-66.359zm27.427 197.922c0 11.731-1.334 23.469-3.965 34.886L368.707 464h-201.92L51.591 302.303c-14.439-20.27 15.023-42.776 29.394-22.605l27.128 38.079c8.995 12.626 29.031 6.287 29.031-9.283V102c0-25.645 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V67c0-25.663 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V101.125c0-25.672 36.57-24.81 36.57.691V256c0 8.837 7.163 16 16 16h6.857c8.837 0 16-7.163 16-16v-76.309c0-26.242 36.57-25.64 36.57-.691v131.563z");
		svg.append(path);

		return (svg);
	},

	create_svg_rock: function()
	{
		const svg = create_svg(['icon_rock']);
		svg.setAttribute('viewBox', "0 0 512 512");

		const path = document.createElementNS(svgns, 'path');
		path.setAttribute('d', "M408.864 79.052c-22.401-33.898-66.108-42.273-98.813-23.588-29.474-31.469-79.145-31.093-108.334-.022-47.16-27.02-108.71 5.055-110.671 60.806C44.846 105.407 0 140.001 0 187.429v56.953c0 32.741 14.28 63.954 39.18 85.634l97.71 85.081c4.252 3.702 3.11 5.573 3.11 32.903 0 17.673 14.327 32 32 32h252c17.673 0 32-14.327 32-32 0-23.513-1.015-30.745 3.982-42.37l42.835-99.656c6.094-14.177 9.183-29.172 9.183-44.568V146.963c0-52.839-54.314-88.662-103.136-67.911zM464 261.406a64.505 64.505 0 0 1-5.282 25.613l-42.835 99.655c-5.23 12.171-7.883 25.04-7.883 38.25V432H188v-10.286c0-16.37-7.14-31.977-19.59-42.817l-97.71-85.08C56.274 281.255 48 263.236 48 244.381v-56.953c0-33.208 52-33.537 52 .677v41.228a16 16 0 0 0 5.493 12.067l7 6.095A16 16 0 0 0 139 235.429V118.857c0-33.097 52-33.725 52 .677v26.751c0 8.836 7.164 16 16 16h7c8.836 0 16-7.164 16-16v-41.143c0-33.134 52-33.675 52 .677v40.466c0 8.836 7.163 16 16 16h7c8.837 0 16-7.164 16-16v-27.429c0-33.03 52-33.78 52 .677v26.751c0 8.836 7.163 16 16 16h7c8.837 0 16-7.164 16-16 0-33.146 52-33.613 52 .677v114.445z");

		svg.append(path);

		return (svg);
	},


	create_pfc_buttons: function(pfc_socket)
	{
		let pfc_div = document.getElementById('body-pfc');

		let pierre_div = document.getElementById('rock');
		let feuille_div = document.getElementById('paper');
		let ciseaux_div = document.getElementById('scissors');
		if (pierre_div && feuille_div && ciseaux_div)
			return;

		let rock = create_btn(['a-btn', '-pfc'], "");
		rock.id = 'rock';
		let svg_rock = create_svg_rock();
		rock.append(svg_rock);
		
		let paper = create_btn(['a-btn', '-pfc'], "");
		paper.id = 'paper';
		let svg_paper = create_svg_paper();
		paper.append(svg_paper);

		let scissor = create_btn(['a-btn', '-pfc'], "");
		scissor.id = 'scissors';
		let svg_scissor = create_svg_scissor();
		scissor.append(svg_scissor);

		var timeleft = 5;
		document.getElementById('time').textContent = timeleft;

		pfc.timer_id = setInterval(function() {
			timeleft--;
			document.getElementById('time').textContent = timeleft;

			if (timeleft <= 0)
			{
				clearInterval(pfc.timer_id);
				pfc.clear_pfc_buttons();
				send_msg.have_played('timeout', currentUser, pfc_socket);
			}
		}, 1000);

		var buttonClicked = function() {
			clearInterval(pfc.timer_id);
			send_msg.have_played(this.id, currentUser, pfc_socket);
			pfc.clear_pfc_buttons();
		};

		pfc_div.append(rock, paper, scissor);

		document.getElementById('rock').addEventListener('click', buttonClicked);
		document.getElementById('paper').addEventListener('click', buttonClicked);
		document.getElementById('scissors').addEventListener('click', buttonClicked);
	},

	clear_pfc_buttons: function()
	{
		var pierre = document.getElementById('rock');
		var feuille = document.getElementById('paper');
		var ciseaux = document.getElementById('scissors');

		if (pierre && feuille && ciseaux)
		{
			pierre.remove();
			feuille.remove();
			ciseaux.remove();
		}
	},

	check_game_state: function(elementId, pfc_socket)
	{
		// Créez un observer pour écouter les changements dans le DOM
		pfc.observer = new MutationObserver(function(mutations) {
			// Pour chaque mutation
			mutations.forEach(function(mutation) {
				// Vérifiez si l'élément avec l'ID spécifié existe toujours
				var titre = document.getElementById('pfc_title');
				if (titre == null) {
					// Si l'élément n'existe pas, affichez un message
					send_msg.stop_game(currentUser, pfc_socket);
					clearInterval(pfc.timer_id);
					pfc_socket.close();
					// Arrêtez d'observer les mutations
					pfc.observer.disconnect();
				}
			});
		});

		// Configuration de l'observer
		var config = { childList: true, subtree: true };

		// Commencez à observer le document avec la configuration spécifiée
		pfc.observer.observe(document, config);
	},

	display_pfc: async function(pfc_socket)
	{
		let main_div = document.getElementById('main-div');
		main_div.innerHTML = "";
		fetch(/pfc/)
			.then(response => response.json())
			.then(data => {
				let pfc_html = data.pfc_html;
				main_div.innerHTML = pfc_html;
				history.pushState({page: 'pierre_feuille_ciseaux'}, '', '/pierre_feuille_ciseaux/');
				pfc.check_game_state('pfc_title', pfc_socket);
			});

	},

	update_pfc: function(data, pfc_socket)
	{
		let pfc_title = document.getElementById('pfc_title');
		let player1_score = document.getElementById('player1_score_main');
		let player2_score = document.getElementById('player2_score_main');
		let player1_penalties = document.getElementById('player1_penalties_main');
		let player2_penalties = document.getElementById('player2_penalties_main');
		let time = document.getElementById('time_main');
		let round = document.getElementById('round_main');

		if (data.message.winner)
		{
			pfc.observer.disconnect();
			if (data.message.winner === 'null match')
				pfc_title.textContent = 'Match nul';
			else
				pfc_title.textContent = data.message.winner + ' est le vainqueur';
			player1_score.remove();
			player2_score.remove();
			player1_penalties.remove();
			player2_penalties.remove();
			time.remove();
			round.remove();
			pfc_socket.close();
		}
		else
		{
			document.getElementById('player1_score').textContent = data.message.player1_score;
			document.getElementById('player2_score').textContent = data.message.player2_score;
			document.getElementById('player1_penalties').textContent = data.message.player1_penalties;
			document.getElementById('player2_penalties').textContent = data.message.player2_penalties;
			document.getElementById('round').textContent = data.message.round_count;
		}
	},

	display_queue: function()
	{
		let main_div = document.getElementById('main-div');
		let title = document.createElement('h1');
		let point_animation = document.createElement('span');

		title.textContent = "En recherche d'un adversaire";
		title.id = 'queue_title';

		point_animation.textContent = "";
		point_animation.id = 'point_animation';
		title.append(point_animation);
		main_div.append(title);

		pfc.queue_timer_animation_id = setInterval(function() {
			point_animation.textContent += ".";
			if (point_animation.textContent.length > 3)
				point_animation.textContent = "";
		}, 1000);
	},

	check_queue_state: function(elementId)
	{
		// Créez un observer pour écouter les changements dans le DOM
		pfc.queue_observer = new MutationObserver(function(mutations) {
			// Pour chaque mutation
			mutations.forEach(function(mutation) {
				// Vérifiez si l'élément avec l'ID spécifié existe toujours
				var titre = document.getElementById('queue_title');
				if (titre == null) {
					// Si l'élément n'existe pas, affichez un message
					clearInterval(pfc.queue_timer_animation_id);
					clearInterval(pfc.queue_timer_id);
					let array = [];
					array.push(currentUser);
					send_msg.kick_queue(array);
					console.log("clear QUEUE");
					// Arrêtez d'observer les mutations
					pfc.queue_observer.disconnect();
				}
			});
		});

		// Configuration de l'observer
		var config = { childList: true, subtree: true };

		// Commencez à observer le document avec la configuration spécifiée
		pfc.queue_observer.observe(document, config);
	},

	find_game()
	{
		pfc.queue_timer_id = setInterval(function() {
			send_msg.find_match();
		}, 15000);
	},

	launch_queue: function()
	{
		console.log("🌿 currentUser --> " + currentUser);
		this.display_queue();
		this.check_queue_state('queue_title');
		send_msg.join_queue(currentUser);
		this.find_game()
	},
};


