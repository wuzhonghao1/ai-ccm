// 语言文件
import zh from './languageZh';
import en from './languageEn';

const lang = window.sessionStorage.getItem('i18n_language') || 'zh_CN';

export default lang === 'zh_CN' ? zh : en;
