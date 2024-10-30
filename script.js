let currentPageUrl = 'https://swapi.dev/api/people/' //variável, usar let porque vamos redeclarar quando atualizar a página

window.onload = async () => { 
    try{ 
        await loadCharacters(currentPageUrl); 
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards'); 
    }

    const nextButton = document.getElementById('next-button')
    const backButton = document.getElementById('back-button')

    nextButton.addEventListener('click', loadNextPage) 
    backButton.addEventListener('click', loadPreviousPage)

}; 

async function loadCharacters(url) { //função vai receber a url da próxima página ou anterior depois que apertar os botões
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = ''; //modificar o HTML que tá dentro desse elemento, a string vazia limpa os resultados anteriores

    try {

            const response = await fetch(url); //Requisição a URL
            const responseJson = await response.json();

            responseJson.results.forEach((character) => { //results tem os dados dos personagens. forEacch estrutura de repetição
                const card = document.createElement("div") 
                card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')` // Tirar o espaço da template string, usamos template string para concatenar código JS
                card.className = "cards" 

                const characterNameBG = document.createElement("div") 
                characterNameBG.className = "character-name-bg" 

                const characterName = document.createElement("span")
                characterName.className = "character-name"
                characterName.innerText = `${character.name}` //innerText modifica o conteúdo de texto, o forEach itera com cada objeto, ou seja, cada personagem
                
                characterNameBG.appendChild(characterName) 
                card.appendChild(characterNameBG) 

                card.onclick = () => {
                    const modal = document.getElementById("modal")
                    modal.style.visibility ="visible"

                    const modalContent = document.getElementById("modal-content")
                    modalContent.innerHTML = '' //de novo modificamos o HTML do documento

                    const characterImage = document.createElement("div")
                    characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
                    characterImage.className = "character-image" 

                    const name = document.createElement('span')
                    name.className = "character-details"
                    name.innerText = `Nome: ${character.name}`

                    const characterHeight  = document.createElement('span')
                    characterHeight.className = "character-details"
                    characterHeight.innerText = `Altura: ${convertHeight(character.height)}`

                    const mass = document.createElement('span')
                    mass.className = "character-details"
                    mass.innerText = `Peso: ${convertMass(character.mass)}`

                    const eyeColor = document.createElement('span')
                    eyeColor.className = "character-details"
                    eyeColor.innerText = `Cor dos olhos: ${convertEyeColor(character.eye_color)}` //função pra converter a cor que chega em ingles

                    const birthYear = document.createElement('span')
                    birthYear.className = "character-details"
                    birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`

                    modalContent.appendChild(characterImage)
                    modalContent.appendChild(name)
                    modalContent.appendChild(characterHeight)
                    modalContent.appendChild(mass)
                    modalContent.appendChild(eyeColor)
                    modalContent.appendChild(birthYear)
                }

                mainContent.appendChild(card)
                
            });

            const nextButton = document.getElementById('next-button') 
            const backButton = document.getElementById('back-button')

            nextButton.addEventListener('click', loadNextPage) 
            backButton.addEventListener('click', loadPreviousPage)

            nextButton.disabled = !responseJson.next //disable pode ser true ou false, ele vai estar true/desabilitado 
            
            
            backButton.disabled = !responseJson.previous 

            backButton.style.visibility = responseJson.previous? "visible" : "hidden" 

            currentPageUrl = url 

    } catch (error) {
        alert('Erro ao carregar personagens')
        console.log(error)
    }
}

async function loadNextPage() {
    if (!currentPageUrl) return;  

    try{
        const response = await fetch(currentPageUrl) //Requisição para o endereço e armazena em response
        const responseJson = await response.json() //pega a response e passa pra json e guarda na const responseJson

        await loadCharacters(responseJson.next) // Quando apertamos o botão de next a função ladNextPag faz a requisição pra api pra obter a url da proxima página que ta armazenado na currentPag
        
        //a nova url vai pra função loadCharacters e carregar os cards
        //depois de carregar a url vai mudar para a pagina dois, então a url da variável do começo muda

    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a próxima página')
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return; //se o valor da variavel CurrentPagUrl for nulo ou não existir (false) ele retorna ou interrompe a execução da função

    try{
        const response = await fetch(currentPageUrl) 
        const responseJson = await response.json() 

        await loadCharacters(responseJson.previous) 

    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a página anterior')
    }
}

function hideModal() {
    const modal = document.getElementById("modal")
    modal.style.visibility ="hidden"
}

function convertEyeColor(eyeColor) { 
    const cores = {
        blue: "azul",
        brown: "castanho",
        green: "verde",
        yellow: "amarelo",
        black: "preto",
        pink: "rosa",
        red: "vermelho",
        orange: "laranja",
        hazel: "avela",
        unknown: "desconhecida"
    };
    return cores[eyeColor.toLowerCase()] || eyeColor; 
}

function convertHeight(height) {
    if (height === "unknown") {
        return "desconhecida"
    }

    return (height / 100).toFixed(2) //to fixed pra dar duas casas decimais, dividir por dez para ter a vírgula
}

function convertMass(mass) {
    if (mass === "unknown") {
        return "desconhecido"
    }

    return `${mass} kg`
}

function convertBirthYear(birthYear) {
    if (birthYear === "unknown") {
        return "desconhecido"
    }

    return birthYear
}