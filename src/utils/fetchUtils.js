/**
 * Utility para fetch con reintentos automáticos y backoff exponencial
 * Soluciona problemas con servidores que se reinician
 */

export async function fetchWithRetry(url, options = {}) {
  const {
    retries = 3,
    backoffMs = 500,
    timeout = 5000,
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 503 || response.status === 500) {
          // Server error, retry
          if (attempt === retries) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          // Wait before retrying
          const delayMs = backoffMs * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      
      if (attempt < retries) {
        // Exponential backoff: 500ms, 1000ms, 2000ms, etc.
        const delayMs = backoffMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

/**
 * Corrige URLs incorrectas de GitHub
 * Convierte github.com/...?raw=true a raw.githubusercontent.com
 */
export function fixGitHubUrl(url) {
  if (!url) return url;
  
  // Si ya es raw.githubusercontent.com, devolver como está
  if (url.includes('raw.githubusercontent.com')) {
    return url;
  }
  
  // Convertir github.com/user/repo/blob/branch/path(?raw=true) 
  // a raw.githubusercontent.com/user/repo/branch/path
  if (url.includes('github.com')) {
    try {
      // Remover ?raw=true si existe
      let cleanUrl = url.replace('?raw=true', '');
      
      // Convertir formato: github.com/owner/repo/blob/branch/path
      // a: raw.githubusercontent.com/owner/repo/branch/path
      if (cleanUrl.includes('/blob/')) {
        cleanUrl = cleanUrl.replace(
          /https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.*)/,
          'https://raw.githubusercontent.com/$1/$2/$3/$4'
        );
      }
      return cleanUrl;
    } catch (err) {
      console.error('Error fixing GitHub URL:', err);
      return url;
    }
  }
  
  return url;
}

/**
 * Fetch con reintentos específico para imágenes
 * Mantener simple: dejar que img nativa maneje CORS
 */
export async function fetchImageWithRetry(url, retries = 3) {
  const backoffMs = 300;
  
  // Simplemente hacer fetch normal con reintentos
  // No convertir a blob - dejar que img nativa lo maneje
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 503 || response.status === 500 || response.status === 429) {
          if (attempt < retries) {
            const delayMs = backoffMs * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
          }
        }
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      
      const delayMs = backoffMs * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}
