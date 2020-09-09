async function getEvents() {
    let url = 'https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json'

    try {
        let res = await fetch(url)
        return await res.json();
    } catch (error) {
        console.log(error)
    }
}

async function renderEvents() {
    let eventos = await getEvents()
    let html = ''
    let cont = 1
    let htmlSegment = ''

    eventos.map(evento => {
        let obj = JSON.parse(evento.squirrel)+""
        console.log(obj)
        if(obj=="true") {
            htmlSegment =   `<tr class="bg-danger">
                                    <th>${cont}</th>
                                    <td>${evento.events}</td>
                                    <td>${evento.squirrel}</td>
                                </tr>`
        }else {
            htmlSegment =   `<tr>
                                    <th>${cont}</th>
                                    <td>${evento.events}</td>
                                    <td>${evento.squirrel}</td>
                                </tr>`
        }
        
        cont ++
        html += htmlSegment

    })

    let container = document.getElementById("eventsTableBody")
    container.innerHTML = html

    html = ''
    cont = 0
    htmlSegment = ''

}



renderEvents()
