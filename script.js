const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
const topbar = document.querySelector('.topbar');
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('#primary-nav');
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const closeMobileMenu = () => {
  if (!topbar || !navToggle) {
    return;
  }

  topbar.classList.remove('menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
};

if (navToggle && topbar && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = topbar.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  for (const link of navLinks) {
    link.addEventListener('click', closeMobileMenu);
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) {
      closeMobileMenu();
    }
  });
}

const setActiveLink = () => {
  const y = window.scrollY + 140;
  let current = sections[0];

  for (const section of sections) {
    if (section.offsetTop <= y) {
      current = section;
    }
  }

  for (const link of navLinks) {
    const isActive = link.getAttribute('href') === `#${current.id}`;
    link.classList.toggle('active', isActive);
  }
};

window.addEventListener('scroll', setActiveLink, { passive: true });
window.addEventListener('load', setActiveLink);

const timeline = document.querySelector('.hero-timeline .event-timeline');
const timelineScrollbar = document.querySelector('.hero-timeline .timeline-scrollbar');
const timelineScrollbarThumb = timelineScrollbar ? timelineScrollbar.querySelector('span') : null;
const timelineEvents = timeline ? Array.from(timeline.querySelectorAll('[data-event-time]')) : [];

const updateTimelineEventStates = () => {
  const now = Date.now();

  for (const event of timelineEvents) {
    const eventTime = Date.parse(event.getAttribute('data-event-time') || '');
    event.classList.toggle('is-inactive', !Number.isNaN(eventTime) && now > eventTime);
  }
};

const updateTimelineScrollbar = () => {
  if (!timeline || !timelineScrollbar || !timelineScrollbarThumb) {
    return;
  }

  const maxScroll = timeline.scrollWidth - timeline.clientWidth;
  const trackWidth = timelineScrollbar.clientWidth;

  if (maxScroll <= 0 || trackWidth <= 0) {
    timelineScrollbar.hidden = true;
    return;
  }

  timelineScrollbar.hidden = false;
  const thumbWidth = Math.max(36, (timeline.clientWidth / timeline.scrollWidth) * trackWidth);
  const maxThumbX = trackWidth - thumbWidth;
  const thumbX = (timeline.scrollLeft / maxScroll) * maxThumbX;

  timelineScrollbarThumb.style.setProperty('--timeline-thumb-width', `${thumbWidth}px`);
  timelineScrollbarThumb.style.setProperty('--timeline-thumb-x', `${thumbX}px`);
};

if (timeline && timelineScrollbarThumb) {
  timeline.addEventListener('scroll', updateTimelineScrollbar, { passive: true });
  window.addEventListener('resize', updateTimelineScrollbar);
  window.addEventListener('load', updateTimelineScrollbar);
  updateTimelineScrollbar();
}

if (timelineEvents.length > 0) {
  updateTimelineEventStates();
  window.setInterval(updateTimelineEventStates, 60000);
}

const yearNode = document.querySelector('[data-current-year]');
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const countdownNodes = Array.from(document.querySelectorAll('[data-countdown-target]'));

const formatCountdown = (diffMs) => {
  if (diffMs <= 0) {
    return 'Workshop Day is live';
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return `${days}d ${hours}h ${minutes}m`;
};

const tickCountdown = () => {
  const now = Date.now();

  for (const node of countdownNodes) {
    const output = node.querySelector('[data-countdown-output]');
    if (!output) {
      continue;
    }

    const targetRaw = node.getAttribute('data-countdown-target');
    const targetTs = Date.parse(targetRaw || '');
    if (Number.isNaN(targetTs)) {
      output.textContent = 'Date TBD';
      continue;
    }

    output.textContent = formatCountdown(targetTs - now);
  }
};

if (countdownNodes.length > 0) {
  tickCountdown();
  window.setInterval(tickCountdown, 60000);
}
