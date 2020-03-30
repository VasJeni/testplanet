import * as THREE from './three.module.js';

import {OBJLoader} from './OBJLoader.js';

var container;
var earthSkeleton;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;
var splineObject;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


var object;

init();
animate();


function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 2000;
    camera.lookAt(0, 0, 0);

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    //try add lines
    //create a blue LineBasicMaterial
    var material = new THREE.LineBasicMaterial({color: 0x0000ff});

    var points = [];
    points.push(new THREE.Vector3(0, 359.7, 0));
    points.push(new THREE.Vector3(0, -356.5, 0));

    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var line = new THREE.Line(geometry, material);
    scene.add(line);


    // Create a sine-like wave
    var curve = new THREE.SplineCurve([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(-600, 0),
        new THREE.Vector2(-300, 300),
        new THREE.Vector2(600, 0),
        new THREE.Vector2(0, 0),
    ]);

    var pointsSplineObject = curve.getPoints(50);
    var geometrySplineObject = new THREE.BufferGeometry().setFromPoints(pointsSplineObject);

    var materialSplineObject = new THREE.LineBasicMaterial({color: 0xff0000});

    // Create the final object to add to the scene
    splineObject = new THREE.Line(geometrySplineObject, materialSplineObject);
    scene.add(splineObject);

    // manager

    function loadModel() {

        object.traverse(function (child) {

            if (child.isMesh) child.material.map = texture;

        });

        object.position.y = -95;
        scene.add(object);

    }

    var manager = new THREE.LoadingManager(loadModel);

    manager.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);

    };

    // texture

    var textureLoader = new THREE.TextureLoader(manager);

    var texture = textureLoader.load('../shaders/models/all.jpg');

    // model

    function onProgress(xhr) {

        if (xhr.lengthComputable) {

            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');

        }

    }

    function onError() {
    }

    var loader = new OBJLoader(manager);

    loader.load('../shaders/models/earth.obj', function (obj) {

        object = obj;
        console.log(object);
        var mesh1 = object.children[0];
        var mesh2 = object.children[1];
        mesh1.position.y = 97.5;
        mesh2.position.y = 97.5;
        earthSkeleton = obj;

    }, onProgress, onError);

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;

}

//

function animate() {

    requestAnimationFrame(animate);
    earthSkeleton.rotation.y += 0.01;
    splineObject.rotation.y += 0.01;
    render();

}

function render() {

    camera.position.x += ( mouseX - camera.position.x ) * 1.25;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    renderer.render(scene, camera);

}