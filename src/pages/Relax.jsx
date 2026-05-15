import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Relax = () => {
  const navigate = useNavigate();

  const [gameKey, setGameKey] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  // =========================================================
  // LÓGICA DE BASE DE DATOS (API / LOCALSTORAGE)
  // =========================================================
  const fetchLeaderboard = async () => {
    try {
      const savedScores = localStorage.getItem('vhsflix_arcade_scores');
      if (savedScores) setLeaderboard(JSON.parse(savedScores));
    } catch (error) {
      console.error("Error al cargar la base de datos:", error);
    }
  };

  const saveToDatabase = async (newScore) => {
    try {
      const updatedLeaderboard = [...leaderboard, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
        
      setLeaderboard(updatedLeaderboard);
      localStorage.setItem('vhsflix_arcade_scores', JSON.stringify(updatedLeaderboard));
    } catch (error) {
      console.error("Error al guardar en la base de datos:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [gameKey]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'GAME_OVER') {
        setIsGameOver(true);
      } 
      else if (event.data.type === 'SAVE_SCORE') {
        const newScore = {
          initials: event.data.initials.toUpperCase(),
          score: event.data.score
        };
        saveToDatabase(newScore);
      }
      else if (event.data.type === 'RESTART') {
        setIsGameOver(false);
        setGameKey(prev => prev + 1);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [leaderboard]);

  const gameHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relax Mode Game</title>
      <style>
        *, *:before, *:after { margin: 0; padding: 0; border: 0; box-sizing: border-box; }
        
        /* BLOQUEAR SELECCIÓN DE TEXTO */
        html, body { 
          display: block; width: 100vw; height: 100vh; cursor: crosshair; 
          user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;
        }
        
        body {
          overflow: hidden; position: relative; background-color: black;
          background-image: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.85)), url('https://raw.githubusercontent.com/rainner/codepen-assets/master/images/pinkish_sunset.jpg');
          background-position: center top; background-repeat: no-repeat; background-size: cover;
          font-family: 'Courier New', Courier, monospace;
        }
        
        #stageElement { display: block; position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: -1; }
        
        #uiLayer {
          position: fixed; top: 20px; left: 0; width: 100%; display: flex; justify-content: space-between;
          padding: 0 5%; z-index: 100; pointer-events: none;
        }
        .arcade-text { font-size: clamp(20px, 4vw, 36px); font-weight: bold; color: #0ff; text-shadow: 0 0 10px #0ff, 0 0 20px #d946ef; }
        #timerBoard { color: #f0f; text-shadow: 0 0 10px #f0f, 0 0 20px #0ff; transition: color 0.3s, text-shadow 0.3s; }

        /* PANTALLA GAME OVER ADAPTATIVA */
        #gameOverScreen {
          display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 1000;
          flex-direction: column; align-items: center; justify-content: center;
          backdrop-filter: blur(5px); padding-right: 0;
        }
        @media (min-width: 1024px) { #gameOverScreen { padding-right: 400px; } }

        .go-title { font-size: clamp(40px, 8vw, 70px); color: #f0f; text-shadow: 0 0 20px #f0f; margin-bottom: 20px; animation: blink 1s infinite; font-weight: 900;}
        .go-score { font-size: clamp(25px, 5vw, 40px); color: #0ff; margin-bottom: 10px; font-weight: bold; text-align: center;}
        .go-stats { font-size: clamp(18px, 3vw, 24px); color: #fff; margin-bottom: 40px; font-weight: bold; text-align: center;}
        
        .input-group { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: center;}
        #initials {
          background: transparent; border: 3px solid #0ff; color: #fff; font-size: clamp(30px, 5vw, 40px); font-family: 'Courier New', monospace;
          width: 120px; text-align: center; text-transform: uppercase; outline: none; letter-spacing: 10px; box-shadow: 0 0 15px #0ff; font-weight: bold;
        }
        .arcade-btn {
          background: #f0f; color: #fff; border: 3px solid #fff; font-size: clamp(20px, 4vw, 30px); font-family: 'Courier New', monospace; font-weight: bold;
          padding: 5px 20px; cursor: pointer; text-transform: uppercase; box-shadow: 0 0 15px #f0f; transition: 0.2s;
        }
        .arcade-btn:hover { background: #0ff; box-shadow: 0 0 20px #0ff; transform: scale(1.05); }
        .restart-btn { background: #0ff; box-shadow: 0 0 15px #0ff; margin-top: 30px; display: none; }
        .restart-btn:hover { background: #f0f; box-shadow: 0 0 20px #f0f; }
        
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      </style>
    </head>
    <body>
      <div id="uiLayer">
        <div id="timerBoard" class="arcade-text">TIME: 50</div>
        <div id="scoreBoard" class="arcade-text">SCORE: 0</div>
      </div>

      <div id="gameOverScreen">
        <div class="go-title">TIME OVER</div>
        <div class="go-score">FINAL SCORE: <br><span id="finalScoreVal" style="font-size: 1.5em; color: #ffd700;"></span></div>
        <div class="go-stats">BULLETS FIRED: <span id="finalShotsVal" style="color: #f0f;"></span></div>
        
        <div class="input-group" id="inputSection">
          <input type="text" id="initials" maxlength="3" placeholder="AAA" oninput="this.value = this.value.toUpperCase().replace(/[^A-Z]/g, '')" autocomplete="off" />
          <button id="saveBtn" class="arcade-btn" onclick="submitScore()">SAVE</button>
        </div>
        
        <div id="savedMsg" style="display:none; color:#0ff; font-size:clamp(25px, 5vw, 35px); margin-top:20px; font-weight: bold;">SCORE SAVED!</div>
        <button id="restartBtn" class="arcade-btn restart-btn" onclick="restartGame()">PLAY AGAIN</button>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js"></script>
      
      <script>
        let gameActive = true;
        let timeLeft = 50;
        let currentScore = 0;
        let totalShots = 0; 
        
        const updateScore = (points) => {
          if(!gameActive) return;
          currentScore += points;
          document.getElementById('scoreBoard').innerText = 'SCORE: ' + currentScore;
        };

        const timerInterval = setInterval(() => {
          if (!gameActive) return;
          timeLeft--;
          document.getElementById('timerBoard').innerText = 'TIME: ' + timeLeft;
          if (timeLeft <= 0) endGame();
        }, 1000);

        function endGame() {
          gameActive = false;
          clearInterval(timerInterval);
          document.getElementById('gameOverScreen').style.display = 'flex';
          document.getElementById('finalScoreVal').innerText = currentScore;
          document.getElementById('finalShotsVal').innerText = totalShots;
          window.parent.postMessage({ type: 'GAME_OVER' }, '*');
        }

        window.submitScore = function() {
          let initials = document.getElementById('initials').value;
          if(initials.length !== 3) {
            alert('¡Ingresa 3 letras exactas!');
            return;
          }
          window.parent.postMessage({ type: 'SAVE_SCORE', initials: initials, score: currentScore }, '*');
          
          document.getElementById('inputSection').style.display = 'none';
          document.getElementById('savedMsg').style.display = 'block';
          document.getElementById('restartBtn').style.display = 'block';
        };

        window.restartGame = function() {
          window.parent.postMessage({ type: 'RESTART' }, '*');
        };

        let commonHue = 0.038; 
        let commonColor = new THREE.Color(); commonColor.setHSL( commonHue, .8, .5 );

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

        const addEase = ( pos, to, ease ) => { pos.x += ( to.x - pos.x ) / ease; pos.y += ( to.y - pos.y ) / ease; pos.z += ( to.z - pos.z ) / ease; };

        // MATERIALES DE ASTEROIDES
        const mat10 = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true, transparent: true, opacity: 1 }); // Fucsia (Normal)
        const mat20 = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 1 }); // Cyan
        const mat30 = new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true, transparent: true, opacity: 1 }); // Dorado
        const matTime = new THREE.MeshBasicMaterial({ color: 0x39ff14, wireframe: true, transparent: true, opacity: 1 }); // Verde Neón (Reloj)

        const asteroidsManager = {
          scene: null, asteroids: [], 
          baseSpeed: 18, 
          spawnRate: 0.1, 
          geometry: new THREE.DodecahedronGeometry(25, 0),
          geoTime: new THREE.OctahedronGeometry(22, 0), 
          
          create(scene) { this.scene = scene; },
          spawn() {
            let roll = Math.random();
            let mat, pts, type, spdMult;

            // DISTRIBUCIÓN DE PROBABILIDADES AJUSTADA
            if (roll < 0.015) { 
              // 1.5% Reloj de arena (SÚPER RARO)
              mat = matTime; pts = 0; type = 'time'; spdMult = 1.3; 
            } else if (roll < 0.365) { 
              // 35% Normal (Fucsia)
              mat = mat10; pts = 10; type = 'normal'; spdMult = 1.0; 
            } else if (roll < 0.765) { 
              // 40% Cyan (Doble)
              mat = mat20; pts = 20; type = 'cyan'; spdMult = 1.3; 
            } else { 
              // 23.5% Dorado (Triple)
              mat = mat30; pts = 30; type = 'gold'; spdMult = 1.5; 
            } 

            let geo = (type === 'time') ? this.geoTime : this.geometry;
            let mesh = new THREE.Mesh(geo, mat);
            mesh.position.set( THREE.Math.randFloat(-2000, 2000), THREE.Math.randFloat(-800, 800), -4000 );
            mesh.rotation.set( Math.random(), Math.random(), Math.random() );
            
            mesh.userData = { 
              rotX: THREE.Math.randFloat(-0.05, 0.05), rotY: THREE.Math.randFloat(-0.05, 0.05), rotZ: THREE.Math.randFloat(-0.05, 0.05), 
              points: pts, type: type, speed: this.baseSpeed * spdMult, color: mat.color
            };
            
            this.asteroids.push(mesh); this.scene.add(mesh);
          },
          update() {
            if (Math.random() < this.spawnRate) this.spawn();
            for (let i = this.asteroids.length - 1; i >= 0; i--) {
              let ast = this.asteroids[i];
              ast.position.z += ast.userData.speed; 
              ast.rotation.x += ast.userData.rotX; ast.rotation.y += ast.userData.rotY; ast.rotation.z += ast.userData.rotZ;
              if (ast.position.z > 500) { this.scene.remove(ast); this.asteroids.splice(i, 1); }
            }
          }
        };

        const explosions = {
          scene: null, particles: [], geometry: new THREE.BoxGeometry(3, 3, 3),
          create(scene) { this.scene = scene; },
          spawn(pos, colorHex) {
            let mat = new THREE.MeshBasicMaterial({ color: colorHex });
            for(let i=0; i<8; i++) {
              let p = new THREE.Mesh(this.geometry, mat); p.position.copy(pos);
              p.userData = { vx: THREE.Math.randFloat(-10, 10), vy: THREE.Math.randFloat(-10, 10), vz: THREE.Math.randFloat(-10, 10), life: 30 };
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

        // SUELO ASTRAL DINÁMICO
        const groundPlain = {
          group: null, geometry: null, simplex: null, factor: 300, scale: 30, speed: 0.015, cycle: 0, ease: 12, 
          move: { x: 0, y: -300, z: -1000 }, look: { x: 29.8, y: 0, z: 0 }, 
          targetHue: Math.random(), currentHue: Math.random(), material: null,
          
          create( scene ) {
            this.group = new THREE.Object3D(); this.group.position.set( this.move.x, this.move.y, this.move.z ); this.group.rotation.set( this.look.x, this.look.y, this.look.z );
            this.geometry = new THREE.PlaneGeometry( 4000, 2000, 128, 64 ); 
            
            // Material luminoso y brillante
            this.material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.6 });
            this.material.color.setHSL(this.currentHue, 1, 0.6);
            
            let plane = new THREE.Mesh( this.geometry, this.material ); this.simplex = new SimplexNoise(); this.moveNoise();
            this.group.add( plane ); scene.add( this.group );

            // CAMBIA EL COLOR OBJETIVO CADA 10 SEGUNDOS
            setInterval(() => {
              if(gameActive) this.targetHue = Math.random();
            }, 10000);
          }, 
          moveNoise() {
            for ( let vertex of this.geometry.vertices ) {
              let xoff = ( vertex.x / this.factor ); let yoff = ( vertex.y / this.factor ) + this.cycle; 
              vertex.z = this.simplex.noise2D( xoff, yoff ) * this.scale;
            }
            this.geometry.verticesNeedUpdate = true; this.cycle += this.speed;
          }, 
          update( mouse ) { 
            // INTERPOLACIÓN SUAVE DEL COLOR DEL SUELO
            this.currentHue += (this.targetHue - this.currentHue) * 0.02;
            this.material.color.setHSL(this.currentHue, 1, 0.6);
            
            this.moveNoise(); this.move.x = -( mouse.x * 0.04 ); addEase( this.group.position, this.move, this.ease ); 
          }
        };

        const gunShip = {
          scene: null, group: null, shots: [], toggleCannon: false, ease: 8, 
          move: { x: 0, y: 0, z: -40 }, look: { x: 0, y: 0, z: 0 }, aimDirection: new THREE.Vector3(0, 0, -1),
          create( scene ) {
            this.scene = scene; this.group = new THREE.Object3D(); this.group.position.set( this.move.x, this.move.y, this.move.z );
            this.setupShip2(); scene.add( this.group ); 
          },
          setupShip2() {
            let material = new THREE.MeshBasicMaterial({ color: 0x0099ff, blending: THREE.AdditiveBlending, transparent: true });
            let cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 0, .4, 8, 32, 32, true ), material );
            cylinder.position.set( 0, .4, 307 ); cylinder.rotation.x = Math.PI / 2; this.group.add( cylinder ); 
          },
          onScroll( e ) {
            if(!gameActive) return;
            let z = this.move.z; let d = z + ( e.deltaY | 0 ); d = ( d < -130 ) ? -130 : d; d = ( d > -30 ) ? -30 : d; this.move.z = d;
          }, 
          onClick( e ) {
            if(!gameActive) return;
            totalShots++; 
            
            let color = new THREE.Color(); color.setHSL( Math.random(), 1, 0.7 ); // Colores más saturados y brillantes
            this.toggleCannon = !this.toggleCannon; 
            let offsetX = this.toggleCannon ? 3 : -3; 
            
            // LÁSER SÚPER GRUESO, LARGO Y TOTALMENTE VISIBLE
            let cylinder = new THREE.Mesh( 
              new THREE.CylinderGeometry( 3, 3, 100, 8 ), 
              new THREE.MeshBasicMaterial({ color, opacity: 1, blending: THREE.AdditiveBlending, transparent: true }) 
            );
            
            let spawnPos = new THREE.Vector3(this.group.position.x + offsetX, this.group.position.y, this.group.position.z + 307);
            cylinder.position.copy(spawnPos);
            let dir = this.aimDirection.clone();
            cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
            
            let speed = 250; 
            cylinder.userData = { vx: dir.x * speed, vy: dir.y * speed, vz: dir.z * speed };
            this.shots.push( cylinder ); this.scene.add( cylinder ); 
          }, 
          updateShots() {
            for ( let i = this.shots.length - 1; i >= 0; i-- ) {
              let cylinder = this.shots[ i ]; 
              if ( cylinder.position.z < -4000 ) { this.shots.splice( i, 1 ); this.scene.remove( cylinder ); continue; }
              cylinder.position.x += cylinder.userData.vx; cylinder.position.y += cylinder.userData.vy; cylinder.position.z += cylinder.userData.vz;
            }
          }, 
          update( mouse, camera ) {
            let ndcX = mouse.x / deviceInfo.screenCenterX(); let ndcY = -(mouse.y / deviceInfo.screenCenterY());
            let vec = new THREE.Vector3(ndcX, ndcY, 0.5); vec.unproject(camera); vec.sub(camera.position).normalize();
            this.aimDirection = vec.clone();
            let distance = ((this.move.z + 307) - camera.position.z) / vec.z;
            let targetPos = camera.position.clone().add(vec.multiplyScalar(distance));
            this.move.x = targetPos.x; this.move.y = targetPos.y;
            this.look.x = ndcY * 0.15; this.look.y = -ndcX * 0.15; this.look.z = -ndcX * 0.25;
            this.updateShots();
            addEase( this.group.position, this.move, this.ease ); addEase( this.group.rotation, this.look, this.ease );
          }
        };

        const checkCollisions = () => {
          for (let i = gunShip.shots.length - 1; i >= 0; i--) {
            let shot = gunShip.shots[i];
            for (let j = asteroidsManager.asteroids.length - 1; j >= 0; j--) {
              let ast = asteroidsManager.asteroids[j];
              
              if (shot.position.distanceTo(ast.position) < 70) {
                explosions.spawn(ast.position, ast.userData.color); 
                asteroidsManager.scene.remove(ast); asteroidsManager.asteroids.splice(j, 1);
                gunShip.scene.remove(shot); gunShip.shots.splice(i, 1);
                
                if(ast.userData.type === 'time') {
                  timeLeft += 10; 
                  const tBoard = document.getElementById('timerBoard');
                  tBoard.style.color = '#39ff14';
                  tBoard.style.textShadow = '0 0 15px #39ff14, 0 0 30px #fff';
                  setTimeout(() => {
                    tBoard.style.color = '#f0f';
                    tBoard.style.textShadow = '0 0 10px #f0f, 0 0 20px #0ff';
                  }, 500);
                } else {
                  updateScore(ast.userData.points); 
                }
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
          
          groundPlain.create( scene ); gunShip.create( scene ); asteroidsManager.create( scene ); explosions.create( scene );
          
          window.addEventListener( 'resize', e => { camera.aspect = deviceInfo.screenRatio(); camera.updateProjectionMatrix(); renderer.setSize( deviceInfo.screenWidth(), deviceInfo.screenHeight() ); });
          window.addEventListener( 'mousemove', e => { if(!gameActive) return; mouse.x = deviceInfo.mouseCenterX( e ); mouse.y = deviceInfo.mouseCenterY( e ); });
          window.addEventListener( 'wheel', e => { gunShip.onScroll( e ); });
          window.addEventListener( 'click', e => { gunShip.onClick( e ); });
          
          const loop = () => {
            requestAnimationFrame( loop ); 
            if (gameActive) {
              groundPlain.update( mouse ); 
              gunShip.update( mouse, camera ); 
              asteroidsManager.update(); explosions.update();
              checkCollisions();
            } else {
              // Si el juego termina, el suelo se sigue moviendo y cambiando de color!
              groundPlain.update( mouse );
              explosions.update(); gunShip.updateShots();
            }
            renderer.render( scene, camera );
          };
          loop();
        };

        setTimeout(setupScene, 100);
      </script>
    </body>
    </html>
  `;

  return (
    <div className="relative w-full h-screen bg-black select-none font-mono overflow-hidden">
      
      {/* BOTÓN VOLVER (ESQUINA INFERIOR IZQUIERDA) */}
      <button 
        onClick={() => navigate('/')}
        className="absolute bottom-6 left-6 z-50 bg-black/80 border-2 border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-white px-4 py-2 uppercase font-bold transition-all shadow-[0_0_15px_rgba(217,70,239,0.8)] cursor-pointer backdrop-blur-md rounded-md"
      >
        <i className="fa-solid fa-arrow-left mr-2"></i> VOLVER
      </button>

      {/* LEADERBOARD (HALL OF FAME RESPONSIVE) */}
      {isGameOver && (
        <div className="absolute top-4 right-4 md:top-1/2 md:-translate-y-1/2 md:right-10 z-40 bg-black/85 border-4 border-fuchsia-500 p-6 w-[90%] md:w-80 lg:w-96 max-h-[50vh] md:max-h-[80vh] overflow-y-auto backdrop-blur-md shadow-[0_0_30px_rgba(217,70,239,0.7)] pointer-events-auto rounded-xl custom-scrollbar">
          <h2 className="text-center text-fuchsia-400 text-2xl md:text-3xl font-black tracking-widest mb-4 md:mb-6 border-b-2 border-fuchsia-500 pb-2 md:pb-4 uppercase animate-pulse">
            HALL OF FAME
          </h2>
          
          {leaderboard.length === 0 ? (
            <p className="text-zinc-500 text-sm md:text-lg font-bold text-center mt-6">NO RECORDS YET</p>
          ) : (
            <ul className="text-white font-bold text-lg md:text-2xl space-y-2 md:space-y-3">
              {leaderboard.map((entry, index) => (
                <li key={index} className="flex justify-between border-b border-fuchsia-900/50 pb-1 items-center">
                  <span className="text-cyan-400">
                    <span className="text-fuchsia-500 text-base md:text-lg mr-2">{index + 1}.</span>
                    {entry.initials}
                  </span>
                  <span className="text-yellow-400">{entry.score}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* JUEGO (IFRAME) */}
      <iframe 
        key={gameKey}
        title="Relax Mode Game"
        srcDoc={gameHTML}
        className="w-full h-full border-none pointer-events-auto"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d946ef; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Relax;