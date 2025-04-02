// Preloader и запуск анимаций после загрузки страницы
window.addEventListener('load', function() {
  gsap.to("#preloader", {
    duration: 1,
    opacity: 0,
    onComplete: function() {
      document.getElementById("preloader").style.display = "none";
      gsap.to(".animate-header", {duration: 1, opacity: 1, y: 0, ease: "power2.out"});
      gsap.to(".animate-subheader", {duration: 1, opacity: 1, y: 0, ease: "power2.out", delay: 0.5});
      gsap.to(".animate-section", {duration: 1, opacity: 1, x: 0, ease: "power2.out", delay: 0.5});
      gsap.to(".animate-text", {duration: 1, opacity: 1, ease: "power2.out", delay: 0.8});
      gsap.to(".animate-fade", {duration: 1, opacity: 1, ease: "power2.out", delay: 1});
    }
  });
});

// Улучшенная конфигурация Particles.js (больше частиц, разнообразие размеров)
particlesJS("particles-js", {
  "particles": {
    "number": { "value": window.innerWidth < 768 ? 80 : 200 , "density": { "enable": true, "value_area": 800 } },
    "color": { "value": "#ffffff" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.6, "random": true },
    "size": { "value": 2, "random": true },
    "line_linked": {
      "enable": true,
      "distance": 120,
      "color": "#3498db",
      "opacity": 0.5,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out"
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": { "enable": true, "mode": "repulse" },
      "onclick": { "enable": true, "mode": "push" },
      "resize": true
    },
    "modes": {
      "repulse": { "distance": 100 }
    }
  },
  "retina_detect": true
});

// Функция для загрузки 3D модели с OrbitControls
function loadModel(modelPath, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Очистка контейнера, если необходимо
  container.innerHTML = "";
  
  const controlsHTML = `
  <div class="model-controls">
    <button class="control-btn" onclick="toggleRotation(this)">▶ Автоповорот</button>
    <button class="control-btn" onclick="resetCamera()">↻ Сброс</button>
  </div>
`;
container.insertAdjacentHTML('beforeend', controlsHTML);

let autoRotate = true;
let model;

window.toggleRotation = function(btn) {
  autoRotate = !autoRotate;
  btn.textContent = autoRotate ? "▶ Автоповорот" : "⏸ Стоп";
  controls.autoRotate = autoRotate;
};

window.resetCamera = function() {
  controls.reset();
  camera.position.set(0, 1, 3);
};

// Добавить обработчики событий для масштабирования
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

container.addEventListener('pointerdown', onPointerDown);
container.addEventListener('wheel', onMouseWheel);

function onPointerDown(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObject(model, true);
  
  if (intersects.length > 0) {
    container.style.cursor = 'grabbing';
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }
}

function onPointerMove(event) {
  // Реализация вращения модели
  model.rotation.y += event.movementX * 0.01;
  model.rotation.x += event.movementY * 0.01;
}

function onMouseWheel(event) {
  // Масштабирование модели
  const delta = event.deltaY * 0.001;
  model.scale.x = Math.max(0.3, model.scale.x - delta);
  model.scale.y = Math.max(0.3, model.scale.y - delta);
  model.scale.z = Math.max(0.3, model.scale.z - delta);
}

  // Создание сцены
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // Камера
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 1, 3);
  
  // Рендерер
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  
  // Освещение
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);
  
  // OrbitControls с автоповоротом и возможностью ручного управления
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // Загрузка 3D модели через GLTFLoader
  const loader = new THREE.GLTFLoader();
  loader.load(modelPath, function(gltf) {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    // Центрируем модель
    model.position.set(0, 0, 0);
    scene.add(model);
    
    // Анимация сцены
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }, undefined, function(error) {
    console.error("Ошибка загрузки модели:", error);
  });
  
  // Обработка изменения размера окна
  window.addEventListener('resize', function() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
}
