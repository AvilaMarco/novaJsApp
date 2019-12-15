// var today = new Date().toDateString().substring(4,10).split(" ").reverse().join(" ")
var today = "27 Oct"

function fechasJSON(mesFiltro, filtroToday,filtroTeam,isteam) {
  let fechas = filtroOrden(mesFiltro, JSON.parse(localStorage.getItem("fechas")))
  let filtro = []
  let jsonToday = []
  for (mes in fechas) {
    for (dia in fechas[mes]) {
      for(partido in fechas[mes][dia]){
        //filtro por equipos
        if (filtroTeam != '') {
          Object.values(fechas[mes][dia][partido]).forEach(e=> e == filtroTeam ? filtro.push(fechas[mes][dia][partido]) : null)
        }
        // filtro para el dia actual
        if (filtroToday!=null && fechas[mes][dia][partido].date == filtroToday) {
          jsonToday.push(fechas[mes][dia][partido])
        }
        //filtro por mes
        if (filtroToday == null && filtroTeam == '') {
          filtro.push(fechas[mes][dia][partido])
        }
        //filtro para el proximo partido de un equipo o jugador
        if (isteam!=null && parseInt(fechas[mes][dia][partido].date.substring(0,2),10) >= parseInt(filtroToday.substring(0,2),10)) {
          let card = []
          Object.values(fechas[mes][dia][partido]).forEach(e=> e == filtroTeam ? card.push(fechas[mes][dia][partido]): null)
          if (card.length != 0) {
            return crearObjetoCard(card[0],isteam,filtroTeam)
          }
        }
      }
    }
  }
  // retorna el filtro para el dia actual
  if (jsonToday.length != 0) {
    return jsonToday
  }else if (filtroToday != null) {
    return null
  }
  // retorna el filtro por mes o equipo
  return filtro
}

//retorna un array con el mes o los meses
function filtroOrden(mesFiltro, JSON) {
  let object = []
  for(key in JSON){
    if(mesFiltro == key){
      object.unshift(JSON[key])
    }else if (mesFiltro == "All") {
      object.unshift(JSON[key])
    }
  }
  return object
}

//buscar participantes en equipos pra luego agregarlos en las tarjetas
function playerOnTeam(playerfiltro) {
  let teams = JSON.parse(localStorage.getItem("participantes"))
  for (team in teams) {
    if (team == firstChartUppeCase(playerfiltro)) {
      return team;
    }
    for (player in teams[team]) {
      if (teams[team][player] == firstChartUppeCase(playerfiltro)) {
        return team;
      }
    }
  }
  return null
}

//creo un objeto con los datos de la tarjeta del jugador o equipos
function crearObjetoCard(card,isteam,team){
  let object = {}
  object.address = card.address
  object.date = card.date
  object.isteam = isteam
  object.link = card.link
  object.school = card.school
  object.teamA = card.teamA
  object.teamB = card.teamB
  object.time = card.time
  object.id = card.id
  object.nameTeam = team
  object.namePlayer = app.followPlayer
  return object
}

function firstChartUppeCase(string) {
  return string[0].toLocaleUpperCase() + string.substring(1)

}

function toggleDisplay(){
  document.querySelector("#collapseLogin").classList.toggle("d-flexy")
}