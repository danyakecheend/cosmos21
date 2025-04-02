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

particlesJS("particles-js", {
  "particles": {
    "number": { "value": 120, "density": { "enable": true, "value_area": 800 } },
    "color": { "value": "#ffffff" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.5, "random": false },
    "size": { "value": 3, "random": true },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
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

function loadModel(modelPath, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 1, 3);
  
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);
  
  const loader = new THREE.GLTFLoader();
  loader.load(modelPath, function(gltf) {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    scene.add(model);
    
    function animate() {
      requestAnimationFrame(animate);
      model.rotation.y += 0.005;
      renderer.render(scene, camera);
    }
    animate();
  }, undefined, function(error) {
    console.error("Ошибка загрузки модели:", error);
  });
  
  window.addEventListener('resize', function() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
}
