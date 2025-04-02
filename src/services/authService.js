export class AuthService {
  static async getAuthToken(interactive = false) {
    return new Promise((resolve) => {
      chrome.identity.getAuthToken({ interactive }, (token) => {
        resolve(token);
      });
    });
  }

  static async isAuthorized() {
    const token = await this.getAuthToken(false);
    return !!token;
  }
}
