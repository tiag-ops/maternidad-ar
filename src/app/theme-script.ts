// Script anti-flash: aplica el tema ANTES del primer paint. Se inyecta en <head>.
export const themeScript = `(function(){try{var t=localStorage.getItem('tema');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`;
