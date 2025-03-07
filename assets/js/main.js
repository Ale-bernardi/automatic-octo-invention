/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

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
						

						// Back arrow.
$('<div class="back-arrow"></div>')
  .appendTo($this)
  .on('click', function(event) {
    event.stopPropagation();
    window.history.back();
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







document.getElementById("home-button").addEventListener("click", function(event) {
    event.preventDefault(); // Impedisce che il link venga seguito
    var messageDiv = document.getElementById("message");
    messageDiv.innerHTML = "Non sapevo che funzione dare a questo pulsante quindi accontentati di questo gattino &nbsp;&nbsp;&nbsp;&nbsp; =＾● ⋏ ●＾=";
    
    // Dopo 2 secondi (2000 ms), il messaggio scompare
    setTimeout(function() {
        messageDiv.innerHTML = "";
    }, 3000);
});









// Seleziona gli elementi necessari
const images = document.querySelectorAll('#about img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const videoThumbnail = document.getElementById('video-thumbnail');

// Aggiungi l'evento click a tutte le immagini della sezione "about"
images.forEach(img => {
  img.addEventListener('click', () => {
    // Se l'immagine cliccata è la thumbnail del video…
    if (img === videoThumbnail) {
      // Indica che vogliamo mostrare il video
      lightbox.classList.add('video-active');
      // Nascondi l'elemento immagine (lightboxImg) se visibile
      lightboxImg.style.display = 'none';
      // Rimuovi eventuale tag video già presente (per ricaricarlo da zero)
      let existingVideo = lightbox.querySelector('video');
      if (existingVideo) {
        existingVideo.remove();
      }
      // Crea dinamicamente il tag video
      let videoElement = document.createElement('video');
      videoElement.setAttribute('controls', '');
      videoElement.setAttribute('autoplay', '');
      videoElement.style.maxWidth = '90%';
      videoElement.style.maxHeight = '90%';
      // Crea il tag source per il video
      let source = document.createElement('source');
      source.setAttribute('src', 'images/le_oliveee.mp4');
      source.setAttribute('type', 'video/mp4');
      videoElement.appendChild(source);
      // Aggiungi il video alla lightbox
      lightbox.appendChild(videoElement);
    } else {
      // Se è una normale immagine:
      lightbox.classList.remove('video-active');
      // Rimuovi eventuale video se presente
      let existingVideo = lightbox.querySelector('video');
      if (existingVideo) {
         existingVideo.remove();
      }
      // Mostra l'immagine nella lightbox
      lightboxImg.src = img.src;
      lightboxImg.style.display = 'block';
    }
    // Mostra la lightbox
    lightbox.style.display = 'flex';
  });
});

// Gestione della chiusura della lightbox
lightboxClose.addEventListener('click', (e) => {
  e.stopPropagation();
  closeLightbox();
});
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    e.stopPropagation();
    closeLightbox();
  }
});

function closeLightbox() {
  lightbox.style.display = 'none';
  // Se c'è un video, fermalo e rimuovilo
  let existingVideo = lightbox.querySelector('video');
  if (existingVideo) {
    existingVideo.pause();
    existingVideo.remove();
  }
  // Ripristina la visualizzazione dell'immagine (per eventuali prossimi click)
  lightboxImg.style.display = 'block';
  lightbox.classList.remove('video-active');
}

