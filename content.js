function controlSetup(){
	const video = document.querySelector('video');
	if (!video){return}
	let pnode = video.parentNode;
	while (pnode.parentNode.nodeName === 'DIV'){pnode = pnode.parentNode;}
	
	const v_element = Array.from(pnode.children).filter(e => e.getAttribute('role') === 'button')[0];
	
	const vtop = Math.max(v_element.offsetTop, 0),
		  vleft = Math.max(v_element.offsetLeft, 0),
		  vwidth = v_element.offsetWidth,
		  vheight = v_element.offsetHeight,
		  vol = video.volume;

	pnode.classList.add('ig-slider-div');

	const time_slider = document.createElement('input');
	time_slider.setAttribute('type','range');
	time_slider.setAttribute('min',0);
	time_slider.setAttribute('value',0);
	time_slider.setAttribute('style',`position:relative; opacity:0; z-index:999999; width:90%; height:10%`);

	time_slider.addEventListener('input',e => video.currentTime = e.target.value/10,false);

	const volume_slider = document.createElement('input');
	volume_slider.setAttribute('type','range');
	volume_slider.setAttribute('min',0);
	volume_slider.setAttribute('max',500);
	volume_slider.setAttribute('value',500);
	volume_slider.setAttribute('style',`position:relative; opacity:0; z-index:999999; transform-origin:-30px ${vleft}px; transform:rotate(-90deg);`);
	volume_slider.style.height = .1 * vwidth;
	volume_slider.style.width = .8 * vheight;
	volume_slider.addEventListener('input',e => video.volume = e.target.value/500,false);

	[time_slider,volume_slider].forEach(e => {
		pnode.insertBefore(e,pnode.firstChild);
		e.setAttribute('class','ig-slider');
	});
	
	video.addEventListener('durationchange',_ => {
		time_slider.setAttribute('max',video.duration*10)});
	video.addEventListener('timeupdate',_ => time_slider.value = video.currentTime*10|0);

	resizeObserver(v_element,time_slider,volume_slider);
}

function initializeObserver(){
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			const mutationList = Array.from(mutation.addedNodes);
			return mutationList.length && mutationList.some(e => e.nodeName === 'DIV') && controlSetup();
		});
	});
	observer.observe(document.body, {childList:true});
}

function resizeObserver(e,tslider,vslider){
	const observer = new ResizeObserver(entries => {
		entries.forEach(entry => {
			let w = entry.contentRect.width | 0,
				h = entry.contentRect.height | 0;
			tslider.style.top = `${h*.95}px`;
			tslider.style.left = `${w*.05}px`;
			vslider.style.height = `${.1*w}px`;
			vslider.style.width = `${.8*h}px`;
			vslider.style.top = `${h*.9+e.offsetTop}px`;
			vslider.style.left = `${w*.95}px`;
		});
	});
	observer.observe(e);
}

document.addEventListener('readystatechange',e => {
	if (e.target.readyState === 'complete'){
		controlSetup();
		initializeObserver();
	}
});