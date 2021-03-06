(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);

			// NASA
			// Show most recent APOD on load
			today();
			randThumbs();
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);

// NASA Blast Off
/////////////////

let date
let randomDate

const root = document.querySelector(':root')

const apodButton = document.querySelector('[name="apodButton"]')
const randButton = document.querySelector('[name="random"]')
let url = `https://api.nasa.gov/planetary/apod?api_key=${key}`
const libUrl = ``
const bg = document.querySelector('#bg')
const description = document.querySelector('.description')
const title = document.querySelector('.apodTitle')
const copy = document.querySelector('.apodCopy')
const randomInfo = document.querySelector('.randomInfo')

// Construct random date
const genRandomDate = () => {
	const minDate = Date.parse('1995-06-16')
    const maxDate = Date.now()
    const timestamp = Math.floor(Math.random() * (maxDate - minDate + 1) + minDate)
	return new Date(timestamp).toLocaleDateString('en-CA')
}

// Clear prev media and info
const wipe = () => {
	// if user selects date, hide potentially previously generated random date
	while(randomInfo.innerText){
		randomInfo.innerText = ''
	}
	while(bg.firstChild){
		bg.removeChild(bg.firstChild)
	}
	while(description.innerText){
		description.innerText = ''
	}
}

// Append media to DOM
const blastOff = data => {
	if(data.media_type === 'image'){
        const nasaBg = data.hdurl
        root.style.setProperty('--nasa-url', `url(${nasaBg})`)

		document.querySelector('.thumbnail').innerHTML = `<img src="${data.url}" alt="${data.title}">`
		document.querySelector('.descriptionImg').innerHTML = `<img src="${data.url}" alt="${data.title}">`
	}else if(data.media_type === 'video'){
		const vid = `${data.url}?background=1`
		bg.classList.add('video')
		bg.innerHTML = `<iframe class="iframe" src="${vid}" frameborder="0" allow=autoplay></iframe>`
	} // TODO -> Make video autoplay in background (overlay? vimeo?)
}

// Append description to DOM
const showInfo = data => {
	title.innerText = `${data.title}`
	description.innerText = `${data.explanation}`
	// If no copyright is avaliable, append the date
	if(data.copyright !== undefined){
		copy.innerText = `${data.copyright}`
	}else{
		copy.innerText = `${data.date}`
	}
}

apodButton.addEventListener('click', ()=>{
	date = document.querySelector('input').value
	aDay(date)
})

randButton.addEventListener('click', ()=>{
    randomDate = genRandomDate()
    aDay(randomDate)
    // Display random date generated
    randomInfo.innerText = randomDate
}) // TODO -> If no entry for date, display message saying so

const today = () => {
	fetch(url)
		.then((res)=> res.json())
		.then((data)=>{
			blastOff(data)
			showInfo(data)
		})
		.catch((err)=> console.log(`error ${err}`))
}

const randThumbs = () => {
	randomDate = genRandomDate()
	fetch(`${url}`+`&date=${randomDate}`)
		.then((res)=> res.json())
		.then((data)=>{
			if(data.media_type === 'image'){
				document.querySelector('.library').innerHTML = `<img src="${data.url}" alt="${data.title}">`
			}else if(data.media_type === 'video'){
				const vid = `${data.url}?autoplay=1&mute=1&enable_js=1`
				document.querySelector('iframe').classList.remove('hidden')
				document.querySelector('iframe').src = `${vid}`
			}
			document.querySelector('.libTitle').innerText = `${data.date}  ???  ${data.title}`
		})
		.catch((err)=> console.log(`error ${err}`))
}

const aDay = date => {
    wipe()
    fetch(`${url}`+`&date=${date}`)
		.then((res)=> res.json())
		.then((data)=>{
			blastOff(data)
			showInfo(data)
		})
		.catch((err)=>{
			console.log(`error ${err}`)
		})
}