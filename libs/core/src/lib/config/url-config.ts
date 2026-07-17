// url-config.ts should only contain relative paths since ApiService prepends the apiBase automatically.

export const urlConfig = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    sendOtp: '/auth/send-otp',
    verifyOtp: '/auth/verify-otp',
    changePassword: '/auth/change-password',
  },
  profile: {
    me: '/profiles/me',
  },
  media: {
    upload: '/media/upload',
    uploadBase64: '/media/upload-base64',
    list: '/media',
  },
};
