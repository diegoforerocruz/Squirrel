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
    cont = 1   
    htmlSegment = ''
    //arreglo con los eventos
    let arreglo = []
    //arreglo con los datos de la matriz de confusion true pos, false pos, false neg, true neg
    let mc = []
    //arreglo con los datos de correlacion
    let corr = []
    //Arreglo de tuplas de evento, correlación
    let arregloCompleto = []
    //Este for se encarga de sacar todos los eventos sin que se repitan y los pone en el arreglo "arreglo"
    for (let i=0; i<eventos.length; i++) {
        for (let j=0; j<eventos[i]["events"].length; j++) {
            if(arreglo.length==0) {
                arreglo.push(eventos[i]["events"][j])
            }else {
                if(arreglo.includes(eventos[i]["events"][j])){
                }else {
                    arreglo.push(eventos[i]["events"][j]) 
                }
            }
        }
    }
    //Este for llena el arreglo de mc en el mismo orden de los eventos
    for (let i=0;i<arreglo.length;i++){
        let tp=0, fp=0, fn=0, tn=0
        for(let j=0;j<eventos.length;j++){
            let obj = JSON.parse(eventos[j].squirrel)+""
            if(eventos[j]["events"].includes(arreglo[i])){
                if(obj=="true") tp++
                else fp++
            }else {
                if(obj=="true") fn++
                else tn++
            } 
        }
        mc.push([tp,fp,fn,tn])
    }
    //for para hacer llenar el arreglo de correlacion
    for(let i=0;i<arreglo.length;i++){
        let numerador1, denominador, resp
        numerador1=(mc[i][0]*mc[i][3])-(mc[i][1]*mc[i][2])
        denominador=Math.sqrt((mc[i][0]+mc[i][1])*(mc[i][0]+mc[i][2])*(mc[i][3]+mc[i][1])*(mc[i][3]+mc[i][2]))
        resp=(numerador1)/denominador
        corr.push(resp)
    }
    //une los resultados de eventos con correlacion y lo mete en "arregloCompleto"
    for(let i=0;i<corr.length;i++){
        arregloCompleto.push([arreglo[i],corr[i]])
    }
    //Ordena descendentemente a arregloCompleto por la correlacion
    arregloCompleto.sort(function(a, b) {
        var keyA = a[1],
        keyB = b[1];
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
    });
    //Añade el código html con la info de correlación
    arregloCompleto.map(correlacion => {
        htmlSegment =   `<tr>
                            <th>${cont}</th>
                            <td>${correlacion[0]}</td>
                            <td>${correlacion[1]}</td>
                        </tr>`
        cont ++
        html += htmlSegment
    })
    let container2 = document.getElementById("correlationTableBody")
    container2.innerHTML = html
}

renderEvents()