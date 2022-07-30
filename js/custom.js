/*--------------------------------------------------------------------------------------------------------------------*/

$(document).ready(function() {

	if(window.location.href.indexOf('/articles') >= 0)
	{
		$('#body-wrapper > .container').removeClass('grid-lg').addClass('grid-xl');
	}
});

/*--------------------------------------------------------------------------------------------------------------------*/

var grav_editor = $('textarea[data-grav-editor]');

/*--------------------------------------------------------------------------------------------------------------------*/

if(grav_editor.length === 1)
{
	window.setTimeout(() => {

		var codemirror = grav_editor.data('codemirror');

		if(codemirror) 
		{
			/*--------------------------------------------------------------------------------------------------------*/
			/* SET POSITION                                                                                           */
			/*--------------------------------------------------------------------------------------------------------*/

			var hash = window.location.hash;

			if(hash)
			{
				var parts = hash.substring(1).split(':');

				if(parts.length === 2)
				{
					codemirror.setCursor({
						'line': parts[0],
						 'ch' : parts[1],
					});
				}
			}

			/*--------------------------------------------------------------------------------------------------------*/
			/* GET POSITION                                                                                           */
			/*--------------------------------------------------------------------------------------------------------*/

			window.setInterval(() => {

				var cursor = codemirror.getCursor();

				window.location.hash = cursor.line + ':' + cursor.ch;

			}, 500);

			/*--------------------------------------------------------------------------------------------------------*/
		}

	}, 500);
}

/*--------------------------------------------------------------------------------------------------------------------*/

$('.delete-prev').each((idx, obj) => {

	$(obj).prev().remove();
});

$('.delete-next').each((idx, obj) => {

		$(obj).next().remove();
});

/*--------------------------------------------------------------------------------------------------------------------*/

function drawDiagrams(diagrams)
{
	diagrams.each((idx, obj) => {

		/*------------------------------------------------------------------------------------------------------------*/

		const el1 = $(obj);

		/*------------------------------------------------------------------------------------------------------------*/

		try
		{
			/*--------------------------------------------------------------------------------------------------------*/

			const json = JSON.parse(el1.text());

			/*--------------------------------------------------------------------------------------------------------*/

			const deferred = $.Deferred().done(() => {

				/*----------------------------------------------------------------------------------------------------*/

				json.mathjax = true;

				/*----------------------------------------------------------------------------------------------------*/

				el1.feyn(json).find('foreignObject').each((idx, obj) => {

					const foreignObject = $(obj);

					foreignObject.find('svg').each((idx, obj) => {

						const svg = $(obj);

						foreignObject.width(1 * svg.width());
						foreignObject.height(2 * svg.height());
					});
				});

				/*----------------------------------------------------------------------------------------------------*/
			});

			/*--------------------------------------------------------------------------------------------------------*/

			let cnt = 0;

			if('label' in json) for(const label of Object.values(json.label)) if(label.length >= 2)
			{
				const text = label[1].trim();

				if(text.startsWith('##')
				   &&
				   text.endsWith('##')
				 ) {

					MathJax.tex2svgPromise(text.substring(2, text.length - 2)).then((svg) => {

						label[1] = svg.innerHTML;

						if(--cnt === 0)
						{
							deferred.resolve();
						}
					});

					++cnt;
				}
			}

			/*--------------------------------------------------------------------------------------------------------*/

			if(cnt === 0)
			{
				deferred.resolve();
			}

			/*--------------------------------------------------------------------------------------------------------*/
		}
		catch(e)
		{
			el1.text(e);
		}
	});
}

/*--------------------------------------------------------------------------------------------------------------------*/

drawDiagrams($('.feynman'));

/*--------------------------------------------------------------------------------------------------------------------*/
