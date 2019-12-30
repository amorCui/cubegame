import React from 'react';
import * as THREE from 'three';

class  ThreeBim extends React.Component{
    
	constructor(props) {
        super(props);
        this.state = {
        };
    }

    
    initThree(){

        threeStart();
    
        var renderer, width, height;

        function init(options) {
            width = window.innerWidth;
            height = window.innerHeight;

            renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            renderer.setSize(width, height);
            document.getElementById('canvas-frame').appendChild(renderer.domElement);
            renderer.setClearColor(0x000000, 1.0);
        }
    
        var camera;
        function initCamera(options) {
            camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
            camera.position.set(0, 400, 400)
            // camera.up.set(0, 1, 0);
            camera.lookAt(0, 0, 0);
        }
    
        var scene;
        function initScene() {
            scene = new THREE.Scene();
        }
    
        var light;
        function initLight(options) {
            light = new THREE.AmbientLight(0xFFFFFF);
            light.position.set(300, 300, 0);
            scene.add(light);
        }
    
        function initObject(objOptions) {
            var objGroup = new THREE.Group();//围墙

            for(var opt of objOptions.objs){
                var geometry = new THREE.CubeGeometry(objOptions.objSize.lenght, objOptions.objSize.width, objOptions.objSize.height);
                var material = new THREE.MeshPhongMaterial({ 
                    color: parseInt(opt.color) 
                });
                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(opt.position.x * objOptions.objSize.lenght, opt.position.y * objOptions.objSize.width, opt.position.z * objOptions.objSize.height);
                objGroup.add(mesh);
                // var edges = new THREE.EdgesHelper( mesh, 0x1535f7 );//设置边框，可以旋转
                // objGroup.add(edges);
                // console.log('edges',edges);
                // console.log("mesh.position",mesh.position);
            }
            scene.add(objGroup);
        }

        var minMapCamera;
        function initMinMap(){
            minMapCamera = new THREE.OrthographicCamera( window.innerWidth/-2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2,1,1000 );
            minMapCamera.position.x = 0;
            minMapCamera.position.z = 0;
            minMapCamera.position.y = 1000;
            minMapCamera.lookAt(0,0,0);
        }

        function initHelper(){
            let axesHelper = new THREE.AxesHelper(10);
            let cameraHelper = new THREE.CameraHelper(camera);
            // let lightHelper = new THREE.DirectionalLightHelper(0xffffff);
            scene.add(axesHelper);
            scene.add(cameraHelper);
            // this.scene.add(lightHelper);
        }
    
        function threeStart() {
            fetch('./options.json')
            .then((res) => res.json())
            .then((data) => {
                console.log('data:', data);
                init(data);
                initCamera(data);
                initScene();
                initLight(data);
                initObject(data.objOptions);

                initMinMap();

                initHelper();

                animation();
            })
        }
        function animation() {
            requestAnimationFrame(animation);

            // main scene
            renderer.setClearColor( 0x000000, 0 );
            renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
            // renderer will set this eventually
            // matLine.resolution.set( window.innerWidth, window.innerHeight ); // resolution of the viewport
            renderer.render(scene, camera);

           

            // inset scene
            var insetWidth = window.innerWidth / 6; // square
            var insetHeight = window.innerHeight / 6;

            renderer.setClearColor( 0x222222, 1 );
            renderer.clearDepth(); // important!
            renderer.setScissorTest( true );
            renderer.setScissor( 120, 120, insetWidth, insetHeight );
            renderer.setViewport( 120, 120, insetWidth, insetHeight );

            //min map 俯视,
            minMapCamera.position.x = 0;
            minMapCamera.position.z = 0;
            minMapCamera.position.y = 1000;
            minMapCamera.lookAt(0,0,0);
            // minMapCamera.position.set(camera.position.);
            // minMapCamera.quaternion.copy( camera.quaternion );
            // renderer will set this eventually
            // matLine.resolution.set( insetWidth, insetHeight ); // resolution of the inset viewport
            renderer.render( scene, minMapCamera );
            renderer.setScissorTest( false );

        }
    }

    /**
     * 开始Three
     *
     * @memberof ThreeBim
     */
    componentDidMount(){
        this.initThree();
        window.addEventListener("resize",()=>{
            //renderer
            debugger;
            this.initRenderer();

        });
    }


    render() {
        return (
            <div id='canvas-frame'>
            </div>
        );
    }
}

export default ThreeBim;


