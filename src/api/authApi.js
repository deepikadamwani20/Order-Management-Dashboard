// Mock auth — accepts any email with password "password123"
export async function loginApi({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (password === 'password123') {
        resolve({ token: 'mock-jwt-token-' + Date.now(), email });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
}