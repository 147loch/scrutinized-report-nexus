const displayHeight = height => `${(height / 12) | 0}' ${height - ((height / 12) | 0) * 12}"`;

function search(store) {
  return poiCache => {
    const filterResults = [];
    const searchObject = store.state.search;

    Object.values(poiCache.data).forEach(report => {
      if (searchObject.name && !(searchObject.name.split(' ')[0].trim().toLowerCase() === report.FirstName.trim().toLowerCase() && searchObject.name.split(' ')[1].trim().toLowerCase() === report.LastName.trim().toLowerCase())) {
        return;
      }

      if (searchObject.reportDate && searchObject.reportDate !== report.ReportDate) {
        return;
      }

      if (searchObject.minAge && searchObject.minAge !== report.AgeMin) {
        return;
      }

      if (searchObject.maxAge && searchObject.maxAge !== report.AgeMax) {
        return;
      }

      if (searchObject.height && !(searchObject.height === displayHeight(report.Height) || searchObject.height === displayHeight(report.HeightGuess))) {
        return;
      }

      if (searchObject.weight && !(searchObject.weight === report.Weight || searchObject.weight === report.WeightGuess)) {
        return;
      }

      if (searchObject.gender && searchObject.gender.toLowerCase() !== report.Gender.toLowerCase()) {
        return;
      }

      if (searchObject.hairColor && searchObject.hairColor.toLowerCase() !== report.HairColor.toLowerCase()) {
        return;
      }

      if (searchObject.eyeColor && searchObject.eyeColor.toLowerCase() !== report.EyeColor.toLowerCase()) {
        return;
      }

      if (Object.values(searchObject).every(value => !value || value === '')) {
        return;
      }

      filterResults.push(report.ID);
    });

    store.commit('results', filterResults);
    return filterResults;
  };
}

export default ({store}, inject) => {
  inject('search', search(store));
  inject('version', process.env.VERSION);
  inject('displayIMEI', imei => imei.match(/.{1,4}/g).join(' '));
  inject('displayHeight', displayHeight);
};
