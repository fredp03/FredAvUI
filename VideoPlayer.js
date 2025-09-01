const { useState, useRef, useEffect } = React;

function VideoPlayer() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [hover, setHover] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setScale(w / 1840);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const timeHandler = () => setCurrentTime(video.currentTime);
    const loadedHandler = () => setDuration(video.duration);
    const playHandler = () => setIsPlaying(true);
    const pauseHandler = () => setIsPlaying(false);
    video.addEventListener('timeupdate', timeHandler);
    video.addEventListener('loadedmetadata', loadedHandler);
    video.addEventListener('play', playHandler);
    video.addEventListener('pause', pauseHandler);
    return () => {
      video.removeEventListener('timeupdate', timeHandler);
      video.removeEventListener('loadedmetadata', loadedHandler);
      video.removeEventListener('play', playHandler);
      video.removeEventListener('pause', pauseHandler);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (duration) {
      videoRef.current.currentTime = percent * duration;
    }
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const formatTime = (t) => {
    if (!isFinite(t)) return '0:00';
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = Math.floor(t % 60);
    const mm = h ? String(m).padStart(2, '0') : String(m);
    const hh = h ? h + ':' : '';
    const ss = String(s).padStart(2, '0');
    return hh + mm + ':' + ss;
  };

  return (
    React.createElement('div', {
      className: 'player-wrapper',
      ref: containerRef,
      style: { height: 1121 * scale },
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false)
    },
      React.createElement('div', { className: 'player-inner', style: { transform: 'scale(' + scale + ')' } },
        React.createElement('div', { className: 'video-placeholder' },
          React.createElement('video', { ref: videoRef, src: 'https://www.w3schools.com/html/mov_bbb.mp4' }),
          React.createElement('div', { className: 'hover-controls', style: { opacity: hover ? 1 : 0 } },
            React.createElement('div', { className: 'controls-left' },
              React.createElement('div', { className: 'time-elapsed' }, formatTime(currentTime)),
              React.createElement('div', { className: 'volume-slider' },
                React.createElement('input', {
                  type: 'range', min: '0', max: '1', step: '0.01',
                  value: volume, onChange: handleVolume
                })
              )
            ),
            React.createElement('div', { className: 'controls-right' },
              React.createElement('div', { className: 'time-remaining' }, formatTime(duration - currentTime))
            ),
            React.createElement('div', { className: 'playbar', onClick: handleSeek },
              React.createElement('div', {
                className: 'playbar-elapsed',
                style: { width: duration ? (currentTime / duration) * 1772 : 0 }
              })
            )
          )
        ),
        React.createElement('div', { className: 'playpause', onClick: togglePlay },
          isPlaying ?
            React.createElement('svg', { width: '50', height: '21', viewBox: '0 0 50 21', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
              React.createElement('path', { d: 'M38 2V19M49 2V19', stroke: '#333333', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
              React.createElement('path', { d: 'M1 18.322V2.83726C1 2.04494 1.87753 1.56731 2.54291 1.99748L15.5827 10.4276C16.2208 10.8401 16.1839 11.7853 15.51056 12.1469L2.47584 19.2016C1.80955 19.562 1 19.0796 1 18.322Z', stroke: '#333333', 'stroke-width': '2' })
            ) :
            React.createElement('svg', { width: '50', height: '21', viewBox: '0 0 50 21', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
              React.createElement('path', { d: 'M1 18.322V2.83726C1 2.04494 1.87753 1.56731 2.54291 1.99748L15.5827 10.4276C16.2208 10.8401 16.1839 11.7853 15.51056 12.1469L2.47584 19.2016C1.80955 19.562 1 19.0796 1 18.322Z', stroke: '#333333', 'stroke-width': '2' })
            )
        )
      )
    )
  );
}

window.VideoPlayer = VideoPlayer;
