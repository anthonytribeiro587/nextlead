const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelectorAll('.nav a');
const glow = document.querySelector('.cursor-glow');

menuButton?.addEventListener('click', () => {
  document.body.classList.toggle('menu-open');
  menuButton.textContent = document.body.classList.contains('menu-open') ? 'Fechar' : 'Menu';
});

navLinks.forEach(link => link.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  if (menuButton) menuButton.textContent = 'Menu';
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section-reveal').forEach(section => revealObserver.observe(section));

window.addEventListener('pointermove', (event) => {
  if (!glow || window.innerWidth < 900) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const board = document.querySelector('.hero-board');
window.addEventListener('mousemove', event => {
  if (!board || window.innerWidth < 1000) return;
  const x = (event.clientX / window.innerWidth - .5) * 12;
  const y = (event.clientY / window.innerHeight - .5) * 12;
  board.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});

// Integração com o CRM NextLead
// Se você ativar NEXTLEAD_LEADS_API_KEY no CRM, coloque o mesmo valor abaixo.
const NEXTLEAD_CRM_ENDPOINT = 'https://nextlead-crm.vercel.app/api/leads';
const NEXTLEAD_LEADS_API_KEY = '';
const NEXTLEAD_WHATSAPP_URL = 'https://wa.me/5551995092781?text=Ol%C3%A1%2C%20preenchi%20o%20formul%C3%A1rio%20da%20NextLead%20e%20quero%20falar%20sobre%20minha%20landing%20page.';

const leadForm = document.querySelector('#leadForm');
const formFeedback = document.querySelector('#formFeedback');

function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '');
}

function setFormFeedback(message, type = '') {
  if (!formFeedback) return;
  formFeedback.textContent = message;
  formFeedback.className = `form-feedback ${type}`.trim();
}

leadForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = leadForm.querySelector('button[type="submit"]');
  const formData = new FormData(leadForm);
  const phone = normalizePhone(formData.get('phone'));

  if (!phone || phone.length < 10) {
    setFormFeedback('Informe um WhatsApp válido para continuarmos.', 'error');
    return;
  }

  const payload = {
    name: String(formData.get('name') || '').trim(),
    phone,
    company: String(formData.get('company') || '').trim(),
    source: 'Landing Page NextLead',
    interest: String(formData.get('interest') || 'Orçamento de Landing Page').trim(),
    value: 1200,
    temperature: 'quente',
    owner: 'Anthony',
    expectedCloseDate: '',
    tags: ['site-nextlead', 'landing-page', 'portfolio'],
    notes: String(formData.get('notes') || '').trim()
  };

  if (!payload.name) {
    setFormFeedback('Informe seu nome para enviarmos o contato.', 'error');
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';
  setFormFeedback('Enviando seu contato para o CRM...', '');

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (NEXTLEAD_LEADS_API_KEY) {
      headers['x-api-key'] = NEXTLEAD_LEADS_API_KEY;
    }

    const response = await fetch(NEXTLEAD_CRM_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result?.ok === false) {
      throw new Error(result?.error || 'Erro ao enviar lead');
    }

    setFormFeedback('Contato enviado! Você será direcionado para o WhatsApp.', 'success');
    leadForm.reset();

    setTimeout(() => {
      window.open(NEXTLEAD_WHATSAPP_URL, '_blank', 'noopener');
    }, 800);
  } catch (error) {
    console.error(error);
    setFormFeedback('Não foi possível enviar ao CRM agora. Use o botão de WhatsApp direto.', 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Enviar para análise';
  }
});
