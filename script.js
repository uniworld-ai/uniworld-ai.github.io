const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

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
