        // Enhanced Scroll Controls
        const prevArrow = document.querySelector('.arrow-prev');
        const nextArrow = document.querySelector('.arrow-next');
        const progressBar = document.querySelector('.scroll-progress-bar');

    // Auto-scroll functionality
    class AutoScroller {
        constructor(trackElement) {
            this.track = trackElement;
            this.autoScroll = true;
            this.scrollSpeed = 0.5; // Pixels per frame (adjust as needed)
            this.idleTimeout = 5000; // 5 seconds idle time
            this.lastInteraction = Date.now();
            this.animationFrame = null;
            this.isScrolling = false;

            // Initialize event listeners
            this.addEventListeners();
            this.startAutoScroll();
        }

        startAutoScroll() {
            const scroll = () => {
                if (!this.autoScroll || this.isScrolling) {
                    this.animationFrame = requestAnimationFrame(scroll);
                    return;
                }

                this.isScrolling = true;
                
                // Check if reached end of scroll
                if (this.track.scrollLeft >= this.track.scrollWidth - this.track.clientWidth - 1) {
                    this.track.scrollLeft = 0;
                } else {
                    this.track.scrollLeft += this.scrollSpeed;
                }

                // Check idle time
                if (Date.now() - this.lastInteraction > this.idleTimeout) {
                    this.autoScroll = true;
                } else {
                    this.autoScroll = false;
                }

                this.animationFrame = requestAnimationFrame(scroll);
                this.isScrolling = false;
            };
            
            scroll();
        }

        handleInteraction() {
            this.lastInteraction = Date.now();
            this.autoScroll = false;
        }

        addEventListeners() {
            // Touch events
            this.track.addEventListener('touchstart', () => this.handleInteraction());
            this.track.addEventListener('touchmove', () => this.handleInteraction());
            
            // Mouse events
            this.track.addEventListener('mousedown', () => this.handleInteraction());
            this.track.addEventListener('mousemove', () => this.handleInteraction());
            
            // Scroll events
            this.track.addEventListener('wheel', () => this.handleInteraction());
            
            // Reset on mouse leave
            this.track.addEventListener('mouseleave', () => {
                if (Date.now() - this.lastInteraction > this.idleTimeout) {
                    this.autoScroll = true;
                }
            });
        }
    }

    // Initialize auto-scroller
    const track = document.querySelector('.gallery-track');
    if (track) {
        new AutoScroller(track);
    }

    // Keep existing video controls and other functionality below
    // ...

        


        // Navigation
        const handleScroll = (direction) => {
            const scrollAmount = track.offsetWidth * 0.8;
            track.scrollBy({
                left: direction === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        };

        prevArrow.addEventListener('click', () => handleScroll('prev'));
        nextArrow.addEventListener('click', () => handleScroll('next'));

        // Scroll Progress
        const updateProgress = () => {
            const progress = (track.scrollLeft / (track.scrollWidth - track.clientWidth)) * 100;
            progressBar.style.height = `${progress}%`;
        };

        track.addEventListener('scroll', updateProgress);

        // Video Controls
        document.querySelectorAll('video').forEach(video => {
            const playButton = video.closest('.video-wrapper').querySelector('.video-play-button');
            
            playButton.addEventListener('click', () => {
                video.play();
                video.controls = true;
                playButton.style.display = 'none';
            });

            video.addEventListener('play', () => playButton.style.display = 'none');
            video.addEventListener('pause', () => playButton.style.display = 'block');
        });

        // Parallax Effect
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
                item.style.transform = `translateY(-10px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) rotateY(0) rotateX(0)';
            });
        });

        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.gallery-item').forEach(item => observer.observe(item));


        