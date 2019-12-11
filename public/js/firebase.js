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

	//ANIMACION SALUDO USER
	setTimeout(e=> {
		document.querySelector('#user-welcome').classList.remove('d-none')
		document.querySelector('#user-welcome').classList.add('animation-divEntry')
	},2500)
	setTimeout(e=> {
			document.querySelector('#user-welcome').classList.add('d-none')
		},7500)

	docRefUser = fireStore.collection('usuarios').doc(app.datosuser.displayName).collection('tarjetas')
	agregarUsuarios(user.displayName,app.datosuser)

	docRefUser.get().then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {
	        app.datosarratys.push(doc.data())
	    });
	});
}else{
	app.datosarratys = []
	app.datosuser = null
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
function borrarTarjetaUsuarios(id){
	docrefuser.doc(id).delete().then(function(docRef) {
    console.log("tarjeta borrada correctamente");
	})
}
	// docRefUser.add(objetotarjeta).then(function(docRef) {
	//     console.log("tarjeta enviado correctamente");
	//     let auxid = docRef.id
	// 		objetotarjeta['id'] = auxid
	// 		app.datosarratys.push(objetotarjeta)
	// 		updateid(auxid)
	// })

// function updateid(idt) {
// 	docrefuser.doc(idt).update({
// 		'id' : idt
// 	}).then(function(docRef) {
// 		console.log("update");
// 	})
// }

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
	fireStore.collection("matchcomments").doc(id).collection('comenkey').onSnapshot(function(querySnapshot) {
		app.arraycomments = []
    querySnapshot.forEach(function(doc) {
        app.arraycomments.push(doc.data())
    });
});
}

// inicion de sesion
// firebase.auth().signInWithRedirect(provedor de cuentas);
//cerrar sesion
// firebase.auth().signOut()