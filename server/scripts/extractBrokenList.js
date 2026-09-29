const fs = require('fs');
const http = require('http');

const API_BASE = 'http://127.0.0.1:5000/api';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function analyzeBroken() {
  const catRes = await fetchJson(`${API_BASE}/categories`);
  const banRes = await fetchJson(`${API_BASE}/banners`);
  const prodRes = await fetchJson(`${API_BASE}/products?limit=500`);

  const categories = catRes.categories || [];
  const banners = banRes.banners || [];
  const products = prodRes.products || [];

  // Read status map from previous test or re-check
  const { statusMap } = require('./auditAllImages');
}
