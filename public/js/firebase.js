// falta agregar kla camera 
// que se puieda usar offline
// hacer filtro de busqueda por descarte o coincidencia
let providerGoogle = new firebase.auth.GoogleAuthProvider();
var providerFacebook = new firebase.auth.FacebookAuthProvider();
var providerTwitter = new firebase.auth.TwitterAuthProvider();

let fireStore = firebase.firestore();
let docRefUser = ""
if (!localStorage.getItem("fechas") && !localStorage.getItem("participantes")) {
  fireStore.doc("json/fechas").get().then(function(doc) {
    localStorage.setItem('fechas', JSON.stringify(doc.data().fechas));
  })

  fireStore.doc("json/participantes").get().then(function(doc) {
    localStorage.setItem('participantes', JSON.stringify(doc.data().participantes));
  })
}

/*FUNCIONES RELACIONADAS CON LOS USUARIOS*/
//para saber si un usuario inicio sesion
firebase.auth().onAuthStateChanged(function(user) {
if (user) {
	app.datosuser = {}
	app.datosuser.photoURL = user.photoURL
	app.datosuser.displayName = user.displayName
	app.datosuser.email = user.email
	document.querySelector('#user-img').src = user.photoURL


	docRefUser = fireStore.collection('usuarios').doc(app.datosuser.displayName).collection('tarjetas')
	agregarUsuarios(user.displayName,app.datosuser)

	//ANIMACION SALUDO USER
	document.querySelector('#user-welcome').classList.remove('d-none')
	document.querySelector('#Success').classList.add('animation-text1')
	document.querySelector('#welcome').classList.add('animation-text2')
	setTimeout(e=> document.querySelector('#user-welcome').classList.add('d-none') ,5000)

	docRefUser.get().then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {
	        app.datosarratys.push(doc.data().objetotarjeta)
	    });
	});
}else{
	app.datosarratys = []
	app.datosuser = null
	document.querySelector('#user-img').src = "img/logo-user.png"
}
})

function agregarUsuarios(usuario, objetouser){
fireStore.doc("usuarios/"+usuario).set({objetouser}).then(function(docRef) {
	    console.log("usuario enviado correctamente");
	})
}

function actualizarTarjetaUsuarios(objetotarjeta){
	docRefUser.doc(objetotarjeta.id+objetotarjeta.nameTeam).set({objetotarjeta})
	.then(function(docRef) {
		app.datosarratys.push(objetotarjeta)
	    console.log("card enviado correctamente");
	})
}
function borrarTarjetaUsuarios(id,index){
	docRefUser.doc(id).delete().then(function(docRef) {
		app.datosarratys.splice(index,1)
    	console.log("tarjeta borrada correctamente");
	})
}

//base de datos
// enviarFeedback
function agregarFeedback(comentario,user) {
	fireStore.collection("feedback").add({
    'feedback':comentario,
    'username':user
	}).then(function(docRef) {
	    console.log("comentario enviado correctamente");
	})
}

function commentsMatch(comentario,user,photo,id) {
	fireStore.collection("matchcomments").doc(id).collection('comenkey').doc(new Date().toString().substring(4)).set({
	'date': new Date,
	'linkfoto' : photo,
    'username': user,
    'comment' : comentario
	})
	.then(function(docRef) {
	    console.log("comentario enviado correctamente");
	})
}

function traerComentarios(id) {
	let contador = 0;
	let aumento = 500;
	app.arraycomments = []
	fireStore.collection("matchcomments").doc(id).collection('comenkey').onSnapshot(function(querySnapshot) {
    	contador = 0;
	    querySnapshot.forEach(function(doc) {
	    	if (!(app.arraycomments.some(c => c.date.seconds == doc.data().date.seconds))){
	    		setTimeout(e=> {
	        		app.arraycomments.push(doc.data())
	        		document.querySelector(".comments-main").scrollBy(0,85)	
				},contador+=aumento)
	    	}
	    });
	});
}