import { OBJLoader } from '../build/OBJLoader.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
/*scene.add( cube );*/

var loader = new OBJLoader();

// load a resource
loader.load(
    // resource URL
    '../shaders/models/skull.obj',
    // called when resource is loaded
    ( object ) => {

        scene.add( object );
        console.log(object);

    },
);
camera.position.z = 5;

var animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();
