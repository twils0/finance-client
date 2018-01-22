const convertDate = (UTCDate) => {
  let newDate = null;

  if (typeof UTCDate === 'string') {
    newDate = new Date(Number(UTCDate));
  } else {
    newDate = new Date(UTCDate);
  }

  return newDate.toLocaleDateString('en');
};

export default convertDate;
