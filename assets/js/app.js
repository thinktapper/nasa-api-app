// NASA Blast Off
/////////////////

let date
let randomDate

const apodButton = document.querySelector('[name="apodButton"]')
let url = `https://api.nasa.gov/planetary/apod?api_key=${key}`
const bg = document.querySelector('#bg')
const description = document.querySelector('.description')
const title = document.querySelector('.apodTitle')
const copy = document.querySelector('.apodCopy')
const randomInfo = document.querySelector('.randomInfo')

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
		bg.style.backgroundImage = "url("+nasaBg+")"
	}else if(data.media_type === 'video'){
		bg.classList.add('video')
		bg.innerHTML = `<iframe class="iframe" src="${data.url}" frameborder="0"></iframe>`
	}
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
	wipe()
	date = document.querySelector('input').value
	
	fetch(`${url}`+`&date=${date}`)
		.then((res)=> res.json())
		.then((data)=>{
			blastOff(data)
			showInfo(data)
		})
		.catch((err)=>{
			console.log(`error ${err}`)
		})
})

const today = () => {
	fetch(url)
		.then((res)=> res.json())
		.then((data)=>{
			blastOff(data)
			showInfo(data)
		})
		.catch((err)=> console.log(`error ${err}`))
}

// Show most recent APOD on load
today()