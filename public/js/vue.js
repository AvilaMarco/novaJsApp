Vue.component('google-maps',{
	props:{
		link:{type:String},
		school:{type:String},
		address:{type:String},
		ismodal:{type:Boolean}
	},
	template:`
	<table class="table bg-blanco text-center">
  	<thead class="thead-dark">
  		<tr>
  			<th class="fs-14">
					{{school}}
	  			<button v-if="ismodal" type="button" class="close blanco" data-dismiss="alert">&times;</button>
			</th>
  		</tr>
  	</thead>
  	<tbody>
  		<tr>
  			<td>{{address}}</td>
  		</tr>
  		<tr>
  			<td><iframe class="w-100 border border-success" :src="link"></iframe></td>
  		</tr>
  	</tbody>
	</table>
	`
})

Vue.component('card-followed',{
	props:{
		player:{type:Object},
	},
	template:`
	<div class="card m-2">
		<div class="card-header bg-dark blanco headerCard">
			<h2 v-if="player.isteam">{{player.nameTeam}}</h2>
			<h2 v-else>{{player.namePlayer}} ({{player.nameTeam}})</h2>
			<button class="btn-headerCard" @click="toDeletecard(player.id+player.nameTeam)">X</button>
		</div>
		<h3 class="text-center m-2">Next Match</h3>
		<ul class="list-group">
			<li class="list-group-item">
				<i class="fas fa-futbol icon-with-text"></i>
				<span class="text-with-icon">{{player.teamA}} vs {{player.teamB}}}</span>
			</li>
		  <li class="list-group-item">
				<i class="fas fa-map-marker-alt icon-with-text"></i>
				<a :href="'#'+player.id" data-toggle="modal" class="text-with-icon">{{player.school}}</a>
				<div class="modal fade" :id="player.id">
					<div class="modal-dialog modal-dialog-centered">
						<google-maps :link="player.link" :school="player.school" :address="player.address" :ismodal="true"></google-maps>
					</div>
				</div>
			</li>
		  <li class="list-group-item">
				<i class="far fa-calendar-alt icon-with-text"></i>
				<span class="text-with-icon">{{player.date}}</span>
			</li>
		  <li class="list-group-item">
				<i class="far fa-clock icon-with-text"></i>
				<span class="text-with-icon">{{player.time}}</span>
			</li>
		</ul>
	</div>
	`,
	methods:{
		toDeletecard(id){
			console.log(id)
			this.$emit('borrarcard',id)
		}
	}
})

Vue.component('card-login',{
	template:`
	<div>
		<div class="modal-dialog">
			<div id="LoginSocial" class="modal-content mt-40">
				<!-- Modal Header -->
				<div class="modal-header">
					<h4 class="modal-title">Social Networks</h4>
					<button type="button" class="close" data-dismiss="modal">&times;</button>
				</div>
				<!-- Modal body -->
				<div class="modal-body">
					<div id="login" class="card m-3 blanco">
						<div class="card-body bg-google rounded-lg m-2">
							<i class="fab fa-google icon-with-text"></i> <span id="Google" @click="iralogin('Google')" class="text-with-icon">Login with Google</span>
						</div>
						<div class="card-body bg-facebook rounded-lg m-2">
							<i class="fab fa-facebook-square icon-with-text"></i> <span id="Facebook" @click="iralogin('Facebook')" class="text-with-icon">Login with Facebook</span>
						</div>
						<div class="card-body bg-twitter rounded-lg m-2">
							<i class="fab fa-twitter icon-with-text"></i> <span id="Twitter" @click="iralogin('Twitter')" class="text-with-icon">Login with Twitter</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`,
	methods:{
		iralogin(id){
			this.$emit('ircardlogin',id)
		}
	}
})

Vue.component('card-match',{
	props:{
		match:{type:Object}
	},
	template:`
	<div class="card m-2 text-center fs-25">
		<div class="card-header">
			<p class="card-title">{{match.date}}</p>
		</div>
		<div class="card-body">
			<div class="row">
				<div class="col-4">
					<img class="logo-card" :src='"img/"+match.teamA+".png"'>
					<p>{{match.teamA}}</p>
				</div>
				<div class="col-4 mt-2">
					<p class="card-text mt-4">{{match.time}}</p>
					<a name="isandscape" class="btn btn-info" data-toggle="modal" href="#mapatoday">{{match.school}}</a>
					<div class="modal fade" id="mapatoday">
						<div class="modal-dialog modal-dialog-centered">
							<google-maps :link="match.link" :school="match.school" :address="match.address" :ismodal="true"></google-maps>
						</div>
					</div>
				</div>
				<div class="col-4">
					<img class="logo-card" :src='"img/"+match.teamB+".png"'>
					<p>{{match.teamB}}</p>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<a name="isortraid" class="btn btn-info btn-block" data-toggle="modal" href="#mapatoday">{{match.school}}</a>
				</div>
			</div>
		</div>
	</div>
	`
})

let app = new Vue({
	el:'#app',
	data:{
		singlePage:'Home',
		filtroteam:"",
		feedback:'',
		datosuser:null,
		datosarratys : [],
		mesFiltro:'All',
		linkMap:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d190255.33858302396!2d-87.87204658078659!3d41.833903666429514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2c3cd0f4cbed%3A0xafe0a6ad09c0c000!2sChicago%2C%20Illinois%2C%20EE.%20UU.!5e0!3m2!1ses-419!2sar!4v1571088920009!5m2!1ses-419!2sar',
		schoolMap:'AJ Katzenmaier Elementary',
		addressMap:'24 W. Walton St., Chicago, IL 60610',
		followPlayer:'',
		commentMatch:'',
		dataMatch:{},
		arraycomments:[]
	},
	methods:{
		selectNav(event){
			document.querySelector('button[name*="'+this.singlePage+'"').classList.remove('bg-verde')
			document.querySelector('button[name*="'+this.singlePage+'"').classList.add('bg-azul')
			let click = event.target;
			this.singlePage = click.dataset.name;
			click.name != "" ? click.classList.add('bg-verde'):null
		},
		filtroPorEquipos(event){
			// con esto me aseguro de obtener siempre el equipo que se clickeo
			let click = event.target.name ? event.target.name : event.target.id
			let beforeclick = this.filtroteam
			this.filtroteam = click == this.filtroteam ? '' : click
			if (this.filtroteam != '') {
					// quito el color al boton anterior
					if (beforeclick != click && beforeclick != '') {
						document.querySelector('button[name*="'+beforeclick+'"').classList.remove('bg-verde')
						document.querySelector('button[name*="'+beforeclick+'"').style.opacity = 0.4
					}
					// agrego el color al boton clickeado
					document.querySelector('button[name*="'+click+'"').classList.add('bg-verde')
					document.querySelector('button[name*="'+click+'"').style.opacity = 1
			}else {
				document.querySelector('button[name*="'+click+'"').classList.remove('bg-verde')
				document.querySelector('button[name*="'+click+'"').style.opacity = 0.4
			}

		},
		scrollContact(){setTimeout(e=>window.scrollBy(0, 500),250)},
		webComments(match){
			this.singlePage = "Comments"
			this.dataMatch = match
			traerComentarios(match.id)
		},
		mapaLandscape(match){
			this.linkMap = match.link
			this.schoolMap = match.school
			this.addressMap = match.address
		},
		// manejo de base de datos
		addFollowCard(){
			if (playerOnTeam(this.followPlayer) != null) {
				let mesacual = ""
				switch (today.substring(3)) {
				case "Oct":
					mesacual = "October"
					break;
				case "Sep":
					mesacual = "September"
					break;
				}
				actualizarTarjetaUsuarios(
					fechasJSON(mesacual,today,playerOnTeam(this.followPlayer),this.equipos.includes(firstChartUppeCase(this.followPlayer)))
				)
				this.followPlayer = ''
			}else{
				this.followPlayer = ''
				alert("Player/Team no found")
			}
		},
		deleteFollwCard(id){
			borrarTarjetaUsuarios(id)
		},
		enviarFeedback(){
			agregarFeedback(this.feedback,"pruebas")
		},
		LoginSocial(id){
			console.log(id)
			switch (id) {
				case "Google":
					firebase.auth().signInWithRedirect(providerGoogle);
					break;
				case "Facebook":
					firebase.auth().signInWithRedirect(providerFacebook);
					break;
				case "Twitter":
					firebase.auth().signInWithRedirect(providerTwitter);
				break;
			}
		},
		Logout(){
			console.log("logaouyt")
			firebase.auth().signOut();
		},
		comentarPartido(){
			if (this.commentMatch != ""){
				commentsMatch(this.commentMatch,this.datosuser.displayName,this.datosuser.photoURL,this.dataMatch.id)
				console.log(this.commentMatch)
			}else{
				alert("Write a comment")
			}
		}
	},
	computed:{
		equipos(){
			return ["U1","U2","U3","U4","U5","U6"]
		},
		matches(){
			return fechasJSON(this.mesFiltro,null,this.filtroteam)
		},
		matchesToday(){
			return fechasJSON("All",today,'');
		}
	}
})
