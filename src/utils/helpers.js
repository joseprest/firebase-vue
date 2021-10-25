import _ from 'lodash';

const format = (date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 86400) {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds - hh * 3600) / 60);
    const h = hh === 0 ? '' : `${hh} hour${hh !== 1 ? 's' : ''}`;
    const m = mm === 0 ? '' : `${mm} minute${mm !== 1 ? 's' : ''}`;

    return `${h} ${m} ago`;
  }

  return `${_.padStart(date.getFullYear(), 4, 0)}/${_.padStart(date.getMonth() + 1, 2, 0)}/${_.padStart(date.getDate())} ${_.padStart(date.getHours(), 2, 0)}:${_.padStart(date.getMinutes(), 2, 0)}`;
};

export default {};

export {
  format,
};
