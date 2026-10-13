export const getAuthTokenFromLocalStorage = () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  return JSON.parse(token)
}

export const setAuthTokenToLocalStorage = (token: string) => {
  localStorage.setItem('token', JSON.stringify(token))
}

export const getLanguageFromLocalStorage = () => {
  if (typeof window === 'undefined') return 'en'
  const language = localStorage.getItem('language')
  if (!language) return 'en'
  return JSON.parse(language)
}

export const setLanguageToLocalStorage = (language: string) => {
  localStorage.setItem('language', JSON.stringify(language))
}

