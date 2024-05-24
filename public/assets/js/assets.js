
    function showStep(step) {
      // Hide all steps
      document.querySelectorAll('.step').forEach(function(stepElement) {
          stepElement.style.display = 'none';
          stepElement.classList.remove('step-active');
      });

      // Show the current step with slide-in effect
      const currentStep = document.getElementById('step-' + step);
      currentStep.style.display = 'block';
      setTimeout(() => {
          currentStep.classList.add('step-active');
      }, 10);  // Small delay to trigger CSS transition
    }



      // affiliated payors animation
     
    document.addEventListener('DOMContentLoaded', () => {

    const slider = document.querySelector('.affiliated-payors-wrapper');
    const marqueeContent = document.querySelector('.affiliated-payors');
    const itemsWidth = slider.scrollWidth - slider.clientWidth;
    const randomPosition = Math.floor(Math.random() * itemsWidth);

    // Set initial scroll position
    slider.scrollLeft = randomPosition;


    let isDragging = false;
    let startX;
    let scrollLeft;

    // Start dragging
    const startDrag = (e) => {
        isDragging = true;
        startX = (e.type === 'mousedown') ? e.pageX : e.touches[0].pageX;
        scrollLeft = slider.scrollLeft;
        slider.classList.add('active');
        pauseMarquee();
    };

    // End dragging
    const endDrag = () => {
        isDragging = false;
        slider.classList.remove('active');
        resumeMarquee();
    };

    // Dragging
    const drag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = (e.type === 'mousemove') ? e.pageX : e.touches[0].pageX;
        const walk = (x - startX) * 2; // Adjust the multiplier for faster/slower scrolling
        slider.scrollLeft = scrollLeft - walk;
    };

    // Mouse events
    slider.addEventListener('mousedown', startDrag);
    slider.addEventListener('mouseup', endDrag);
    slider.addEventListener('mousemove', drag);

    // Touch events
    slider.addEventListener('touchstart', startDrag);
    slider.addEventListener('touchend', endDrag);
    slider.addEventListener('touchmove', drag);

    // Function to pause the marquee animation
    const pauseMarquee = () => {
        const marquee = document.querySelector('.affiliated-payors');
        marquee.style.animationPlayState = 'paused';
    };

    // Function to resume the marquee animation
    const resumeMarquee = () => {
        const marquee = document.querySelector('.affiliated-payors');
        marquee.style.animationPlayState = 'running';
    };
  });
  