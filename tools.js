(function() {
	if(
		document.querySelector('#aspnetForm') 
		&& window.location.pathname !== "/SpellsCustom.aspx"
		&& window.location.pathname !== "/Search.aspx"
		&& window.location.pathname !== "/SearchOld.aspx"
	) {
		document.querySelector('#aspnetForm').onsubmit = ()=> false;
	}

	let stripstyle = `
	<style>
		body {
			margin: 8px!important;
		}

		.header, .menutitle, #main > h2, #main > br, #footer, #ctl00_MainContent_Navigation {
			display: none!important;
		}

		#page {
			min-height: 0;
			border: none!important;
		}

		#main-wrapper {
			margin: 0!important;
			padding: 0!important;
			min-height: 0!important;
		}

		#wrapper {
			width: auto;
			min-width: 0;
			margin: 0;
		}

	</style>
	`;

	let x = "520px";
	let y = "250px";

	let inTimer = {};
	let outTimer = {};

	const links = document.querySelectorAll('#main :not(h2, h2 > span) > a:not(.external-link)');

	function showFrame(frame) {
		frame.style.width = x;
		frame.style.height = y;
		frame.style.display = "block";						
		const inWindowB = frame.getBoundingClientRect().top + parseInt(y) <= (window.innerHeight + window.scrollY || document.documentElement.clientHeight + window.scrollY);
		const inWindowR = frame.getBoundingClientRect().left + parseInt(x)  <= (window.innerWidth + window.scrollX || document.documentElement.clientWidth + window.scrollX);

		frame.classList.toggle('bottom', !inWindowB);
		frame.classList.toggle('right', !inWindowR);
	}

	links.forEach( (a, i) => {
		let n = 'Frame' + i;
		a.insertAdjacentHTML('beforeBegin', '<span class="link-container"></span>');
		const container = a.previousElementSibling;
		
		let frame = document.getElementById(n);
		
		const show = function(e) {
			if(!frame) {
				inTimer[i] = setTimeout( () => {
					container.insertAdjacentHTML("beforeEnd", `<iframe src="${a.href}" id="${n}"></iframe>`);
					frame = document.getElementById(n);
					frame.onload = ()=> {
						frame.contentWindow.document.body.insertAdjacentHTML('beforeEnd', stripstyle);
						frame.classList.add('loaded');
						frame.contentWindow.addEventListener("resize", ()=> {
							x = frame.style.width;
							y = frame.style.height; 
						});
						showFrame(frame);
					}
				}, 250);
			} else {
				if(frame.classList.contains('loaded')) showFrame(frame);
				clearTimeout(outTimer[i]);
			}

		}

		container.prepend(a);
		container.addEventListener('mouseenter', show );

		container.addEventListener('mousedown', e => {
			if(window.innerWidth <= 768) {
				e.preventDefault();				
			}
		} );

		container.addEventListener('click', e => {
			if(window.innerWidth <= 768) {
				e.preventDefault();				
			}
		} );

		container.addEventListener('mouseleave', e => {
			clearTimeout(inTimer[i]);
			if(!e.buttons) {
				outTimer[i] = setTimeout(()=> {
					if(frame) frame.style.display = "none";
				}, 500);
			}
		});
	});

	/*------------------Search page-----------------*/

	if(window.location.pathname == "/Search.aspx") {
		const checks = document.querySelectorAll('#ctl00_MainContent_TableList [type="checkbox"]');

		const all = document.querySelector('[value="Select All"]');
		const none = document.querySelector('[value="Select None"]');

		all.type="button";
		none.type="button";

		all.onclick = ()=> checks.forEach(i => i.checked = true);
		none.onclick = ()=> checks.forEach(i => i.checked = false);
	}


	if(window.location.pathname == "/SearchOld.aspx") {
		const checks = document.querySelectorAll('#ctl00_MainContent_CheckBoxList_SearchEngine [type="checkbox"]');

		const all = document.querySelector('[value="Check All"]');
		const none = document.querySelector('[value="Uncheck All"]');

		all.type="button";
		none.type="button";

		all.onclick = ()=> checks.forEach(i => i.checked = true);
		none.onclick = ()=> checks.forEach(i => i.checked = false);
	}

	/*------------------Search bar-----------------*/
	(function(){
		const search = [
			"Afflictions/Hazards",
			"Archetypes",
			"Classes",
			"Deities",
			"Equipment",
			"Feats",
			"Magic Items",
			"Monsters",
			"Mythic Material",
			"NPCs",
			"Pets",
			"Prestige Classes",
			"Races",
			"Rules",
			"Skills",
			"Spells/Rituals",
			"Technology",
			"Traits"
		];

		const options = `<option>${search.join('</option>\n<option>')}</option>`;

		function addDropdown(container) {
			container.innerHTML += `
				<select multiple size="3">
					<option value="" selected>Search everywhere</option>
					${options}
				</select>
			`;

			const [query, btn, select] = container.children;

			btn.onclick = ()=> {
				let filter = "";
				for(let i = 1; i <= search.length; i++) {
					filter += select.children[i].selected? '1' : '0';
				}
				window.location.href = `https://aonprd.com/Search.aspx?Query=${query.value}&AllTerms=True&Filter=${filter}`
			};

			query.onkeydown = ( (e) => {if(e.key == 'Enter') btn.click()});
		}

	/*desktop*/
		const container = document.querySelector("#nav-parent .search");
		addDropdown(container);

	/*mobile*/
		const mobileContainer = document.querySelector("#mobile-nav-parent .search");
		addDropdown(mobileContainer);

	})();

	/*-----------------Archetypes---------------------*/

	if(window.location.pathname == "/Archetypes.aspx") {
		const className = (new URLSearchParams(window.location.search)).get("Class");
		const savedChanges = JSON.parse(localStorage.getItem(className)) || {};
		let newlines = 0;
		const table = document.getElementById('ctl00_MainContent_GridViewArchetypes');

		if(savedChanges.New) {
			savedChanges.New.forEach(row => {
				if(row) {
					table.children[0].children[0].insertAdjacentHTML('afterEnd',`<tr><td></td><td>${row.changes}</td><td><textarea>${row.description}</textarea></td></tr>`);
				}
			});
		}

		const rows = table.querySelectorAll('tr:not(:first-child)');

		function getInputs() {
			return table.querySelectorAll('tr:not(:first-child) input');
		} 

		function addInput(el, val) {
			el.insertAdjacentHTML("beforeEnd", `<div><input value="${val}"><button>X</button></div>`);
			const container = el.lastElementChild;
			const removeBtn = container.children[1];
			removeBtn.onclick = e => {
				removeBtn.parentNode.remove();
				updateConflicts();
			}
			const input = container.children[0];
			addEvents(input);
		}

		function formatRow(row) {
			const line = newlines;
			const name = row.children[0].innerText;
			if(!name) newlines++;
			const cell = row.children[1];
			cell.title = cell.innerText;
			let reps = savedChanges[name] || cell.innerText.split('; ');
			cell.innerHTML = "";

			reps.forEach( (rep, j) => {
				if(rep.match(/, and |, | and |\//g)) {
					rep = rep.split(/, and |, | and |\//g);
					let last = rep.at(-1);
					let name = last.slice(last.search(/ |-/));
					rep[rep.length-1] = last.replace(name, "");
					name = singular(name);

					rep.forEach(r => {
						addInput(cell, r + name);
					});
				} else if (rep.match(/[0-9][0-9]*-[0-9][0-9]*/)) {
					let match = rep.match(/[0-9][0-9]*-[0-9][0-9]*/)[0];
					rep = rep.replace(match, "");
					let [from, to] = match.split('-');
					for(let k = (from*1); k <= (to*1); k++){
						addInput(cell, rep + k);
					}
				} else {
					addInput(cell, rep);
				}
			});

			cell.insertAdjacentHTML("beforeEnd", '<button class="plus-btn">+</button>');
			const btn = cell.lastElementChild;
			btn.onclick = e => {
				addInput(cell, '');
				cell.append(btn);
			}

			cell.insertAdjacentHTML("beforeEnd", '<button class="save-btn" title="save changes">💾</button>');
			const save = cell.lastElementChild;
			save.onclick = e => {
				const arr = [];
				cell.querySelectorAll('input').forEach( input => {
					arr.push(input.value);
				});

				if(name) {
					savedChanges[name] = arr;
				} else {
					savedChanges.New = savedChanges.New || [];
					savedChanges.New[line] = {
						changes: arr.join('; '), 
						description: row.children[2].firstChild.value
					};
				}

				localStorage.setItem(className, JSON.stringify(savedChanges));
			}

			cell.insertAdjacentHTML("beforeEnd", '<button class="delete-btn" title="delete changes">⛔</button>');
			const del = cell.lastElementChild;
			del.onclick = e => {
				if(name) {
					delete(savedChanges[name]);
					cell.innerHTML = cell.title;
					formatRow(row);
				} else {
					savedChanges.New[line] = null;
					row.remove();
				}

				localStorage.setItem(className, JSON.stringify(savedChanges));
			}

			row.firstElementChild.onclick = ()=> {
				row.classList.toggle('selected');
				updateConflicts();
			};
		}

		rows.forEach(formatRow);

		function addEvents(input) {
			input.oninput = (e) => {
				updateConflicts();
				showSuggestions(e);
			}
			input.onfocus = showSuggestions;
			input.onblur = hideSuggestions;
		}

		function hideSuggestions() {
			document.querySelector('.archetype-suggestions').style.display = "none";
		}

		function showSuggestions(e) {
			let changeList = new Set;
			const selected = e.target;
			const suggestions = document.querySelector('.archetype-suggestions');

			getInputs().forEach( j => {
				if(j.value.includes(selected.value) && selected.value != j.value) {
					changeList.add(j.value);
				}
			});

			if(changeList.size > 0) {
				suggestions.innerHTML = "";
				changeList.forEach( k => {
					suggestions.insertAdjacentHTML("beforeEnd",`<div>${k}</div>`);
					suggestions.lastElementChild.onmousedown = ( (event) => {
						selected.value = k + "";
						updateConflicts();
						showSuggestions(e);
					});
				});

				suggestions.style.top = selected.getBoundingClientRect().top + window.scrollY + selected.offsetHeight + "px";
				suggestions.style.left = selected.getBoundingClientRect().left + window.scrollX + "px";
				suggestions.style.width = selected.offsetWidth - 2 + "px";
				suggestions.style.display = "block";
			} else {
				hideSuggestions();
			}
		}

		function updateConflicts() {
			const selected = table.querySelectorAll('tr.selected input');
			const inputs = getInputs();

			inputs.forEach( j => j.classList.remove('conflict', 'conflict-light'));
			table.querySelectorAll('tr:not(:first-child)').forEach( j => j.classList.remove('conflict', 'conflict-light') );

			selected.forEach( i => {
				inputs.forEach( j => {
					if(j.value !="" && i.value !="") {
						if (j.value == i.value) {
							j.classList.add('conflict');
							j.closest('tr').classList.add('conflict');
						} else if(
							i.value.includes(j.value) || 
							j.value.includes(i.value) || 
							i.value.includes(singular(j.value)) ||
							j.value.includes(singular(i.value)) ){
							j.classList.add('conflict-light');
							j.closest('tr').classList.add('conflict-light');
						}
					}
				});
			});
		}

		const firstRow = table.children[0].children[0];

		firstRow.children[0].insertAdjacentHTML("afterBegin", `<button class="new-row">+</button>`);
		table.querySelector(".new-row").onclick = ()=> {
			table.children[0].children[0].insertAdjacentHTML('afterEnd', `
				<tr><td></td><td></td><td><textarea></textarea></td></tr>
			`);
			formatRow(table.children[0].children[1]);
		}

		firstRow.children[2].insertAdjacentHTML("beforeEnd", `<button class="hideshow" onclick="document.querySelector('#ctl00_MainContent_GridViewArchetypes').classList.toggle('hide-conflicts');"></button>`
		);

		document.body.insertAdjacentHTML("beforeEnd", `<div class="archetype-suggestions"></div>`);

		function singular(word) {
			const singular = {
				'(quiz)zes$'             : "$1",
				'(matr)ices$'            : "$1ix",
				'(vert|ind)ices$'        : "$1ex",
				'^(ox)en$'               : "$1",
				'(alias)es$'             : "$1",
				'(octop|vir)i$'          : "$1us",
				'(cris|ax|test)es$'      : "$1is",
				'(shoe)s$'               : "$1",
				'(o)es$'                 : "$1",
				'(bus)es$'               : "$1",
				'([m|l])ice$'            : "$1ouse",
				'(x|ch|ss|sh)es$'        : "$1",
				'(m)ovies$'              : "$1ovie",
				'(s)eries$'              : "$1eries",
				'([^aeiouy]|qu)ies$'     : "$1y",
				'([lr])ves$'             : "$1f",
				'(tive)s$'               : "$1",
				'(hive)s$'               : "$1",
				'(li|wi|kni)ves$'        : "$1fe",
				'(shea|loa|lea|thie)ves$': "$1f",
				'(^analy)ses$'           : "$1sis",
				'((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",
				'([ti])a$'               : "$1um",
				'(n)ews$'                : "$1ews",
				'(h|bl)ouses$'           : "$1ouse",
				'(corpse)s$'             : "$1",
				'(us)es$'                : "$1",
				's$'                     : ""
			}

			const irregular = {
				'move'   : 'moves',
				'foot'   : 'feet',
				'goose'  : 'geese',
				'sex'    : 'sexes',
				'child'  : 'children',
				'man'    : 'men',
				'tooth'  : 'teeth',
				'person' : 'people'
			}
			const uncountable = [
				'sheep',
				'fish',
				'deer',
				'moose',
				'series',
				'species',
				'money',
				'rice',
				'information',
				'equipment',
				'bison',
				'cod',
				'offspring',
				'pike',
				'salmon',
				'shrimp',
				'swine',
				'trout',
				'aircraft',
				'hovercraft',
				'spacecraft',
				'sugar',
				'tuna',
				'you',
				'wood'
			]
			// save some time in the case that singular and plural are the same
			if (uncountable.indexOf(word.toLowerCase()) >= 0) {
				return word
			}
			// check for irregular forms
			for (const w in irregular) {
				const pattern = new RegExp(`${irregular[w]}$`, 'i')
				const replace = w;
				if (pattern.test(word)) {
					return word.replace(pattern, replace)
				}
			}
			// check for matches using regular expressions
			for (const reg in singular) {
				const pattern = new RegExp(reg, 'i')
				if (pattern.test(word)) {
					return word.replace(pattern, singular[reg])
				}
			}
			return word
		}
	}
	
})();
