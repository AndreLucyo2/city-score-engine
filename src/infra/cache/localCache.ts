export class LocalCache {
  /**
   * Armazena dados no LocalStorage com tempo de expiração.
   * TTL padrão configurado para 60 minutos.
   */
  static set<T>(key: string, data: T, ttlInMinutes: number = 60): void {
    const now = new Date();
    const item = {
      data,
      expiry: now.getTime() + ttlInMinutes * 60000,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  /**
   * Recupera dados do LocalStorage, verificando a expiração.
   * Retorna null se os dados expiraram ou não existem.
   */
  static get<T>(key: string): T | null {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key); // Limpa o cache velho
        return null;
      }
      return item.data as T;
    } catch {
      return null;
    }
  }
}
