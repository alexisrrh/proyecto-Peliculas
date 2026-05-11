import React from 'react';
import { useNavigate } from 'react-router-dom';

const Relax = () => {
  const navigate = useNavigate();

  const gameHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Relax Mode Game</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      <style>
        *, *:before, *:after { margin: 0; padding: 0; border: 0; }
        html, body { display: block; max-width: 100vw; min-height: 100vh; cursor: crosshair; }
        body {
          overflow: hidden; position: relative; background-color: black;
          background-image: url('https://raw.githubusercontent.com/rainner/codepen-assets/master/images/pinkish_sunset.jpg');
          background-position: center top; background-repeat: no-repeat; background-size: 170vh;
          font-family: 'Denk One', Arial, sans-serif; font-weight: normal; font-size: 18px; line-height: 1.2em; color: #f0f0f0;
        }
        #stageElement { display: block; position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: -1; }
        .player, .instructions { display: flex; position: fixed; flex-direction: row; align-items: center; justify-content: center; z-index: 100; pointer-events: none; }
        .player > .fa, .instructions > .fa { font-size: 320%; color: inherit; }
        .player > .content, .instructions > .content { margin-left: 1em; pointer-events: auto; }
        .player { left: 1em; bottom: 1em; }
        .player button { display: inline-block; background: none; border: 2px solid rgba(255,255,255,0.8); font: inherit; font-size: 80%; line-height: 1.2em; color: inherit; margin: 2px 0; padding: 2px 6px; border-radius: 4px; cursor: pointer; }
        .player button:hover { border-color: rgba(255,255,255,0.6); }
        .instructions { right: 1em; bottom: 1em; }
        
        /* ESTILOS DEL SCOREBOARD */
        #scoreBoard {
          position: fixed; top: 20px; right: 40px; z-index: 100;
          font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: bold;
          color: #0ff; text-shadow: 0 0 10px #0ff, 0 0 20px #d946ef;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div id="scoreBoard">SCORE: 0</div>

      <section class="player" id="player">
        <div class="fa fa-music"></div>
        <div class="content">
          Music Player <br /> Station: Underground 80s <br /> <button>Play music</button> 
        </div>
      </section>
      <section class="instructions">
        <div class="fa fa-mouse-pointer"></div>
        <div class="content">
          Apunta con el ratón. <br /> Scroll para acelerar. <br /> Clic para destruir. 
        </div>
      </section>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js"></script>
      
      <script>
        let startMusic = true; let cycleColor = false; let commonHue = 0.038; 
        let commonColor = new THREE.Color(); commonColor.setHSL( commonHue, .8, .5 );

        let currentScore = 0;
        const updateScore = (points) => {
          currentScore += points;
          document.getElementById('scoreBoard').innerText = 'SCORE: ' + currentScore;
        };

        const deviceInfo = (function(){
          const _w = window; const _s = window.screen; const _b = document.body; const _d = document.documentElement;
          return {
            screenWidth() { return Math.max( 0, _w.innerWidth || _d.clientWidth || _b.clientWidth || 0 ); },
            screenHeight() { return Math.max( 0, _w.innerHeight || _d.clientHeight || _b.clientHeight || 0 ); },
            screenRatio() { return this.screenWidth() / this.screenHeight(); },
            screenCenterX() { return this.screenWidth() / 2; },
            screenCenterY() { return this.screenHeight() / 2; },
            mouseX( e ) { return Math.max( 0, e.pageX || e.clientX || 0 ); },
            mouseY( e ) { return Math.max( 0, e.pageY || e.clientY || 0 ); },
            mouseCenterX( e ) { return this.mouseX( e ) - this.screenCenterX(); },
            mouseCenterY( e ) { return this.mouseY( e ) - this.screenCenterY(); },
          }; 
        })();

        const musicHelper = (function(){
          let wrap = document.querySelector( '#player' ); let button = wrap ? wrap.querySelector( 'button' ) : null; 
          let audio = new Audio( 'http://ice1.somafm.com/u80s-256-mp3' ); let sto = null; let active = false;
          let fadeIn = () => { audio.volume += 0.01; if ( audio.volume >= 0.2 ) { audio.volume = 0.2; return; } sto = setTimeout( fadeIn, 100 ); };
          let fadeOut = () => { audio.volume -= 0.02; if ( audio.volume <= 0.01 ) { audio.volume = 0; audio.pause(); return; } sto = setTimeout( fadeOut, 100 ); };
          let play = () => { if ( sto ) clearTimeout( sto ); active = true; button.textContent = 'Stop music'; audio.play().catch(e=>console.log(e)); fadeIn(); };
          let stop = () => { if ( sto ) clearTimeout( sto ); active = false; button.textContent = 'Play music'; fadeOut(); };
          button.addEventListener( 'click', e => { e.stopPropagation(); e.preventDefault(); if ( active ) { stop(); } else { play(); } });
          audio.preload = 'auto'; audio.muted = false; audio.volume = 0; return { play, stop };
        })();

        const LoaderHelper = {
          _base: 'https://raw.githubusercontent.com/rainner/codepen-assets/master/', _data: {}, _loaded: 0, _cb: null,
          get( key ) { return this._data[ key ] || null; }, 
          onReady( cb ) { this._cb = cb; }, 
          onError( err ) { console.error( err.message || err ); }, 
          onData( key, data ) {
            if ( key && data ) {
              this._loaded += 1; this._data[ key ] = data; 
              if ( this._loaded === 3 && typeof this._cb === 'function' ) this._cb(); 
            }
          }, 
          loadTexture( key, file ) {
            if ( !key || !file ) return; this._data[ key ] = new THREE.Texture(); 
            const loader = new THREE.TextureLoader();
            loader.load( this._base + file, data => { this.onData( key, data ) }, null, this.onError );
          },
        };

        const addEase = ( pos, to, ease ) => { pos.x += ( to.x - pos.x ) / ease; pos.y += ( to.y - pos.y ) / ease; pos.z += ( to.z - pos.z ) / ease; };

        // ASTEROIDES: Aparecen en todo el horizonte
        const asteroidsManager = {
          scene: null, asteroids: [], speed: 18, spawnRate: 0.04,
          geometry: new THREE.DodecahedronGeometry(25, 0),
          material: new THREE.MeshBasicMaterial({ color: 0xd946ef, wireframe: true, transparent: true, opacity: 0.8 }),
          create(scene) { this.scene = scene; },
          spawn() {
            let mesh = new THREE.Mesh(this.geometry, this.material);
            mesh.position.set( THREE.Math.randFloat(-2000, 2000), THREE.Math.randFloat(-800, 800), -4000 );
            mesh.rotation.set( Math.random(), Math.random(), Math.random() );
            mesh.userData = { rotX: THREE.Math.randFloat(-0.05, 0.05), rotY: THREE.Math.randFloat(-0.05, 0.05), rotZ: THREE.Math.randFloat(-0.05, 0.05) };
            this.asteroids.push(mesh); this.scene.add(mesh);
          },
          update() {
            if (Math.random() < this.spawnRate) this.spawn();
            for (let i = this.asteroids.length - 1; i >= 0; i--) {
              let ast = this.asteroids[i];
              ast.position.z += this.speed;
              ast.rotation.x += ast.userData.rotX; ast.rotation.y += ast.userData.rotY; ast.rotation.z += ast.userData.rotZ;
              if (ast.position.z > 500) { this.scene.remove(ast); this.asteroids.splice(i, 1); }
            }
          }
        };

        // EXPLOSIONES PARTICULARES
        const explosions = {
          scene: null, particles: [], geometry: new THREE.BoxGeometry(3, 3, 3), material: new THREE.MeshBasicMaterial({ color: 0x00ffff }),
          create(scene) { this.scene = scene; },
          spawn(pos) {
            for(let i=0; i<6; i++) {
              let p = new THREE.Mesh(this.geometry, this.material); p.position.copy(pos);
              p.userData = { vx: THREE.Math.randFloat(-8, 8), vy: THREE.Math.randFloat(-8, 8), vz: THREE.Math.randFloat(-8, 8), life: 30 };
              this.particles.push(p); this.scene.add(p);
            }
          },
          update() {
            for (let i = this.particles.length - 1; i >= 0; i--) {
              let p = this.particles[i];
              p.position.x += p.userData.vx; p.position.y += p.userData.vy; p.position.z += p.userData.vz;
              p.userData.life--;
              if (p.userData.life <= 0) { this.scene.remove(p); this.particles.splice(i, 1); }
            }
          }
        };

        const shootingStar = {
          scene: null, stars: [], spread: 1000, 
          create( scene ) {
            this.scene = scene; let geometry = new THREE.CylinderGeometry( 0, 2, 120, 10 );
            let material = new THREE.MeshBasicMaterial({ color: 0xffffcc, opacity: .4, blending: THREE.AdditiveBlending, transparent: true });
            let randx = THREE.Math.randInt( -this.spread, this.spread ); 
            let cylinder = new THREE.Mesh( geometry, material ); cylinder.position.set( randx, 300, 200 ); cylinder.rotation.set( Math.PI / 2, 0, 0 );
            this.stars.push( cylinder ); this.scene.add( cylinder ); 
          },
          update() {
            for ( let i = 0; i < this.stars.length; i++ ) {
              let cylinder = this.stars[ i ]; 
              if ( cylinder.position.z < -3000 ) { this.stars.splice( i, 1 ); this.scene.remove( cylinder ); continue; }
              cylinder.position.z -= 20; 
            }
          }
        };

        const starField = {
          group: null, total: 400, spread: 8000, ease: 12, move: { x: 0, y: 1200, z: -1000 }, look: { x: 0, y:0, z: 0 }, 
          create( scene ) {
            this.group = new THREE.Object3D(); this.group.position.set( this.move.x, this.move.y, this.move.z );
            let geometry = new THREE.Geometry();
            let material = new THREE.PointsMaterial({ size: 64, color: 0xffffff, map: LoaderHelper.get( 'starTexture' ), blending: THREE.AdditiveBlending, transparent: true });
            for ( let i = 0; i < this.total; i++ ) {
              let angle = ( Math.random() * Math.PI * 2 ); let radius = THREE.Math.randInt( 0, this.spread );
              geometry.vertices.push( new THREE.Vector3( Math.cos( angle ) * radius, Math.sin( angle ) * radius / 10, THREE.Math.randInt( -this.spread, 0 ) ) );
            }
            this.group.add( new THREE.Points( geometry, material ) ); scene.add( this.group );
          }, 
          update( mouse ) { this.move.x = -( mouse.x * 0.005 ); addEase( this.group.position, this.move, this.ease ); }
        }; 

        const mountains = {
          group: null, simplex: null, geometry: null, factor: 1000, scale: 500, speed: 0.0005, cycle: 0, ease: 18, move: { x: 0, y: 0, z: -3500 }, look: { x: 0, y: 0, z: 0 }, 
          create( scene ) {
            this.group = new THREE.Object3D(); this.group.position.set( this.move.x, this.move.y, this.move.z );
            this.simplex = new SimplexNoise(); this.geometry = new THREE.PlaneGeometry( 10000, 1000, 128, 32 ); 
            let texture = LoaderHelper.get( 'mountainTexture' ); texture.wrapT = THREE.RepeatWrapping; texture.wrapS = THREE.RepeatWrapping;
            let material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture, side: THREE.BackSide });
            let terrain = new THREE.Mesh( this.geometry, material ); terrain.position.set( 0, -500, -3000 ); terrain.rotation.x = ( Math.PI / 2 ) + 1.35;
            let light = new THREE.PointLight( 0xffffff, 8, 5500 ); light.position.set( 0, 1200, -3500 ); light.color = commonColor;
            this.movePlain(); this.group.add( terrain ); this.group.add( light ); scene.add( this.group );
          }, 
          movePlain() {
            for ( let vertex of this.geometry.vertices ) {
              let xoff = ( vertex.x / this.factor ); let yoff = ( vertex.y / this.factor ) + this.cycle; 
              vertex.z = this.simplex.noise2D( xoff, yoff ) * this.scale;
            }
            this.geometry.verticesNeedUpdate = true; this.cycle -= this.speed;
          }, 
          update( mouse ) { this.move.x = -( mouse.x * 0.02 ); this.movePlain(); addEase( this.group.position, this.move, this.ease ); }
        };

        const groundPlain = {
          group: null, geometry: null, simplex: null, factor: 300, scale: 30, speed: 0.015, cycle: 0, ease: 12, move: { x: 0, y: -300, z: -1000 }, look: { x: 29.8, y: 0, z: 0 }, 
          create( scene ) {
            this.group = new THREE.Object3D(); this.group.position.set( this.move.x, this.move.y, this.move.z ); this.group.rotation.set( this.look.x, this.look.y, this.look.z );
            this.geometry = new THREE.PlaneGeometry( 4000, 2000, 128, 64 ); 
            let material = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: true });
            let plane = new THREE.Mesh( this.geometry, material ); this.simplex = new SimplexNoise(); this.moveNoise();
            this.group.add( plane ); scene.add( this.group );
          }, 
          moveNoise() {
            for ( let vertex of this.geometry.vertices ) {
              let xoff = ( vertex.x / this.factor ); let yoff = ( vertex.y / this.factor ) + this.cycle; 
              vertex.z = this.simplex.noise2D( xoff, yoff ) * this.scale;
            }
            this.geometry.verticesNeedUpdate = true; this.cycle += this.speed;
          }, 
          update( mouse ) { this.moveNoise(); this.move.x = -( mouse.x * 0.04 ); addEase( this.group.position, this.move, this.ease ); }
        };

        // NAVE PRINCIPAL Y SISTEMA DE APUNTADO
        const gunShip = {
          scene: null, group: null, engineTexture: null, shots: [], toggleCannon: false, ease: 8, 
          move: { x: 0, y: 0, z: -40 }, look: { x: 0, y: 0, z: 0 }, 
          aimDirection: new THREE.Vector3(0, 0, -1),
          
          create( scene ) {
            this.scene = scene; this.group = new THREE.Object3D(); this.group.position.set( this.move.x, this.move.y, this.move.z );
            let light = new THREE.PointLight( 0xffffff, .4, 600 ); light.position.set( 0, 0, 600 ); this.group.add( light ); 
            this.setupShip2(); this.setupEngine(); scene.add( this.group ); 
          },
          setupShip2() {
            let material = new THREE.MeshBasicMaterial({ color: 0x0099ff, blending: THREE.AdditiveBlending, transparent: true });
            let cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 0, .4, 8, 32, 32, true ), material );
            cylinder.position.set( 0, .4, 307 ); cylinder.rotation.x = Math.PI / 2; this.group.add( cylinder ); 
          },
          setupEngine() {
            this.engineTexture = LoaderHelper.get( 'engineTexture' ); this.engineTexture.wrapT = THREE.RepeatWrapping; this.engineTexture.wrapS = THREE.RepeatWrapping;
            let material = new THREE.MeshBasicMaterial({ color: 0x0099ff, alphaMap: this.engineTexture, blending: THREE.AdditiveBlending, transparent: true });
            let cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 0, .4, 8, 32, 32, true ), material );
            cylinder.position.set( 0, .4, 307 ); cylinder.rotation.x = Math.PI / 2; this.group.add( cylinder ); 
          }, 
          updateEngine() { this.engineTexture.offset.y -= 0.06; this.engineTexture.needsUpdate = true; }, 
          onScroll( e ) {
            let z = this.move.z; let d = z + ( e.deltaY | 0 ); d = ( d < -130 ) ? -130 : d; d = ( d > -30 ) ? -30 : d; this.move.z = d;
          }, 
          onClick( e ) {
            let color = new THREE.Color(); color.setHSL( Math.random(), 1, .5 );
            
            // Alternar Cañones
            this.toggleCannon = !this.toggleCannon;
            let offsetX = this.toggleCannon ? 6 : -6;

            let cylinder = new THREE.Mesh( 
              new THREE.CylinderGeometry( 0.6, 0.6, 40, 8 ), 
              new THREE.MeshBasicMaterial({ color, opacity: .8, blending: THREE.AdditiveBlending, transparent: true }) 
            );
            
            // Spawn del disparo exactamente en la nave
            let spawnPos = new THREE.Vector3(this.group.position.x + offsetX, this.group.position.y, this.group.position.z + 307);
            cylinder.position.copy(spawnPos);

            // Alinear físicamente el láser hacia donde estamos apuntando
            let dir = this.aimDirection.clone();
            cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

            // Darle velocidad hacia ese punto (Z es negativo hacia el fondo)
            let speed = 60; 
            cylinder.userData = {
              vx: dir.x * speed,
              vy: dir.y * speed,
              vz: dir.z * speed
            };

            this.shots.push( cylinder ); this.scene.add( cylinder ); 
          }, 
          updateShots() {
            for ( let i = this.shots.length - 1; i >= 0; i-- ) {
              let cylinder = this.shots[ i ]; 
              if ( cylinder.position.z < -4000 ) { this.shots.splice( i, 1 ); this.scene.remove( cylinder ); continue; }
              
              // El láser viaja siguiendo el rayo hacia el horizonte
              cylinder.position.x += cylinder.userData.vx;
              cylinder.position.y += cylinder.userData.vy;
              cylinder.position.z += cylinder.userData.vz;
            }
          }, 
          update( mouse, camera ) {
            // Mapeo exacto 1:1 del cursor (Normalización -1 a 1)
            let ndcX = mouse.x / deviceInfo.screenCenterX();
            let ndcY = -(mouse.y / deviceInfo.screenCenterY());
            
            // Calcular el rayo proyectado desde la cámara a través del ratón
            let vec = new THREE.Vector3(ndcX, ndcY, 0.5);
            vec.unproject(camera);
            vec.sub(camera.position).normalize();
            
            // Guardar esta dirección porque los lásers deben viajar por aquí
            this.aimDirection = vec.clone();
            
            // Calcular las coordenadas exactas X e Y a la profundidad de la nave
            let distance = ((this.move.z + 307) - camera.position.z) / vec.z;
            let targetPos = camera.position.clone().add(vec.multiplyScalar(distance));
            
            // Actualizar objetivo de movimiento
            this.move.x = targetPos.x;
            this.move.y = targetPos.y;
            
            // Inclinación estética basada en la posición
            this.look.x = ndcY * 0.15; 
            this.look.y = -ndcX * 0.15; 
            this.look.z = -ndcX * 0.25;

            this.updateShots(); this.updateEngine();
            addEase( this.group.position, this.move, this.ease ); addEase( this.group.rotation, this.look, this.ease );
          }
        };

        const checkCollisions = () => {
          for (let i = gunShip.shots.length - 1; i >= 0; i--) {
            let shot = gunShip.shots[i];
            for (let j = asteroidsManager.asteroids.length - 1; j >= 0; j--) {
              let ast = asteroidsManager.asteroids[j];
              
              // Si están lo suficientemente cerca (colisión 3D real)
              if (shot.position.distanceTo(ast.position) < 40) {
                explosions.spawn(ast.position); // BOOM
                asteroidsManager.scene.remove(ast); asteroidsManager.asteroids.splice(j, 1);
                gunShip.scene.remove(shot); gunShip.shots.splice(i, 1);
                updateScore(10);
                break; 
              }
            }
          }
        };

        const setupScene = () => {
          const scene = new THREE.Scene();
          let mouse = { x: deviceInfo.screenCenterX(), y: deviceInfo.screenCenterY() };  
          
          const renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true, precision: 'mediump' } );
          renderer.setSize( deviceInfo.screenWidth(), deviceInfo.screenHeight() ); renderer.setPixelRatio( window.devicePixelRatio );
          renderer.domElement.setAttribute( 'id', 'stageElement' ); document.body.appendChild( renderer.domElement );

          const camera = new THREE.PerspectiveCamera( 60, deviceInfo.screenRatio(), 0.1, 20000 );
          camera.position.set( 0, 0, 300 ); camera.lookAt( scene.position );
          
          const light = new THREE.PointLight( 0xffffff, 4, 1000 ); light.position.set( 0, 200, -500 ); light.color = commonColor; scene.add( light ); 
          
          starField.create( scene ); mountains.create( scene ); groundPlain.create( scene ); gunShip.create( scene ); asteroidsManager.create( scene ); explosions.create( scene );
          
          window.addEventListener( 'resize', e => { camera.aspect = deviceInfo.screenRatio(); camera.updateProjectionMatrix(); renderer.setSize( deviceInfo.screenWidth(), deviceInfo.screenHeight() ); });
          window.addEventListener( 'mousemove', e => { mouse.x = deviceInfo.mouseCenterX( e ); mouse.y = deviceInfo.mouseCenterY( e ); });
          window.addEventListener( 'wheel', e => { gunShip.onScroll( e ); });
          window.addEventListener( 'click', e => { gunShip.onClick( e ); });
          
          const loop = () => {
            requestAnimationFrame( loop ); 
            if ( Math.random() > 0.99 ) shootingStar.create( scene );
            if ( cycleColor ) { commonHue += 0.001; if ( commonHue >= 1 ) commonHue = 0; commonColor.setHSL( commonHue, .8, .5 ); }
            
            shootingStar.update( mouse ); starField.update( mouse ); mountains.update( mouse ); groundPlain.update( mouse ); 
            gunShip.update( mouse, camera ); // Se inyecta la cámara para los cálculos de apuntado
            asteroidsManager.update(); explosions.update();
            checkCollisions();

            renderer.render( scene, camera );
          };
          loop();
        };

        LoaderHelper.onReady( setupScene );
        LoaderHelper.loadTexture( 'starTexture', 'images/star.png' ); 
        LoaderHelper.loadTexture( 'mountainTexture', 'images/terrain2.jpg' ); 
        LoaderHelper.loadTexture( 'engineTexture', 'images/water.jpg' ); 
      </script>
    </body>
    </html>
  `;

  return (
    <div className="relative w-full h-screen bg-black">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 bg-black/50 border border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-white px-4 py-2 font-mono uppercase font-bold transition-all shadow-[0_0_10px_rgba(217,70,239,0.5)] cursor-pointer"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> Volver a VHSFLIX
      </button>

      <iframe 
        title="Relax Mode Game"
        srcDoc={gameHTML}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </div>
  );
};

export default Relax;