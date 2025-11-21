// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .step, .university');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Initialize all video functionality
    initVideoPlayback();
    initVideoSlider();
});

// Video play functionality for all videos on the page
function initVideoPlayback() {
    // Video play button functionality for main video showcase
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        const playButton = container.querySelector('.video-play-button');
        
        if (playButton && video) {
            playButton.addEventListener('click', function() {
                if (video.paused) {
                    video.play();
                    playButton.style.display = 'none';
                } else {
                    video.pause();
                    playButton.style.display = 'flex';
                }
            });
            
            video.addEventListener('play', function() {
                playButton.style.display = 'none';
            });
            
            video.addEventListener('pause', function() {
                playButton.style.display = 'flex';
            });
        }
    });
    
    // Video play functionality for slider videos
    const sliderVideoWrappers = document.querySelectorAll('.video-wrapper');
    
    sliderVideoWrappers.forEach(wrapper => {
        const video = wrapper.querySelector('video');
        const playBtn = wrapper.querySelector('.video-play-btn');
        
        if (playBtn && video) {
            playBtn.addEventListener('click', function() {
                if (video.paused) {
                    video.play();
                    playBtn.style.display = 'none';
                } else {
                    video.pause();
                    playBtn.style.display = 'flex';
                }
            });
            
            video.addEventListener('play', function() {
                playBtn.style.display = 'none';
            });
            
            video.addEventListener('pause', function() {
                playBtn.style.display = 'flex';
            });
        }
    });
    
    // Auto-play hero video (muted) - if you have one
    const heroVideo = document.querySelector('.hero-video video');
    if (heroVideo) {
        heroVideo.play().catch(error => {
            console.log('Auto-play prevented:', error);
        });
    }
}

// Video Slider Functionality
function initVideoSlider() {
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.video-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    // If no slider elements found, exit
    if (!slides.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;
    let isUserInteracting = false;

    // Function to show specific slide
    function showSlide(index) {
        // Pause all videos before switching slides
        pauseAllVideos();
        
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        setTimeout(() => {
            slides[index].style.opacity = '1';
        }, 50);
        
        // Activate current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
        
        // Reset auto-play timer when slide changes
        resetAutoPlay();
    }

    // Function to pause all videos in slider
    function pauseAllVideos() {
        const videos = document.querySelectorAll('.video-slide video');
        videos.forEach(video => {
            video.pause();
            // Show play buttons
            const playBtn = video.closest('.video-wrapper').querySelector('.video-play-btn');
            if (playBtn) {
                playBtn.style.display = 'flex';
            }
        });
    }

    // Next slide function
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % totalSlides;
        showSlide(nextIndex);
    }

    // Previous slide function
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prevIndex);
    }

    // Reset auto-play timer
    function resetAutoPlay() {
        stopAutoPlay();
        if (!isUserInteracting) {
            startAutoPlay();
        }
    }

    // Start auto-play slider with longer interval
    function startAutoPlay() {
        // Use much longer interval (20 seconds) to allow videos to finish
        slideInterval = setInterval(nextSlide, 80000); // 20 seconds
    }

    // Stop auto-play
    function stopAutoPlay() {
        clearInterval(slideInterval);
    }

    // Initialize slider
    showSlide(currentSlide);
    startAutoPlay();

    // Smart video handling - don't advance while videos are playing
    const videos = document.querySelectorAll('.video-slide video');
    videos.forEach(video => {
        // Stop auto-play when video starts playing
        video.addEventListener('play', function() {
            stopAutoPlay();
            isUserInteracting = true;
        });
        
        // Restart auto-play when video ends (with delay)
        video.addEventListener('ended', function() {
            isUserInteracting = false;
            // Wait 5 seconds after video ends before next slide
            setTimeout(() => {
                if (!isUserInteracting) {
                    nextSlide();
                }
            }, 5000);
        });
        
        // If user pauses video, wait a bit before restarting auto-play
        video.addEventListener('pause', function() {
            setTimeout(() => {
                if (!isUserInteracting && !isAnyVideoPlaying()) {
                    isUserInteracting = false;
                    startAutoPlay();
                }
            }, 3000);
        });
    });

    // Check if any video is currently playing
    function isAnyVideoPlaying() {
        return Array.from(videos).some(video => !video.paused);
    }

    // Pause auto-play on hover
    const slider = document.querySelector('.video-slider');
    if (slider) {
        slider.addEventListener('mouseenter', function() {
            isUserInteracting = true;
            stopAutoPlay();
        });
        
        slider.addEventListener('mouseleave', function() {
            // Only restart if no video is currently playing
            if (!isAnyVideoPlaying()) {
                isUserInteracting = false;
                startAutoPlay();
            }
        });
        
        // Also pause on touch devices
        slider.addEventListener('touchstart', function() {
            isUserInteracting = true;
            stopAutoPlay();
        });
        
        slider.addEventListener('touchend', function() {
            setTimeout(() => {
                if (!isAnyVideoPlaying()) {
                    isUserInteracting = false;
                    startAutoPlay();
                }
            }, 1000);
        });
    }

    // Event listeners for controls
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            isUserInteracting = true;
            stopAutoPlay();
            nextSlide();
            // Restart auto-play after user interaction
            setTimeout(() => {
                isUserInteracting = false;
                startAutoPlay();
            }, 10000); // Wait 10 seconds after manual navigation
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            isUserInteracting = true;
            stopAutoPlay();
            prevSlide();
            // Restart auto-play after user interaction
            setTimeout(() => {
                isUserInteracting = false;
                startAutoPlay();
            }, 10000); // Wait 10 seconds after manual navigation
        });
    }

    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            isUserInteracting = true;
            stopAutoPlay();
            showSlide(index);
            // Restart auto-play after user interaction
            setTimeout(() => {
                isUserInteracting = false;
                startAutoPlay();
            }, 10000); // Wait 10 seconds after manual navigation
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            isUserInteracting = true;
            stopAutoPlay();
            prevSlide();
            setTimeout(() => {
                isUserInteracting = false;
                startAutoPlay();
            }, 10000);
        }
        if (e.key === 'ArrowRight') {
            isUserInteracting = true;
            stopAutoPlay();
            nextSlide();
            setTimeout(() => {
                isUserInteracting = false;
                startAutoPlay();
            }, 10000);
        }
    });

    // Handle visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoPlay();
            pauseAllVideos();
        } else {
            if (!isUserInteracting && !isAnyVideoPlaying()) {
                startAutoPlay();
            }
        }
    });
}