// 3D космический фон с частицами
function initSpaceBackground() {
    const canvas = document.getElementById('space-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Создание частиц
    const particles = new THREE.BufferGeometry();
    const particleCount = 5000;
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({
        size: 0.005,
        color: '#00F7FF'
    });
    
    const particleMesh = new THREE.Points(particles, material);
    scene.add(particleMesh);
    
    camera.position.z = 2;
    
    function animate() {
        requestAnimationFrame(animate);
        particleMesh.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    animate();
}

// Анимация временной шкалы при скролле
function animateTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        if(itemTop < window.innerHeight * 0.8) {
            item.classList.add('active');
        }
    });
}
// Инициализация
window.addEventListener('load', () => {
    initSpaceBackground();
    window.addEventListener('scroll', animateTimeline);
});

// Адаптивность
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// 3D-галерея
function init3DGallery() {
    const scientists = [
        { 
            name: "Николай Судзиловский",
            model: "models/sudzilovsky.glb",
            info: "Создатель систем управления для ракет Союз"
        },
        // Добавьте других ученых
    ];

    const gallery = document.getElementById('gallery');
    
    scientists.forEach((scientist, index) => {
        const card = document.createElement('div');
        card.className = 'scientist-card';
        card.innerHTML = `
            <div class="scientist-model" id="model-${index}"></div>
            <div class="scientist-info">
                <h3>${scientist.name}</h3>
                <p>${scientist.info}</p>
            </div>
        `;
        gallery.appendChild(card);

        // Загрузка 3D-модели
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 300 / 400, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(300, 400);
        document.getElementById(`model-${index}`).appendChild(renderer.domElement);

        const loader = new THREE.GLTFLoader();
        loader.load(scientist.model, (gltf) => {
            scene.add(gltf.scene);
            camera.position.z = 5;
            
            // Анимация вращения
            function animate() {
                requestAnimationFrame(animate);
                gltf.scene.rotation.y += 0.01;
                renderer.render(scene, camera);
            }
            animate();
        });
    });
}

// Вызовите в конце initSpaceBackground()
init3DGallery();
// Анимация заголовков при загрузке
gsap.from('.title', {
    duration: 1.5,
    opacity: 0,
    y: 100,
    ease: "power4.out"
});

// Параллакс-эффект для кнопок
document.querySelectorAll('.mission-button').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        gsap.to(btn, {
            duration: 0.5,
            x: x * 10,
            y: y * 10,
            ease: "power2.out"
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            duration: 0.5,
            x: 0,
            y: 0
        });
    });
});

// Анимация появления секций
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: "top 80%"
        },
        x: -100,
        opacity: 0,
        duration: 1
    });
});
// В самом конце
window.addEventListener('load', () => {
    gsap.to('.preloader', {
        opacity: 0,
        onComplete: () => {
            document.querySelector('.preloader').style.display = 'none';
        }
    });
});