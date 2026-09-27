/**
 * script.js — Coffee Rating App
 * Handles vote button clicks, live vote-count updates, and leaderboard refresh.
 */

'use strict';

// ── In-flight guard: prevents double-clicking while a request is in flight ────
const pending = new Set();

// ── Attach click handlers to all Vote buttons ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('.btn-vote')
    .forEach((btn) => btn.addEventListener('click', handleVote));
});

// ── handleVote ────────────────────────────────────────────────────────────────
async function handleVote(event) {
  const btn  = event.currentTarget;
  const id   = btn.dataset.id;

  // Guard: skip if a request for this coffee is already in flight
  if (pending.has(id)) return;

  const voteEl  = document.getElementById(`votes-${id}`);
  const toastEl = document.getElementById(`toast-${id}`);

  // Lock the button
  pending.add(id);
  btn.disabled = true;
  btn.textContent = '⏳ Voting…';
  clearToast(toastEl);

  try {
    const response = await fetch(`/api/coffee/${id}/vote`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      // Server returned an error (4xx / 5xx)
      showToast(toastEl, `❌ ${data.error || 'Vote failed. Try again.'}`, 'error');
      return;
    }

    const { coffee } = data;

    // ── Update vote count on the card ────────────────────────────────────────
    updateVoteCount(voteEl, coffee.votes);

    // ── Success toast ─────────────────────────────────────────────────────────
    showToast(toastEl, '✅ Voted! Thanks for your pick!', 'success');

    // ── Refresh leaderboard ───────────────────────────────────────────────────
    await refreshLeaderboard();

  } catch (err) {
    console.error('Network error:', err);
    showToast(toastEl, '❌ Network error. Check your connection.', 'error');
  } finally {
    // Unlock button
    pending.delete(id);
    btn.disabled    = false;
    btn.textContent = '👍 Vote';
  }
}

// ── updateVoteCount ───────────────────────────────────────────────────────────
function updateVoteCount(el, votes) {
  if (!el) return;
  el.innerHTML = `<strong>${votes}</strong> ${votes === 1 ? 'vote' : 'votes'}`;

  // Brief "bump" animation via CSS class
  el.classList.add('bumped');
  setTimeout(() => el.classList.remove('bumped'), 1200);
}

// ── refreshLeaderboard ────────────────────────────────────────────────────────
async function refreshLeaderboard() {
  try {
    const response = await fetch('/api/coffee');
    if (!response.ok) return; // Silently fail; leaderboard refresh is non-critical

    const coffees = await response.json();
    renderLeaderboard(coffees);

  } catch (err) {
    console.warn('Could not refresh leaderboard:', err);
  }
}

// ── renderLeaderboard ─────────────────────────────────────────────────────────
function renderLeaderboard(coffees) {
  const list = document.getElementById('leaderboard');
  if (!list) return;

  list.innerHTML = coffees
    .map((coffee, index) => {
      const rank  = index + 1;
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
      return `
        <li class="lb-item" id="lb-${coffee.id}">
          <span class="lb-rank">${medal || rank}</span>
          <span class="lb-name">${escHtml(coffee.name)}</span>
          <span class="lb-emoji">${emojiFor(coffee.name)}</span>
          <span class="lb-votes" id="lb-votes-${coffee.id}">
            <strong>${coffee.votes}</strong> ${coffee.votes === 1 ? 'vote' : 'votes'}
          </span>
        </li>`;
    })
    .join('');
}

// ── showToast ─────────────────────────────────────────────────────────────────
function showToast(el, message, type = 'success') {
  if (!el) return;
  el.textContent  = message;
  el.className    = `toast ${type}`;

  // Auto-clear after 3 s
  clearTimeout(el._timer);
  el._timer = setTimeout(() => clearToast(el), 3000);
}

function clearToast(el) {
  if (!el) return;
  el.textContent = '';
  el.className   = 'toast';
}

// ── emojiFor ──────────────────────────────────────────────────────────────────
// Mirrors the server-side helper so the client can render leaderboard rows
function emojiFor(name) {
  const map = {
    cappuccino: '☕',
    latte:      '🥛',
    espresso:   '⚡',
    americano:  '🫖',
    mocha:      '🍫',
    'cold brew':'🧊',
  };
  return map[name.toLowerCase()] || '☕';
}

// ── escHtml ───────────────────────────────────────────────────────────────────
// Prevent XSS when injecting server data into innerHTML
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
