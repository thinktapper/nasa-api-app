// NASA Blast Off
/////////////////

let date
let randomDate

const root = document.querySelector(':root')

const apodButton = document.querySelector('[name="apodButton"]')
const randButton = document.querySelector('[name="random"]')
let url = `https://api.nasa.gov/planetary/apod?api_key=${key}`
const bg = document.querySelector('#bg')
const description = document.querySelector('.description')
const title = document.querySelector('.apodTitle')
const copy = document.querySelector('.apodCopy')
const randomInfo = document.querySelector('.randomInfo')

// Construct random date
const genRandomDate = () => {
    const maxDate = Date.now()
    const timestamp = Math.floor(Math.random() * maxDate)
    let rando = new Date(timestamp).toLocaleDateString('en-CA')
    return rando
    // let formattedDate = `${rando[2]}-${rando[0]}-${rando[1]}`
    // return formattedDate
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
		// bg.style.backgroundImage = "url("+nasaBg+")"
        root.style.setProperty('--nasa-url', `url(${nasaBg})`)
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
	date = document.querySelector('input').value
	aDay(date)
})

randButton.addEventListener('click', ()=>{
    randomDate = genRandomDate()
    aDay(randomDate)
    // Display random date generated
    randomInfo.innerText = randomDate
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

// Show most recent APOD on load
today()