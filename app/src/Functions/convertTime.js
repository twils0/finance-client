const convertTime = (UTCDate) => {
  let newDate = null;

  if (typeof UTCDate === 'string') {
    newDate = new Date(Number(UTCDate));
  } else {
    newDate = new Date(UTCDate);
  }

  return newDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default convertTime;
