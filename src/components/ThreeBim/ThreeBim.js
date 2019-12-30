import React from 'react';
import * as THREE from 'three';
import wallTexture from '../../resources/imgs/textures/wall.jpg'

class ThreeBim extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options: null,
            renderer: null,
            width: null,
            height: null,
            camera: null,
            scene: null,
            light: null,
            minMapCamera: null,
            keyEventListener: true
        };
    }


    init(options) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        if(this.state.renderer === null){
            var renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            
            renderer.setSize(width, height);
            renderer.setClearColor(0x000000, 1.0);
            this.setState((state) => ({
                width: width,
                height: height,
                renderer: renderer
            }));
            document.getElementById('canvas-frame').appendChild(this.state.renderer.domElement);
            
        }else{
            var renderer = this.state.renderer;
            renderer.setSize(width, height);
            this.setState((state) => ({
                width: width,
                height: height,
                renderer: renderer
            }));
        }

        // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
        // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
        // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        var camera = this.state.camera;
        if(camera){
            camera.aspect = window.innerWidth/window.innerHeight;
            camera.updateProjectionMatrix ();
            this.setState((state) => ({
                camera: camera
            }));
        }

        var minMapCameraOption = this.state.options.cameraOptions.minMapCamera;
        var minMapCamera = this.state.minMapCamera;
        if(minMapCamera){
            minMapCamera.left = window.innerWidth / minMapCameraOption.left;
            minMapCamera.right = window.innerWidth / minMapCameraOption.right;
            minMapCamera.top = window.innerHeight / minMapCameraOption.top;
            minMapCamera.bottom = window.innerHeight / minMapCameraOption.bottom;
            minMapCamera.updateProjectionMatrix ();
            this.setState((state) => ({
                minMapCamera: minMapCamera
            }));
        }
        
       
    }


    initCamera(options) {
        var camera = new THREE.PerspectiveCamera(45, this.state.width / this.state.height, 1, 10000);
        camera.position.set(0, 20, 0);
        camera.up.set(0, 1, 0);//正视

        this.setState((state) => ({
            camera: camera
        }));
    }

    initScene() {
        this.setState((state) => ({
            scene: new THREE.Scene()
        }));
    }

    initLight(options) {
        var light = new THREE.AmbientLight(0xFFFFFF);
        light.position.set(300, 300, 0);
        var scene = this.state.scene;
        scene.add(light);
        this.setState((state) => ({
            light: light,
            scene: scene
        }));
    }

    initObject(objOptions) {
        var objGroup = new THREE.Group();//围墙

        // for (var opt of objOptions.objs) {
        //     var geometry = new THREE.CubeGeometry(objOptions.objSize.lenght, objOptions.objSize.width, objOptions.objSize.height);
        //     var material = new THREE.MeshPhongMaterial({
        //         color: parseInt(opt.color)
        //     });
        //     var mesh = new THREE.Mesh(geometry, material);
        //     mesh.position.set(opt.position.x * objOptions.objSize.lenght, opt.position.y * objOptions.objSize.width, opt.position.z * objOptions.objSize.height);
        //     objGroup.add(mesh);
        //     // var edges = new THREE.EdgesHelper( mesh, 0x1535f7 );//设置边框，可以旋转
        //     // objGroup.add(edges);
        //     // console.log('edges',edges);
        //     // console.log("mesh.position",mesh.position);
        // }
        var wall = objOptions.wall;
        // var material = new THREE.MeshPhongMaterial({
        //     color: parseInt(wall.color)
        // });
        var materialArr = [];
        for (let i = 0; i < 6; i++){
            materialArr.push( new THREE.MeshBasicMaterial({
                 map: new THREE.TextureLoader().load( wallTexture )//将图片纹理贴上
            }));
         }
        for(var h = wall.height; h >= 0; h--){
            for(var i = -wall.width / 2;i <= wall.width / 2  ; i++){
                var geometry = new THREE.CubeGeometry(objOptions.objSize.lenght, objOptions.objSize.width, objOptions.objSize.height);
                var mesh1 = new THREE.Mesh(geometry, materialArr);
                mesh1.position.set(i * objOptions.objSize.lenght, objOptions.objSize.height * h, wall.width / 2 * objOptions.objSize.height);
                objGroup.add(mesh1);
                var mesh2 = new THREE.Mesh(geometry, materialArr);
                mesh2.position.set(i * objOptions.objSize.lenght, objOptions.objSize.height * h, -wall.width / 2 * objOptions.objSize.height);
                objGroup.add(mesh2);
                var mesh3 = new THREE.Mesh(geometry, materialArr);
                mesh3.position.set(wall.width / 2 * objOptions.objSize.height, objOptions.objSize.height * h, i * objOptions.objSize.lenght);
                objGroup.add(mesh3);
                var mesh4 = new THREE.Mesh(geometry, materialArr);
                mesh4.position.set(-wall.width / 2 * objOptions.objSize.height, objOptions.objSize.height * h, i * objOptions.objSize.lenght);
                objGroup.add(mesh4);
            }
        }
        
        var scene = this.state.scene;
        scene.add(objGroup);
        // this.state.scene.add(objGroup);
        this.setState({
            scene:scene
        });
    }

    initMinMap() {
        var minMapCameraOption = this.state.options.cameraOptions.minMapCamera;
        var minMapCamera =  new THREE.OrthographicCamera(
            window.innerWidth / minMapCameraOption.left, 
            window.innerWidth / minMapCameraOption.right, 
            window.innerHeight / minMapCameraOption.top, 
            window.innerHeight / minMapCameraOption.bottom, 
            1, 1000);
        minMapCamera.position.x = 0;
        minMapCamera.position.z = 0;
        minMapCamera.position.y = 1000;
        // minMapCamera.up.set(0, 0, 1);
        minMapCamera.lookAt(0,0,0);

        this.setState((state) => ({
            minMapCamera: minMapCamera
        }));
    }

    initHelper() {
        let axesHelper = new THREE.AxesHelper(10);
        let cameraHelper = new THREE.CameraHelper(this.state.camera);
        // let lightHelper = new THREE.DirectionalLightHelper(0xffffff);
        var scene = this.state.scene;
        scene.add(axesHelper);
        scene.add(cameraHelper);
        // this.scene.add(lightHelper);

        this.setState({
            scene: scene
        });
    }

    animation() {

        const animate = timestamp => {
            // main scene
            this.state.renderer.setClearColor(0x000000, 0);
            this.state.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
            // renderer will set this eventually
            // matLine.resolution.set( window.innerWidth, window.innerHeight ); // resolution of the viewport
            this.state.renderer.render(this.state.scene, this.state.camera);

            // inset scene
            var insetWidth = window.innerWidth / 6; // square
            var insetHeight = window.innerHeight / 6;

            this.state.renderer.setClearColor(0x222222, 1);
            this.state.renderer.clearDepth(); // important!
            this.state.renderer.setScissorTest(true);
            this.state.renderer.setScissor(120, 120, insetWidth, insetHeight);
            this.state.renderer.setViewport(120, 120, insetWidth, insetHeight);

            //min map 俯视,
            var minMapCamera = this.state.minMapCamera;

            // minMapCamera.position.x = 0;
            // minMapCamera.position.z = 0;
            // minMapCamera.position.y = 1000;
            // minMapCamera.up.set(0, 0, 1);
            // this.setState({
            //     minMapCamera: minMapCamera
            // });
            // minMapCamera.position.set(camera.position.);
            // minMapCamera.quaternion.copy( camera.quaternion );
            // renderer will set this eventually
            // matLine.resolution.set( insetWidth, insetHeight ); // resolution of the inset viewport
            // this.state.renderer.render(this.state.scene, this.state.minMapCamera);
            this.state.renderer.render(this.state.scene, minMapCamera);

            // console.log("minMapCamera:",minMapCamera.position);

            this.state.renderer.setScissorTest(false);
            window.requestAnimationFrame(animate);
        };
        window.requestAnimationFrame(animate);
    }


    initThree() {
        var that = this;
        fetch('./options.json')
            .then((res) => res.json())
            .then((data) => {
                console.log('data:', data);
                that.setState({
                    options:data
                });


                that.init(data);
                that.initCamera(data);
                that.initScene();
                that.initLight(data);
                that.initObject(data.objOptions);

                that.initMinMap();

                that.initHelper();

                that.animation();
            });
    }

    /**
     * 前进
     */
    go(){
        var camera = this.state.camera;
        var minMapCamera = this.state.minMapCamera;
        var cubeSize = this.state.options.objOptions.objSize;
        camera.position.z = camera.position.z - cubeSize.width;
        minMapCamera.position.z = minMapCamera.position.z - cubeSize.width;
        this.setState({
            camera: camera,
            minMapCamera: minMapCamera
        });
    }

    /**
     * 开始Three
     *
     * @memberof ThreeBim
     */
    componentDidMount() {
        this.initThree();
        window.addEventListener("resize", () => {
            //renderer
            // debugger;
            this.init();
        });
        window.addEventListener("keyup", (e) => {
            if(this.state.keyEventListener){
                this.setState({
                    keyEventListener: false
                });
                switch(e.key){
                    case "ArrowUp":
                        this.go();
                        break;
                    case "ArrowLeft":
                        break;
                    case "ArrowDown":
                        break;
                    case "ArrowRight":
                        break;
                    default:
                        console.log('case default');
                }
                this.setState({
                    keyEventListener: true
                });
            }
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


